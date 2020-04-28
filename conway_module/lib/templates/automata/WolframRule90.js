const LinearCellularAutomaton = require('./LinearCellularAutomaton.js');

class WolframRule90 extends LinearCellularAutomaton {
	constructor(config) {
		super(config);
		this.setRuleSet([0, 1, 0, 1, 1, 0, 1, 0]);
	}
}

module.exports = WolframRule90;
