const DrawingTemplate = require('./DrawingTemplate.js');

class VerticalSpinner extends DrawingTemplate {
	constructor() {
		super();
	}

	pattern() {
		// prettier-ignore
		return [
			[1], 
			[1], 
			[1]
		];
	}
}

module.exports = VerticalSpinner;
