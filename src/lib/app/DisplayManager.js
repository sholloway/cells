const { getElementById } = require('../dom/DomUtilities.js');

class DisplayManager {
	setDisplayMode(perf) {
		if (perf) {
			let container = getElementById('canvas_container');
			let requestFullscreen =
				container.requestFullscreen || // Fullscreen API
				container.mozRequestFullScreen || // Old Firefox
				container.webkitRequestFullscreen || // Old Chrome, Safari and Opera
				container.msRequestFullscreen || // Old IE/Edge
				(() => Promise.reject('Could not find a fullscreen method.')); //Otherwise create a function that will resolve a rejected promise.

			return requestFullscreen.call(container);
			//TODO: Need to unit test the above failure scenario. Might need to use the below code instead.
			// return requestFullscreen
			// 	? requestFullscreen.call(container)
			// 	: Promise.reject('Could not find a fullscreen method.');
		} else {
			return Promise.resolve();
		}
	}
}

module.exports = DisplayManager;
