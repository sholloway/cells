const { Cell } = require('../entity-system/Entities.js');

//Borrowed from: https://github.com/mikolalysenko/bit-twiddle/blob/master/twiddle.js
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

function decode(zcode) {
	return [deinterleave(zcode, 0), deinterleave(zcode, 1)];
}

function deinterleave(zcode, component) {
	zcode = (zcode >>> component) & 0x55555555; // 1010101010101010101010101010101
	zcode = (zcode | (zcode >>> 1)) & 0x33333333; // 110011001100110011001100110011
	zcode = (zcode | (zcode >>> 2)) & 0x0f0f0f0f; // 1111000011110000111100001111
	zcode = (zcode | (zcode >>> 4)) & 0x00ff00ff; // 111111110000000011111111
	zcode = (zcode | (zcode >>> 8)) & 0x000ffff; // 1111111111111111
	return (zcode << 16) >> 16;
}

class LinearQuadTree {
	constructor() {
		this.zcurve = new ZCurve();
		this.bstIndex = new BinarySearchTree();
	}

	index(cells) {
		this.zcurve.buildCurve(cells);
		this.bstIndex.indexSortedArray(this.zcurve.curve);
	}

	indexSize() {
		return this.bstIndex.size;
	}

	curveSize() {
		return this.zcurve.size();
	}

	/**
	 * Finds the indexed cell by its Z-Code.
	 * Returns null if nothing is at that zcode.
	 * @param {Number} zcode
	 * @returns {Cell}
	 */
	at(zcode) {
		let searchResult = this.bstIndex.findNodeByKey(zcode);
		let cell = null;
		if (searchResult.foundNode) {
			let encodedCell = this.zcurve.get(searchResult.foundNode.index);
			if (!encodedCell) {
				throw new Error(
					`A cell was indexed but not present in the curve. Z-Code: ${zcode}`
				);
			}
			cell = new Cell(encodedCell.row, encodedCell.col);
		}
		return cell;
	}
}

function sortByZCode(a, b) {
	return a.zcode - b.zcode;
}

class ZCurve {
	constructor() {
		this.curve = [];
	}

	buildCurve(cells) {
		this.curve = [];
		for (var index = 0; index < cells.length; index++) {
			this.curve.push({
				zcode: encode(cells[index].row, cells[index].col),
				row: cells[index].row,
				col: cells[index].col,
			});
		}
		//Order the curve by sorting the z-code.
		this.curve.sort(sortByZCode);
		return this;
	}

	size() {
		return this.curve.length;
	}

	get(index) {
		return this.curve[index];
	}

	//Add a cell to the existing z-curve. For drawing mode.
	add(cell) {}

	//Is the cell already in the curve? For drawing mode.
	contains(cell) {}

	//Remove a cell from the curve. For drawing mode.
	delete(cell) {}

	//Find all alive cells in the bounding box.
	range(x, y, xx, yy) {}
}

class BinarySearchTree {
	constructor() {
		this.root = null;
		this.size = 0;
		this.idCount = 0;
	}

	calculateHeight(node = this.root) {
		if (!node) {
			return 0;
		}
		let leftDepth = this.calculateHeight(node.left);
		let rightDepth = this.calculateHeight(node.right);
		return leftDepth > rightDepth ? leftDepth + 1 : rightDepth + 1;
	}

	/**
	 * Generate a unique ID for a node in the tree.
	 * @private
	 */
	generateId() {
		return this.idCount++;
	}

	//use a stack
	indexSortedArray(curve) {
		let stack = [];
		let current;
		this.root = BSTNode.withId(this.generateId());
		stack.push({ node: this.root, start: 0, end: curve.length - 1 });
		while (stack.length > 0) {
			current = stack.pop();
			this.size++;
			if (current.end < current.start) {
				current.node.delete();
				this.size--;
				continue;
			} else if (current.end == current.start) {
				current.node.key = curve[current.end].zcode;
				current.node.index = current.end;
				continue;
			}

			//https://ai.googleblog.com/2006/06/extra-extra-read-all-about-it-nearly.html
			let mid = (current.start + current.end) >>> 1;
			current.node.key = curve[mid].zcode;
			current.node.index = mid;
			current.node.setLeft(BSTNode.withId(this.generateId()));
			current.node.setRight(BSTNode.withId(this.generateId()));

			stack.push({
				node: current.node.left,
				start: current.start,
				end: mid - 1,
			});

			stack.push({
				node: current.node.right,
				start: mid + 1,
				end: current.end,
			});
		}
		return this.root;
	}

	add(newNode) {
		if (this.root) {
			const { foundNode, parent } = this.findNodeByKey(newNode.key);
			if (foundNode) {
				throw new Error('Adding a node more than once is not allowed.');
			} else {
				newNode.key < parent.key
					? parent.setLeft(newNode)
					: parent.setRight(newNode);
			}
		} else {
			this.root = newNode;
		}
		this.size++;
	}

	//Recursively search for a node and its parent.
	findNodeByKey(key, current = this.root) {
		if (!key || key === current.key) {
			return { foundNode: current, parent: current.parent };
		} else {
			return key < current.key
				? this.findNodeByKey(key, current.left)
				: this.findNodeByKey(key, current.right);
		}
	}

	print(node = this.root, depth = 0) {
		if (node) {
			console.log(`${' '.repeat(depth)}${node.toString()}`);
			this.print(node.left, depth + 1);
			this.print(node.right, depth + 1);
		}
	}
}

class BSTNode {
	constructor(key = null, index = null) {
		this.id = null;
		this.key = key; //The Z-Code
		this.index = index; //The location on the curve -- array index.
		this.parent = null;
		this.left = null;
		this.right = null;
		this.parentDirection = null;
	}

	static withId(id) {
		let n = new BSTNode();
		n.id = id;
		return n;
	}

	setLeft(child) {
		this.left = child;
		if (child) {
			child.parent = this;
			child.parentDirection = 'LEFT';
		}
	}

	setRight(child) {
		this.right = child;
		if (child) {
			child.parent = this;
			child.parentDirection = 'RIGHT';
		}
	}

	delete() {
		if (this.parent) {
			this.parentDirection == 'LEFT'
				? (this.parent.left = null)
				: (this.parent.right = null);
		}
	}

	toString() {
		return `ID: ${this.id}, key: ${this.key}, index: ${this.index}`;
	}
}

module.exports = {
	encode,
	decode,
	BinarySearchTree,
	BSTNode,
	LinearQuadTree,
	ZCurve,
};
