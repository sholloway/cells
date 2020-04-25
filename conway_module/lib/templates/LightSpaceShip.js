const DrawingTemplate = require('./DrawingTemplate.js');

class LightSpaceShip extends DrawingTemplate {
	pattern() {
		return [
			[0, 1, 0, 0, 1],
			[1, 0, 0, 0, 0],
			[1, 0, 0, 0, 1],
			[1, 1, 1, 1, 0],
		];
	}
}

module.exports = LightSpaceShip;
