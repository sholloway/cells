const DrawingTemplate = require('./DrawingTemplate.js');

class LinearCellularAutomaton extends DrawingTemplate {
	constructor(config) {
		super();
		this.config = config;
	}

	generateCells(x, y) {
		let cells = this.makeCellsFrom2DArray(this.pattern());
		return cells;
	}
}

class WolframRule90 extends LinearCellularAutomaton {
	constructor(config) {
		super(config);
		this.rulesSet = [0, 1, 0, 1, 1, 0, 1, 0]; //Stored in reverse order from Wolfram's Specificiation to enable binary lookup.
	}

	pattern() {
		console.log(
			`Landscape width: ${this.config.landscape.width} height: ${this.config.landscape.height}`
		);
		let height = Math.floor(this.config.landscape.height);
		let width = Math.floor(this.config.landscape.width);

		let midPoint = Math.floor(width / 2);

		let ca = Array(height);

		//The first row is initialized to zero except for it's midpoint.
		ca[0] = Array(width).fill(0);
		ca[0][midPoint] = 1;

		//Generate the next row based on the current row.
		let neighborhood;
		for (let row = 0; row < height - 2; row++) {
			ca[row + 1] = Array(width);
			for (let col = 0; col < width; col++) {
				neighborhood = this.findNeighborHood(ca[row], col);
				ca[row + 1][col] = this.evaluateRules(neighborhood);
			}
		}
		return ca;
	}

	findNeighborHood(generation, index) {
		return [
			this.findArrayValue(generation, index - 1),
			this.findArrayValue(generation, index),
			this.findArrayValue(generation, index + 1),
		];
	}

	findArrayValue(array, index) {
		if (index < 0 || index > array.length - 1) {
			return 0;
		}
		return array[index];
	}

	evaluateRules(neighborhood) {
		let rule = parseInt(neighborhood.join(''), 2);
		return this.rulesSet[rule];
	}
}

module.exports = WolframRule90;
