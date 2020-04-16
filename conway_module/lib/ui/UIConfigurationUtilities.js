const { getElementById } = require('../dom/DomUtilities.js');

/**
 * Updates the zoom setting all threads should use.
 */
function updateConfiguredZoom(config) {
	config.zoom = getCellSize();
}

/**
 * Updates the landscape dimensions all threads should use.
 */
function updateConfiguredLandscape(config) {
	config.landscape.width = config.canvas.width / config.zoom;
	config.landscape.height = config.canvas.height / config.zoom;
}

/**
 * Helper function for finding the cell size as a number.
 * @returns {number} The cell size.
 */
function getCellSize() {
	return Number.parseInt(getElementById('cell_size').value);
}

module.exports = {
	updateConfiguredZoom,
	updateConfiguredLandscape,
	getCellSize,
};
