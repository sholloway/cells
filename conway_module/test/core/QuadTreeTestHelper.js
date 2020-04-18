const { Cell } = require('./../../lib/entity-system/Entities.js');
/*
			 0 1 2 3 4 5 6 7 8 9
		0 |1|0|0|0|0|0|0|0|0|0|
		1 |0|1|0|0|0|0|0|0|0|0|
		2 |0|0|1|0|0|0|0|0|0|0|
		3 |0|0|0|1|0|0|0|0|0|0|
		4 |0|0|0|0|1|0|0|0|0|0|
		5 |0|0|0|0|0|1|0|0|0|0|
		6 |0|0|0|0|0|0|1|0|0|0|
		7 |0|0|0|0|0|0|0|1|0|0|
		8 |0|0|0|0|0|0|0|0|1|0|
		9 |0|0|0|0|0|0|0|0|0|1|
*/
function makeIdentity() {
	return [
		new Cell(0, 0, 1),
		new Cell(1, 1, 1),
		new Cell(2, 2, 1),
		new Cell(3, 3, 1),
		new Cell(4, 4, 1),
		new Cell(5, 5, 1),
		new Cell(6, 6, 1),
		new Cell(7, 7, 1),
		new Cell(8, 8, 1),
		new Cell(9, 9, 1),
	];
}

/*
 		   0 1 2 3 4 5 6 7 8 9
		0 |0|0|0|0|0|0|0|0|0|1|
		1 |0|0|0|0|0|0|0|0|1|0|
		2 |0|0|0|0|0|0|0|1|0|0|
		3 |0|0|0|0|0|0|1|0|0|0|
		4 |0|0|0|0|0|1|0|0|0|0|
		5 |0|0|0|0|1|0|0|0|0|0|
		6 |0|0|0|1|0|0|0|0|0|0|
		7 |0|0|1|0|0|0|0|0|0|0|
		8 |0|1|0|0|0|0|0|0|0|0|
		9 |1|0|0|0|0|0|0|0|0|0|
*/
function makeOppositeIdentity() {
	return [
		new Cell(0, 9, 1),
		new Cell(1, 8, 1),
		new Cell(2, 7, 1),
		new Cell(3, 6, 1),
		new Cell(4, 5, 1),
		new Cell(5, 4, 1),
		new Cell(6, 3, 1),
		new Cell(7, 2, 1),
		new Cell(8, 1, 1),
		new Cell(9, 0, 1),
	];
}

/**
 * Provision an array of alive cells for a 10x10 grid.
 */
function makeFull10By10() {
	let cells = [];
	for (let row = 0; row < 10; row++) {
		for (let col = 0; col < 10; col++) {
			cells.push(new Cell(row, col, 1));
		}
	}
	return cells;
}

/**
 * Create a list of alive Cells from a 2D array of integers.
 * @param {Array[Array[Number]]} grid
 *
 * @example
 * let grid = [[1,0,0],[0,1,0],[0,0,1]]
 * makeCellsFrom2DArray(grid) // returns Array[Cell(0,0), Cell(0,1), Cell(2,2)]
 * @returns Array[Cell]
 */
function makeCellsFrom2DArray(grid) {
	let cells = [];
	grid.forEach((row, rowIndex) => {
		row.forEach((value, colIndex) => {
			if (value == 1) {
				cells.push(new Cell(rowIndex, colIndex, 1));
			}
		});
	});
	return cells;
}

module.exports = {
	makeIdentity,
	makeOppositeIdentity,
	makeFull10By10,
	makeCellsFrom2DArray,
};
