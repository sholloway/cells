const BenchTable = require('./BenchTable.js');
var suite = new BenchTable();

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
let cells = generator.generateCells(); // Generate around 1.1 million cells.
let quadtree = new QuadTree();
quadtree.index(cells);

let linearTree = new LinearQuadTree();
linearTree.index(cells); //BST height should be around 21 levels.

let mid = cells.length >>> 1;

suite
	// Add functions for benchmarking
	.addFunction('Search Pointer Quadtree', (cell) => {
		quadtree.search(cell);
	})
	.addFunction('Search Linear Quadtree', (cell) => {
		linearTree.search(cell);
	})
	.addFunction('Binary Search of Z-Curve', (cell) => {
		linearTree.binarySearch(cell);
	})
	// Add inputs
	.addInput('midpoint', [cells[mid]])
	.addInput('Min', [cells[0]])
	.addInput('Max', [cells[cells.length - 1]])
	// Add listeners
	.on('cycle', (event) => {
		console.log(event.target.toString());
	})
	.on('complete', () => {
		console.log('Fastest is ' + suite.filter('fastest').map('name'));
		console.log(suite.table.toString());
	})
	// Run async
	.run({ async: false });
