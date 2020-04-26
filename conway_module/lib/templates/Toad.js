const DrawingTemplate = require('./DrawingTemplate.js');

class Toad extends DrawingTemplate {
	constructor() {
		super();
	}

	pattern() {
		return [
			[0, 1, 1, 1],
			[1, 1, 1, 0],
		];
	}
}

module.exports = Toad;
