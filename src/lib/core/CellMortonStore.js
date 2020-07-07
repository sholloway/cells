const { map } = require('benchmark');

function encode(x, y) {
	x &= 0xffff; //Constrain to 16 bits. 0xffff is 65535 which is the number range of 16 bits. 1111111111111111 in binary. Numbers larger than 65535 will roll over.
	x = (x | (x << 8)) & 0x00ff00ff; //Shift to the left by 8. Mask: 111111110000000011111111
	x = (x | (x << 4)) & 0x0f0f0f0f; //Mask: 1111000011110000111100001111
	x = (x | (x << 2)) & 0x33333333; //Mask: 110011001100110011001100110011
	x = (x | (x << 1)) & 0x55555555; //Mask: 1010101010101010101010101010101

	y &= 0xffff;
	y = (y | (y << 8)) & 0x00ff00ff;
	y = (y | (y << 4)) & 0x0f0f0f0f;
	y = (y | (y << 2)) & 0x33333333;
	y = (y | (y << 1)) & 0x55555555;

	return x | (y << 1);
}

function clip(value, min, max) {
	return Math.min(max, Math.max(min, value));
}

class CellMortonStore {
	constructor(width, height) {
		this.map = new Map();
		this.width = width;
		this.height = height;
	}

	size() {
		return this.map.size;
	}

	addList(cells) {
		for (var i = 0; i < cells.length; i++) {
			this.map.set(encode(cells[i].row, cells[i].col), cells[i]);
		}
		return this;
	}

	add(cell) {
		this.map.set(encode(cell.row, cell.col), cell);
		return this;
	}

	has(zcode) {
		return this.map.has(zcode);
	}

	get(zcode) {
		return this.map.get(zcode);
	}

	clear() {
		this.map.clear();
		return this;
	}

	/**
	 * Find all of the cells in a given cell's Moore neighborhood.
	 *
	 * {@link https://www.conwaylife.com/wiki/Cellular_automaton#Common_dimensions_and_neighborhoods | Moore Neighborhood}
	 *
	 * @param {*} cell
	 */
	neighborhood(cell) {
		let found = [];
		let current;

		//constrain the neigborhood to the boundaries of the grid 
		let left = clip(cell.row - 1, 0, this.width);
		let right = clip(cell.row + 1, 0, this.width)
		let bottom = clip(cell.col-1, 0, this.height);
		let top = clip(cell.col+1, 0, this.height);

		for (var row = left; row <= right; row++) {
			for (var col = bottom; col <= top; col++) {
				current = this.get(encode(row, col));
				current && found.push(current);
			}
		}
		return found;
	}
}

module.exports = { encode, CellMortonStore, clip };
