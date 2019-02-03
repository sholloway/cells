const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon');

const DrawingStateManager = require('./../../lib/core/DrawingStateManager.js')
const {Cell} = require('./../../lib/core/Quadtree.js')

describe('DrawingStateManager', function(){
	it ('should initialize with empty quad trees', function(){
		let dsm = new DrawingStateManager({})
		expect(dsm.currentTree.aliveCellsCount()).to.equal(0)
		expect(dsm.nextTree.aliveCellsCount()).to.equal(0)
	})

	it ('should enable manually setting the alive cells', function(){
		let aliveCells = [new Cell(1,1), new Cell(12,122)]
		let dsm = new DrawingStateManager({})
		dsm.setCells(aliveCells)
		expect(dsm.currentTree.aliveCellsCount()).to.equal(2)
	})

	it ('should provide a way to get a copy of the alive cells', function(){
		let aliveCells = [new Cell(73,1), new Cell(122, 14), new Cell(17, 3303)]
		let dsm = new DrawingStateManager({})
		dsm.setCells(aliveCells)
		expect(dsm.getCells().length).to.equal(3)
	})
})
