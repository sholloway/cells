/**
 * @private
 */
function clearCanvas(htmlCanvasContext, config) {
	htmlCanvasContext.clearRect(0, 0, config.canvas.width, config.canvas.height);
}

/**
 * Responsible rendering a scene.
 */
class HTMLCanvasRenderer {
	/**
	 * Initializes a new HTMLRenderer
	 * @param {HTMLCanvasContext} htmlCanvasContext
	 * @param {object} config - The simulation's configuration object.
	 */
	constructor(htmlCanvasContext, config) {
		this.htmlCanvasContext = htmlCanvasContext;
		this.config = config;
	}

	/**
	 * Renders one frame of the scene.
	 * @param {SceneManager} scene - The scene to render.
	 */
	render(scene) {
		this.clear();
		while (!scene.fullyRendered()) {
			let entity = scene.nextEntity();
			entity.render(this.htmlCanvasContext);
		}
	}

	/**
	 * Erases the entire canvas.
	 */
	clear() {
		clearCanvas(this.htmlCanvasContext, this.config);
	}
}

module.exports = HTMLCanvasRenderer;
