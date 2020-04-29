const ConwayMemorial = require('./ConwayMemorial.js');
const Block = require('./Block.js');
const HorizontalSpinner = require('./HorizontalSpinner.js');
const VerticalSpinner = require('./VerticalSpinner.js');
const Toad = require('./Toad.js');
const Glider = require('./Glider.js');
const LightSpaceShip = require('./LightSpaceShip.js');
const WolframRule184 = require('./automata/WolframRule184.js');
const LinearCellularAutomaton = require('./automata/LinearCellularAutomaton.js');

class TemplateFactory {
	static generate(name, x, y, config) {
		let template;
		switch (name) {
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
			case 'wr-rule-90':
				//prettier-ignore
				template = new LinearCellularAutomaton(config)
					.setRuleSet([0, 1, 0, 1, 1, 0, 1, 0]);
				break;
			case 'wr-rule-110':
				template = new LinearCellularAutomaton(config)
					.setRuleSet([0, 1, 1, 0, 1, 1, 1, 0])
					.setInitializationAlgorithm((width) => width - 1);
				break;
			case 'wr-rule-30':
				//prettier-ignore
				template = new LinearCellularAutomaton(config)
					.setRuleSet([0, 0, 0, 1, 1, 1, 1, 0]);
				break;
			case 'wr-rule-184':
				template = new WolframRule184(config);
				break;
			case 'wr-rule-250':
				//prettier-ignore
				template = new LinearCellularAutomaton(config)
					.setRuleSet([1, 1, 1, 1, 1, 0, 1, 0]);
				break;
			default:
				throw new Error('Unknown template name.');
				break;
		}
		return template.generateCells(x, y);
	}
}

module.exports = TemplateFactory;
