const DrawingTemplate = require('../DrawingTemplate.js');

const INVALID_RULE_MSG = 'Can only process rules in the in range [0,255].';
class LinearCellularAutomaton extends DrawingTemplate {
	constructor(config, rule = 0) {
		super();
		this.config = config;
		this.enforceRuleSet(rule)
			.setRuleSet(this.generateRuleSet(rule))
			.establishInitializationAlgorithm();
	}

	establishInitializationAlgorithm() {
		this.initializationAlgorithm = (width) => {
			//The default is to start the CA in the middle of row zero.
			return Math.floor(width / 2);
		};
		return this;
	}

	enforceRuleSet(rule) {
		if (rule < 0 || rule > 255) {
			throw new Error(INVALID_RULE_MSG);
		}
		return this;
	}

	/**
	 *
	 * @param {number} rule - An integer in the range [1,255].
	 * @returns number[] An integer represented as an 8 bit binary number.
	 */
	generateRuleSet(rule) {
		let binaryStr = rule.toString(2);
		let paddedStr = binaryStr.padStart(8, '0');
		return [...paddedStr].map((s) => parseInt(s));
	}

	generateCells(x, y) {
		return this.makeCellsFrom2DArray(this.pattern());
	}

	pattern() {
		let height = Math.floor(this.config.landscape.height);
		let width = Math.floor(this.config.landscape.width);

		let startingPoint = this.findStartingIndex(width);

		let ca = Array(height);

		//The first row is initialized to zero except for its starting point.
		ca[0] = Array(width).fill(0);
		ca[0][startingPoint] = 1;

		//Generate the next row based on the current row.
		let neighborhood;
		for (let row = 0; row < height; row++) {
			ca[row + 1] = Array(width);
			for (let col = 0; col < width; col++) {
				neighborhood = this.findNeighborHood(ca[row], col);
				ca[row + 1][col] = this.evaluateRules(neighborhood);
			}
		}
		return ca;
	}

	setInitializationAlgorithm(algorithm) {
		this.initializationAlgorithm = algorithm;
		return this;
	}

	findStartingIndex(width) {
		return this.initializationAlgorithm(width);
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
		let ruleIndex = parseInt(neighborhood.join(''), 2);
		return this.getRule(ruleIndex);
	}

	getRule(ruleIndex) {
		return this.rulesSet[ruleIndex];
	}

	/**
	 * Stores the rule set in reverse order from Wolfram's Specificiation to enable binary lookup.
	 * @param {number[]} ruleSet
	 */
	setRuleSet(ruleSet) {
		this.rulesSet = ruleSet.reverse();
		return this;
	}

	getRulesSetStr() {
		return this.rulesSet.reverse().join('');
	}
}

module.exports = LinearCellularAutomaton;
