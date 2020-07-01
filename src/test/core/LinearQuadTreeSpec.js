const chai = require('chai');
const expect = chai.expect;
const {
	encode,
	decode,
	LinearQuadTree,
	ZCurve,
} = require('../../lib/core/ZCurve.js');
const { Cell } = require('./../../lib/entity-system/Entities.js');
const {
	QTNode,
	QuadTree,
	uniformScale,
	scaleCells,
} = require('../../lib/core/Quadtree.js');

const {
	buildBSTDag,
	buildDag,
	createDotFile,
	mkFile,
} = require('./GraphVizUtility.js');

const {
	makeIdentity,
	makeOppositeIdentity,
	makeFull10By10,
} = require('./QuadTreeTestHelper.js');

const RandomDiceRoll = require('../../lib/templates/RandomDiceRoll.js');

//const { ZCurve } = require('@thi.ng/morton');
describe('Linear Quadtree', function () {
	this.timeout(50000);
	/* https://www5.in.tum.de/lehre/vorlesungen/asc/ss13/quadtrees.pdf
  - Odd digits: position in vertical direction
  - Even digits: position in horizontal direction
  - Neighbours in sequential order remain neighbours in 2D
  */
	it('should build a quadtree', function () {
		let cells = makeIdentity();
		let tree = new QuadTree(cells);
		tree.index();

		let linearTree = new LinearQuadTree();
		linearTree.index(cells);
		expect(linearTree.curveSize()).to.equal(cells.length);
		expect(linearTree.indexSize()).to.equal(cells.length);
		console.log(linearTree.bstIndex.calculateHeight());

		//draw the BST
		let bstTreeNodes = new Map();
		let bstRelationships = new Map();
		buildBSTDag(linearTree.bstIndex.root, bstTreeNodes, bstRelationships);
		let bstDotFileStr = createDotFile(bstTreeNodes, bstRelationships);
		mkFile('bst.dot', bstDotFileStr);
	});

	it('should build a big tree', function () {
		let config = {
			landscape: { width: 2880, height: 1800 },
			game: {
				rules: { birth: [2, 3] },
			},
		};

		let generator = new RandomDiceRoll(config);
		let cells = generator.generateCells();
		let linearTree = new LinearQuadTree();
		linearTree.index(cells);
		expect(linearTree.curveSize()).to.equal(cells.length);
		expect(linearTree.indexSize()).to.equal(cells.length);
		console.log(
			`${
				cells.length
			} cells indexed by a BST of height: ${linearTree.bstIndex.calculateHeight()}`
		);
	});
});

it('should lookup by zcode', function () {
	let config = {
		landscape: { width: 100, height: 100 }, //a few thousand points
		game: {
			rules: { birth: [2, 3] },
		},
	};

	let generator = new RandomDiceRoll(config);
	let cells = generator.generateCells();
	let linearTree = new LinearQuadTree();
	linearTree.index(cells);

	expectCellFound(cells[0], linearTree);
	expectCellFound(cells[100], linearTree);
	let mid = (cells.length - 1) >>> 1
	expectCellFound(cells[mid], linearTree);
	expectCellFound(cells[cells.length - 1], linearTree);
});

function expectCellFound(cell, linearTree) {
	let zcode = encode(cell.row, cell.col);
	foundCell = linearTree.at(zcode);
	expect(foundCell).to.not.be.null;
	expect(foundCell.row).to.equal(cell.row);
	expect(foundCell.col).to.equal(cell.col);
}

/*
Rang search for the bounding box (a,b) -> (A,B)
- MIN is the lowest zcode. The point (a,b)
- MAX is the highest zcode. The point (A,B)
- To speed up the search, one would calculate the next Z-value which 
  is in the search range, called BIGMIN (36 in the example) and only 
  search in the interval between BIGMIN and MAX (bold values), thus 
  skipping most of the hatched area.
- Searching in decreasing direction is analogous with LITMAX which is 
  the highest Z-value in the query range lower than F.
*/

describe('Z-order Curve', function () {
	this.timeout(50000);

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
