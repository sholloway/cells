const { Cell } = require('../entity-system/Entities.js');

class DrawingTemplate {
	constructor() {}

	generateCells(x, y) {
		let cells = this.makeCellsFrom2DArray(this.pattern());
		let patternOrigin = this.origin();
		let shift = {
			x: x + patternOrigin.x,
			y: y + patternOrigin.y,
		};

		cells.forEach((c) => {
			c.location.row += shift.x;
			c.location.col += shift.y;
		});
		return cells;
	}

	pattern() {
		throw new Error('Children of DrawingTemplate must implement pattern().');
	}

	origin() {
		return { x: 0, y: 0 };
	}

	makeCellsFrom2DArray(grid) {
		let cells = [];
		grid.forEach((row, rowIndex) => {
			row.forEach((value, colIndex) => {
				if (value == 1) {
					cells.push(new Cell(colIndex, rowIndex, 1));
				}
			});
		});
		return cells;
	}
}

module.exports = DrawingTemplate;
