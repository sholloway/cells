/**
 * Represents a single unit on an abstract 2D grid.
 *
 * The width and height of the cell are the equal.
 * The grid is uniform.
 */
class Cell{
	constructor(row, col, age=0){
		this.location = {row: row, col: col}
		this.age = age
		this.width = 1
		this.height = 1
	}

	isInsideRect(x,y,xx,yy){
		return (x <= this.location.row && this.location.row <= xx &&
						y <= this.location.col && this.location.col <= yy);
	}
}

let idCount = 0
function generateId(){
	return idCount++;
}

class QTNode{
	constructor(id, x,y, xx, yy){
		this.id = id
		this.rect = {
			x: x,
			y: y,
			xx: xx,
			yy: yy
		}
		this.area = this.area()
		this.subdivided = false //Flag indicating this node has been subdivided.

		//The potential children of this node.
		this.upperLeft = null
		this.upperRight = null
		this.lowerLeft =  null
		this.lowerRight = null

		//The index is a pointer to the data in the array containing all the live cells.
		//If it is null, then this node is empty or not a leaf.
		this.index = null
	}

	/**
	 * Returns the all the children as an array. Returns an empty array if the children have not been initialized yet.
	 */
	children(){
		let kids = null
		if (this.subdivided){
			kids = [this.upperLeft, this.upperRight, this.lowerLeft, this.lowerRight]
		}else{
			kids = []
		}
		return kids
	}

	/**
	 * Rectangle/Point intersection test
	 * @param {number} x - Left most boundary of the rectangle
	 * @param {number} y - Upper most boundary of the rectangle
	 */
	containsPoint(x,y){
		return (this.rect.x <= x && x <= this.rect.xx) &&
			(this.rect.y <= y && y <= this.rect.yy);
	}

	/**
	 * Tests if a given cell is fully contained by the QTNode's bounding box.
	 * This is defined by all 4 points of the cell being inside (or on edge)
	 * of the bounding box.
	 *
	 * @param {Cell} cell
	 */
	containsRect(cell){
		if (cell == null || cell == undefined){
			throw new Exception('QTNode.contains cannot process a null cell.')
		}

		//Since both the cell and bounding box are aligned to the same axes
		//we can just check the min and max points.
		return this.containsPoint(cell.location.row, cell.location.col) &&
			this.containsPoint(cell.location.row+cell.width, cell.location.col+cell.height)
	}

	/**
	 * Axis-aligned bounding box intersection test.
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} xx
	 * @param {Number} yy
	 * @returns {Boolean} Returns whether or not the node's bounding box intersects the provided range.
	 */
	intersectsAABB(x,y,xx,yy){
		let intersects = false
		if ((this.rect.x <= xx && this.rect.xx >= x) &&
		(this.rect.y <= yy && this.rect.yy >= y)){
			intersects = true
		}
		return intersects
	}

	/**
	 * Tests to see if the Node's AABB is inside the provided rectangle.
	 * @param {*} x
	 * @param {*} y
	 * @param {*} xx
	 * @param {*} yy
	 */
	isInsideRect(x,y,xx,yy){
		let firstPointIntersection = (x <= this.rect.x && this.rect.x <= xx &&
			y <= this.rect.y && this.rect.y <= yy);

		let secondPointIntersection = (x <= this.rect.xx && this.rect.xx <= xx &&
			y <= this.rect.yy && this.rect.yy <= yy)

		return firstPointIntersection && secondPointIntersection
	}

	/**
	 * Calculates the area of the bounding rectangle.
	 * Formula: Area = Length * Height
	 *
	 * @returns {number} The area of the rectangle.
	 */
	area(){
		let length = Math.abs(this.rect.xx) - Math.abs(this.rect.x)
		let height = Math.abs(this.rect.yy) - Math.abs(this.rect.y)
		return length * height
	}

	/**
	 * Set the node to a leaf. This is where the data lives.
	 * @param {number} index - The location of the leaf.
	 */
	setLeaf(index){
		this.index = index
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
	subdivide(){
		//Only support the scenario of subdividing exactly once.
		if (this.subdivided){
			return
		}

		let p = this.rect.x + Math.ceil( (Math.abs(this.rect.xx) - Math.abs(this.rect.x))/2 )
		let q = this.rect.y + Math.ceil( (Math.abs(this.rect.yy) - Math.abs(this.rect.y))/2 )

		//How to handle overlap?..
		this.upperLeft = new QTNode(generateId(), this.rect.x, this.rect.y, p, q) //Q1
		this.upperRight = new QTNode(generateId(), p,this.rect.y, this.rect.xx, q) //Q2
		this.lowerLeft = new QTNode(generateId(), this.rect.x, q, p, this.rect.yy) //Q3
		this.lowerRight = new QTNode(generateId(), p,q, this.rect.xx, this.rect.yy) //Q4
		this.subdivided = true
	}
}

class QuadTree{
	constructor(liveCells){
		this.leaves = liveCells
		this.root = null
		this.minimumCellSize = 1
	}

	index(){
		//find the bounds of the landscape
		this.boundary = this.buildAxisAlignedBoundingBox()
		this.root = new QTNode(generateId(),
			this.boundary.rowMin, this.boundary.colMin,
			this.boundary.rowMax, this.boundary.colMax)

		//Traverse the cells and build a compacted quad tree
		this.leaves.forEach((cell, index, leaves) => {
			this.addCell(this.root, cell, index)
		})
		return this.root
	}

	/**
	 * Constructs an axis aligned bounding box from a set of cells
	 * on a uniform grid.
	 */
	buildAxisAlignedBoundingBox(){
		let rowMin = this.leaves[0].location.row
		let rowMax = this.leaves[0].location.row
		let colMin = this.leaves[0].location.col
		let colMax = this.leaves[0].location.col
		this.leaves.forEach((cell)=>{
			rowMin = Math.min(rowMin, cell.location.row)
			rowMax = Math.max(rowMax, cell.location.row)
			colMin = Math.min(colMin, cell.location.col)
			colMax = Math.max(colMax, cell.location.col)
		})
		// The max is increased by one in both axis to
		// account for including the farthest cell rather
		// than intersecting it.
		return {
			rowMin: rowMin, colMin: colMin,
			rowMax: rowMax+1, colMax: colMax+1
		}
	}

	/**
	We want to use recursion to add a cell to quad tree.
	Starting with the root, check to see if the cell belongs the active node,
	if it does not, then subdivide by 4 and call each new child recursively.

	@param {QTNode} node - The node in the QuadTree to start the test.
	@param {Cell} cell - The cell to be added to the QualTree.
	@param {number} index - The location of the cell in the array of leaves.
	*/
	addCell(node, cell, index){
		//If the cell does not fall in the node's bounding box end.
		if (!node.containsRect(cell)){
			return
		}

		//Is this the smallest a region can be? If so set the index otherwise subdivide.
		if(this.minimumCellSize >= node.area)
		{
			//set the cell
			node.setLeaf(index)
			return
		}else{
			if (!node.subdivided){
				node.subdivide()
			}
			//make recursive call for each quadrant
			node.children().forEach((quadrant) => {
				this.addCell(quadrant, cell, index)
			})
		}
	}

	/**
	 * Recursively searches for an alive cell in the tree.
	 * @param {Number} x - The column coordinate of the cell.
	 * @param {Number} y - The row column coordinate of the cell.
	 *
	 * @returns {QTNode} Returns the node that points to the alive cell if it exists. Otherwise returns null.
	 */
	search(cell, currentNode = this.root){
		if (currentNode === null){
			throw new Error('Cannot search a null tree.')
		}
		// End the search
		if (currentNode.area == this.minimumCellSize){
			if (currentNode.containsRect(cell) && currentNode.index !== null){
				return currentNode
			}else{
				return null
			}
		}

		//End Search
		if (!currentNode.subdivided){
			return null
		}

		//try searching on the left of the horizontal partition.
		let cellRightBoundary = cell.location.row + cell.width
		let cellLowerBoundary = cell.location.col + cell.height
		let horizontalPartition = currentNode.upperLeft.rect.xx //bug
		let verticalPartition = currentNode.upperLeft.rect.yy
		let nextNode = null
		if (cellRightBoundary <= horizontalPartition){ // The right most boundary of the cell is to the left horizontal partition.
			if(cellLowerBoundary <= verticalPartition){ //try upper left
				nextNode = currentNode.upperLeft
			}else{ //try lower left
				nextNode = currentNode.lowerLeft
			}
		}else{ //try searching on the right of the horizontal partition.
			if(cellLowerBoundary <= verticalPartition){ //try upper right
				nextNode = currentNode.upperRight
			}else{ //try lower right
				nextNode = currentNode.lowerRight
			}
		}
		return (nextNode === null)? null : this.search(cell, nextNode)
	}

	/**
	 * Recursive Range query. Finds all alive cells in the rectangle defined by bounds of the points (x,y), (xx,yy).
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} xx
	 * @param {Number} yy
	 * @param {QTNode} currentNode - The node to perform the range on. Defaults to the root of the tree.
	 * @returns {Array[Cell]} The array of alive cells found. Returns an empty array if none are found.
	 */
	findAliveInArea(x,y,xx,yy, currentNode = this.root){
		if (typeof currentNode === 'undefined' || currentNode === null){
			throw new Error('Cannot perform a range query on an empty node.')
		}
		let foundCells = []
		if (!currentNode.intersectsAABB(x,y,xx,yy)){
			return foundCells
		}

		if (currentNode.subdivided){
			let q1 = this.findAliveInArea(x,y,xx,yy,currentNode.upperLeft)
			let q2 = this.findAliveInArea(x,y,xx,yy,currentNode.upperRight)
			let q3 = this.findAliveInArea(x,y,xx,yy,currentNode.lowerLeft)
			let q4 = this.findAliveInArea(x,y,xx,yy,currentNode.lowerRight)
			foundCells = foundCells.concat(q1,q2,q3,q4)
		}else{
			if(this.validIndex(currentNode.index)){
				let cell = this.leaves[currentNode.index]
				if (cell.isInsideRect(x,y,xx,yy)){
					foundCells.push(cell)
				}
			}
		}
		return foundCells
	}

	validIndex(index){
		return (typeof index === 'number' &&
			(index >=0 && index <= this.leaves.length - 1))
	}
}

/**
 * Scale from the origin by a constant in place along both axis.
 *
 * @param {QTNode} node - The node in the tree to scale.
 * @param {number} factor - The scaling factor.
 */
function uniformScale(node, factor){
	node.rect.x = node.rect.x * factor
	node.rect.y = node.rect.y * factor
	node.rect.xx = node.rect.xx * factor
	node.rect.yy = node.rect.yy * factor
	node.children().forEach((child) => uniformScale(child, factor))
}

function scaleCells(cells, scalingFactor){
	return cells.map((cell) => new Cell(cell.location.row * scalingFactor, cell.location.col * scalingFactor, cell.age))
}

module.exports = { Cell, QTNode, QuadTree, uniformScale, scaleCells}
