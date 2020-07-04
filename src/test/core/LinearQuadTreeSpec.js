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
	makeCellsFrom2DArray,
	makeOppositeIdentity,
	makeFull10By10,
} = require('./QuadTreeTestHelper.js');

const RandomDiceRoll = require('../../lib/templates/RandomDiceRoll.js');

//const { ZCurve } = require('@thi.ng/morton');
describe('Linear Quadtree', function () {
	this.timeout(36000000);
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
		//Macbook Pro Retina Display. Will generate >1.1 million cells.
		let config = buildConfig(2880, 1800);
		let generator = new RandomDiceRoll(config);
		let cells = generator.generateCells();
		let linearTree = new LinearQuadTree();
		linearTree.index(cells);
		expect(linearTree.curveSize()).to.equal(cells.length);
		expect(linearTree.indexSize()).to.equal(cells.length);

		//Verify that the zcurve is in fact truly sorted.
		expect(linearTree.verifyCurve()).to.be.true;

		let mid = (cells.length - 1) >>> 1;
		let zcode = encode(cells[mid].row, cells[mid].col);
		let cellAtCurveIndex = linearTree.zcurve.curve.findIndex(
			(i) => i.zcode === zcode
		);
		let foundByBS = linearTree.binarySearch(cells[mid]);
		expect(foundByBS.row).to.equal(cells[mid].row);
		expect(foundByBS.col).to.equal(cells[mid].col);

		console.log(`cellAtCurveIndex: ${cellAtCurveIndex}`);

		let indexNode = linearTree.search(cells[mid]);
		console.log('The found index node');
		console.log(indexNode);

		if (!indexNode) {
			let dfsResult = linearTree.bstIndex.bfs(zcode);
			console.log(dfsResult.toString());
			console.log(dfsResult.parent.toString());
			let lineage = [];
			buildLineage(dfsResult, lineage);
			lineage.reverse();
			lineage.forEach((i) => console.log(i));
		}
	});
});

function buildLineage(node, stack) {
	if (node) {
		stack.push(node.key);
		buildLineage(node.parent, stack);
	}
}

it('should lookup by zcode', function () {
	//A few thousand points
	let config = buildConfig(100, 100);
	let generator = new RandomDiceRoll(config);
	let cells = generator.generateCells();
	let linearTree = new LinearQuadTree();
	linearTree.index(cells);

	expectCellFound(cells[0], linearTree);
	expectCellFound(cells[100], linearTree);
	let mid = (cells.length - 1) >>> 1;
	expectCellFound(cells[mid], linearTree);
	expectCellFound(cells[cells.length - 1], linearTree);
});

function buildConfig(width, height) {
	return (config = {
		landscape: { width: width, height: height },
		game: {
			rules: { birth: [2, 3] },
		},
	});
}

function expectCellFound(cell, linearTree) {
	let zcode = encode(cell.row, cell.col);
	foundCell = linearTree.at(zcode);
	expect(foundCell).to.not.be.null;
	expect(foundCell.row).to.equal(cell.row);
	expect(foundCell.col).to.equal(cell.col);
}

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

	/*
	Range search for the bounding box (a,b) -> (A,B)
	- MIN is the lowest zcode. The point (a,b)
	- MAX is the highest zcode. The point (A,B)
	- To speed up the search, one would calculate the next Z-value which 
		is in the search range, called BIGMIN (36 in the example) and only 
		search in the interval between BIGMIN and MAX (bold values), thus 
		skipping most of the hatched area.
	- Searching in decreasing direction is analogous with LITMAX which is 
		the highest Z-value in the query range lower than F.
*/
	describe('Range Search', function () {
		it('should find 0 cells: EMPTY', function () {
			let cells = makeCellsFrom2DArray(scenarios.EMPTY);
			let nh = neighborhood(1, 1);
			let zcurve = new ZCurve();
			zcurve.buildCurve(cells);
			expect(zcurve.range(nh.x, nh.y, nh.xx, nh.yy).length).to.equal(0);
		});

		it('should find 1 cells: NW', function () {
			let cells = makeCellsFrom2DArray(scenarios.NW);
			let nh = neighborhood(1, 1);
			let zcurve = new ZCurve();
			zcurve.buildCurve(cells);
			let found = zcurve.range(nh.x, nh.y, nh.xx, nh.yy);
			expect(found.length).to.equal(1);
			expect(found[0].row).to.equal(0);
			expect(found[0].col).to.equal(0);
		});

		it('should find 1 cells: North', function () {
			let cells = makeCellsFrom2DArray(scenarios.NORTH);
			let nh = neighborhood(1, 1);
			let zcurve = new ZCurve();
			zcurve.buildCurve(cells);
			let found = zcurve.range(nh.x, nh.y, nh.xx, nh.yy);
			expect(found.length).to.equal(1);
			expect(found[0].row).to.equal(0);
			expect(found[0].col).to.equal(1);
		});

		it('should find 1 cells: NE', function () {
			let cells = makeCellsFrom2DArray(scenarios.NE);
			let nh = neighborhood(1, 1);
			let zcurve = new ZCurve();
			zcurve.buildCurve(cells);
			let found = zcurve.range(nh.x, nh.y, nh.xx, nh.yy);
			expect(found.length).to.equal(1);
			expect(found[0].row).to.equal(0);
			expect(found[0].col).to.equal(2);
		});

		it('should find 1 cells: West', function () {
			let cells = makeCellsFrom2DArray(scenarios.WEST);
			let nh = neighborhood(1, 1);
			let zcurve = new ZCurve();
			zcurve.buildCurve(cells);
			let found = zcurve.range(nh.x, nh.y, nh.xx, nh.yy);
			expect(found.length).to.equal(1);
			expect(found[0].row).to.equal(1);
			expect(found[0].col).to.equal(0);
		});

		it('should find 1 cells: Center', function () {
			let cells = makeCellsFrom2DArray(scenarios.CENTER);
			let nh = neighborhood(1, 1);
			let zcurve = new ZCurve();
			zcurve.buildCurve(cells);
			let found = zcurve.range(nh.x, nh.y, nh.xx, nh.yy);
			expect(found.length).to.equal(1);
			expect(found[0].row).to.equal(1);
			expect(found[0].col).to.equal(1);
		});

		it('should find 1 cells: SW', function () {
			let cells = makeCellsFrom2DArray(scenarios.SW);
			let nh = neighborhood(1, 1);
			let zcurve = new ZCurve();
			zcurve.buildCurve(cells);
			let found = zcurve.range(nh.x, nh.y, nh.xx, nh.yy);
			expect(found.length).to.equal(1);
			expect(found[0].row).to.equal(2);
			expect(found[0].col).to.equal(0);
		});

		it('should find 1 cells: South', function () {
			let cells = makeCellsFrom2DArray(scenarios.SOUTH);
			let nh = neighborhood(1, 1);
			let zcurve = new ZCurve();
			zcurve.buildCurve(cells);
			let found = zcurve.range(nh.x, nh.y, nh.xx, nh.yy);
			expect(found.length).to.equal(1);
			expect(found[0].row).to.equal(2);
			expect(found[0].col).to.equal(1);
		});

		it('should find 1 cells: SE', function () {
			let cells = makeCellsFrom2DArray(scenarios.SE);
			let nh = neighborhood(1, 1);
			let zcurve = new ZCurve();
			zcurve.buildCurve(cells);
			let found = zcurve.range(nh.x, nh.y, nh.xx, nh.yy);
			expect(found.length).to.equal(1);
			expect(found[0].row).to.equal(2);
			expect(found[0].col).to.equal(2);
		});

		it('should find 9 cells', function () {
			let cells = makeCellsFrom2DArray(scenarios.ALL);
			let nh = neighborhood(1, 1);
			let zcurve = new ZCurve();
			zcurve.buildCurve(cells);
			
			let found = zcurve.range(nh.x, nh.y, nh.xx, nh.yy);

			expect(found.length).to.equal(9);
			expect(found[0].zcode).to.equal(0);
			expect(found[1].zcode).to.equal(1);
			expect(found[2].zcode).to.equal(2);
			expect(found[3].zcode).to.equal(3);
			expect(found[4].zcode).to.equal(4);
			expect(found[5].zcode).to.equal(6);
			expect(found[6].zcode).to.equal(8);
			expect(found[7].zcode).to.equal(9);
			expect(found[8].zcode).to.equal(12);
		});
	});
});

// A helper function for calculating the neighborhood
function neighborhood(x, y) {
	return {
		x: x - 1,
		y: y - 1,
		xx: x + 1,
		yy: y + 1,
	};
}

const scenarios = {
	EMPTY: [
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0],
	],
	NW: [
		[1, 0, 0],
		[0, 0, 0],
		[0, 0, 0],
	],
	NORTH: [
		[0, 1, 0],
		[0, 0, 0],
		[0, 0, 0],
	],
	NE: [
		[0, 0, 1],
		[0, 0, 0],
		[0, 0, 0],
	],
	WEST: [
		[0, 0, 0],
		[1, 0, 0],
		[0, 0, 0],
	],
	CENTER: [
		[0, 0, 0],
		[0, 1, 0],
		[0, 0, 0],
	],
	EAST: [
		[0, 0, 0],
		[0, 0, 1],
		[0, 0, 0],
	],
	SW: [
		[0, 0, 0],
		[0, 0, 0],
		[1, 0, 0],
	],
	SOUTH: [
		[0, 0, 0],
		[0, 0, 0],
		[0, 1, 0],
	],
	SE: [
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 1],
	],
	ALL: [
		[1, 1, 1],
		[1, 1, 1],
		[1, 1, 1],
	],
};
