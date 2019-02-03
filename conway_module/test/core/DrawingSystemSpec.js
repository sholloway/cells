const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon');

const DrawingSystem = require('./../../lib/core/DrawingSystem.js')

describe('DrawingSystem', function(){
	it ('should implement getStateManager', function(){
		let ds = new DrawingSystem({}, {}, {})
		expect(ds.getStateManager()).to.not.be.null
	})

	it ('should update the scene', function(){
		let ds = new DrawingSystem({}, {}, {})
		let fakeStateManager = {}
		fakeStateManager.stageStorage = sinon.spy()
		fakeStateManager.processCells = sinon.spy()
		ds.stateManager = fakeStateManager
		ds.update()
		expect(fakeStateManager.stageStorage.calledOnce).to.be.true
		expect(fakeStateManager.processCells.calledOnce).to.be.true
	})

	it ('should enable setting alive cells', function(){
		let ds = new DrawingSystem({}, {}, {})
		let fakeStateManager = {}
		fakeStateManager.setCells = sinon.spy()
		ds.stateManager = fakeStateManager
		ds.setCells([])
		expect(fakeStateManager.setCells.calledOnce).to.be.true
	})

	it ('should enable toggling cells', function(){
		let ds = new DrawingSystem({}, {}, {})
		let fakeStateManager = {}
		fakeStateManager.toggleCell = sinon.spy()
		ds.stateManager = fakeStateManager
		ds.toggleCell(4,2)
		expect(fakeStateManager.toggleCell.calledOnce).to.be.true
	})
})
