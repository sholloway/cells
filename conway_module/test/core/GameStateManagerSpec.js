const chai = require('chai')
const expect = chai.expect

const GameStateManager = require('./../../src/core/GameStateManager.js')

describe('Game State Manager', function(){
	describe('Initializing Grid Size', function(){
		it ('should create the currentGrid to fit the maximum number of cells', function(){
			let config = makeConfig()
			let mngr = new GameStateManager(config)
			mngr.seedWorld()
			let currentGrid = mngr.getCurrentGrid()
			expect(currentGrid.length).to.equal(10)
			for(let i = 0; i < 10; i++){
				expect(currentGrid[i].length).to.equal(10)
			}
		})

		it ('should create the nextGrid to fit the maximum number of cells', function(){
			let config = makeConfig()
			let mngr = new GameStateManager(config)
			mngr.seedWorld()
			let nextGrid = mngr.getNextGrid()
			expect(nextGrid.length).to.equal(10)
			for(let i = 0; i < 10; i++){
				expect(nextGrid[i].length).to.equal(10)
			}
		})
	})

	describe("Seeding the World", function(){
		it ("should initialize the nextGrid as a dead world", function(){
			let config = makeConfig()
			let mngr = new GameStateManager(config)
			mngr.seedWorld()
			let nextGrid = mngr.getNextGrid()
			expect(arraySum(nextGrid)).to.equal(0)
		})

		it ("should initialize the currentGrid with some life in it", function(){
			let config = makeConfig()
				let mngr = new GameStateManager(config)
				mngr.seedWorld()
				let currentGrid = mngr.getCurrentGrid()
				expect(arraySum(currentGrid) > 0).to.be.true
		})
	})

	it ('should replace the current grid with the next grid when activating', function(){
		let config = makeConfig(20,20)
		let mngr = new GameStateManager(config)

		//Seeding the world should result in a current grid that has some life and
		//A next grid that is completely dead.
		mngr.seedWorld()
		let originalCurrentGridSum = arraySum(mngr.getCurrentGrid())
		expect(originalCurrentGridSum > 0 && originalCurrentGridSum < 400).to.be.true
		expect(arraySum(mngr.getNextGrid()) == 0).to.be.true

		//Evaluating the grid should result in no changes to the current grid and
		//The next grid should be completely alive.
		mngr.evaluateCells(new AlwayAliveEvaluator())
		expect(arraySum(mngr.getCurrentGrid()) == originalCurrentGridSum).to.be.true
		let nextStateArraySum = arraySum(mngr.getNextGrid())
		expect(nextStateArraySum != 0).to.be.true
		expect(nextStateArraySum != originalCurrentGridSum).to.be.true

		//Activating the next grid should replace the current grid with the next grid.
		mngr.activateNextGrid()
		expect(arraySum(mngr.getCurrentGrid()) == nextStateArraySum).to.be.true
	})

	it ('should replace the next grid with a dead grid when activating', function(){
		let config = makeConfig(20,20)
		let mngr = new GameStateManager(config)

		//Seeding should result in the next grid being completely dead.
		mngr.seedWorld()
		expect(arraySum(mngr.getNextGrid()) == 0).to.be.true

		//Evaluating should make the next grid completely alive.
		mngr.evaluateCells(new AlwayAliveEvaluator())
		expect(arraySum(mngr.getNextGrid()) == 400).to.be.true

		//Activating should make the next grid dead again.
		mngr.activateNextGrid()
		expect(arraySum(mngr.getNextGrid()) == 0).to.be.true
	})
})

class AlwayAliveEvaluator{
	evaluate(neghborsCount, currentCellState){
		return 1
	}
}

function makeConfig(width=10, height=10, cellWidth=1, cellHeight=1){
	return {
		canvas: {
			width: width,
			height: height
		},
		cell:{
			width: cellWidth,
			height: cellHeight
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
