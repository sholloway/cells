const ConwayMemorial = require('./ConwayMemorial.js');
const Block = require('./Block.js');

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
			default:
				throw new Error('Unknown template name.');
				break;
		}
		return template.generateCells(x, y);
	}
}

module.exports = TemplateFactory;
