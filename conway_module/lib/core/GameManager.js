const {Cell, QuadTree, findAliveNeighbors, cloneCells} = require('./Quadtree.js')
const CellEvaluator = require('./CellEvaluator.js')
const {Box, ColorByAgeTrait, CircleTrait, ScaleTransformer, GridCellToRenderingEntity,
	ProcessBoxAsRect, ColorByContents, RectOutlineTrait, GridEntity,
	DarkThinLines, GridPattern} = require('./EntitySystem.js')

const {CellStates} = require('./CellStates.js')
const {SeederFactory, SeederModels} = require('./SeederFactory.js')

/**
 * Create the default cell evaluator.
 * @private
 * @returns {CellEvaluator}
 */
function defaultCellEvaluator(){
	return new CellEvaluator()
}

/**
 * Create the default simulation seeder.
 * @private
 * @returns {Seeder}
 */
function defaultSeeder(){
	return SeederFactory.build(SeederModels.RANDOM)
}

/**
 * Configure Cells to be render-able.
 * @private
 * @param {object} config - The simulation's configuration object.
 * @param {Cell[]} cells - The list of cells to configure.
 */
function registerCellTraits(config, cells){
	cells.forEach((cell) => {
		cell.register(new GridCellToRenderingEntity())
			.register(new ScaleTransformer(config.zoom))
			.register(new ColorByAgeTrait())
			.register(new CircleTrait())
	});
}

/**
 * Recursively traverses a quad tree and adds the partition boxes to the provided array.
 * @private
 * @param {QTNode} currentNode - The current node to process.
 * @param {Box[]} boxes - The array to add the partition boxes to.
 */
function collectBoxes(currentNode, boxes){
	let containsAliveCell = currentNode.index != null
	boxes.push(new Box(currentNode.rect.x, currentNode.rect.y, currentNode.rect.xx, currentNode.rect.yy, containsAliveCell))
	if(currentNode.subdivided){
		currentNode.children().forEach((child)=>{
			collectBoxes(child, boxes)
		})
	}
}

/**
 * Configure boxes to be render-able.
 * @private
 * @param {object} config - The simulation's configuration object.
 * @param {Box[]} boxes - The list of boxes to configure.
 */
function registerBoxTraits(config, boxes){
	boxes.forEach(box => {
		box.register(new ProcessBoxAsRect())
			.register(new ScaleTransformer(config.zoom))
			.register(new ColorByContents())
			.register(new RectOutlineTrait())
	})
}

/**
 * Orchestrates Conway's Game of Life.
 */
class GameManager{
	/**
	 * Create a new GameManager instance.
	 * @param {object} config - The simulation's configuration object.
	 */
	constructor(config){
		this.config = config
		this.currentTree = QuadTree.empty()
		this.nextTree = QuadTree.empty()
	}

	/**
	 * The number of cells currently alive in the simulation.
	 * @returns {number}
	*/
	aliveCellsCount(){
		return this.currentTree.aliveCellsCount()
	}

	/**
	 * Creates a deep copy of the cells in the drawing.
	 * @returns {Cell[]} The copy of the cells.
	 */
	getCells(){
		return cloneCells(this.currentTree.leaves)
	}

	/**
	 * Populates the current tree.
	 */
	seedWorld(seeder = defaultSeeder()){
		let aliveCells = seeder.seed(this.config.landscape.width, this.config.landscape.height)
		this.currentTree.index(aliveCells)
		this.nextTree.index()
	}

	/**
	 * Traverse the current grid, applying the rules defined by the evaluator and
	 * populate the next grid accordingly. No changes are made to the current grid.
	 *
	 * @param {SceneManager} scene - The active list of things that need to be rendered.
	 * @param {CellEvaluator} evaluator - Responsible for evaluating a single cell.
	*/
	evaluateCells(scene, evaluator = defaultCellEvaluator()){
		//1. Traverse every possible cell on the landscape, building up a list of new alive cells.
		let aliveNeighbors, nextCellState, foundCell;
		let nextAliveCells = []
		for(let row = 0; row < this.config.landscape.width; row++){
			for(let col = 0; col < this.config.landscape.height; col++){
				//TODO: There is an opportunity to combine findAliveNeighbors with findCellIfAlive.
				//Then, only one traversal would be needed. findAliveNeighbors could be renamed and return
				// something like { aliveNeighbors:..., aliveCenter: ... }
				aliveNeighbors = findAliveNeighbors(this.currentTree, row, col)
				foundCell = this.currentTree.findCellIfAlive(row,col) //Returns DeadCell if not alive.
				nextCellState = evaluator.evaluate(aliveNeighbors, foundCell.getState())
				if (nextCellState == CellStates.ALIVE){
					nextAliveCells.push(new Cell(row,col, foundCell.age+1))
				}
			}
		}

		//2. Create a new quad tree from the list of alive cells.
		this.nextTree.clear()
		this.nextTree.index(nextAliveCells)

		//3. Feed the cells to the scene manager.
		registerCellTraits(this.config, nextAliveCells)
		scene.push(nextAliveCells)
	}

	/**
	 * Replace the current tree with the next state tree and re-initializes the next tree to be empty.
	 */
	activateNext(){
		this.currentTree = QuadTree.clone(this.nextTree)
		this.nextTree.clear().index()
	}

	/**
	 * Traverse the next state data structure and adds it to the scene to be rendered.
	 * @param {SceneManager} scene - The active list of things that need to be rendered.
	 */
	stageStorage(scene, display){
		if (!display){
			return
		}
		let boxes = []
		collectBoxes(this.nextTree.root,boxes)
		registerBoxTraits(this.config, boxes)
		scene.push(boxes)
	}

	/**
	 * Purges the game manager of all alive cells.
	 */
	clear(){
		this.currentTree.clear().index()
		this.nextTree.clear().index()
	}
}

module.exports = GameManager
