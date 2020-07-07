const { CellMortonStore } = require('./CellMortonStore.js');
const { CellEvaluator } = require('./CellEvaluator.js');
const { Box, Cell } = require('../entity-system/Entities.js');
const {
	ColorByAgeTrait,
	CircleTrait,
	GridCellToRenderingEntity,
	ScaleTransformer,
	ProcessBoxAsRect,
	ColorByContents,
	RectOutlineTrait,
} = require('../entity-system/Traits.js');

const CellStates = require('./../entity-system/CellStates.js');
const { SeederFactory, SeederModels } = require('./SeederFactory.js');

/**
 * Create the default cell evaluator.
 * @private
 * @returns {CellEvaluator}
 */
function defaultCellEvaluator() {
	return new CellEvaluator();
}

/**
 * Create the default simulation seeder.
 * @private
 * @returns {Seeder}
 */
function defaultSeeder() {
	return SeederFactory.build(SeederModels.RANDOM);
}

/**
 * Configure Cells to be render-able.
 * @private
 * @param {object} config - The simulation's configuration object.
 * @param {Cell[]} cells - The list of cells to configure.
 */
function registerCellTraits(config, cells) {
	cells.forEach((cell) => {
		cell
			.register(new GridCellToRenderingEntity())
			.register(new ScaleTransformer(config.zoom))
			.register(new ColorByAgeTrait())
			.register(new CircleTrait());
	});
}

/**
 * Recursively traverses a quad tree and adds the partition boxes to the provided array.
 * @private
 * @param {QTNode} currentNode - The current node to process.
 * @param {Box[]} boxes - The array to add the partition boxes to.
 */
function collectBoxes(currentNode, boxes) {
	let containsAliveCell = currentNode.index != null;
	boxes.push(
		new Box(
			currentNode.rect.x,
			currentNode.rect.y,
			currentNode.rect.xx,
			currentNode.rect.yy,
			containsAliveCell
		)
	);
	if (currentNode.subdivided) {
		currentNode.children.forEach((child) => {
			collectBoxes(child, boxes);
		});
	}
}

/**
 * Configure boxes to be render-able.
 * @private
 * @param {object} config - The simulation's configuration object.
 * @param {Box[]} boxes - The list of boxes to configure.
 */
function registerBoxTraits(config, boxes) {
	boxes.forEach((box) => {
		box
			.register(new ProcessBoxAsRect())
			.register(new ScaleTransformer(config.zoom))
			.register(new ColorByContents())
			.register(new RectOutlineTrait());
	});
}

/**
 * Orchestrates Conway's Game of Life.
 */
class GameManager {
	/**
	 * Create a new GameManager instance.
	 * @param {object} config - The simulation's configuration object.
	 */
	constructor(config) {
		this.config = config;
		this.currentStore = new CellMortonStore();
		this.nextStore = new CellMortonStore();
	}

	setConfig(config) {
		this.config = config;
	}

	/**
	 * The number of cells currently alive in the simulation.
	 * @returns {number}
	 */
	aliveCellsCount() {
		return this.currentStore.size();
	}

	/**
	 * Creates a deep copy of the cells in the drawing.
	 * @returns {Cell[]} The copy of the cells.
	 */
	getCells() {
		return this.currentStore.cells();
	}

	/**
	 * Populates the current tree.
	 */
	seedWorld(seeder = defaultSeeder()) {
		let aliveCells = seeder.seed(
			this.config.landscape.width,
			this.config.landscape.height
		);
		this.currentStore.addList(aliveCells);
	}

	evaluateCellsFaster(scene, evaluator = defaultCellEvaluator()) {
		//1. Traverse every possible cell on the landscape, building up a list of new alive cells.
		// prettier-ignore
		let aliveNeighborsCount, nextCellState, x, y, xx, yy, cellsInArea, currentCellState;
		let nextAliveCells = [];
		let cellBin = new CellBin();

		for (let row = 0; row < this.config.landscape.width; row++) {
			for (let col = 0; col < this.config.landscape.height; col++) {
				cellsInArea = this.currentStore.neighborhood(
					{ row: row, col: col }, 
					this.config.landscape.width,
					this.config.landscape.height);

				//Assume the cell is dead.
				currentCellState = CellStates.DEAD;
				aliveNeighborsCount = 0;

				//Find the current cell's state and the count of active cells.
				for (let i = 0; i < cellsInArea.length; i++) {
					if (cellsInArea[i].row == row && cellsInArea[i].col == col) {
						currentCellState = cellsInArea[i].state;
						continue; //Don't count the current cell in the neighborhood calculation.
					}

					if (cellsInArea[i].state === CellStates.ACTIVE) {
						aliveNeighborsCount++;
					}
				}

				nextCellState = evaluator.evaluate(
					aliveNeighborsCount,
					currentCellState
				);

				if (nextCellState !== CellStates.DEAD) {
					// nextAliveCells.push(new Cell(row, col, nextCellState));
					cellBin.add(new Cell(row, col, nextCellState));
				}
			}
		}

		//Merge the bins into a single pre-sorted array of cells.
		nextAliveCells = cellBin.merge();
		cellBin.clear();

		//2. Create a new hash store from the list of active and aging cells.
		this.nextStore.clear();
		this.nextStore.addList(nextAliveCells);

		//3. Feed the cells to the scene manager.
		scene.push(nextAliveCells);
	}

	/**
	 * Replace the current tree with the next state tree and re-initializes the next tree to be empty.
	 */
	activateNext() {
		this.currentStore.clear();
		this.currentStore = null;
		this.currentStore = this.nextStore;
		this.nextStore = new CellMortonStore(
			this.config.landscape.width,
			this.config.landscape.height
		);
	}

	/**
	 * Traverse the next state data structure and adds it to the scene to be rendered.
	 * @param {SceneManager} scene - The active list of things that need to be rendered.
	 */
	stageStorage(scene, display) {
		if (!display) {
			return;
		}
		let boxes = [];
		collectBoxes(this.nextTree.root, boxes);
		// registerBoxTraits(this.config, boxes); //No longer doing this on the worker side.
		scene.push(boxes);
	}

	/**
	 * Purges the game manager of all alive cells.
	 */
	clear() {
		this.currentStore.clear();
		this.nextStore.clear();
	}
}

/**
 * Stores cells in arrays partitioned by their state.
 */
class CellBin {
	constructor() {
		this.bin = new Map();
	}

	add(cell) {
		if (cell && cell.state) {
			this.bin.has(cell.state)
				? this.bin.get(cell.state).push(cell)
				: this.bin.set(cell.state, [cell]);
		} else {
			throw new Error('Cannot add an undeclared Cell.');
		}
		return this;
	}

	/**
	 * Creates a new array by combining the bins in increasing key order.
	 * @returns {Cell[]} An array of cells.
	 */
	merge() {
		let cells = [];
		let keys = Array.from(this.bin.keys()).sort();
		keys.forEach((k) => cells.push(...this.bin.get(k)));
		return cells;
	}

	clear() {
		this.bin.clear();
	}
}
module.exports = GameManager;
