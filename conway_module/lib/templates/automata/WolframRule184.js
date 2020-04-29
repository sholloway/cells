const LinearCellularAutomaton = require('./LinearCellularAutomaton.js');

class WolframRule184 extends LinearCellularAutomaton {
	constructor(config) {
		super(config);
		this.setRuleSet([1, 0, 1, 1, 1, 0, 0, 0]);
	}
}

module.exports = WolframRule184;
