const ConwayMemorial = require('./ConwayMemorial.js');

class TemplateFactory {
	static generate(name, x, y) {
		let cells;
		//TODO: Move switch to dedicated class.
		switch (name) {
			case 'conways-memorial':
				cells = new ConwayMemorial().generateCells(x, y);
				break;
			default:
				throw new Error('Unknown template name.');
				break;
		}
		return cells;
	}
}

module.exports = TemplateFactory;
