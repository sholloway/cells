const DrawingTemplate = require('./DrawingTemplate.js');

class Block extends DrawingTemplate {
	constructor() {
		super();
	}

	pattern() {
		return [
			[1, 1],
			[1, 1],
		];
	}
}

module.exports = Block;
