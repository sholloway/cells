const ConwayMemorial = require('./ConwayMemorial.js');
const Block = require('./Block.js');
const HorizontalSpinner = require('./HorizontalSpinner.js');
const VerticalSpinner = require('./VerticalSpinner.js');
const Toad = require('./Toad.js');
const Glider = require('./Glider.js');
const LightSpaceShip = require('./LightSpaceShip.js');
const LinearCellularAutomaton = require('./automata/LinearCellularAutomaton.js');
const RandomDiceRoll = require('./RandomDiceRoll.js');

class TemplateFactory {
	static generate(commandName, x, y, config) {
		let template = commandName.startsWith('wr-rule-')
			? this.generateElementaryCA(commandName, config)
			: this.generateRegisteredTemplate(commandName, config);
		return template.generateCells(x, y);
	}

	static generateElementaryCA(commandName, config) {
		let tokens = commandName.split('-');
		let caRuleName = tokens[tokens.length - 1];
		let ruleNumber = Number.parseInt(caRuleName);
		return new LinearCellularAutomaton(config, ruleNumber);
	}

	static generateRegisteredTemplate(commandName, config) {
		let template;
		switch (commandName) {
			case 'conways-memorial':
				template = new ConwayMemorial();
				break;
			case 'da-block':
				template = new Block();
				break;
			case 'vert-spinner':
				template = new VerticalSpinner();
				break;
			case 'horiz-spinner':
				template = new HorizontalSpinner();
				break;
			case 'toad':
				template = new Toad();
				break;
			case 'glider':
				template = new Glider();
				break;
			case 'light-ship':
				template = new LightSpaceShip();
				break;
			case 'wr-rule-110':
				template = new LinearCellularAutomaton(
					config,
					110
				).setInitializationAlgorithm((width) => width);
				break;
			case 'dice-roll':
				template = new RandomDiceRoll(config);
				break;
			default:
				throw new Error('Unknown template name.');
		}
		return template;
	}
}

module.exports = TemplateFactory;
