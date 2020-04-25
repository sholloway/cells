const DrawingTemplate = require('./DrawingTemplate.js');

class HorizontalSpinner extends DrawingTemplate {
	constructor() {
		super();
	}

	pattern() {
		return [[1, 1, 1]];
	}
}

module.exports = HorizontalSpinner;
