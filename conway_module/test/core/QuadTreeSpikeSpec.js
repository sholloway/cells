const chai = require('chai')
const expect = chai.expect

/*
Considerations:
1. The seeder design is 2D array specific.
2. The seeder abstraction may be the right place to put the Grid vs QuadTree distinction.
3. Fundamentally, perhaps we should change how things are seeded.
	- A plane needs a coordinate system. (Cell Addresses)
	- Define a cell data structure.
	- A seeder should produce a list of cell addresses that are alive.
	- The spatial data structures (grid, quadtree, etc...) should take in the same structure.

	*/
describe('QuadTree Spike', function(){
	describe('Indexing', function(){
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
		it('should build a tree from identity matrix', function(){
			/*
			Issues:
			- I've implemented a point in rectangle intersection test, but really,
			I want a rectangle in rectangle test. That is resulting in multiple hits.
			- The convex hull needs to include width of the cells.

			- Having the grid start at 0,0 might be messing up the math.
			The quad tree should work directly with the grid. Scaling should happen after indexing.
			Grid Location -> Index -> Scale -> Render
			- Scaling might be the wrong way to think about this. Projection from one coordinate
			system to another might be preferable.

			*/

			let gridSize = {width: 10, height: 10}
			let cells = [
				new Cell(0,0, 1), new Cell(1,1,1), new Cell(2,2,1), new Cell(3,3,1),new Cell(4,4,1),
				new Cell(5,5,1),new Cell(6,6,1),new Cell(7,7,1),new Cell(8,8,1),
				new Cell(9,9,1)]

			let tree = new QuadTree(cells)
			let root = tree.index()

			expect(root.rect.x).to.equal(0)
			expect(root.rect.y).to.equal(0)
			expect(root.rect.xx).to.equal(10)
			expect(root.rect.yy).to.equal(10)

			//Draw the tree via GraphViz
			let treeNodes = new Map()
			let relationships = new Map()
			buildDag(root, treeNodes, relationships)
			let dotFileStr = createDotFile(treeNodes, relationships)
			mkFile('temp.dot', dotFileStr)

			//Draw the QuadTree via HTML5 Context
			let scalingFactor = 20
			const {createCanvas} = require('canvas')
			let scaledCells = scaleCells(cells, scalingFactor)
			let canvas = createCanvas(gridSize.width * scalingFactor, gridSize.height * scalingFactor)
			let ctx = canvas.getContext('2d')

			uniformScale(root, scalingFactor)
			drawImageBoarder(ctx, gridSize.width * scalingFactor, gridSize.height * scalingFactor, 'purple')
			drawTree(root, ctx, 1)
			mkImageFile('quadtree.png', canvas, () => {
				drawCells(scaledCells,ctx,scalingFactor,scalingFactor,'red')
				mkImageFile('quadtreeWithCells.png', canvas, ()=>{})
			})

		});
		it ('should handle the worst case of all cells being populated')


		it ('should handle a grid of 10k cells randomly distributed')
	})

	/*
	I need to change the QTNode structure to have pointers to each box directly for the search function.
	Right now, the structure won't provide the full benefit of the spatial partitioning.
	https://www.geeksforgeeks.org/quad-tree/
	*/
	//http://homepage.divms.uiowa.edu/~kvaradar/sp2012/daa/ann.pdf
	//https://stackoverflow.com/questions/32412107/quadtree-find-neighbor
	describe('Range Queries', function(){
		it ('should find if a given cell if it exists', function(){
			let gridSize = {width: 10, height: 10}
			//10x10 Identity matrix
			let cells = [
				new Cell(0,0, 1), new Cell(1,1,1), new Cell(2,2,1), new Cell(3,3,1),new Cell(4,4,1),
				new Cell(5,5,1),new Cell(6,6,1),new Cell(7,7,1),new Cell(8,8,1),
				new Cell(9,9,1)]

			let tree = new QuadTree(cells)
			tree.index()

			//Test for all alive cells.
			cells.forEach((cell,index) => {
				let foundNode = tree.search(cell)
				expect(foundNode).to.not.be.null
				expect(foundNode.index).to.be.equal(index)
			})

			//Test for all the empty cells
			for (let x = 0; x < 10; x++){
				for (let y = 0; y < 10; y++) {
					if (x == y){
						continue
					}else{
						let foundInErrorNode = tree.search(new Cell(x,y))
						if (foundInErrorNode != null){
							// console.log(`Error: Searching for the cell (${x},${y}) found ${foundInErrorNode.index}`)
							// console.log(`Error: Node ID: ${foundInErrorNode.id} | Rect: (${foundInErrorNode.rect.x}, ${foundInErrorNode.rect.y}, ${foundInErrorNode.rect.xx}, ${foundInErrorNode.rect.yy}) | Area: ${foundInErrorNode.area}`)
							expect.fail('Found a node in error.')
						}else{
							expect(foundInErrorNode).to.be.null
						}
					}
				}
			}
		})

		it ('should find all alive (existing) neighboring cells')
	})

	describe('QTNode', function(){
		it ('should not detect a point outside the boundary', function(){
			let node = new QTNode(1, 5,5, 10, 10)
			expect(node.containsPoint(0,0)).to.be.false
			expect(node.containsPoint(11,0)).to.be.false
			expect(node.containsPoint(11,10)).to.be.false
		})

		it ('should detect a point inside', function(){
			let node = new QTNode(1, 5,5, 10, 10)
			expect(node.containsPoint(6,6)).to.be.true
			expect(node.containsPoint(7,6)).to.be.true
		})

		it ('should detect a point on an edge', function(){
			let node = new QTNode(1, 5,5, 10, 10)
			expect(node.containsPoint(5,8)).to.be.true
			expect(node.containsPoint(5,5)).to.be.true
			expect(node.containsPoint(10,10)).to.be.true
		})
	})
});

const fs = require('fs');
function mkFile(filename, dotFile){
	fs.writeFile(filename, dotFile, function(err) {
			if(err) {
					return console.log(err);
			}
			console.log(`The file ${filename} was saved!`);
	});
}

function mkImageFile(filename, canvas, callback){
	const out = fs.createWriteStream(__dirname + filename)
	const stream = canvas.createPNGStream()
	stream.pipe(out)
	out.on('finish', callback)
}

//Use GraphViz
function buildDag(node, treeNodes, relationships){
	if (!treeNodes.has(node.id)){
		let dagNode = {}
		if (node.index != null){
			dagNode.color = 'green'
			dagNode.label = node.index
		}else{
			dagNode.color = 'blue'
			dagNode.label = node.id
		}
		treeNodes.set(node.id, dagNode) //of the form: 241 [label="Delete" color=blue]
	}

	if (!relationships.has(node.id)){
		relationships.set(node.id, []) // of the form: 218->{219 241}
	}

	if(node.subdivided){
		node.children().forEach((child)=>{
			relationships.get(node.id).push(child.id)
			buildDag(child, treeNodes, relationships)
		})
	}
}

function createDotFile(treeNodes, relationships){
	let template = `
	digraph QuadTree{
		graph [
			fontname = "Helvetica",
			fontsize = 10,
			splines = true,
			overlap = true,
			ranksep = 2.5,
			bgcolor = black,
			color=white
		];
		node [shape = note,
			style=filled,
			fontname = "Helvetica",
		];
		edge [color = white];
		${Array.from(relationships.entries()).map(entry => `${entry[0]} ->{ ${entry[1].join(' ')}}`).join('\n\t\t')}
		${Array.from(treeNodes.entries()).map(entry => `${entry[0]} [label="${entry[1].label}" color="${entry[1].color}"]`).join('\n\t\t')}
	}
	`;
	return template
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

function drawImageBoarder(ctx, width, height, color){
	ctx.fillStyle = color
	ctx.fillRect(0,0, width, height)
}

let indexedNodes = 0
function drawTree(node, ctx, depth){
	// console.log(`${'|\t'.repeat(depth)}| Area: ${node.area} Index: ${node.index}`)
	if (node.index != null){
		indexedNodes++
		if (node.children().length != 0){
			console.log(`Node ${node.id} incorrectly has children.`)
		}
		ctx.strokeStyle = 'green'
		ctx.fillStyle = 'green'
		ctx.fillRect(node.rect.x, node.rect.y, node.rect.xx - node.rect.x, node.rect.yy - node.rect.y) //x,y, width, height
		ctx.strokeRect(node.rect.x, node.rect.y, node.rect.xx - node.rect.x, node.rect.yy - node.rect.y) //x,y, width, height
	}else{
		ctx.strokeStyle = 'blue'
		ctx.strokeRect(node.rect.x, node.rect.y, node.rect.xx - node.rect.x, node.rect.yy - node.rect.y) //x,y, width, height
	}

	// ctx.strokeStyle = (node.index)?'green':'blue'
	if(node.subdivided){
		node.children().forEach((child)=>{
			drawTree(child, ctx, depth + 1)
		})
	}
}

/**
 * Render a cell as a filled in rectangle.
 * @param {Cell[]} listOfCells
 * @param {HTMLCanvasContext} ctx
 * @param {number} width - The constant width of all cells.
 * @param {number} height - The constant height of all cells.
 * @param {string} color - The constant color of all cells.
 */
function drawCells(listOfCells, ctx, width, height, color){
	ctx.fillStyle = color
	listOfCells.forEach((cell) => {
		ctx.fillRect(cell.location.row, cell.location.col, width, height)
	})
}

function scaleCells(cells, scalingFactor){
	return cells.map((cell) => new Cell(cell.location.row * scalingFactor, cell.location.col * scalingFactor, cell.age))
}

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
		/*
		What are the possible scenarios?
		1. The node does not contain the point.
		2. The node contains the point and is the smallest it can be, so stop.
		3. The node contains the point, but is bigger than the point.
			A. The node is already subdivided.
			B. The node is not subdivided.
				Divide it.
			Pass the point to each child.
		*/

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
}

/*
Node* Quad::search(Point p)
{
    if (!inBoundary(p)) return NULL;

    // We are at a quad of unit length
    // We cannot subdivide this quad further
    if (n != NULL) return n;

    if ((topLeft.x + botRight.x) / 2 >= p.x){
        // Indicates topLeftTree
        if ((topLeft.y + botRight.y) / 2 >= p.y){
            if (topLeftTree == NULL) return NULL;
            return topLeftTree->search(p);
        }
        // Indicates botLeftTree
        else{
            if (botLeftTree == NULL) return NULL;
            return botLeftTree->search(p);
        }
    }else{
        // Indicates topRightTree
        if ((topLeft.y + botRight.y) / 2 >= p.y) {
            if (topRightTree == NULL) return NULL;
            return topRightTree->search(p);
        }else{ // Indicates botRightTree
            if (botRightTree == NULL) return NULL;
            return botRightTree->search(p);
        }
    }
};
*/
