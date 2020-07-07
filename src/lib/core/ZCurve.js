const { ZCurve } = require('@thi.ng/morton');
const { Cell } = require('../entity-system/Entities.js');

function componentsToCell(comps) {
	return new Cell(comps[0], comps[1]);
}

function cellInBox(cell, x, y, xx, yy) {
	return !(cell.row < x || cell.row > xx || cell.col < y || cell.col > yy);
}

class LinearQuadTree {
	constructor() {
		this.zcurve = new ZCurveManager();
		this.bstIndex = new BinarySearchTree();
	}

	clear() {
		this.bstIndex.clear();
		this.zcurve.clear();
	}

	index(cells) {
		this.zcurve.buildCurve(cells);
		this.bstIndex.indexSortedArray(this.zcurve.curve);
	}

	indexWithRecursion(cells) {
		this.zcurve.buildCurve(cells);
		this.bstIndex.indexSortedArrayWithRecursion(this.zcurve.curve);
	}

	indexSize() {
		return this.bstIndex.countChildren();
	}

	curveSize() {
		return this.zcurve.size();
	}

	search(cell) {
		let zcode = this.zcurve.encode(cell.row, cell.col);
		return this.at(zcode);
	}

	binarySearch(cell) {
		let zcode = this.zcurve.encode(cell.row, cell.col);
		return this.zcurve.search(zcode);
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
		if (searchResult && searchResult.foundNode) {
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

	//Find all cells between two points.
	range(x, y, xx, yy) {
		//TBD
	}

	verifyCurve() {
		let isValid = true;
		for (var i = 1; i < this.zcurve.curve.length - 1; i++) {
			if (this.zcurve.curve[i].zcode <= this.zcurve.curve[i - 1].zcode) {
				console.log(
					`Curve is not valid. ${this.zcurve.curve[i].zcode} <= ${
						this.zcurve.curve[i - 1].zcode
					}`
				);
				isValid = false;
				break;
			}
		}
		return isValid;
	}
}

function sortByZCode(a, b) {
	return a.zcode < b.zcode ? -1 : a.zcode > b.zcode ? 1 : 0;
}

class ZCurveManager {
	constructor() {
		this.curve = [];
		this.encoder = new ZCurve(2, 16);
	}

	clear() {
		this.curve = [];
	}

	encode(row, col) {
		return this.encoder.encode([row, col]);
	}

	buildCurve(cells) {
		this.curve = this.encodeArray(cells);
		this.curve.sort(sortByZCode);
		return this;
	}

	encodeArray(cells) {
		let encoded = [];
		for (var index = 0; index < cells.length; index++) {
			encoded.push({
				zcode: this.encoder.encode([cells[index].row, cells[index].col]),
				row: cells[index].row,
				col: cells[index].col,
			});
		}
		return encoded;
	}

	size() {
		return this.curve.length;
	}

	get(index) {
		return this.curve[index];
	}

	/**
	 * Find a cell if it exists on the curve by its Z-Code using binary search.
	 * @param {*} zcode
	 */
	search(zcode) {
		let mid;
		let left = 0;
		let right = this.curve.length - 1;
		const NOT_FOUND = null;
		while (left <= right) {
			mid = (left + right) >>> 1;
			if (this.curve[mid].zcode < zcode) {
				left = mid + 1;
			} else if (this.curve[mid].zcode > zcode) {
				right = mid - 1;
			} else {
				//Enrich the data on the curve with the curve location.
				//This is useful for range searches.
				return {
					index: mid,
					zcode: this.curve[mid].zcode,
					row: this.curve[mid].row,
					col: this.curve[mid].col,
				};
			}
		}
		return NOT_FOUND;
	}

	/**
	 * Find the zcodes on the curve inside a bounding box.
	 * Note: This does not return the actual cells, but rather
	 * the z-codes of the cells that need to be examined.
	 *
	 * Leverages the bigmin technique.
	 * {@link https://en.wikipedia.org/wiki/Z-order_curve#Use_with_one-dimensional_data_structures_for_range_searching}
	 * {@link https://github.com/smatsumt/pyzorder/blob/master/pyzorder/pyzorder.py}
	 * {@link https://github.com/thi-ng/umbrella/blob/81e8a39c45ad8f32ada5f48552757d15b4cd681c/packages/morton/src/zcurve.ts#L228}
	 *
	 * @param {Number} x - The horizontal component of the minimum point.
	 * @param {Number} y - The vertical component of the minimum point.
	 * @param {Number} xx - The horizontal component of the maximum point.
	 * @param {Number} yy - The vertical component of the minimum point.
	 * @returns {Cell[]} Returns an array of cells contained in the bounding box.
	 */
	range(x, y, xx, yy) {
		let component,
			found = [];
		for (var zcode of this.encoder.range([x, y], [xx, yy])) {
			component = this.search(zcode);
			if (component) {
				found.push(new Cell(component.row, component.col));
			}
		}
		return found;
	}
}

class BinarySearchTree {
	constructor() {
		this.root = null;
		this.size = 0;
		this.idCount = 0;
	}

	clear() {
		this.root = null;
		this.size = 0;
		this.idCount = 0;
	}

	countChildren(node = this.root) {
		if (!node) {
			return 0;
		}
		return this.countChildren(node.left) + this.countChildren(node.right) + 1;
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

			if (current.end < current.start) {
				if (current.node.key == null) {
					current.node.delete();
				}
			} else if (current.end == current.start) {
				current.node.key = curve[current.end].zcode;
				current.node.index = current.end;
			} else {
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
		}
		return this.root;
	}

	//build the tree using binary search and recursion
	indexSortedArrayWithRecursion(curve) {
		this.root = this.helper(curve, 0, curve.length - 1);
		return this.root;
	}

	helper(curve, start, end) {
		if (start > end) {
			return null;
		}

		let mid = Math.floor(start + (end - start) / 2);
		let node = BSTNode.withId(this.generateId());
		node.key = curve[mid].zcode;
		node.index = mid;
		node.setLeft(this.helper(curve, start, mid - 1));
		node.setRight(this.helper(curve, mid + 1, end));
		return node;
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
	findNodeByKey(key, current = this.root, parent = null) {
		if (!current || current.key == key) {
			return { foundNode: current, parent: parent };
		} else {
			if (key < current.key) {
				return this.findNodeByKey(key, current.left, current);
			} else if (key > current.key) {
				return this.findNodeByKey(key, current.right, current);
			}
		}
	}

	//For debugging. Apply a breadth first search to find a value.
	bfs(value, node = this.root) {
		let visitedCount = 0;
		let percentComplete = 0;
		let queue = [];
		let current;
		queue.push(node);

		console.log(`Searching for Z-Code: ${value}`);
		console.log(`Nodes created: ${this.idCount}`);
		while (queue && queue.length > 0) {
			visitedCount++;
			percentComplete = (visitedCount / this.idCount) * 100;
			current = queue.shift();
			process.stdout.write(
				`% complete: ${percentComplete} \t Queue Length: ${queue.length} \t Evaluating: ${current.key} \r`
			);
			if (current.key == value) {
				process.stdout.write('\r');
				console.log('Match Found!');
				console.log(
					`% complete: ${percentComplete} \t Queue Length: ${queue.length} \t Evaluating: ${current.key}`
				);
				queue = [];
				return current;
			}
			if (current.left) queue.push(current.left);
			if (current.right) queue.push(current.right);
		}
		return null;
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
	BinarySearchTree,
	BSTNode,
	LinearQuadTree,
	ZCurveManager,
};
