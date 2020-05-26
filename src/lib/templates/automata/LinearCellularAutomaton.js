const DrawingTemplate = require('../DrawingTemplate.js');

const INVALID_RULE_MSG = 'Can only process rules in the in range [0,255].';
class LinearCellularAutomaton extends DrawingTemplate {
	constructor(config, rule = 0, useRandomStart = false) {
		super();
		this.config = config;
		this.useRandomStart = useRandomStart; //TODO: This is also in the config param. Remove it.
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
		let ca = Array(height);
		ca[0] = this.useRandomStart
			? this.randomStartingPoint(width)
			: this.traditionalStartingPoint(width);

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

	/**
	 * Generate the traditional starting point for elementary CAs.
	 * All zeros except for the center.
	 * @returns {Number[]}
	 */
	traditionalStartingPoint(width) {
		let startingPoint = this.findStartingIndex(width);
		//The first row is initialized to zero except for its starting point.
		let initialRow = Array(width).fill(0);
		initialRow[startingPoint] = 1;
		return initialRow;
	}

	randomStartingPoint(width) {
		return Array(width).fill(0).map((i) => this.rollDice());
	}

	//floor(random() * (max - min + 1)) + min
	//floor(random() * (1 - 0 + 1)) + 0
	//floor(random() * (2))
	rollDice() {
		return Math.floor(Math.random() * 2);
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
		// Hard Dead Border
		// if (index < 0 || index > array.length - 1) {
		// 	return 0;
		// }

		//Wrap the border
		let value;
		if (index < 0) {
			value = array[array.length - 1];
		} else if (index > array.length - 1) {
			value = index[0];
		} else {
			value = array[index];
		}
		return value;
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
