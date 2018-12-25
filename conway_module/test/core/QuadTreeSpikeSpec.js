const chai = require('chai')
const expect = chai.expect
const {Cell, QTNode, QuadTree, uniformScale, scaleCells} = require('./../../lib/core/Quadtree.js')
const {buildDag, createDotFile, mkFile} = require('./GraphVizUtility.js')
const { drawImageBoarder, drawTree, drawCells, mkImageFile } = require('./CanvasUtility.js')
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
		it('should build a tree from identity matrix', function(){
			let gridSize = {width: 10, height: 10}
			let cells = makeIdentity()

			let tree = new QuadTree(cells)
			let root = tree.index()

			expect(root.rect.x).to.equal(0)
			expect(root.rect.y).to.equal(0)
			expect(root.rect.xx).to.equal(10)
			expect(root.rect.yy).to.equal(10)

			/*
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
		*/
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
			let cells = makeIdentity()
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
							expect.fail('Found a node in error.')
						}else{
							expect(foundInErrorNode).to.be.null
						}
					}
				}
			}
		})

		it ('should find all alive (existing) neighboring cells', function(){
			let cells = makeFull10By10()
			let tree = new QuadTree(cells)
			tree.index()

			let foundCells = tree.findAliveInArea(3,3,5,5)
			expect(foundCells.length).to.equal(9)

			expectCell(foundCells, new Cell(3,3))
			expectCell(foundCells, new Cell(3,4))
			expectCell(foundCells, new Cell(3,5))

			expectCell(foundCells, new Cell(4,3))
			expectCell(foundCells, new Cell(4,4))
			expectCell(foundCells, new Cell(4,5))

			expectCell(foundCells, new Cell(5,3))
			expectCell(foundCells, new Cell(5,4))
			expectCell(foundCells, new Cell(5,5))

			/*
			let gridSize = {width: 10, height: 10}
			//Draw the tree via GraphViz
			let treeNodes = new Map()
			let relationships = new Map()
			buildDag(root, treeNodes, relationships)
			let dotFileStr = createDotFile(treeNodes, relationships)
			mkFile('full_tree.dot', dotFileStr)

			//Draw the QuadTree via HTML5 Context
			let scalingFactor = 20
			const {createCanvas} = require('canvas')
			let scaledCells = scaleCells(foundCells, scalingFactor)
			let canvas = createCanvas(gridSize.width * scalingFactor, gridSize.height * scalingFactor)
			let ctx = canvas.getContext('2d')

			uniformScale(root, scalingFactor)
			drawImageBoarder(ctx, gridSize.width * scalingFactor, gridSize.height * scalingFactor, 'purple')
			drawTree(root, ctx, 1)
			mkImageFile('full_quadtree.png', canvas, () => {
				drawCells(scaledCells,ctx,scalingFactor,scalingFactor,'red')
				//draw the selection box...
				ctx.strokeStyle = 'white'
				ctx.strokeRect(3*scalingFactor, 3*scalingFactor, 3*scalingFactor, 3*scalingFactor) //x,y, width, height
				mkImageFile('full_tree_WithCells.png', canvas, ()=>{})
			})
			*/
		})

		/*
		Test for the scenario of a cell on the upper boundary of the canvas.
		*/
		it ('should find a range on the upper border', function(){
			let cells = makeFull10By10()
			let tree = new QuadTree(cells)
			tree.index()

			let foundCells = tree.findAliveInArea(2,0, 7,0)
			expect(foundCells.length).to.equal(6)

			expectCell(foundCells, new Cell(2,0))
			expectCell(foundCells, new Cell(3,0))
			expectCell(foundCells, new Cell(4,0))

			expectCell(foundCells, new Cell(5,0))
			expectCell(foundCells, new Cell(6,0))
			expectCell(foundCells, new Cell(7,0))
		})

		it ('should find a range on the left border', function(){
			let cells = makeFull10By10()
			let tree = new QuadTree(cells)
			let root = tree.index()

			let foundCells = tree.findAliveInArea(0,0, 0,9)
			expect(foundCells.length).to.equal(10)

			expectCell(foundCells, new Cell(0,0))
			expectCell(foundCells, new Cell(0,1))
			expectCell(foundCells, new Cell(0,2))
			expectCell(foundCells, new Cell(0,3))
			expectCell(foundCells, new Cell(0,4))
			expectCell(foundCells, new Cell(0,5))
			expectCell(foundCells, new Cell(0,6))
			expectCell(foundCells, new Cell(0,7))
			expectCell(foundCells, new Cell(0,8))
			expectCell(foundCells, new Cell(0,9))
		})

		it ('should find a range on the right border', function(){
			let cells = makeFull10By10()
			let tree = new QuadTree(cells)
			tree.index()

			let foundCells = tree.findAliveInArea(9,0, 9,9)
			expect(foundCells.length).to.equal(10)
			expectCell(foundCells, new Cell(9,0))
			expectCell(foundCells, new Cell(9,1))
			expectCell(foundCells, new Cell(9,2))
			expectCell(foundCells, new Cell(9,3))
			expectCell(foundCells, new Cell(9,4))
			expectCell(foundCells, new Cell(9,5))
			expectCell(foundCells, new Cell(9,6))
			expectCell(foundCells, new Cell(9,7))
			expectCell(foundCells, new Cell(9,8))
			expectCell(foundCells, new Cell(9,9))
		})
		it ('should find a range on the bottom border', function(){
			let cells = makeFull10By10()
			let tree = new QuadTree(cells)
			tree.index()

			let foundCells = tree.findAliveInArea(0,9, 9,9)
			expect(foundCells.length).to.equal(10)
			expectCell(foundCells, new Cell(0,9))
			expectCell(foundCells, new Cell(1,9))
			expectCell(foundCells, new Cell(2,9))
			expectCell(foundCells, new Cell(3,9))
			expectCell(foundCells, new Cell(4,9))
			expectCell(foundCells, new Cell(5,9))
			expectCell(foundCells, new Cell(6,9))
			expectCell(foundCells, new Cell(7,9))
			expectCell(foundCells, new Cell(8,9))
			expectCell(foundCells, new Cell(9,9))
		})
	})

	function expectCell(cells, expected){
		let foundCell = cells.find((cell)=>{
			return (cell.location.row == expected.location.row &&
							cell.location.col == expected.location.col)
		})
		expect(foundCell, `Can't find row: ${expected.location.row}, col: ${expected.location.col}`).to.exist
		expect(foundCell.location.row).to.equal(expected.location.row)
		expect(foundCell.location.col).to.equal(expected.location.col)
	}

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
function makeIdentity(){
	return [
		new Cell(0,0, 1), new Cell(1,1,1), new Cell(2,2,1), new Cell(3,3,1),new Cell(4,4,1),
		new Cell(5,5,1),new Cell(6,6,1),new Cell(7,7,1),new Cell(8,8,1),
		new Cell(9,9,1)]
}

function makeFull10By10(){
	let cells = []
	for(let row = 0; row < 10; row++){
		for(let col = 0; col < 10; col++){
			cells.push(new Cell(row,col, 1))
		}
	}
	return cells
}

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
