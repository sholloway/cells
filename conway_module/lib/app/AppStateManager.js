const SceneManager = require('./../core/SceneManager');
const HTMLCanvasRenderer = require('./../renderer/HTMLCanvasRenderer.js');
const WorkerSystem = require('./../core/WorkerSystem.js');
const WorkerCommands = require('./../workers/WorkerCommands.js');

const Layers = require('./AppLayers.js');
const { getElementById } = require('./../dom/DomUtilities.js');
const {
	updateConfiguredZoom,
	updateConfiguredLandscape,
} = require('../ui/UIConfigurationUtilities.js');

const SEEDER_CREATION_ERR_MSG = 'There was an error trying to build the seeder';
const PROCESS_CYCLE_MESSAGE_ERR_MSG =
	'AppStateManager.processCycleMessage: Can only process messages that are PROCESS_CYCLE and contain a stack.';
const MISSING_CELLS = 'Cells were not provided.';
const PAUSE_SIM_IN_DRAWING_MODE_ERR =
	'There was an error trying to pause the simulation.';

/**
 * The supported events the state manager notifies on.
 */
const AppStateManagerEvents = {
	UI_CHANGES: 'ticked',
};

/**
 * Manages the application state and orchestrate communication between the App and Workers.
 */
class AppStateManager {
	constructor(config) {
		this.config = config;
		this.observers = new Map();
		this.drawingAllowed = true;
		this.fullScreenDesired = false;
		this.renderers = new Map();
		this.scenes = new Map();
		this.sceneBuilders = new Map();
		this.workers = new Map();
		this.workerSystem = new WorkerSystem(this.getWindow(), config);
	}

	getWindow() {
		return typeof window === 'undefined' ? this.window : window;
	}

	/**
	 * Signals if drawing mode is enabled.
	 * @returns {boolean} Is drawing allowed.
	 */
	isDrawingAllowed() {
		return this.drawingAllowed;
	}

	/**
	 * Creates an HTMLCanvasRender for a layer.
	 * @param {string} name - The name of the renderer.
	 * @param {CanvasRenderingContext2D} canvasContext - The rendering context.
	 * @returns {AppStateManager} The instance.
	 */
	registerRenderer(name, canvasContext) {
		!this.renderers.has(name) &&
			this.renderers.set(name, new HTMLCanvasRenderer(canvasContext));
		return this;
	}

	/**
	 * Creates a SceneManager for a layer.
	 * @param {*} name - The name of layer.
	 * @param {*} sceneBuilder - The function that builds the scene.
	 * @returns {AppStateManager} The instance.
	 */
	createScene(name, sceneBuilder) {
		if (!this.scenes.has(name)) {
			this.scenes.set(name, new SceneManager());
			this.sceneBuilders.set(name, sceneBuilder);
		}
		return this;
	}

	/**
	 * Creates a web worker for a layer.
	 * @param {string} name - The name of the layer.
	 * @param {Constructor} workerConstructor - The web worker's constructor.
	 * @param {Function} messageHandler - A function handler to be invoked when a message is sent by the worker.
	 * @param {boolean} registerForBroadcastMessages - Should this worker recieve PROCESS_CYCLE broadcasts.
	 * @returns {AppStateManager} The instance.
	 */
	createWorker(
		name,
		workerConstructor,
		messageHandler,
		registerForBroadcastMessages = true
	) {
		if (!this.workers.has(name)) {
			let worker = new workerConstructor();
			worker.onmessage = messageHandler;
			registerForBroadcastMessages
				? this.workerSystem.registerWorker(name, worker)
				: (worker.onerror = this.workerSystem.workerErrorHandler.bind(
						this.workerSystem
				  ));
			this.workers.set(name, worker);
		}
		return this;
	}

	/**
	 * Starts the worker system's process cycle.
	 * @param {DOMHighResTimeStamp} - The current time.
	 * @returns {AppStateManager} The AppStateManager instance being started.
	 */
	start(time) {
		this.workerSystem.main(time);
		return this.allowDrawing();
	}

	/**
	 * Starts the main loop if it's not already running.
	 */
	startMainLoop() {
		this.workerSystem.start();
	}

	/**
	 * Notifies a worker to start.
	 * @param {string} name - The layer name.
	 * @returns {AppStateManager} The instance.
	 */
	startWorker(name) {
		if (this.workers.has(name)) {
			this.workers.get(name).postMessage({
				command: WorkerCommands.LifeCycle.START,
			});
		}
		return this;
	}

	/**
	 * Notifies a worker to stop.
	 * @param {string} name - The layer name.
	 * @returns {AppStateManager} The instance.
	 */
	stopWorker(name) {
		if (this.workers.has(name)) {
			this.workers.get(name).postMessage({
				command: WorkerCommands.LifeCycle.STOP,
			});
		}
		return this;
	}

	/**
	 * Commands a renderer to render.
	 * @param {string} name - The layer name.
	 * @returns {AppStateManager} The instance.
	 */
	render(name) {
		if (this.renderers.has(name) && this.scenes.has(name)) {
			this.renderers.get(name).render(this.getScene(name));
		}
		return this;
	}

	updateUI(message) {
		this.notify(AppStateManagerEvents.UI_CHANGES, message);
	}

	/**
	 * The internal method for notifying all System event subscribers.
	 * @private
	 */
	notify(eventName, message) {
		if (!this.observers.has(eventName)) {
			return;
		}
		this.observers.get(eventName).forEach((observer) => observer(message));
	}

	/**
	 * Implementation of the observer pattern. Provides the ability
	 * to register an event lister.
	 * @param {string} eventName - The event to subscribe to.
	 * @param {function} observer - The function to be invoked when the event occurs.
	 */
	subscribe(eventName, observer) {
		!this.observers.has(eventName) && this.observers.set(eventName, []);
		this.observers.get(eventName).push(observer);
	}

	/**
	 * Commands a render to clear.
	 * @param {string} name - The layer name.
	 * @returns {AppStateManager} The instance.
	 */
	clearRender(name) {
		this.renderers.get(name).clear();
		return this;
	}

	/**
	 * Commands a layer's scene to clear.
	 * @param {string} name - The layer name.
	 * @returns {AppStateManager} The instance.
	 */
	clearScene(name) {
		this.scenes.get(name).clear();
		return this;
	}

	/**
	 * Finds a scene by its layer name.
	 * @param {string} name - The layer name.
	 * @returns {SceneManager} The scene.
	 */
	getScene(name) {
		return this.scenes.get(name);
	}

	/**
	 * Builds a scene for a layer using its registered scene builder.
	 * @param {string} name - The layer name.
	 * @param {Entity[]} stack - An array of entities to render.
	 * @returns {AppStateManager} The instance.
	 */
	buildScene(name, stack) {
		if (this.sceneBuilders.has(name) && this.scenes.has(name)) {
			this.sceneBuilders.get(name)(this.getScene(name), this.config, stack);
		}
		return this;
	}

	/**
	 * Sends a message to a layer's web worker.
	 * @param {string} name - The layer name.
	 * @param {*} msg - The message to send.
	 * @returns {AppStateManager} The instance.
	 */
	sendWorkerMessage(name, msg) {
		if (this.workers.has(name)) {
			this.workers.get(name).postMessage(msg);
		}
		return this;
	}

	promiseResponse(name, command, params) {
		return this.workerSystem.promiseResponse(name, command, params);
	}

	/**
	 * Sends a message to every registered worker.
	 * @param {*} msg - The message to send.
	 * @returns {AppStateManager} The instance.
	 */
	broadcast(msg) {
		this.workerSystem.broadcast(msg);
		return this;
	}

	/**
	 * Process rendering a frame for a layer. The frame's scene contents are
	 * sent from a web worker.
	 * @param {string} name - The layer name.
	 * @param {*} message - The message to process.
	 */
	processCycleMessage(name, message) {
		if (message && message.command === 'PROCESS_CYCLE' && message.stack) {
			this.clearScene(name)
				.buildScene(name, message.stack)
				.render(name)
				.updateUI(message);
		} else {
			throw new Error(PROCESS_CYCLE_MESSAGE_ERR_MSG);
		}
	}

	/**
	 * Enables the drawing mode.
	 * @returns {AppStateManager} Returns the instance of the main thread being modified.
	 */
	allowDrawing() {
		this.drawingAllowed = true;
		return this.startWorker(Layers.DRAWING);
	}

	/**
	 * Disables drawing mode.
	 * @returns {AppStateManager} Returns the instance of the main thread being modified.
	 */
	preventDrawing() {
		this.drawingAllowed = false;
		return this.stopWorker(Layers.DRAWING);
	}

	/**
	 * Starts the simulation.
	 * @returns {Promise}
	 */
	startSimulation() {
		return this.workerSystem
			.promiseResponse(
				Layers.DRAWING,
				WorkerCommands.DrawingSystemCommands.SEND_CELLS
			)
			.then((response) => {
				return this.resetDrawingSystem(response);
			})
			.then((drawingCells) => {
				updateConfiguredZoom(this.config);
				updateConfiguredLandscape(this.config);
				return this.setSeederOnLifeSystem(drawingCells);
			})
			.then(() => {
				this.startWorker(Layers.SIM);
			})
			.catch((reason) => {
				console.error('AppStateManager.startSimulation(): There was an error.');
				console.error(reason);
				throw new Error(`${SEEDER_CREATION_ERR_MSG}.\n${reason}`);
			});
	}

	/**
	 * Orchestrates the drawing and life web workers to pause both systems.
	 * @returns {Promise}
	 */
	pauseSimulationInDrawingMode() {
		return this.workerSystem
			.promiseResponse(Layers.SIM, WorkerCommands.LifeSystemCommands.SEND_CELLS)
			.then((response) => {
				this.sendWorkerMessage(Layers.DRAWING, {
					command: WorkerCommands.DrawingSystemCommands.SET_CELLS,
					cells: response.cells,
				}).sendWorkerMessage(Layers.SIM, {
					command: WorkerCommands.LifeSystemCommands.RESET,
					config: this.config,
				});
			})
			.catch((reason) => {
				throw new Error(`${PAUSE_SIM_IN_DRAWING_MODE_ERR}\n${reason}`);
			})
			.finally(() => {
				this.clearRender(Layers.SIM).allowDrawing();
			});
	}

	/**
	 * Command the drawing system to reset with the provided configuration.
	 * @private
	 * @param {*} msg - An object that should contain an array of cells.
	 * @returns {Promise} Promise to invoke the drawing system worker.
	 */
	resetDrawingSystem(msg) {
		return new Promise((resolve, reject) => {
			this.sendWorkerMessage(Layers.DRAWING).clearRender(Layers.DRAWING);
			msg.cells ? resolve(msg.cells) : reject(MISSING_CELLS);
		});
	}

	/**
	 * Send configuration and cells to the life system worker to initialize the seeder with.
	 * @private
	 * @param {Cell[]} drawingCells The cells to populate the seeder with.
	 * @returns {Promise} Promise to invoke the life system worker.
	 */
	setSeederOnLifeSystem(drawingCells) {
		return this.workerSystem.promiseResponse(
			Layers.SIM,
			WorkerCommands.LifeSystemCommands.SET_SEEDER,
			{
				seedSetting: getElementById('seed').value,
				config: this.config,
				cells: drawingCells,
			}
		);
	}

	/**
	 * Command the life worker to stop the simulation.
	 * @returns {AppStateManager} The instance.
	 */
	stopSimulation() {
		return this.stopWorker(Layers.SIM);
	}

	/**
	 * Command the life worker to start the simulation.
	 * @returns {AppStateManager} The instance.
	 */
	resumeSimulation() {
		return this.startWorker(Layers.SIM);
	}

	/**
	 * Commands the simulation layer to reset and clears the simulation and drawing layer.
	 */
	resetSimulation() {
		let promisedResponses = this.workerSystem.promiseResponses(
			WorkerCommands.LifeSystemCommands.RESET,
			{ config: this.config }
		);

		return Promise.all(promisedResponses).then(() => {
			this.clearScene(Layers.SIM)
				.clearRender(Layers.SIM)
				.clearRender(Layers.DRAWING);
		});
	}

	setDisplayPreference(pref) {
		this.fullScreenDesired = pref;
	}

	getDisplayPreference() {
		return this.fullScreenDesired;
	}
}

module.exports = { AppStateManager, AppStateManagerEvents };
