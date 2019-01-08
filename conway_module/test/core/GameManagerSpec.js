/*
This is a replacement for GameStateManagerSpec that uses a Quadtree.
*/
const chai = require('chai')
const expect = chai.expect
const {makeIdentity, makeFull10By10, makeCellsFrom2DArray} = require('./QuadTreeTestHelper.js')
const { Cell, QTNode, QuadTree, findAliveNeighbors} = require('./../../lib/core/Quadtree.js')
const GameManager = require('./../../lib/core/GameManager.js')
const SceneManager = require('./../../lib/core/SceneManager.js')
const ArrayAssertions = require('./ArrayAssertions.js')

describe('Game Manager', function(){
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
		it ('should replace the current grid with the next grid when activating', function(){
			let config = makeConfig(20,20)
			let mngr = new GameManager(config)
			let scene = new SceneManager()

			//Seeding the world should result in a current grid that has some life and
			//A next grid that is completely dead.
			mngr.seedWorld()
			let originalAliveCells = mngr.currentTree.findAliveInArea(0,0,config.landscape.width, config.landscape.height)
			let originalAliveCellsCount = originalAliveCells.length
			expect(originalAliveCellsCount > 0 && originalAliveCellsCount <= config.landscape.width * config.landscape.height).to.be.true

			//Evaluating the grid should result in no changes to the current grid and
			//The next grid should be completely alive.
			mngr.evaluateCells(scene, new AlwayAliveEvaluator())

			let currentTreeLiveCells = mngr.currentTree.findAliveInArea(0,0,config.landscape.width, config.landscape.height)
			let currentTreeLiveCellsCount = currentTreeLiveCells.length
			expect(currentTreeLiveCellsCount == originalAliveCellsCount).to.be.true

			//verify that the nextGrid is fully alive
			let nextTreeLiveCells = mngr.nextTree.findAliveInArea(0,0,config.landscape.width, config.landscape.height)
			let nextTreeLiveCellsCount = nextTreeLiveCells.length
			expect(nextTreeLiveCellsCount == config.landscape.width * config.landscape.height).to.be.true

			//Activating the next grid should replace the current grid with the next grid.
			mngr.activateNext()
			let newCurrentTreeAliveCells = mngr.currentTree.findAliveInArea(0,0,config.landscape.width, config.landscape.height)
			let newCurrentTreeAliveCellsCount = newCurrentTreeAliveCells.length
			expect(newCurrentTreeAliveCellsCount == nextTreeLiveCellsCount).to.be.true
		})

		it ('should replace the next grid with a dead grid when activating', function(){
			let config = makeConfig(20,20)
			let mngr = new GameManager(config)
			let scene = new SceneManager()

			//Seeding should result in the next grid being completely dead.
			mngr.seedWorld()
			let nextTreeLiveCells = mngr.nextTree.findAliveInArea(0,0,config.landscape.width, config.landscape.height)
			let nextTreeLiveCellsCount = nextTreeLiveCells.length
			expect(nextTreeLiveCellsCount == 0).to.be.true

			//Evaluating should make the next grid completely alive.
			mngr.evaluateCells(scene, new AlwayAliveEvaluator())
			nextTreeLiveCells = mngr.nextTree.findAliveInArea(0,0,config.landscape.width, config.landscape.height)
			nextTreeLiveCellsCount = nextTreeLiveCells.length
			expect(nextTreeLiveCellsCount == config.landscape.width * config.landscape.height).to.be.true

			//Activating should make the next grid dead again.
			mngr.activateNext()
			nextTreeLiveCells = mngr.nextTree.findAliveInArea(0,0,config.landscape.width, config.landscape.height)
			nextTreeLiveCellsCount = nextTreeLiveCells.length
			expect(nextTreeLiveCellsCount == 0).to.be.true
		})
	})

	/*
	Desired Tests: http://conwaylife.com/wiki/List_of_common_still_lifes
	- Beehive
	- Boat
	- Tub
	- Ship
	- Barge
	- Dark Spark Coil
	*/
	describe('Common Conway Primitives', function(){
		it('should support blocks', function(){
			let config = makeConfig(5, 5)
			let mngr = new GameManager(config)
			let scene = new SceneManager()
			let gridWithBlock = [	[ 0, 0, 0, 0, 0],
														[ 0, 0, 0, 0, 0],
														[ 0, 0, 1, 1, 0],
														[ 0, 0, 1, 1, 0],
														[ 0, 0, 0, 0, 0]]
			mngr.seedWorld(new ArraySeeder(gridWithBlock))

			let currentGrid = treeToGrid(mngr.currentTree, config.landscape.width, config.landscape.height)
			ArrayAssertions.assertEqual2DArrays(gridWithBlock,currentGrid)

			//Do 100 evaluations
			for(let cycle = 0; cycle < 100; cycle++){
				mngr.evaluateCells(scene)
				mngr.activateNext()
				scene.purge()
			}

			//The block should still be there.
			let lastGrid = treeToGrid(mngr.currentTree, config.landscape.width, config.landscape.height)
			ArrayAssertions.assertEqual2DArrays(gridWithBlock, lastGrid)
		})

		it ('should support blinkers', function(){
			let config = makeConfig(5, 5)
			let mngr = new GameManager(config)
			let scene = new SceneManager()

			let initBlinker = [[ 0, 0, 0, 0, 0 ],
														[ 0, 0, 1, 0, 0 ],
														[ 0, 0, 1, 0, 0 ],
														[ 0, 0, 1, 0, 0 ],
														[ 0, 0, 0, 0, 0 ] ]

			let blink = [	[ 0, 0, 0, 0, 0 ],
										[ 0, 0, 0, 0, 0 ],
										[ 0, 1, 1, 1, 0 ],
										[ 0, 0, 0, 0, 0 ],
										[ 0, 0, 0, 0, 0 ] ]
			mngr.seedWorld(new ArraySeeder(initBlinker))

			let currentGrid = treeToGrid(mngr.currentTree, config.landscape.width, config.landscape.height)
			ArrayAssertions.assertEqual2DArrays(initBlinker,currentGrid)

			for(i = 0; i < 100; i++){
				mngr.evaluateCells(scene)
				mngr.activateNext()
				scene.purge()
				currentGrid = treeToGrid(mngr.currentTree, config.landscape.width, config.landscape.height)
				if(i % 2){ //Odd: i % 2 == 1
					ArrayAssertions.assertEqual2DArrays(initBlinker, currentGrid)
				}else{ //Even: i % 2 == 0
					ArrayAssertions.assertEqual2DArrays(blink, currentGrid)
				}
			}
		})

		it ('should support ')
	})

})

class AlwayAliveEvaluator{
	evaluate(neighborsCount, currentCellState){
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

function treeToGrid(tree, width, height){
	//Make an array of 0s...
	let grid = []
	for (let row = 0; row < width; row++){
		let currentRow = Array(height).fill(0)
		grid.push(currentRow)
	}
	//Add all alive cells directly from leaves.
	tree.leaves.forEach((cell) =>{
		grid[cell.location.row][cell.location.col] = 1
	})
	return grid
}

class ArraySeeder{
	constructor(grid){
		this.grid = grid
	}

	seed(width, height){
		return makeCellsFrom2DArray(this.grid)
	}
}
