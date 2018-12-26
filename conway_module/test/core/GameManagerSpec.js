/*
This is a replacement for GameStateManagerSpec that uses a Quadtree.
*/
const chai = require('chai')
const expect = chai.expect
const {makeIdentity, makeFull10By10, makeCellsFrom2DArray} = require('./QuadTreeTestHelper.js')
const { Cell, QTNode, QuadTree} = require('./../../lib/core/Quadtree')
const GameManager = require('./../../lib/core/GameManager.js')

describe('Game Manager', function(){

	/**
	 * Given a cell's coordinates, find the count of alive neighbors.
	 * @param {number} row - The cell's coordinates on the x-axis.
	 * @param {number} col - The cell's coordinates on the y-axis.
	 * @returns {number} The count of alive neighbors.
	 */
	function findAliveNeighbors(tree, row, col){
	// 1. Calculate the range from the cell coordinates.
	// 2. Run the range query.
	// 3. Filter the center cell.
		let range = {
			x : row - 1,
			y : col - 1,
			xx : row + 1,
			yy : col + 1
		}
		let aliveCells = tree.findAliveInArea(range.x, range.y, range.xx, range.yy)
		let aliveCount = aliveCells.reduce((count, cell) => {
				if (!(cell.location.row == row && cell.location.col == col)){
					count++
				}
				return count
			}, 0)
		return aliveCount
	}

	function buildTree(grid){
		let cells = makeCellsFrom2DArray(grid)
		let tree = new QuadTree(cells)
		tree.index()
		return tree
	}

	describe('Scanning Neighbors', function(){
		it ('should return zero when the cell has no neighbors', function(){
			let grid = [[0, 0, 0],
									[0, 0, 0],
									[0, 0, 0]]
			let aliveNeighborsCount = findAliveNeighbors(buildTree(grid),1,1)
			expect(aliveNeighborsCount).to.equal(0)
		})

		it ('should return 1 when the cell has 1 neighbor', function(){
			let a = findAliveNeighbors(buildTree([[1, 0, 0],
																						[0, 0, 0],
																						[0, 0, 0]]), 1, 1)
			expect(a).to.equal(1)

			let b = findAliveNeighbors(buildTree([[0, 1, 0],
																						[0, 0, 0],
																						[0, 0, 0]]), 1, 1)
			expect(b).to.equal(1)

			let c = findAliveNeighbors(buildTree([[0, 0, 1],
																						[0, 0, 0],
																						[0, 0, 0]]), 1, 1)
			expect(c).to.equal(1)

			let d = findAliveNeighbors(buildTree([[0, 0, 0],
																						[1, 0, 0],
																						[0, 0, 0]]), 1, 1)
			expect(d).to.equal(1)

			let f = findAliveNeighbors(buildTree([[0, 0, 0],
																						[0, 0, 1],
																						[0, 0, 0]]), 1, 1)
			expect(f).to.equal(1)

			let g = findAliveNeighbors(buildTree([[0, 0, 0],
																						[0, 0, 0],
																						[1, 0, 0]]), 1, 1)
			expect(g).to.equal(1)

			let h = findAliveNeighbors(buildTree([[0, 0, 0],
																						[0, 0, 0],
																						[0, 1, 0]]), 1, 1)
			expect(h).to.equal(1)

			let i = findAliveNeighbors(buildTree([[0, 0, 0],
																						[0, 0, 0],
																						[0, 0, 1]]), 1, 1)
			expect(i).to.equal(1)
		})

		it ('should not include the cell in the neighbors count', function(){
			let e = findAliveNeighbors(buildTree([[0, 0, 0],
																						[0, 1, 0],
																						[0, 0, 0]]), 1, 1)
			expect(e).to.equal(0)
		})

		it ('should return the count of neighbors', function(){
			let a = findAliveNeighbors(buildTree([[1, 0, 0],
																						[0, 1, 0],
																						[0, 0, 1]]), 1, 1)
			expect(a).to.equal(2)

			let b = findAliveNeighbors(buildTree([[1, 1, 1],
																						[0, 0, 0],
																						[0, 0, 1]]), 1, 1)
			expect(b).to.equal(4)

			let c = findAliveNeighbors(buildTree([[1, 1, 1],
																						[1, 0, 0],
																						[1, 0, 0]]), 1, 1)
			expect(c).to.equal(5)

			let d = findAliveNeighbors(buildTree([[1, 1, 1],
																						[1, 0, 0],
																						[1, 1, 1]]), 1, 1)
			expect(d).to.equal(7)

			let e = findAliveNeighbors(buildTree([[1, 1, 1],
																						[1, 0, 1],
																						[1, 1, 1]]), 1, 1)
			expect(e).to.equal(8)
		})

		it ('should ignore invalid cells', function(){
			let a = findAliveNeighbors(buildTree([	[1, 1, 1],
															[1, 0, 0],
															[1, 1, 1]]), 0, 0)
			expect(a).to.equal(2)

			let b = findAliveNeighbors(buildTree([	[1, 1, 1],
															[1, 0, 0],
															[1, 1, 1]]), 2, 2)
			expect(b).to.equal(1)

			let c = findAliveNeighbors(buildTree([	[1, 1, 1],
															[1, 0, 0],
															[1, 1, 1]]), 2, 1)
			expect(c).to.equal(3)
		})
	})

	describe('Initializing Grid Size', function(){
		it.skip ('should create the currentGrid to fit the maximum number of cells', function(){
			// let config = makeConfig()
			// let mngr = new GameStateManager(config)
			// mngr.seedWorld()
			// let currentGrid = mngr.getCurrentGrid()
			// expect(currentGrid.length).to.equal(10)
			// for(let i = 0; i < 10; i++){
			// 	expect(currentGrid[i].length).to.equal(10)
			// }
		})

		it.skip ('should create the nextGrid to fit the maximum number of cells', function(){
			// let config = makeConfig()
			// let mngr = new GameStateManager(config)
			// mngr.seedWorld()
			// let nextGrid = mngr.getNextGrid()
			// expect(nextGrid.length).to.equal(10)
			// for(let i = 0; i < 10; i++){
			// 	expect(nextGrid[i].length).to.equal(10)
			// }
		})
	})

	describe("Seeding the World", function(){
		it ("should initialize the nextGrid as a dead world", function(){
			let config = makeConfig()
			let mngr = new GameManager(config)
			mngr.seedWorld()
			let aliveCells = mngr.nextTree.findAliveInArea(0,0,config.landscape.width, config.landscape.height)
			expect(aliveCells.length).to.equal(0)
		})

		it ("should initialize the currentGrid with some life in it", function(){
			let config = makeConfig()
			let mngr = new GameManager(config)
			mngr.seedWorld()
			let aliveCells = mngr.currentTree.findAliveInArea(0,0,config.landscape.width, config.landscape.height)
			let aliveCellsCount = aliveCells.length
			expect(aliveCellsCount > 0 && aliveCellsCount <= config.landscape.width * config.landscape.height).to.be.true
		})
	})

	describe('Activating the Next Grid', function(){
		it.skip ('should replace the current grid with the next grid when activating', function(){
			// let config = makeConfig(20,20)
			// let mngr = new GameStateManager(config)
			// let scene = new SceneManager()

			// //Seeding the world should result in a current grid that has some life and
			// //A next grid that is completely dead.
			// mngr.seedWorld()
			// let originalCurrentGridSum = arraySum(mngr.getCurrentGrid())
			// expect(originalCurrentGridSum > 0 && originalCurrentGridSum < 400).to.be.true
			// expect(arraySum(mngr.getNextGrid()) == 0).to.be.true

			// //Evaluating the grid should result in no changes to the current grid and
			// //The next grid should be completely alive.
			// mngr.evaluateCells(scene, new AlwayAliveEvaluator())
			// expect(arraySum(mngr.getCurrentGrid()) == originalCurrentGridSum).to.be.true
			// let nextStateArraySum = arraySum(mngr.getNextGrid())
			// expect(nextStateArraySum != 0).to.be.true
			// expect(nextStateArraySum != originalCurrentGridSum).to.be.true

			// //Activating the next grid should replace the current grid with the next grid.
			// mngr.activateNextGrid()
			// expect(arraySum(mngr.getCurrentGrid()) == nextStateArraySum).to.be.true
		})

		it.skip ('should replace the next grid with a dead grid when activating', function(){
			// let config = makeConfig(20,20)
			// let mngr = new GameStateManager(config)
			// let scene = new SceneManager()

			// //Seeding should result in the next grid being completely dead.
			// mngr.seedWorld()
			// expect(arraySum(mngr.getNextGrid()) == 0).to.be.true

			// //Evaluating should make the next grid completely alive.
			// mngr.evaluateCells(scene, new AlwayAliveEvaluator())
			// expect(arraySum(mngr.getNextGrid()) == 400).to.be.true

			// //Activating should make the next grid dead again.
			// mngr.activateNextGrid()
			// expect(arraySum(mngr.getNextGrid()) == 0).to.be.true
		})
	})

	//write tests for block, blinker
	describe('Common Conway Primitives', function(){
		it.skip('should support blocks', function(){
			// let config = makeConfig(5, 5, 1, 1)
			// let mngr = new GameStateManager(config)
			// let scene = new SceneManager()
			// let blockSeeder = new BlockSeeder()
			// mngr.seedWorld(blockSeeder)

			// let blockGrid = blockSeeder.seed(5,5)
			// ArrayAssertions.assertEqual2DArrays(blockGrid, mngr.getCurrentGrid())

			// //Do 100 evaluations
			// for(let cycle = 0; cycle < 100; cycle++){
			// 	mngr.evaluateCells(scene)
			// 	mngr.activateNextGrid()
			// }

			// //The block should still be there.
			// ArrayAssertions.assertEqual2DArrays(blockGrid, mngr.getCurrentGrid())
		})

		it.skip ('should support blinkers', function(){
			// let config = makeConfig(5, 5, 1, 1)
			// let mngr = new GameStateManager(config)
			// let scene = new SceneManager()
			// let blinkerSeeder = new BlinkerSeeder()

			// mngr.seedWorld(blinkerSeeder)
			// let initBlinker = blinkerSeeder.seed(5,5)
			// let blink = BlinkerSeeder.blink()

			// ArrayAssertions.assertEqual2DArrays(initBlinker, mngr.getCurrentGrid())
			// for(i = 0; i < 100; i++){
			// 	mngr.evaluateCells(scene)
			// 	mngr.activateNextGrid()
			// 	if(i % 2){ //Odd: i % 2 == 1
			// 		ArrayAssertions.assertEqual2DArrays(initBlinker, mngr.getCurrentGrid())
			// 	}else{ //Even: i % 2 == 0
			// 		ArrayAssertions.assertEqual2DArrays(blink, mngr.getCurrentGrid())
			// 	}
			// }
		})
	})

})

class AlwayAliveEvaluator{
	evaluate(neghborsCount, currentCellState){
		return 1
	}
}

function makeConfig(width=10, height=10){
	return {
		landscape:{
			width: width,
			height: height
		}
	}
}

function arraySum(array){
	let sum = 0;
	for(let i = 0; i < array.length; i++){
		for (let j = 0; j < array[i].length; j++){
			sum += array[i][j]
		}
	}
	return sum
}

class BlockSeeder{
	seed(width, height){
		return [[ 0, 0, 0, 0, 0],
						[ 0, 0, 0, 0, 0],
						[ 0, 0, 1, 1, 0],
						[ 0, 0, 1, 1, 0],
						[ 0, 0, 0, 0, 0]]
	}
}

class BlinkerSeeder{
	seed(width, height){
		return [[ 0, 0, 0, 0, 0 ],
						[ 0, 0, 1, 0, 0 ],
						[ 0, 0, 1, 0, 0 ],
						[ 0, 0, 1, 0, 0 ],
						[ 0, 0, 0, 0, 0 ] ]
	}

	static blink(){
		return [[ 0, 0, 0, 0, 0 ],
						[ 0, 0, 0, 0, 0 ],
						[ 0, 1, 1, 1, 0 ],
						[ 0, 0, 0, 0, 0 ],
						[ 0, 0, 0, 0, 0 ] ]
	}
}
