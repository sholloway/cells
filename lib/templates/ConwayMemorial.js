const DrawingTemplate = require('./DrawingTemplate.js');

class ConwayMemorial extends DrawingTemplate {
	constructor() {
		super();
	}

	pattern() {
		return [
			[0, 0, 1, 1, 1, 0, 0],
			[0, 0, 1, 0, 1, 0, 0],
			[0, 0, 1, 0, 1, 0, 0],
			[0, 0, 0, 1, 0, 0, 0],
			[1, 0, 1, 1, 1, 0, 0],
			[0, 1, 0, 1, 0, 1, 0],
			[0, 0, 0, 1, 0, 0, 1],
			[0, 0, 1, 0, 1, 0, 0],
			[0, 0, 1, 0, 1, 0, 0],
		];
	}

	//The center of origin for the pattern.
	origin() {
		return { x: -3, y: -4 };
	}
}

module.exports = ConwayMemorial;
