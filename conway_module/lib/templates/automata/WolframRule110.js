const LinearCellularAutomaton = require('./LinearCellularAutomaton.js');

class WolframRule90 extends LinearCellularAutomaton {
	constructor(config) {
		super(config);
		this.setRuleSet([0, 1, 1, 0, 1, 1, 1, 0]);
	}

	findStartingIndex(width) {
		//The default is to start the CA in the middle of row zero.
		return width - 1;
	}
}

module.exports = WolframRule90;
