/*
Benchmark the performance of creating and searching a 
pointer quadtree vs a z-curve.
*/

const { Benchmark } = require('benchmark');

const suite = new Benchmark.Suite();

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

console.log('Starting benchmark.');
console.log(`Index a data set containing ${Benchmark.formatNumber(cells.length)} cells.`);

suite
	.add('Construct Pointer Tree', function () {
		quadtree.index(cells);
	})
	.add('Construct LinearQuadTree', function () {
		linearTree.index(cells);
	})
	.on('cycle', function (event) {
    console.log(String(event.target));
    console.log(event.target.stats.mean)
	})
	.on('complete', function () {
		console.log('Fastest is ' + this.filter('fastest').map('name'));
	})
	.run();
