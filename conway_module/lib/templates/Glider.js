const DrawingTemplate = require('./DrawingTemplate.js');

class Glider extends DrawingTemplate {
	pattern() {
		return [
			[0, 1, 0],
			[0, 0, 1],
			[1, 1, 1],
		];
	}
}

module.exports = Glider;
