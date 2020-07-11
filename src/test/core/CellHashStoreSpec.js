const chai = require('chai');
const expect = chai.expect;

const {
	decode,
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
		let store = new CellMortonStore();
		store.addList(cells);

		let found = store.neighborhood({ row: 0, col: 0 }, 100, 100);
		expect(found.length).to.equal(2);
		expect(found[0].row).to.equal(0);
		expect(found[0].col).to.equal(0);
		expect(found[1].row).to.equal(1);
		expect(found[1].col).to.equal(1);
	});

	it('should find neighborhoood: diagonal SE End', function () {
		let cells = makeCellsFrom2DArray(scenarios.IDENTITY);
		let store = new CellMortonStore();
		store.addList(cells);

		let found = store.neighborhood({ row: 2, col: 2 }, 100, 100);
		expect(found.length).to.equal(2);
		expect(found[0].row).to.equal(1);
		expect(found[0].col).to.equal(1);
		expect(found[1].row).to.equal(2);
		expect(found[1].col).to.equal(2);
	});

	it('should find neighborhoood: center', function () {
		let cells = makeCellsFrom2DArray(scenarios.ALL);
		let store = new CellMortonStore();
		store.addList(cells);

		let found = store.neighborhood({ row: 1, col: 1 }, 100, 100);
		expect(found.length).to.equal(9);
	});

	it('should find neighborhoood: empty', function () {
		let cells = makeCellsFrom2DArray(scenarios.NE);
		let store = new CellMortonStore(100, 100);
		store.addList(cells);

		let found = store.neighborhood({ row: 2, col: 0 });
		expect(found.length).to.equal(0);
	});

	it('should clear the store', function () {
		let cells = makeCellsFrom2DArray(scenarios.ALL);
		let store = new CellMortonStore();
		store.addList(cells);
		expect(store.size()).to.equal(9);
		store.clear();
		expect(store.size()).to.equal(0);
	});

	describe('Encode/Decode', function () {
		//https://github.com/thi-ng/umbrella/blob/develop/packages/morton/src/zcurve.ts
		it('should encode points', function () {
			expect(encode(0, 0)).to.equal(0);
			expect(encode(1, 0)).to.equal(1);
			expect(encode(0, 1)).to.equal(2);
			expect(encode(1, 1)).to.equal(3);
			expect(encode(2, 0)).to.equal(4);
			expect(encode(3, 0)).to.equal(5);
			expect(encode(3, 1)).to.equal(7);

			expect(encode(4, 5)).to.equal(50);
			expect(encode(6, 7)).to.equal(62);
		});

		it('should decode zcode into two points', function () {
			expect(decode(0)).to.eql([0, 0]);
			expect(decode(1)).to.eql([1, 0]);
			expect(decode(2)).to.eql([0, 1]);
			expect(decode(3)).to.eql([1, 1]);
			expect(decode(4)).to.eql([2, 0]);
			expect(decode(5)).to.eql([3, 0]);
			expect(decode(7)).to.eql([3, 1]);

			expect(decode(50)).to.eql([4, 5]);
			expect(decode(62)).to.eql([6, 7]);

			expect(decode(256)).to.eql([16, 0]);
		});

		it('should reverse encode with decode', function () {
			var encoded;
			for (var x = 0; x < 100; x++) {
				for (var y = 0; y < 100; y++) {
					encoded = encode(x, y);
					decoded = decode(encoded);
					expect(decoded).to.eql([x, y]);
				}
			}
		});
	});
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
