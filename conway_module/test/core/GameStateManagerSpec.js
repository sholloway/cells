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
