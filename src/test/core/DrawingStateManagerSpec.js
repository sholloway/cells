const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const DrawingStateManager = require('./../../lib/core/DrawingStateManager.js');
const { Cell } = require('./../../lib/entity-system/Entities.js');
const SceneManager = require('./../../lib/core/SceneManager.js');
const { makeIdentity } = require('./QuadTreeTestHelper.js');

describe('DrawingStateManager', function () {
	it('should initialize with empty cell store', function () {
		let dsm = new DrawingStateManager({});
		expect(dsm.currentStore.size()).to.equal(0);
	});

	it('should enable manually setting the alive cells', function () {
		let aliveCells = [new Cell(1, 1), new Cell(12, 122)];
		let dsm = new DrawingStateManager({});
		dsm.setCells(aliveCells);
		expect(dsm.currentStore.size()).to.equal(2);
	});

	it('should provide a way to get a copy of the alive cells', function () {
		let aliveCells = [new Cell(73, 1), new Cell(122, 14), new Cell(17, 3303)];
		let dsm = new DrawingStateManager({});
		dsm.setCells(aliveCells);
		expect(dsm.getCells().length).to.equal(3);
	});

	it('should enable drawing', function () {
		let dsm = new DrawingStateManager({});
		expect(dsm.getCells().length).to.equal(0);
		dsm.toggleCell(0, 0);
		dsm.toggleCell(1, 0);
		dsm.toggleCell(2, 0);
		dsm.toggleCell(3, 0);
		expect(dsm.getCells().length).to.equal(4);
		expect(dsm.getCells()).to.include.deep.members([
			new Cell(0, 0),
			new Cell(2, 0),
		]);
	});

	it('should enable removing alive cells', function () {
		let dsm = new DrawingStateManager({});
		dsm.toggleCell(0, 0);
		dsm.toggleCell(1, 0);
		dsm.toggleCell(2, 0);
		expect(dsm.getCells()).to.include.deep.members([
			new Cell(0, 0),
			new Cell(2, 0),
			new Cell(1, 0),
		]);

		//remove a cell
		dsm.toggleCell(1, 0);
		expect(dsm.getCells())
			.to.include.deep.members([new Cell(0, 0), new Cell(2, 0)])
			.but.not.include.deep.members([new Cell(1, 0)]);
	});

	it('should prepare all alive cells for rendering', function () {
		let dsm = new DrawingStateManager({});
		dsm.toggleCell(0, 0);
		dsm.toggleCell(1, 0);
		dsm.toggleCell(2, 0);

		let scene = new SceneManager();
		expect(scene.fullyRendered()).to.be.true;
		expect(scene.stack.length).to.equal(0);
		dsm.processCells(scene);

		expect(scene.fullyRendered()).to.be.false;
		expect(scene.stack.length).to.equal(3);
	});

	it('should clear the system', function () {
		let dsm = new DrawingStateManager({});
		dsm.toggleCell(0, 0);
		dsm.toggleCell(1, 0);
		dsm.toggleCell(2, 0);
		dsm.clear();

		expect(dsm.currentStore.size()).to.equal(0);
		expect(dsm.getCells().length).to.equal(0);
	});
});
