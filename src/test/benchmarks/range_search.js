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

let zcurve = new ZCurve();
zcurve.buildCurve(cells);

let mid = cells.length >>> 1;
let nh = neighborhood(cells[mid]);

function neighborhood(cell) {
	return {
		x: cell.row - 1,
		y: cell.col - 1,
		xx: cell.row + 1,
		yy: cell.col + 1,
	};
}

suite
	// Add functions for benchmarking
	.addFunction('Quadtree.findAliveInArea()', (nh) => {
		quadtree.findAliveInArea(nh.x, nh.y, nh.xx, nh.yy);
	})
	.addFunction('Z-Curve.range()', (nh) => {
		zcurve.range(nh.x, nh.y, nh.xx, nh.yy);
	})
	// Add inputs
	.addInput('midpoint', [nh])
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
