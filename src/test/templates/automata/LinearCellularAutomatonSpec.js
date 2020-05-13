const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const LinearCellularAutomaton = require('./../../../lib/templates/automata/LinearCellularAutomaton.js');
describe('Linear Cellular Automaton', function () {
	it('should default to rule 0', function () {
		let automaton = new LinearCellularAutomaton({});
		expect(automaton.getRulesSetStr()).to.equal('00000000');
	});

	it('should generate the rule set as an array', function () {
		let automaton = new LinearCellularAutomaton({});
		let currentRuleSet;

		currentRuleSet = automaton.generateRuleSet(5);
		expect(Array.isArray(currentRuleSet)).to.be.true;
	});

	it('should generate binary rules from their integer representation', function () {
		expect(new LinearCellularAutomaton({}, 1).getRulesSetStr()).to.equal(
			'00000001'
		);
		expect(new LinearCellularAutomaton({}, 8).getRulesSetStr()).to.equal(
			'00001000'
		);
		expect(new LinearCellularAutomaton({}, 30).getRulesSetStr()).to.equal(
			'00011110'
		);
		expect(new LinearCellularAutomaton({}, 90).getRulesSetStr()).to.equal(
			'01011010'
		);
		expect(new LinearCellularAutomaton({}, 110).getRulesSetStr()).to.equal(
			'01101110'
		);
		expect(new LinearCellularAutomaton({}, 255).getRulesSetStr()).to.equal(
			'11111111'
		);
	});

	it('should throw an error if not in the range of [0,255]', function () {
		expect(() => {
			new LinearCellularAutomaton({}, -1);
		}).to.throw(Error, 'Can only process rules in the in range [0,255].');
		expect(() => {
			new LinearCellularAutomaton({}, 256);
		}).to.throw(Error, 'Can only process rules in the in range [0,255].');
	});

	it('should initialize the algorithm in the middle of the row by default', function () {
		let lca = new LinearCellularAutomaton({}, 0);
		expect(lca.initializationAlgorithm(0)).to.equal(0);
		expect(lca.initializationAlgorithm(1)).to.equal(0);
		expect(lca.initializationAlgorithm(2)).to.equal(1);
		expect(lca.initializationAlgorithm(3)).to.equal(1);
		expect(lca.initializationAlgorithm(4)).to.equal(2);
		expect(lca.initializationAlgorithm(5)).to.equal(2);
	});

	it('should generate cells', function () {
		let config = {
			landscape: {
				width: 10,
				height: 10,
			},
		};
		let lca = new LinearCellularAutomaton(config, 255); //Rule 255 will populate every cell except for the first row.
		let cells = lca.generateCells(0, 0);

		//The the first row only has 1 active cell.
		//The algoritm adds an extra row at the end due to
		//the grid not fitting perfectly on the Canvas.
		expect(cells.length).to.equal(
			config.landscape.width * config.landscape.height + 1 //The first row will include the midpoint.
		);
	});
});
