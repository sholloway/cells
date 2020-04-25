const ConwayMemorial = require('./ConwayMemorial.js');
const Block = require('./Block.js');
const HorizontalSpinner = require('./HorizontalSpinner.js');
const VerticalSpinner = require('./VerticalSpinner.js');
const Toad = require('./Toad.js');
const Glider = require('./Glider.js');

class TemplateFactory {
	static generate(name, x, y) {
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
			default:
				throw new Error('Unknown template name.');
				break;
		}
		return template.generateCells(x, y);
	}
}

module.exports = TemplateFactory;
