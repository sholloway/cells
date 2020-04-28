const ConwayMemorial = require('./ConwayMemorial.js');
const Block = require('./Block.js');
const HorizontalSpinner = require('./HorizontalSpinner.js');
const VerticalSpinner = require('./VerticalSpinner.js');
const Toad = require('./Toad.js');
const Glider = require('./Glider.js');
const LightSpaceShip = require('./LightSpaceShip.js');
const WolframRule90 = require('./WolframRule90.js');

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
				template = new WolframRule90(config);
				break;
			default:
				throw new Error('Unknown template name.');
				break;
		}
		return template.generateCells(x, y);
	}
}

module.exports = TemplateFactory;
