const {
	AppStateManager,
	AppStateManagerEvents,
} = require('./AppStateManager.js');
const DefaultConfig = require('../core/DefaultConfig.js');
const Layers = require('./AppLayers.js');

const DrawingSceneBuilder = require('./../scenes/DrawingSceneBuilder.js');
const GridSceneBuilder = require('./../scenes/GridSceneBuilder.js');
const LifeSceneBuilder = require('./../scenes/LifeSceneBuilder.js');
const DisplayManager = require('./DisplayManager.js');
const ContextMenu = require('./../ui/ContextMenu.js');

const {
	GridSystemWorker,
	DrawingSystemWorker,
	LifeSystemWorker,
} = require('../workers/WorkersLoader');

const {
	handleMessageFromGridWorker,
	handleMsgFromDrawingWorker,
	handleMessageFromLifeWorker,
} = require('./AppMessageHandlers');

class AppBuilder {
	static buildApp(gridCanvas, simCanvas, drawCanvas, app) {
		this.setupProperties(gridCanvas, simCanvas, drawCanvas, app);
		this.setupRenderers(app);
		this.setupScenes(app);
		return this.setupWorkers(app);
	}

	/**
	 * Initialize all properties for the main thread.
	 * @param {HTMLCanvasElement} gridCanvas - The HTML canvas to use for rendering the grid.
	 * @param {HTMLCanvasElement} simCanvas - The HTML canvas to use for rendering the simulation.
	 * @param {HTMLCanvasElement} drawCanvas - The HTML canvas to use for drawing.
	 * @param {App} - The App to configure.
	 * @returns {App} Returns the instance of the main thread being modified.
	 */
	static setupProperties(gridCanvas, simCanvas, drawCanvas, app) {
		app.config = DefaultConfig;
		app.gridCanvas = gridCanvas;
		app.simCanvas = simCanvas;
		app.drawCanvas = drawCanvas;
		app.stateManager = new AppStateManager(app.config);
		app.stateManager.subscribe(
			AppStateManagerEvents.UI_CHANGES,
			app.updateUI.bind(app)
		);

		app.displayManager = new DisplayManager();
		app.canvasContextMenu = new ContextMenu();

		return app;
	}

	/**
	 * Establishes the renderers.
	 * @returns {App} Returns the instance of the main thread being modified.
	 */
	static setupRenderers(app) {
		app.stateManager
			.registerRenderer(Layers.GRID, app.gridCanvas.getContext('2d'))
			.registerRenderer(Layers.DRAWING, app.drawCanvas.getContext('2d'))
			.registerRenderer(Layers.SIM, app.simCanvas.getContext('2d'));
		return app;
	}

	/**
	 * Sets up the scenes.
	 * @returns {App} Returns the instance of the main thread being modified.
	 */
	static setupScenes(app) {
		//Move these to the AppStateManager
		app.stateManager
			.createScene(Layers.GRID, GridSceneBuilder.buildScene)
			.createScene(Layers.DRAWING, DrawingSceneBuilder.buildScene)
			.createScene(Layers.SIM, LifeSceneBuilder.buildScene);
		return app;
	}

	/**
	 * Initializes and configures the web workers.
	 * @returns {App} Returns the instance of the main thread being modified.
	 */
	static setupWorkers(app) {
		app.stateManager
			.createWorker(
				Layers.GRID,
				GridSystemWorker,
				handleMessageFromGridWorker.bind(app.stateManager),
				false
			)
			.createWorker(
				Layers.DRAWING,
				DrawingSystemWorker,
				handleMsgFromDrawingWorker.bind(app.stateManager)
			)
			.createWorker(
				Layers.SIM,
				LifeSystemWorker,
				handleMessageFromLifeWorker.bind(app.stateManager)
			);

		return app;
	}
}

module.exports = AppBuilder;
