/*
Benchmark the performance of creating and searching a 
pointer quadtree vs a z-curve.
*/
const Benchmark = require('benchmark');
const BenchTable = require('./BenchTable.js');
var suite = new BenchTable();

//Build the array of cells
const { Cell } = require('../../lib/entity-system/Entities.js');
const { QuadTree } = require('../../lib/core/Quadtree.js');
const { ZCurve, LinearQuadTree } = require('../../lib/core/ZCurve.js');
const RandomDiceRoll = require('../../lib/templates/RandomDiceRoll.js');

let config = {
	landscape: { width: 2880, height: 1800 },
	game: {
		rules: {
			birth: [2, 3],
		},
	},
};

let generator = new RandomDiceRoll(config);
let cells = generator.generateCells();
let quadtree = new QuadTree();
let linearTree = new LinearQuadTree();
let zcurve = new ZCurve();

console.log('Starting benchmark.');
console.log(
	`Index a data set containing ${Benchmark.formatNumber(cells.length)} cells.`
);

suite
	.addFunction('Construct Pointer Tree', function (cells) {
		quadtree.index(cells);
	})
	.addFunction('Construct LinearQuadTree w/ Stack', function (cells) {
		linearTree.index(cells);
	})
	.addFunction('Construct LinearQuadTree w/ Recursion', function (cells) {
		linearTree.indexWithRecursion(cells);
	})
	.addFunction('Construct Z-Curve', function (cells) {
		// linearTree.clear();
		zcurve.buildCurve(cells);
	})
	.addFunction('Encode Cells', function (cells) {
		zcurve.encodeArray(cells);
	})
	.addInput(`${Benchmark.formatNumber(cells.length)} Cells`, [cells])
	.on('cycle', function (event) {
		quadtree.clear();
		linearTree.clear();
		zcurve.clear();
		console.log(String(event.target));
	})
	.on('complete', function () {
		console.log('Fastest is ' + suite.filter('fastest').map('name'));
		console.log(suite.table.toString());
	})
	.run({ async: false });
