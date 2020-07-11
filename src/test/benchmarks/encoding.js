const BenchTable = require('./BenchTable.js');
var suite = new BenchTable();

const { ZCurve } = require('@thi.ng/morton');
const { Cell } = require('../../lib/entity-system/Entities.js');


function encode(x, y) {
	x &= 0xffff; //Constrain to 16 bits. 0xffff is 65535 which is the number range of 16 bits. 1111111111111111 in binary. Numbers larger than 65535 will roll over.
	x = (x | (x << 8)) & 0x00ff00ff; //Shift to the left by 8. Mask: 111111110000000011111111
	x = (x | (x << 4)) & 0x0f0f0f0f; //Mask: 1111000011110000111100001111
	x = (x | (x << 2)) & 0x33333333; //Mask: 110011001100110011001100110011
	x = (x | (x << 1)) & 0x55555555; //Mask: 1010101010101010101010101010101

	y &= 0xffff;
	y = (y | (y << 8)) & 0x00ff00ff;
	y = (y | (y << 4)) & 0x0f0f0f0f;
	y = (y | (y << 2)) & 0x33333333;
	y = (y | (y << 1)) & 0x55555555;

	return x | (y << 1);
}

const zcurve = new ZCurve(2, 16);
suite
	// Add functions for benchmarking
	.addFunction('Bit Shifting', (cell) => {
		encode(cell.row, cell.col)
	})
	.addFunction('@thi.ng/morton', (cell) => {
		zcurve.encode([cell.row, cell.col])
	})
	// Add inputs
	.addInput('midpoint', [new Cell(1224, 768)])
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
