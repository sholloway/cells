const LinearCellularAutomaton = require('./LinearCellularAutomaton.js');

class WolframRule30 extends LinearCellularAutomaton {
	constructor(config) {
		super(config);
		this.setRuleSet([0, 0, 0, 1, 1, 1, 1, 0]);
	}
}

module.exports = WolframRule30;
