/*
Next Steps
* Get Main.js under test.
* Optimize Worker messaging
* Move Cell into Entities.js
* Move QTNode into its own file.
* Rename entities.js and traits.js to be capitialized.
* Add page level error handling? 
  * Every cmd in a try/catch
  * A way to display errors to the user.
  * Still want trace info going to the console.
* Organize the JSDoc modules.
* Remove the conway_module directory. Flatten the code base.
* Add markdown to prettier.
*/

const { getElementById, setElementValue } = require('./dom/DomUtilities.js');

const Cell = require('./core/Quadtree.js').Cell;
const DefaultConfig = require('./core/DefaultConfig.js');
const { DrawingSceneBuilder } = require('./core/DrawingStateManager.js');
const LifeSceneBuilder = require('./core/LifeSceneBuilder.js');
const SceneManager = require('./core/SceneManager');

const HTMLCanvasRenderer = require('./renderer/HTMLCanvasRenderer.js');
const TraitBuilderFactory = require('./entity-system/TraitBuilderFactory.js');

//Workers
const WorkerSystem = require('./core/WorkerSystem.js');
const WorkerCommands = require('./workers/WorkerCommands.js');
const GridSystemWorker = require('worker-loader!./workers/GridSystem.worker.js');
const DrawingSystemWorker = require('worker-loader!./workers/DrawingSystem.worker.js');
const LifeSystemWorker = require('worker-loader!./workers/LifeSystem.worker.js');

/**
 * The names of the registered web workers.
 */
const Workers = {
	DRAWING_SYSTEM: 'DRAWING_SYSTEM_WORKER',
	LIFE_SYSTEM: 'LIFE_SYSTEM',
};

const MISSING_CELLS = 'Cells were not provided.';

/**
 * Represents the main thread of the simulation.
 */
class Main {
	/**
	 * Creates a new instance of the main thread.
	 * @param {HTMLCanvasElement} gridCanvas - The HTML canvas to use for rendering the grid.
	 * @param {HTMLCanvasElement} simCanvas - The HTML canvas to use for rendering the simulation.
	 * @param {HTMLCanvasElement} drawCanvas - The HTML canvas to use for drawing.
	 */
	constructor(gridCanvas, simCanvas, drawCanvas) {
		this.setupProperties(gridCanvas, simCanvas, drawCanvas)
			.setupRenderers()
			.setupScenes()
			.setupWorkers();
	}

	/**
	 * Initialize all properties for the main thread.
	 * @param {HTMLCanvasElement} gridCanvas - The HTML canvas to use for rendering the grid.
	 * @param {HTMLCanvasElement} simCanvas - The HTML canvas to use for rendering the simulation.
	 * @param {HTMLCanvasElement} drawCanvas - The HTML canvas to use for drawing.
	 * @private
	 * @returns {Main} Returns the instance of the main thread being modified.
	 */
	setupProperties(gridCanvas, simCanvas, drawCanvas) {
		this.config = DefaultConfig;
		this.drawingAllowed = true;
		this.gridCanvas = gridCanvas;
		this.simCanvas = simCanvas;
		this.drawCanvas = drawCanvas;
		return this;
	}

	/**
	 * Establishes the renderers.
	 * @private
	 * @returns {Main} Returns the instance of the main thread being modified.
	 */
	setupRenderers() {
		this.gridRender = new HTMLCanvasRenderer(
			this.gridCanvas.getContext('2d'),
			this.config
		);
		this.drawingSystemRender = new HTMLCanvasRenderer(
			this.drawCanvas.getContext('2d'),
			this.config
		);

		this.lifeSystemRender = new HTMLCanvasRenderer(
			this.simCanvas.getContext('2d'),
			this.config
		);
		return this;
	}

	/**
	 * Sets up the scenes.
	 * @private
	 * @returns {Main} Returns the instance of the main thread being modified.
	 */
	setupScenes() {
		this.drawingScene = new SceneManager();
		this.lifeScene = new SceneManager();
		return this;
	}

	/**
	 * Initializes and configures the web workers.
	 * @private
	 * @returns {Main} Returns the instance of the main thread being modified.
	 */
	setupWorkers() {
		this.gridWorker = new GridSystemWorker();
		this.drawingWorker = new DrawingSystemWorker();
		this.lifeWorker = new LifeSystemWorker();

		this.workerSystem = new WorkerSystem(window, this.config);
		this.gridWorker.onmessage = this.handleMessageFromGridWorker.bind(this);
		this.drawingWorker.onmessage = this.handleMsgFromDrawingWorker.bind(this);
		this.lifeWorker.onmessage = this.handleMessageFromLifeWorker.bind(this);

		//We don't want to fully register the gridWorker because it is only rendered on demand.
		this.gridWorker.onerror = this.workerSystem.workerErrorHandler.bind(
			this.workerSystem
		);

		this.workerSystem
			.registerWorker(Workers.DRAWING_SYSTEM, this.drawingWorker)
			.registerWorker(Workers.LIFE_SYSTEM, this.lifeWorker);
		return this;
	}

	/**
	 * Kicks off the main loop for all workers.
	 * @returns {Main} Returns the instance of the main thread being modified.
	 */
	initialize() {
		this.workerSystem.start();
		return this;
	}

	/**
	 * Render the grid canvas when a message is received from the GridSystemWorker.
	 * @param {*} envelope - The message sent.
	 * @private
	 */
	handleMessageFromGridWorker(envelope) {
		if (envelope && envelope.data) {
			let sceneObj = JSON.parse(envelope.data);
			let scene = SceneManager.fromObject(sceneObj, TraitBuilderFactory.select);
			let htmlCanvasContext = this.gridCanvas.getContext('2d');
			htmlCanvasContext.strokeStyle = '#757575';
			htmlCanvasContext.lineWidth = 0.5;
			this.gridRender.render(scene);
		}
	}

	/**
	 * Process a message received from the drawing system web worker.
	 * @param {*} envelope - The message sent.
	 * @private
	 */
	handleMsgFromDrawingWorker(envelope) {
		if (envelope && envelope.data) {
			envelope.data.promisedResponse
				? this.workerSystem.attemptToProcessPendingWork(envelope.data)
				: this.processMessageFromDrawingWorker(envelope.data);
		}
	}

	/**
	 * Process a message received from the life system web worker.
	 * @param {*} envelope - The message sent.
	 * @private
	 */
	handleMessageFromLifeWorker(envelope) {
		if (envelope && envelope.data) {
			envelope.data.promisedResponse
				? this.workerSystem.attemptToProcessPendingWork(envelope.data)
				: this.processMessageFromLifeSystemWorker(envelope.data);
		}
	}

	/**
	 * Process the various messages the drawing worker may send.
	 * @param {*} message - The message sent.
	 * @private
	 */
	processMessageFromDrawingWorker(message) {
		switch (message.command) {
			case WorkerCommands.LifeCycle.PROCESS_CYCLE:
				this.drawingScene.clear();
				DrawingSceneBuilder.buildScene(
					this.drawingScene,
					this.config,
					message.stack
				);
				this.drawingSystemRender.render(this.drawingScene);
				break;
			default:
				console.error(
					`An unexpected message was sent from the Drawing Worker. ${message}`
				);
		}
	}

	/**
	 * Process the various messages the drawing worker may send.
	 * @param {*} message - The message sent.
	 * @private
	 */
	processMessageFromLifeSystemWorker(message) {
		switch (message.command) {
			case WorkerCommands.LifeCycle.PROCESS_CYCLE:
				this.lifeScene.clear();
				LifeSceneBuilder.buildScene(this.lifeScene, this.config, message.stack);
				this.lifeSystemRender.render(this.lifeScene);

				//update the related controls.
				setElementValue('alive_cells_count', message.aliveCellsCount);
				setElementValue(
					'sim_generation_count',
					message.numberOfSimulationIterations
				);
				break;
			default:
				console.error(
					`An unexpected message was sent from the Life System Worker. ${message}`
				);
		}
	}

	/**
	 * Register all event listeners on the hosting window.
	 * @param {Window} window - The Window object.
	 * @returns {Main} Returns the instance of the main thread being modified.
	 */
	registerEventHandlers(window) {
		window.addEventListener('load', this.handlePageLoad.bind(this));
		window.addEventListener('resize', this.handlePageResize.bind(this));
		this.drawCanvas.addEventListener(
			'click',
			this.handleDrawCanvasClicked.bind(this)
		);
		return this;
	}

	/**
	 * Event handler for reacting to when the hosting web page is loaded.
	 * @param {*} event
	 * @private
	 */
	handlePageLoad(event) {
		this.sizeCanvas();
		let now = window.performance.now();
		this.workerSystem.main(now);
		this.allowDrawing();
	}

	/**
	 * Event handler for reacting to when the hosting web page is resized.
	 * @param {*} event
	 * @private
	 */
	handlePageResize(event) {
		this.sizeCanvas().handleGridBackgroundClicked();
	}

	/**
	 * Event handler for processing a user click when in drawing mode.
	 * @param {Event} clickEvent Event generated when the draw canvas is clicked.
	 */
	handleDrawCanvasClicked(clickEvent) {
		if (this.drawingAllowed) {
			//Get Pixel clicked.
			let boundary = this.drawCanvas.getBoundingClientRect();
			let px = clickEvent.clientX - boundary.left;
			let py = clickEvent.clientY - boundary.top;

			//Project to a Cell
			let cx = Math.floor(px / this.config.zoom);
			let cy = Math.floor(py / this.config.zoom);

			this.drawingWorker.postMessage({
				command: WorkerCommands.DrawingSystemCommands.TOGGLE_CELL,
				cx: cx,
				cy: cy,
			});
		}
	}

	/**
	 * Enables drawing mode.
	 * @private
	 * @returns {Main} Returns the instance of the main thread being modified.
	 */
	allowDrawing() {
		this.drawingAllowed = true;
		this.drawingWorker.postMessage({
			command: WorkerCommands.LifeCycle.START,
		});
		return this;
	}

	/**
	 * Disables drawing mode.
	 * @private
	 * @returns {Main} Returns the instance of the main thread being modified.
	 */
	preventDrawing() {
		this.drawingAllowed = false;
		this.drawingWorker.postMessage({
			command: WorkerCommands.LifeCycle.STOP,
		});
		return this;
	}

	/**
	 * Sets the simulation's seeder based on the UI.
	 */
	setSeedingOption() {
		switch (getElementById('seed').value) {
			case 'draw':
				this.resetSimulation();
				this.allowDrawing();
				break;
			default:
				this.preventDrawing();
				this.resetSimulation();
				break;
		}
	}

	/**
	 * Starts and stops the simulation.
	 */
	toggleSimulation() {
		let button = getElementById('play_pause_button');
		let isInDrawingMode = getElementById('seed').value === 'draw';
		switch (button.innerText) {
			case 'Start':
				this.transitionToThePauseButton().preventDrawing().startSimulation();
				break;
			case 'Pause':
				this.transitionToTheResumeButton().stopSimulation();
				isInDrawingMode && this.pauseSimulationInDrawingMode();
				break;
			case 'Resume':
				this.transitionToThePauseButton().preventDrawing();
				isInDrawingMode ? this.startSimulation() : this.resumeSimulation();
				break;
			default:
				break;
		}
	}

	/**
	 * Changes the current state of the simulation button.
	 * @private
	 * @returns {Main} Returns the instance of the main thread being modified.
	 */
	transitionToThePauseButton() {
		getElementById('play_pause_button').innerText = 'Pause';
		return this;
	}

	/**
	 * Changes the current state of the simulation button.
	 * @private
	 * @returns {Main} Returns the instance of the main thread being modified.
	 */
	transitionToTheResumeButton() {
		getElementById('play_pause_button').innerText = 'Resume';
		return this;
	}

	/**
	 * Changes the current state of the simulation button.
	 * @private
	 * @returns {Main} Returns the instance of the main thread being modified.
	 */
	transitionToThePauseButton() {
		getElementById('play_pause_button').innerText = 'Pause';
		return this;
	}

	/**
	 * Orchestrates the drawing and life web workers to pause both systems.
	 * @private
	 * @returns {Main} Returns the instance of the main thread being modified.
	 */
	pauseSimulationInDrawingMode() {
		this.workerSystem
			.promiseResponse(
				Workers.LIFE_SYSTEM,
				WorkerCommands.LifeSystemCommands.SEND_CELLS
			)
			.then((response) => {
				this.drawingWorker.postMessage({
					command: WorkerCommands.DrawingSystemCommands.SET_CELLS,
					cells: response.cells,
				});
				this.lifeWorker.postMessage({
					command: WorkerCommands.LifeSystemCommands.RESET,
					config: this.config,
				});
			})
			.catch((reason) => {
				throw new Error(
					`There was an error trying to pause the simulation.\n${reason}`
				);
			})
			.finally(() => {
				this.lifeSystemRender.clear();
				this.allowDrawing();
			});
		return this;
	}

	/**
	 * Resets all web workers and the UI.
	 */
	resetSimulation() {
		this.stopSimulation();
		let button = getElementById('play_pause_button');
		button.innerText = 'Start';
		setElementValue('alive_cells_count', 0);
		setElementValue('sim_generation_count', 0);

		let promisedResponses = this.workerSystem.promiseResponses(
			WorkerCommands.LifeSystemCommands.RESET,
			{ config: this.config }
		);

		Promise.all(promisedResponses).then(() => {
			this.lifeScene.clear();
			this.lifeSystemRender.clear();
			this.drawingSystemRender.clear();
		});
	}

	/**
	 * Event handler for when the grid checkbox is clicked.
	 */
	handleGridBackgroundClicked() {
		getElementById('display_grid_background').checked
			? this.requestToDrawGrid()
			: this.requestToClearGrid();
	}

	/**
	 * Requests the grid worker to generate a grid scene.
	 * @private
	 */
	requestToDrawGrid() {
		let cellSize = getCellSize();
		this.gridWorker.postMessage({
			command: 'CREATE_GRID',
			parameters: {
				cellWidth: cellSize,
				cellHeight: cellSize,
				gridWidth: this.config.canvas.width,
				gridHeight: this.config.canvas.height,
			},
		});
	}

	/**
	 * Clears the grid renderer.
	 * @private
	 */
	requestToClearGrid() {
		this.gridRender.clear();
	}

	/**
	 * Starts the simulation.
	 * @private
	 */
	startSimulation() {
		this.workerSystem
			.promiseResponse(
				Workers.DRAWING_SYSTEM,
				WorkerCommands.DrawingSystemCommands.SEND_CELLS
			)
			.then((response) => {
				return this.resetDrawingSystem(response);
			})
			.then((drawingCells) => {
				this.updateConfiguredZoom().updateConfiguredLandscape();
				return this.setSeederOnLifeSystem(drawingCells);
			})
			.then(() => {
				this.lifeWorker.postMessage({
					command: WorkerCommands.LifeCycle.START,
				});
			})
			.catch((reason) => {
				console.error(
					`There was an error trying to build the seeder.\n${reason}`
				);
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
			Workers.LIFE_SYSTEM,
			WorkerCommands.LifeSystemCommands.SET_SEEDER,
			{
				seedSetting: getElementById('seed').value,
				config: this.config,
				cells: drawingCells,
			}
		);
	}

	/**
	 * Command the drawing system to reset with the provided configuration.
	 * @private
	 * @param {*} response
	 * @returns {Promise} Promise to invoke the drawing system worker.
	 */
	resetDrawingSystem(response) {
		return new Promise((resolve, reject) => {
			this.drawingWorker.postMessage({
				command: WorkerCommands.DrawingSystemCommands.RESET,
				config: this.config,
			});
			this.drawingSystemRender.clear();
			response.cells ? resolve(response.cells) : reject(MISSING_CELLS);
		});
	}

	/**
	 * Updates the zoom setting all threads should use.
	 * @private
	 * @returns {Main} Returns the instance of the main thread being modified.
	 */
	updateConfiguredZoom() {
		this.config.zoom = getCellSize();
		return this;
	}

	/**
	 * Updates the landscape dimensions all threads should use.
	 * @private
	 * @returns {Main} Returns the instance of the main thread being modified.
	 */
	updateConfiguredLandscape() {
		this.config.landscape.width = this.config.canvas.width / this.config.zoom;
		this.config.landscape.height = this.config.canvas.height / this.config.zoom;
		return this;
	}

	/**
	 * Command the life worker to stop the simulation.
	 * @private
	 */
	stopSimulation() {
		this.lifeWorker.postMessage({
			command: WorkerCommands.LifeCycle.STOP,
		});
	}

	/**
	 * Command the life worker to start the simulation.
	 * @private
	 */
	resumeSimulation() {
		this.lifeWorker.postMessage({
			command: WorkerCommands.LifeCycle.START,
		});
	}

	/**
	 * Command all registered workers to set their display storage setting.
	 * @private
	 */
	toggleDisplayStorageStructure() {
		this.workerSystem.broadcast({
			command: WorkerCommands.LifeSystemCommands.DISPLAY_STORAGE,
			displayStorage: getElementById('display_storage').checked,
		});
	}

	/**
	 * Command all registered workers to set their cell size.
	 */
	changedCellSize() {
		this.workerSystem.broadcast({
			command: WorkerCommands.LifeSystemCommands.SET_CELL_SIZE,
			cellSize: getCellSize(),
		});
		this.handleGridBackgroundClicked();
	}

	/**
	 * Override the current configuration to size the HTML Canvas
	 * to fit the document.
	 * @param {*} config
	 */
	sizeCanvas() {
		this.config.canvas.height = this.calculateConfiguredCanvasHeight();
		let canvasContainerDiv = getElementById('canvas_container');

		//WARNING: Setting the canvas height changes the body
		//width so always set the height before the width.
		canvasContainerDiv.style.height = `${this.config.canvas.height}px`;
		this.gridCanvas.setAttribute('height', this.config.canvas.height);
		this.simCanvas.setAttribute('height', this.config.canvas.height);
		this.drawCanvas.setAttribute('height', this.config.canvas.height);

		this.config.canvas.width = document.body.clientWidth;
		canvasContainerDiv.style.width = `${this.config.canvas.width}px`;
		this.gridCanvas.setAttribute('width', this.config.canvas.width);
		this.simCanvas.setAttribute('width', this.config.canvas.width);
		this.drawCanvas.setAttribute('width', this.config.canvas.width);
		return this;
	}

	/**
	 * Calculate the new height of the canvas elements.
	 * @returns {number} The intended canvas height.
	 */
	calculateConfiguredCanvasHeight() {
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
} //End of Main Class

/**
 * Helper function for finding the cell size as a number.
 * @returns {number} The cell size.
 */
function getCellSize() {
	return Number.parseInt(getElementById('cell_size').value);
}

module.exports = Main;
