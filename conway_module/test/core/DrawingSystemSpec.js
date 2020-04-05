const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon');

const DrawingSystem = require('./../../lib/core/DrawingSystem.js')

describe('DrawingSystem', function(){
	it ('should implement getStateManager', function(){
		let ds = new DrawingSystem()
		expect(ds.getStateManager()).to.not.be.null
	})

	it ('should update the scene', function(){
		let ds = new DrawingSystem()
		let fakeStateManager = {}
		fakeStateManager.stageStorage = sinon.spy()
		fakeStateManager.processCells = sinon.spy()
		ds.stateManager = fakeStateManager
		ds.update()
		expect(fakeStateManager.stageStorage.calledOnce).to.be.true
		expect(fakeStateManager.processCells.calledOnce).to.be.true
	})

	it ('should enable setting alive cells', function(){
		let ds = new DrawingSystem()
		let fakeStateManager = {}
		fakeStateManager.setCells = sinon.spy()
		ds.stateManager = fakeStateManager
		ds.setCells([])
		expect(fakeStateManager.setCells.calledOnce).to.be.true
	})

	it ('should enable toggling cells', function(){
		let ds = new DrawingSystem()
		let fakeStateManager = {}
		fakeStateManager.toggleCell = sinon.spy()
		ds.stateManager = fakeStateManager
		ds.toggleCell(4,2)
		expect(fakeStateManager.toggleCell.calledOnce).to.be.true
	})

	it ('should only allow toggling when the system is idle', function(){
		let ds = new DrawingSystem();
		expect(ds.getState()).to.equal('IDLE');
		ds.toggleCell(1,1);
		ds.toggleCell(2,10);
		ds.toggleCell(14,221);
		expect(ds.getCells().length).to.equal(3);
		ds.state = 'NOT IDLE';
		ds.toggleCell(0,221); //should not get added
		expect(ds.getCells().length).to.equal(3);
	});

	it ('should enable setting the cell size', function(){
		let ds = new DrawingSystem();
		expect(ds.config.zoom).to.equal(1);
		ds.setCellSize(5);
		expect(ds.config.zoom).to.equal(5);
	});

	it ('should enable specifying to draw the storage structure', function(){
		let ds = new DrawingSystem();
		expect(ds.displayStorageStructure).to.be.false;
		ds.displayStorage(true);
		expect(ds.displayStorageStructure).to.be.true;
	});

	it ('should enable resetting the system', function(){
		let ds = new DrawingSystem();
		let fakeStateManager = {};
		let fakeSceneManager = {};
		fakeStateManager.clear = sinon.spy();
		fakeSceneManager.clear = sinon.spy();
		ds.stateManager = fakeStateManager;
		ds.scene = fakeSceneManager;
		ds.reset();
		expect(fakeStateManager.clear.calledOnce).to.be.true;
		expect(fakeSceneManager.clear.calledOnce).to.be.true;
	});

	it ('should share the internal state', function(){
		let ds = new DrawingSystem();
		expect(ds.getState()).to.equal('IDLE');
	});

	it ('should set the configuration', function(){
		let ds = new DrawingSystem();
		expect(ds.config.zoom).to.equal(1);
		ds.setConfig({zoom: 10});
		expect(ds.config.zoom).to.equal(10);
	});

	it ('should share the internal scene', function(){
		let ds = new DrawingSystem();
		expect(ds.getScene()).to.not.be.null;
	});

	it ('should only allow update when idle', function(){
		let ds = new DrawingSystem();
		expect(ds.getState()).to.equal('IDLE');
		expect(ds.canUpdate()).to.be.true;
		ds.state = 'NOT IDLE';
		expect(ds.canUpdate()).to.be.false;
	});

	it ('should share cells in the scene', function(){
		let ds = new DrawingSystem();
		expect(ds.getScene()).to.not.be.null;
	});
})
