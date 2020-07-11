const chai = require('chai');
const expect = chai.expect;
const { makeCellsFrom2DArray } = require('./QuadTreeTestHelper.js');

const {
	QuadTree,
	findAliveNeighbors,
} = require('./../../lib/core/Quadtree.js');
const GameManager = require('./../../lib/core/GameManager.js');
const SceneManager = require('./../../lib/core/SceneManager.js');
const ArrayAssertions = require('./ArrayAssertions.js');
const { CellEvaluator } = require('../../lib/core/CellEvaluator.js');

let lifeEvaluator = new CellEvaluator([3], [2, 3]);

describe('Game Manager', function () {
	function buildTree(grid) {
		let cells = makeCellsFrom2DArray(grid);
		let tree = new QuadTree(cells);
		tree.index();
		return tree;
	}

	it('should provide the alive cell count', function () {
		let gm = new GameManager({
			landscape: {
				width: 20,
				height: 20,
			},
		});
		expect(gm.aliveCellsCount()).to.equal(0);
		gm.seedWorld();
		expect(gm.aliveCellsCount() > 0).to.be.true;
		expect(gm.aliveCellsCount()).to.equal(gm.getCells().length);
	});

	it('should clear the system', function () {
		let gm = new GameManager({
			landscape: {
				width: 20,
				height: 20,
			},
		});
		gm.seedWorld();
		gm.clear();

		expect(gm.currentStore.size()).to.equal(0);
		expect(gm.nextStore.size()).to.equal(0);
		expect(gm.getCells().length).to.equal(0);
	});

	describe('Scanning Neighbors', function () {
		it('should return zero when the cell has no neighbors', function () {
			let grid = [
				[0, 0, 0],
				[0, 0, 0],
				[0, 0, 0],
			];
			let aliveNeighborsCount = findAliveNeighbors(buildTree(grid), 1, 1);
			expect(aliveNeighborsCount).to.equal(0);
		});

		it('should return 1 when the cell has 1 neighbor', function () {
			let a = findAliveNeighbors(
				buildTree([
					[1, 0, 0],
					[0, 0, 0],
					[0, 0, 0],
				]),
				1,
				1
			);
			expect(a).to.equal(1);

			let b = findAliveNeighbors(
				buildTree([
					[0, 1, 0],
					[0, 0, 0],
					[0, 0, 0],
				]),
				1,
				1
			);
			expect(b).to.equal(1);

			let c = findAliveNeighbors(
				buildTree([
					[0, 0, 1],
					[0, 0, 0],
					[0, 0, 0],
				]),
				1,
				1
			);
			expect(c).to.equal(1);

			let d = findAliveNeighbors(
				buildTree([
					[0, 0, 0],
					[1, 0, 0],
					[0, 0, 0],
				]),
				1,
				1
			);
			expect(d).to.equal(1);

			let f = findAliveNeighbors(
				buildTree([
					[0, 0, 0],
					[0, 0, 1],
					[0, 0, 0],
				]),
				1,
				1
			);
			expect(f).to.equal(1);

			let g = findAliveNeighbors(
				buildTree([
					[0, 0, 0],
					[0, 0, 0],
					[1, 0, 0],
				]),
				1,
				1
			);
			expect(g).to.equal(1);

			let h = findAliveNeighbors(
				buildTree([
					[0, 0, 0],
					[0, 0, 0],
					[0, 1, 0],
				]),
				1,
				1
			);
			expect(h).to.equal(1);

			let i = findAliveNeighbors(
				buildTree([
					[0, 0, 0],
					[0, 0, 0],
					[0, 0, 1],
				]),
				1,
				1
			);
			expect(i).to.equal(1);
		});

		it('should not include the cell in the neighbors count', function () {
			let e = findAliveNeighbors(
				buildTree([
					[0, 0, 0],
					[0, 1, 0],
					[0, 0, 0],
				]),
				1,
				1
			);
			expect(e).to.equal(0);
		});

		it('should return the count of neighbors', function () {
			let a = findAliveNeighbors(
				buildTree([
					[1, 0, 0],
					[0, 1, 0],
					[0, 0, 1],
				]),
				1,
				1
			);
			expect(a).to.equal(2);

			let b = findAliveNeighbors(
				buildTree([
					[1, 1, 1],
					[0, 0, 0],
					[0, 0, 1],
				]),
				1,
				1
			);
			expect(b).to.equal(4);

			let c = findAliveNeighbors(
				buildTree([
					[1, 1, 1],
					[1, 0, 0],
					[1, 0, 0],
				]),
				1,
				1
			);
			expect(c).to.equal(5);

			let d = findAliveNeighbors(
				buildTree([
					[1, 1, 1],
					[1, 0, 0],
					[1, 1, 1],
				]),
				1,
				1
			);
			expect(d).to.equal(7);

			let e = findAliveNeighbors(
				buildTree([
					[1, 1, 1],
					[1, 0, 1],
					[1, 1, 1],
				]),
				1,
				1
			);
			expect(e).to.equal(8);
		});

		it('should ignore invalid cells', function () {
			let a = findAliveNeighbors(
				buildTree([
					[1, 1, 1],
					[1, 0, 0],
					[1, 1, 1],
				]),
				0,
				0
			);
			expect(a).to.equal(2);

			let b = findAliveNeighbors(
				buildTree([
					[1, 1, 1],
					[1, 0, 0],
					[1, 1, 1],
				]),
				2,
				2
			);
			expect(b).to.equal(1);

			let c = findAliveNeighbors(
				buildTree([
					[1, 1, 1],
					[1, 0, 0],
					[1, 1, 1],
				]),
				2,
				1
			);
			expect(c).to.equal(3);
		});
	});

	describe('Initializing Grid Size', function () {
		it.skip('should create the currentGrid to fit the maximum number of cells', function () {
			// let config = makeConfig()
			// let mngr = new GameStateManager(config)
			// mngr.seedWorld()
			// let currentGrid = mngr.getCurrentGrid()
			// expect(currentGrid.length).to.equal(10)
			// for(let i = 0; i < 10; i++){
			// 	expect(currentGrid[i].length).to.equal(10)
			// }
		});

		it.skip('should create the nextGrid to fit the maximum number of cells', function () {
			// let config = makeConfig()
			// let mngr = new GameStateManager(config)
			// mngr.seedWorld()
			// let nextGrid = mngr.getNextGrid()
			// expect(nextGrid.length).to.equal(10)
			// for(let i = 0; i < 10; i++){
			// 	expect(nextGrid[i].length).to.equal(10)
			// }
		});
	});

	describe('Seeding the World', function () {
		it('should initialize the nextGrid as a dead world', function () {
			let config = makeConfig();
			let mngr = new GameManager(config);
			mngr.seedWorld();
			expect(mngr.nextStore.size()).to.equal(0);
		});

		it('should initialize the currentGrid with some life in it', function () {
			let config = makeConfig();
			let mngr = new GameManager(config);
			mngr.seedWorld();
			let aliveCellsCount = mngr.currentStore.size();
			expect(
				aliveCellsCount > 0 &&
					aliveCellsCount <= config.landscape.width * config.landscape.height
			).to.be.true;
		});
	});

	describe('Activating the Next Grid', function () {
		it('should replace the current grid with the next grid when activating', function () {
			let config = makeConfig(20, 20);
			let mngr = new GameManager(config);
			let scene = new SceneManager();

			//Seeding the world should result in a current grid that has some life and
			//A next grid that is completely dead.
			mngr.seedWorld();
			let originalAliveCellsCount = mngr.currentStore.size();
			expect(
				originalAliveCellsCount > 0 &&
					originalAliveCellsCount <=
						config.landscape.width * config.landscape.height
			).to.be.true;

			//Evaluating the grid should result in no changes to the current grid and
			//The next grid should be completely alive.
			mngr.evaluateCells(scene, new AlwayAliveEvaluator());

			let currentTreeLiveCellsCount = mngr.currentStore.size();
			expect(currentTreeLiveCellsCount == originalAliveCellsCount).to.be.true;

			//verify that the nextGrid is fully alive
			let nextTreeLiveCellsCount = mngr.nextStore.size();
			expect(
				nextTreeLiveCellsCount ==
					config.landscape.width * config.landscape.height
			).to.be.true;

			//Activating the next grid should replace the current grid with the next grid.
			mngr.activateNext();

			let newCurrentTreeAliveCellsCount = mngr.currentStore.size();
			expect(newCurrentTreeAliveCellsCount == nextTreeLiveCellsCount).to.be
				.true;
		});

		it('should replace the next grid with a dead grid when activating', function () {
			let config = makeConfig(20, 20);
			let mngr = new GameManager(config);
			let scene = new SceneManager();

			//Seeding should result in the next grid being completely dead.
			mngr.seedWorld();
			let nextTreeLiveCellsCount = mngr.nextStore.size();
			expect(nextTreeLiveCellsCount == 0).to.be.true;

			//Evaluating should make the next grid completely alive.
			mngr.evaluateCells(scene, new AlwayAliveEvaluator());
			nextTreeLiveCellsCount = mngr.nextStore.size();
			expect(
				nextTreeLiveCellsCount ==
					config.landscape.width * config.landscape.height
			).to.be.true;

			//Activating should make the next grid dead again.
			mngr.activateNext();
			nextTreeLiveCellsCount = mngr.nextStore.size();
			expect(nextTreeLiveCellsCount == 0).to.be.true;
		});
	});
});

class AlwayAliveEvaluator {
	evaluate(neighborsCount, currentCellState) {
		return 1;
	}
}

function makeConfig(width = 10, height = 10) {
	return {
		landscape: {
			width: width,
			height: height,
		},
	};
}
