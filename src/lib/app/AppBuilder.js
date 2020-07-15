const {
	AppStateManager,
	AppStateManagerEvents,
} = require('./AppStateManager.js');
const DefaultConfig = require('../configs/DefaultConfig.js');
const Layers = require('./AppLayers.js');

const DrawingSceneBuilder = require('../scenes/DrawingSceneBuilder.js');
const GridSceneBuilder = require('../scenes/GridSceneBuilder.js');
const LifeSceneBuilder = require('../scenes/LifeSceneBuilder.js');
const DisplayManager = require('./DisplayManager.js');

const { createWorker } = require('../workers/WorkersLoader');

const {
	handleMessageFromGridWorker,
	handleMsgFromDrawingWorker,
	handleMessageFromLifeWorker,
	setThreadFlagToClean,
} = require('./AppMessageHandlers');

class AppBuilder {
	static buildApp(app) {
		this.setupProperties(app);
		this.setupScenes(app);
		return this.setupWorkers(app);
	}

	/**
	 * Initialize all properties for the main thread.
	 * @param {App} - The App to configure.
	 * @returns {App} Returns the instance of the main thread being modified.
	 */
	static setupProperties(app) {
		app.config = DefaultConfig;
		app.stateManager = new AppStateManager(app.config);
		app.stateManager.subscribe(
			AppStateManagerEvents.UI_CHANGES,
			app.updateUI.bind(app)
		);

		app.stateManager.subscribe(
			AppStateManagerEvents.UI_CHANGES,
			setThreadFlagToClean.bind(app.stateManager)
		);

		app.displayManager = new DisplayManager();

		return app;
	}

	/**
	 * Establishes the renderers.
	 * @returns {App} Returns the instance of the main thread being modified.
	 */
	static setupRenderers(app) {
		app.stateManager
			.registerRenderer(Layers.GRID, app.getCanvasContext('grid_canvas'))
			.registerRenderer(Layers.DRAWING, app.getCanvasContext('draw_canvas'))
			.registerRenderer(Layers.SIM, app.getCanvasContext('sim_canvas'));
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
				createWorker(Layers.GRID),
				handleMessageFromGridWorker.bind(app.stateManager),
				false
			)
			.createWorker(
				Layers.DRAWING,
				createWorker(Layers.DRAWING),
				handleMsgFromDrawingWorker.bind(app.stateManager)
			)
			.createWorker(
				Layers.SIM,
				createWorker(Layers.SIM),
				handleMessageFromLifeWorker.bind(app.stateManager)
			);

		return app;
	}
}

module.exports = AppBuilder;
