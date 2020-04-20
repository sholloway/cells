const { getElementById } = require('../dom/DomUtilities.js');

/**
 * Calculate the new height of the canvas elements.
 * @returns {number} The intended canvas height.
 */
function calculateConfiguredCanvasHeight() {
	// Note: This will use the same padding/margins as the HTML Body.
	let blockElement = getElementById('block');
	let headerElement = getElementById('header');
	let controlBarElement = getElementById('control_bar');
	let statusBarElement = getElementById('status_bar');
	let bodyMargin = 8 * 2; //Padding on body element in CSS is 8 top and bottom.

	return (
		window.innerHeight -
		bodyMargin -
		(blockElement.offsetHeight +
			headerElement.offsetHeight +
			controlBarElement.offsetHeight +
			statusBarElement.offsetHeight)
	);
}

function calculateFullScreenHeight() {
	return screen.height;
}

function isFullscreen() {
	return document.fullscreenElement != null;
}

/**
 * Override the current configuration to size the HTML Canvas
 * to fit the document.
 * @param {*} config
 */
function sizeCanvas(game) {
	game.config.canvas.height = isFullscreen()
		? calculateFullScreenHeight()
		: calculateConfiguredCanvasHeight();

	let canvasContainerDiv = getElementById('canvas_container');

	//WARNING: Setting the canvas height changes the body
	//width so always set the height before the width.
	canvasContainerDiv.style.height = `${game.config.canvas.height}px`;
	game.gridCanvas.setAttribute('height', game.config.canvas.height);
	game.simCanvas.setAttribute('height', game.config.canvas.height);
	game.drawCanvas.setAttribute('height', game.config.canvas.height);

	game.config.canvas.width = document.body.clientWidth;
	canvasContainerDiv.style.width = `${game.config.canvas.width}px`;
	game.gridCanvas.setAttribute('width', game.config.canvas.width);
	game.simCanvas.setAttribute('width', game.config.canvas.width);
	game.drawCanvas.setAttribute('width', game.config.canvas.width);
	return game;
}

module.exports = { sizeCanvas };
