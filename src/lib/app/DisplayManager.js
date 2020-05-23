const { getElementById } = require('../dom/DomUtilities.js');

class DisplayManager {
	setDisplayMode(perf, element) {
		if (perf) {
			let requestFullscreen =
				element.requestFullscreen || // Fullscreen API
				element.mozRequestFullScreen || // Old Firefox
				element.webkitRequestFullscreen || // Old Chrome, Safari and Opera
				element.msRequestFullscreen || // Old IE/Edge
				(() => Promise.reject('Could not find a fullscreen method.')); //Otherwise create a function that will resolve a rejected promise.

			return requestFullscreen.call(element);
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
