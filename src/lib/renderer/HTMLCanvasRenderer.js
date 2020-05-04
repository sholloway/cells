/**
 * @private
 */
function clearCanvas(ctx) {
	ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
}

/**
 * Responsible rendering a scene.
 */
class HTMLCanvasRenderer {
	/**
	 * Initializes a new HTMLRenderer
	 * @param {HTMLCanvasContext} htmlCanvasContext
	 */
	constructor(htmlCanvasContext) {
		this.htmlCanvasContext = htmlCanvasContext;
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
		clearCanvas(this.htmlCanvasContext);
	}

	/**
	 *
	 * @param {Function} draw - A function that works with the HTMLCanvasContext
	 */
	processCanvas(draw) {
		draw(this.this.htmlCanvasContext);
	}
}

module.exports = HTMLCanvasRenderer;
