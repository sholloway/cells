const chai = require('chai');
const expect = chai.expect;

const {
	encode,
	CellMortonStore,
} = require('../../lib/core/CellMortonStore.js');

const { makeCellsFrom2DArray } = require('./QuadTreeTestHelper.js');

describe('CellMortonStore', function () {
	it('should store and retrieve cells by z-code', function () {
		let cells = makeCellsFrom2DArray(scenarios.IDENTITY);
		let store = new CellMortonStore();
		store.addList(cells);
		expect(store.size()).to.equal(3);

		let nwCell = store.get(encode(cells[0].row, cells[0].col));
		expect(nwCell.row).to.equal(0);
		expect(nwCell.col).to.equal(0);

		let centerCell = store.get(encode(cells[1].row, cells[1].col));
		expect(centerCell.row).to.equal(1);
		expect(centerCell.col).to.equal(1);

		let seCell = store.get(encode(cells[2].row, cells[2].col));
		expect(seCell.row).to.equal(2);
		expect(seCell.col).to.equal(2);
	});

	it('should find neighborhoood: diagonal NW End', function () {
		let cells = makeCellsFrom2DArray(scenarios.IDENTITY);
		let store = new CellMortonStore(100, 100);
		store.addList(cells);

		let found = store.neighborhood({ row: 0, col: 0 });
		expect(found.length).to.equal(2);
		expect(found[0].row).to.equal(0);
		expect(found[0].col).to.equal(0);
		expect(found[1].row).to.equal(1);
		expect(found[1].col).to.equal(1);
	});

	it('should find neighborhoood: diagonal SE End', function () {
		let cells = makeCellsFrom2DArray(scenarios.IDENTITY);
		let store = new CellMortonStore(100, 100);
		store.addList(cells);

		let found = store.neighborhood({ row: 2, col: 2 });
		expect(found.length).to.equal(2);
		expect(found[0].row).to.equal(1);
		expect(found[0].col).to.equal(1);
		expect(found[1].row).to.equal(2);
		expect(found[1].col).to.equal(2);
	});

	it('should find neighborhoood: center', function () {
		let cells = makeCellsFrom2DArray(scenarios.ALL);
		let store = new CellMortonStore(100, 100);
		store.addList(cells);

		let found = store.neighborhood({ row: 1, col: 1 });
		expect(found.length).to.equal(9);
  });
  
	it('should find neighborhoood: empty', function () {
		let cells = makeCellsFrom2DArray(scenarios.NE);
		let store = new CellMortonStore(100, 100);
		store.addList(cells);

		let found = store.neighborhood({ row: 2, col: 0 });
		expect(found.length).to.equal(0);
  });
  
  it('should clear the store', function(){
    let cells = makeCellsFrom2DArray(scenarios.ALL);
		let store = new CellMortonStore(100, 100);
    store.addList(cells);
    expect(store.size()).to.equal(9)
    store.clear()
    expect(store.size()).to.equal(0)
  })
});

const scenarios = {
	EMPTY: [
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0],
	],
	NW: [
		[1, 0, 0],
		[0, 0, 0],
		[0, 0, 0],
	],
	NORTH: [
		[0, 1, 0],
		[0, 0, 0],
		[0, 0, 0],
	],
	NE: [
		[0, 0, 1],
		[0, 0, 0],
		[0, 0, 0],
	],
	WEST: [
		[0, 0, 0],
		[1, 0, 0],
		[0, 0, 0],
	],
	CENTER: [
		[0, 0, 0],
		[0, 1, 0],
		[0, 0, 0],
	],
	EAST: [
		[0, 0, 0],
		[0, 0, 1],
		[0, 0, 0],
	],
	SW: [
		[0, 0, 0],
		[0, 0, 0],
		[1, 0, 0],
	],
	SOUTH: [
		[0, 0, 0],
		[0, 0, 0],
		[0, 1, 0],
	],
	SE: [
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 1],
	],
	ALL: [
		[1, 1, 1],
		[1, 1, 1],
		[1, 1, 1],
	],
	IDENTITY: [
		[1, 0, 0],
		[0, 1, 0],
		[0, 0, 1],
	],
};
