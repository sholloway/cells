/**
 * A module for working with a 2D quadtree.
 * @module quadtree
 */

const {
	Cell,
	CELL_HEIGHT,
	CELL_WIDTH,
	DeadCell,
} = require('../entity-system/Entities');

/**
 * Singleton instance of a dead cell.
 * */
const DEAD_CELL = new DeadCell(Infinity, Infinity);
Object.freeze(DEAD_CELL);

/**
 * A node in the pointer based quad tree.
 */
class QTNode {
	/**
	 * Initialize a new QTNode.
	 * @param {number} id - The unique identifier of the node.
	 * @param {number} x
	 * @param {number} y
	 * @param {number} xx
	 * @param {number} yy
	 */
	constructor(id, x, y, xx, yy) {
		this.id = id;
		this.rect = {
			x: x,
			y: y,
			xx: xx,
			yy: yy,
		};
		this.area = this.area();
		this.subdivided = false; //Flag indicating this node has been subdivided.
		this.children = [];
		//The potential children of this node.
		this.upperLeft = null;
		this.upperRight = null;
		this.lowerLeft = null;
		this.lowerRight = null;

		//The index is a reference to the data in the array containing all the live cells.
		//It should be the number index, not a pointer to the data itself.
		//If it is null, then this node is empty or not a leaf.
		this.index = null;
	}

	toString() {
		return `ID: ${this.id}\nSpace: (${this.rect.x},${this.rect.y}),(${this.rect.xx},${this.rect.yy})\nArea: ${this.area}`;
	}

	/**
	 * Returns true if the region doesn't contain a point yet.
	 * @returns {boolean}
	 */
	empty() {
		return this.index === null;
	}

	/**
	 * Sets all class members to null.
	 */
	destroy() {
		this.id = null;
		this.rect = null;
		this.area = null;
		this.upperLeft = null;
		this.upperRight = null;
		this.lowerLeft = null;
		this.lowerRight = null;
		this.index = null;
	}

	/**
	 * Rectangle/Point intersection test
	 * @param {number} x - Left most boundary of the rectangle
	 * @param {number} y - Upper most boundary of the rectangle
	 * @returns {boolean}
	 */
	containsPoint(x, y) {
		return (
			this.rect.x <= x &&
			x <= this.rect.xx &&
			this.rect.y <= y &&
			y <= this.rect.yy
		);
	}

	/**
	 * Tests if a given cell is fully contained by the QTNode's bounding box.
	 * This is defined by all 4 points of the cell being inside (or on edge)
	 * of the bounding box.
	 *
	 * @param {Cell} cell
	 * @returns {boolean}
	 */
	containsRect(cell) {
		if (cell == null || cell == undefined) {
			throw new Exception('QTNode.contains cannot process a null cell.');
		}

		//Since both the cell and bounding box are aligned to the same axes
		//we can just check the min and max points.
		return (
			this.containsPoint(cell.row, cell.col) &&
			this.containsPoint(cell.row + CELL_WIDTH, cell.col + CELL_HEIGHT)
		);
	}

	/**
	 * Axis-aligned bounding box intersection test.
	 * @param {number} x
	 * @param {number} y
	 * @param {number} xx
	 * @param {number} yy
	 * @returns {boolean} Returns whether or not the node's bounding box intersects the provided range.
	 */
	intersectsAABB(x, y, xx, yy) {
		let intersects = false;
		if (
			this.rect.x <= xx &&
			this.rect.xx >= x &&
			this.rect.y <= yy &&
			this.rect.yy >= y
		) {
			intersects = true;
		}
		return intersects;
	}

	/**
	 * Tests to see if the Node's AABB is inside the provided rectangle.
	 * @param {number} x
	 * @param {number} y
	 * @param {number} xx
	 * @param {number} yy
	 * @returns {boolean}
	 */
	isInsideRect(x, y, xx, yy) {
		let firstPointIntersection =
			x <= this.rect.x &&
			this.rect.x <= xx &&
			y <= this.rect.y &&
			this.rect.y <= yy;

		let secondPointIntersection =
			x <= this.rect.xx &&
			this.rect.xx <= xx &&
			y <= this.rect.yy &&
			this.rect.yy <= yy;

		return firstPointIntersection && secondPointIntersection;
	}

	/**
	 * Calculates the area of the bounding rectangle.
	 * Formula: Area = Length * Height
	 *
	 * @returns {number} The area of the rectangle.
	 */
	area() {
		let length = Math.abs(this.rect.xx) - Math.abs(this.rect.x);
		let height = Math.abs(this.rect.yy) - Math.abs(this.rect.y);
		return length * height;
	}

	/**
	 * Set the node to a leaf. This is where the data lives.
	 * @param {number} index - The location of the leaf.
	 */
	setLeaf(index) {
		this.index = index;
	}

	/**
	 * Divides the node's region into 4 equal quadrants.
	 *
	 * Given the bounding box BB divide into the Quadrants Q1, Q2, Q3 & Q4 where:
	 * BB ------------------->
	 *    |   Q1   |   Q2   |
	 *    |--------|--------|
	 *    |   Q3   |   Q4   |
	 *    -------------------
	 *
	 * And the quadrants being divided by the point (p,q).
	 */
	subdivide(tree) {
		//Only support the scenario of subdividing exactly once.
		if (this.subdivided) {
			return;
		}

		let p =
			this.rect.x +
			Math.ceil((Math.abs(this.rect.xx) - Math.abs(this.rect.x)) / 2);
		let q =
			this.rect.y +
			Math.ceil((Math.abs(this.rect.yy) - Math.abs(this.rect.y)) / 2);

		//How to handle overlap?..
		this.upperLeft = new QTNode(
			tree.generateId(),
			this.rect.x,
			this.rect.y,
			p,
			q
		); //Q1
		this.upperRight = new QTNode(
			tree.generateId(),
			p,
			this.rect.y,
			this.rect.xx,
			q
		); //Q2
		this.lowerLeft = new QTNode(
			tree.generateId(),
			this.rect.x,
			q,
			p,
			this.rect.yy
		); //Q3
		this.lowerRight = new QTNode(
			tree.generateId(),
			p,
			q,
			this.rect.xx,
			this.rect.yy
		); //Q4

		this.children.push(
			this.upperLeft,
			this.upperRight,
			this.lowerLeft,
			this.lowerRight
		);

		this.subdivided = true;
	}

	horizontalPartition() {
		return this.upperLeft.rect.xx;
	}

	verticalPartition() {
		return this.upperLeft.rect.yy;
	}

	static createNullNode() {
		return new NullNode();
	}
}

class NullNode extends QTNode {
	constructor() {
		super(-1, -1, -1, -1, -1);
		this.isNullNode = true;
	}
}

/**
 * Create an empty Axis-aligned bounding box.
 * @returns {object} An AABB defined by two points.
 */
function emptyAABB() {
	return {
		rowMin: 0,
		colMin: 0,
		rowMax: 0,
		colMax: 0,
	};
}

/**
 * Constructs an axis aligned bounding box from a set of cells
 * on a uniform grid.
 *
 * @param {Cell[]} cells - An array of alive cells.
 * @returns {object} An AABB defined by two points.
 */
function buildAxisAlignedBoundingBox(cells) {
	let rowMin = cells[0].row;
	let rowMax = cells[0].row;
	let colMin = cells[0].col;
	let colMax = cells[0].col;
	cells.forEach((cell) => {
		rowMin = Math.min(rowMin, cell.row);
		rowMax = Math.max(rowMax, cell.row);
		colMin = Math.min(colMin, cell.col);
		colMax = Math.max(colMax, cell.col);
	});
	// The max is increased by one in both axis to
	// account for including the farthest cell rather
	// than intersecting it.
	return {
		rowMin: rowMin,
		colMin: colMin,
		rowMax: rowMax + 1,
		colMax: colMax + 1,
	};
}

/**
 * Given an array and index, verifies that the index is valid.
 * @param {Array} array - The array to verify the index against.
 * @param {number} index - The index to verify
 * @returns {Boolean}
 */
function validIndex(array, index) {
	return typeof index === 'number' && index >= 0 && index <= array.length - 1;
}

/**
 * Deletes the provided and all children nodes.
 * @param {QTNode} node - The node to start the top-down delete from.
 */
function recursiveDelete(node) {
	if (node) {
		recursiveDelete(node.upperLeft);
		recursiveDelete(node.upperRight);
		recursiveDelete(node.lowerLeft);
		recursiveDelete(node.lowerRight);
		node.destroy();
	}
}

/**
 * A pointer based 2D spatial quad tree.
 */
class QuadTree {
	constructor(liveCells) {
		this.leaves = liveCells;
		this.root = null;
		this.minimumCellSize = 1;
		this.idCount = 0;
	}

	/**
	 * Generate a unique ID for a node in the quad tree. Used for debugging.
	 * @private
	 */
	generateId() {
		return this.idCount++;
	}

	aliveCellsCount() {
		return this.leaves.length;
	}

	/**
	 * Empties the tree. It sets the leaves to an empty array and recursively deletes all nodes.
	 * @returns {QuadTree} The instance of the tree being operated on.
	 */
	clear() {
		//	recursiveDelete(this.root);
		this.root = null;
		this.leaves = [];
		this.idCount = 0;
		return this;
	}

	/**
	 * Create a new empty quad tree.
	 */
	static empty() {
		return new QuadTree([]);
	}

	/**
	 * Creates a deep copy of the provided quad tree.
	 * @param {QuadTree} tree
	 * @returns {QuadTree} A deep copy of the tree. Returns an empty tree if passed null.
	 */
	static clone(tree) {
		if (typeof tree === 'undefined' || tree === null) {
			return QuadTree.empty();
		}

		let clonedCells = [];
		tree.leaves.forEach((leaf) => {
			clonedCells.push(leaf.clone());
		});
		let clonedTree = new QuadTree(clonedCells);
		clonedTree.index();
		return clonedTree;
	}

	/**
	We want to use recursion to add a cell to quad tree.
	Starting with the root, check to see if the cell belongs the active node,
	if it does not, then subdivide by 4 and call each new child recursively.

	@param {number} minimumCellSize - The smallest area a partition can have.
	@param {QTNode} node - The node in the QuadTree to start the test.
	@param {Cell} cell - The cell to be added to the QuadTree.
	@param {number} index - The location of the cell in the array of leaves.
	*/
	addCell(minimumCellSize, node, cell, index) {
		//If the cell does not fall in the node's bounding box end.
		if (!node.containsRect(cell)) {
			return;
		}

		if (node.subdivided) {
			for (var quadrant = 0; quadrant < node.children.length; quadrant++) {
				if (node.children[quadrant].containsRect(cell)) {
					this.addCell(minimumCellSize, node.children[quadrant], cell, index);
				}
			}
		} else {
			if (node.empty()) {
				node.setLeaf(index);
				return;
			} else {
				// If it's not empty, there's already a cell here.
				// We need to subdivide and reposition the existing cell.
				node.subdivide(this);
				let relocateCell = this.leaves[node.index];
				let relocateCellIndex = node.index;
				node.setLeaf(null);

				for (var quadrant = 0; quadrant < node.children.length; quadrant++) {
					//attempt to place the existing cell
					if (node.children[quadrant].containsRect(relocateCell)) {
						this.addCell(
							minimumCellSize,
							node.children[quadrant],
							relocateCell,
							relocateCellIndex
						);
					}

					//attempt to place the current cell
					if (node.children[quadrant].containsRect(cell)) {
						this.addCell(minimumCellSize, node.children[quadrant], cell, index);
					}
				}
			}
		}
	}

	/** The original index method. Leverages recursion.
	 * Build the spatial data structure based on a provided array of cells.
	 * @param {Cell[]} liveCells
	 * @returns {QTNode} Returns the root of the tree.
	 */
	recursive_index(liveCells = null) {
		if (liveCells !== null) {
			this.leaves = liveCells;
		}
		this.boundary =
			this.leaves.length > 0
				? buildAxisAlignedBoundingBox(this.leaves)
				: emptyAABB();
		this.root = new QTNode(
			this.generateId(),
			this.boundary.rowMin,
			this.boundary.colMin,
			this.boundary.rowMax,
			this.boundary.colMax
		);

		for (var index = 0; index < this.leaves.length; index++) {
			this.addCell(this.minimumCellSize, this.root, this.leaves[index], index);
		}

		return this.root;
	}

	/** The second index method. Leverages a stack and looping.
	 * Build the spatial data structure based on a provided array of cells.
	 * @param {Cell[]} liveCells
	 * @returns {QTNode} Returns the root of the tree.
	 */
	index(liveCells = null) {
		let stack = [];
		if (liveCells !== null) {
			this.leaves = liveCells;
		}
		this.boundary =
			this.leaves.length > 0
				? buildAxisAlignedBoundingBox(this.leaves)
				: emptyAABB();
		this.root = new QTNode(
			this.generateId(),
			this.boundary.rowMin,
			this.boundary.colMin,
			this.boundary.rowMax,
			this.boundary.colMax
		);

		this.leaves.forEach((cell, index) => {
			stack.push({ node: this.root, cell: cell, index: index });
		});

		let item;
		while (stack.length) {
			item = stack.pop();

			if (!item.node.containsRect(item.cell)) {
				continue;
			}

			if (item.node.subdivided) {
				for (
					var quadrant = 0;
					quadrant < item.node.children.length;
					quadrant++
				) {
					if (item.node.children[quadrant].containsRect(item.cell)) {
						stack.push({
							node: item.node.children[quadrant],
							cell: item.cell,
							index: item.index,
						});
					}
				}
			} else {
				if (item.node.empty()) {
					if (item.node.area === this.minimumCellSize) {
						item.node.setLeaf(item.index);
					} else {
						item.node.subdivide(this);
						stack.push(item); //Place the item back on the stack. It's children will get processed on the next loop.
					}
				} else {
					// If it's not empty, there's already a cell here.
					// We need to subdivide and reposition the existing cell.
					item.node.subdivide(this);
					let relocateCell = this.leaves[item.node.index];
					let relocateCellIndex = item.node.index;
					item.node.setLeaf(null);

					for (
						var quadrant = 0;
						quadrant < item.node.children.length;
						quadrant++
					) {
						//attempt to place the existing cell
						if (item.node.children[quadrant].containsRect(relocateCell)) {
							stack.push({
								node: item.node.children[quadrant],
								cell: relocateCell,
								index: relocateCellIndex,
							});
						}

						//attempt to place the current cell
						if (item.node.children[quadrant].containsRect(item.cell)) {
							stack.push({
								node: item.node.children[quadrant],
								cell: item.cell,
								index: item.index,
							});
						}
					}
					relocateCell = null;
					relocateCellIndex = null;
				}
			}
		}
		item = null;
		stack = null;
		return this.root;
	}

	/**
	 * Recursively searches for an alive cell in the tree.
	 * @param {Number} x - The column coordinate of the cell.
	 * @param {Number} y - The row column coordinate of the cell.
	 *
	 * @returns {QTNode} Returns the node that points to the alive cell if it exists. Otherwise returns null.
	 */
	search(cell, currentNode = this.root) {
		if (currentNode === null) {
			throw new Error('Cannot search a null tree.');
		}

		if (currentNode.containsRect(cell) && currentNode.index !== null) {
			return currentNode; // End the search
		} else if (currentNode.subdivided) {
			//Traverse farther down the tree.
			let nextNode = selectPartition(cell, currentNode);
			return nextNode.isNullNode ? nextNode : this.search(cell, nextNode);
		} else {
			return QTNode.createNullNode(); //End Search
		}
	}

	/**
	 * Finds a cell if it is alive in landscape.
	 * @param {number} row
	 * @param {number} col
	 * @returns {Cell} Returns the found cell or the DeadCell.
	 */
	findCellIfAlive(row, col) {
		let foundLeafNode = this.search(new Cell(row, col));
		if (
			foundLeafNode !== null &&
			validIndex(this.leaves, foundLeafNode.index)
		) {
			let indexedCell = this.leaves[foundLeafNode.index];
			return indexedCell;
		} else {
			return DEAD_CELL;
		}
	}

	/**
	 * Recursive Range query. Finds all alive cells in the rectangle defined by bounds of the points (x,y), (xx,yy).
	 * @param {number} x
	 * @param {number} y
	 * @param {number} xx
	 * @param {number} yy
	 * @param {QTNode} currentNode - The node to perform the range on. Defaults to the root of the tree.
	 * @returns {Cell[]} The array of alive cells found. Returns an empty array if none are found.
	 */
	recursive_findAliveInArea(x, y, xx, yy, currentNode = this.root) {
		if (typeof currentNode === 'undefined' || currentNode === null) {
			throw new Error('Cannot perform a range query on an empty node.');
		}
		let foundCells = [];
		if (!currentNode.intersectsAABB(x, y, xx, yy)) {
			return foundCells;
		}

		if (currentNode.subdivided) {
			let q1 = this.findAliveInArea(x, y, xx, yy, currentNode.upperLeft);
			let q2 = this.findAliveInArea(x, y, xx, yy, currentNode.upperRight);
			let q3 = this.findAliveInArea(x, y, xx, yy, currentNode.lowerLeft);
			let q4 = this.findAliveInArea(x, y, xx, yy, currentNode.lowerRight);
			foundCells = [...q1, ...q2, ...q3, ...q4];
		} else {
			let cell = this.leaves[currentNode.index];
			if (cell && cell.isInsideRect(x, y, xx, yy)) {
				foundCells.push(cell);
			}
		}
		return foundCells;
	}

	/**
	 * Optimized range query that leverages a stack and looping.
	 * Finds all alive cells in the rectangle defined by bounds of the points (x,y), (xx,yy).
	 * @param {number} x
	 * @param {number} y
	 * @param {number} xx
	 * @param {number} yy
	 * @returns {Cell[]} The array of alive cells found. Returns an empty array if none are found.
	 */
	findAliveInArea(x, y, xx, yy) {
		let stack = [];
		let foundCells = [];
		stack.push(this.root);

		let currentNode;
		while (stack.length) {
			currentNode = stack.pop();
			if (currentNode.intersectsAABB(x, y, xx, yy)) {
				if (currentNode.subdivided) {
					stack.push(currentNode.upperLeft);
					stack.push(currentNode.upperRight);
					stack.push(currentNode.lowerLeft);
					stack.push(currentNode.lowerRight);
				} else {
					let cell = this.leaves[currentNode.index];
					if (cell && cell.isInsideRect(x, y, xx, yy)) {
						foundCells.push(cell);
					}
				}
			}
		}

		return foundCells;
	}
} //Ends QuadTree

/**
 * Selects which child node the provided cell is in.
 * @param {Cell} cell
 * @param {QTNode} currentNode
 * @returns {QTNode} Returns the selected child partition.
 */
function selectPartition(cell, currentNode) {
	let isCellToTheLeft =
		cell.rightBoundary() <= currentNode.horizontalPartition();
	let isCellToTheTop = cell.lowerBoundary() <= currentNode.verticalPartition();
	if (isCellToTheLeft) {
		if (isCellToTheTop) {
			return currentNode.upperLeft;
		} else {
			return currentNode.lowerLeft;
		}
	} else {
		//try searching on the right of the horizontal partition.
		if (isCellToTheTop) {
			return currentNode.upperRight;
		} else {
			return currentNode.lowerRight;
		}
	}
}

/**
 * Scale from the origin by a constant in place along both axis.
 *
 * @param {QTNode} node - The node in the tree to scale.
 * @param {number} factor - The scaling factor.
 */
function uniformScale(node, factor) {
	node.rect.x = node.rect.x * factor;
	node.rect.y = node.rect.y * factor;
	node.rect.xx = node.rect.xx * factor;
	node.rect.yy = node.rect.yy * factor;
	node.children.forEach((child) => uniformScale(child, factor));
}

/**
 * Uniformly scales cells along both axis from the upper left corner.
 * @param {Cell[]} cells
 * @param {number} scalingFactor
 * @returns {Cell[]} A new array of cells.
 */
function scaleCells(cells, scalingFactor) {
	return cells.map(
		(cell) => new Cell(cell.row * scalingFactor, cell.col * scalingFactor)
	);
}

/**
 * Given a cell's coordinates, find the count of alive neighbors.
 * @param {number} row - The cell's coordinates on the x-axis.
 * @param {number} col - The cell's coordinates on the y-axis.
 * @returns {number} The count of alive neighbors.
 */
function findAliveNeighbors(tree, row, col) {
	let range = {
		x: row - 1,
		y: col - 1,
		xx: row + 1,
		yy: col + 1,
	};
	let aliveCells = tree.findAliveInArea(range.x, range.y, range.xx, range.yy);
	let aliveCount = aliveCells.reduce((count, cell) => {
		if (!(cell.row == row && cell.col == col)) {
			count++;
		}
		return count;
	}, 0);
	return aliveCount;
}

/**
 * Creates a deep copy of an array of cells.
 * @param {Cell[]} cells - The array of cells to copy.
 * @returns {Cell[]} The new array.
 */
function cloneCells(cells) {
	let clones = [];
	cells.forEach((cell) => {
		clones.push(new Cell(cell.row, cell.col, 1));
	});
	return clones;
}

module.exports = {
	cloneCells,
	findAliveNeighbors,
	QTNode,
	QuadTree,
	scaleCells,
	uniformScale,
};
