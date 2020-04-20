const { getElementById } = require('./../dom/DomUtilities.js');

class DisplayManager {
	setDisplayMode(perf) {
		if (perf) {
			let container = getElementById('canvas_container');
			return container.requestFullscreen();
		} else {
			return Promise.resolve();
		}
	}
}

module.exports = DisplayManager;
