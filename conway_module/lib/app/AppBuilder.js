const {
	AppStateManager,
	AppStateManagerEvents,
} = require('./AppStateManager.js');
const DefaultConfig = require('../core/DefaultConfig.js');
const Layers = require('./AppLayers.js');

const DrawingSceneBuilder = require('./../scenes/DrawingSceneBuilder.js');
const GridSceneBuilder = require('./../scenes/GridSceneBuilder.js');
const LifeSceneBuilder = require('./../scenes/LifeSceneBuilder.js');

const {
	GridSystemWorker,
	DrawingSystemWorker,
	LifeSystemWorker,
} = require('../workers/WorkersLoader');

/**
 * Processes a message received from the grid web worker.
 * This is ran in the context of the AppStateManager.
 * @param {*} envelope - The message to be processed.
 */
function handleMessageFromGridWorker(envelope) {
	if (envelope && envelope.data) {
		envelope.data.promisedResponse
			? this.workerSystem.attemptToProcessPendingWork(envelope.data)
			: this.processCycleMessage(Layers.GRID, envelope.data);
	}
}

/**
 * Process a message received from the drawing system web worker.
 * This is ran in the context of the AppStateManager.
 * @param {*} envelope - The message sent.
 */
function handleMsgFromDrawingWorker(envelope) {
	if (envelope && envelope.data) {
		envelope.data.promisedResponse
			? this.workerSystem.attemptToProcessPendingWork(envelope.data)
			: this.processCycleMessage(Layers.DRAWING, envelope.data);
	}
}

/**
 * Process a message received from the life system web worker.
 * This is ran in the context of the AppStateManager.
 * @param {*} envelope - The message sent.
 */
function handleMessageFromLifeWorker(envelope) {
	if (envelope && envelope.data) {
		envelope.data.promisedResponse
			? this.workerSystem.attemptToProcessPendingWork(envelope.data)
			: this.processCycleMessage(Layers.SIM, envelope.data);
	}
}

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
	 * @returns {App} Returns the instance of the main thread being modified.
	 */
	static setupProperties(gridCanvas, simCanvas, drawCanvas, game) {
		game.config = DefaultConfig;
		game.gridCanvas = gridCanvas;
		game.simCanvas = simCanvas;
		game.drawCanvas = drawCanvas;
		game.stateManager = new AppStateManager(game.config);
		game.stateManager.subscribe(
			AppStateManagerEvents.UI_CHANGES,
			game.updateUI.bind(game)
		);
		return game;
	}

	/**
	 * Establishes the renderers.
	 * @returns {App} Returns the instance of the main thread being modified.
	 */
	static setupRenderers(game) {
		game.stateManager
			.registerRenderer(Layers.GRID, game.gridCanvas.getContext('2d'))
			.registerRenderer(Layers.DRAWING, game.drawCanvas.getContext('2d'))
			.registerRenderer(Layers.SIM, game.simCanvas.getContext('2d'));
		return game;
	}

	/**
	 * Sets up the scenes.
	 * @returns {App} Returns the instance of the main thread being modified.
	 */
	static setupScenes(game) {
		//Move these to the AppStateManager
		game.stateManager
			.createScene(Layers.GRID, GridSceneBuilder.buildScene)
			.createScene(Layers.DRAWING, DrawingSceneBuilder.buildScene)
			.createScene(Layers.SIM, LifeSceneBuilder.buildScene);
		return game;
	}

	/**
	 * Initializes and configures the web workers.
	 * @returns {App} Returns the instance of the main thread being modified.
	 */
	static setupWorkers(game) {
		game.stateManager
			.createWorker(
				Layers.GRID,
				GridSystemWorker,
				handleMessageFromGridWorker.bind(game.stateManager),
				false
			)
			.createWorker(
				Layers.DRAWING,
				DrawingSystemWorker,
				handleMsgFromDrawingWorker.bind(game.stateManager)
			)
			.createWorker(
				Layers.SIM,
				LifeSystemWorker,
				handleMessageFromLifeWorker.bind(game.stateManager)
			);

		return game;
	}
}

module.exports = AppBuilder;
