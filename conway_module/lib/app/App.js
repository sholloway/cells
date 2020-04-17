/*
Next Steps
* Get app module under test.
* Get DOMUtils under test.
* Move Cell into Entities.js
* Move QTNode into its own file.
* Rename entities.js and traits.js to be capitialized.
* Remove index.js and just use Main.js.
* Get a handle on the FPS calculation. Is it really 8 FPS? 
* Optimize Worker messaging
* Add page level error handling? 
  * Every cmd in a try/catch
  * A way to display errors to the user.
  * Still want trace info going to the console.
* Organize the JSDoc modules.
* Remove the conway_module directory. Flatten the code base.
* Add markdown to prettier.
* Search for all NOTE and TODO comments.
* Get webpack.prod.js working to enable hosting. Don't host the dev version.
* Host this.
*/

const Layers = require('./AppLayers.js');
const AppBuilder = require('./AppBuilder.js');
const { getElementById, setElementValue } = require('../dom/DomUtilities.js');
const Cell = require('../core/Quadtree.js').Cell;

const WorkerCommands = require('./../workers/WorkerCommands.js');

const Workers = require('../workers/WorkerNames.js');
const { sizeCanvas } = require('../ui/CanvasUtilities.js');

const { getCellSize } = require('../ui/UIConfigurationUtilities.js');

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
	static buildInstance(
		gridCanvas,
		simCanvas,
		drawCanvas,
		instance = new Main()
	) {
		return AppBuilder.buildApp(gridCanvas, simCanvas, drawCanvas, instance);
	}

	/**
	 * Kicks off the main loop for all workers.
	 * @returns {Main} Returns the instance of the main thread being modified.
	 */
	initialize() {
		this.stateManager.startMainLoop();
		return this;
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
		sizeCanvas(this);
		let now = this.getWindow().performance.now();
		this.stateManager.start(now);
	}

	/**
	 * A getter for the window object. Aids with testings.
	 */
	getWindow() {
		return typeof window !== 'undefined' ? window : this.window;
	}

	/**
	 * Event handler for reacting to when the hosting web page is resized.
	 * @param {*} event
	 * @private
	 */
	handlePageResize(event) {
		sizeCanvas(this);
		this.handleGridBackgroundClicked();
	}

	/**
	 * Event handler for processing a user click when in drawing mode.
	 * @param {Event} clickEvent Event generated when the draw canvas is clicked.
	 */
	handleDrawCanvasClicked(clickEvent) {
		if (this.stateManager.isDrawingAllowed()) {
			//Get Pixel clicked.
			let boundary = this.drawCanvas.getBoundingClientRect();
			let px = clickEvent.clientX - boundary.left;
			let py = clickEvent.clientY - boundary.top;

			//Project to a Cell
			let cx = Math.floor(px / this.config.zoom);
			let cy = Math.floor(py / this.config.zoom);

			this.stateManager.sendWorkerMessage(Layers.DRAWING, {
				command: WorkerCommands.DrawingSystemCommands.TOGGLE_CELL,
				cx: cx,
				cy: cy,
			});
		}
	}

	/**
	 * Sets the simulation's seeder based on the UI.
	 */
	setSeedingOption() {
		switch (getElementById('seed').value) {
			case 'draw':
				this.resetSimulation();
				this.stateManager.allowDrawing();
				break;
			default:
				this.stateManager.preventDrawing();
				this.resetSimulation();
				break;
		}
	}
	//HERE

	/**
	 * Resets all web workers and the UI.
	 */
	resetSimulation() {
		this.stateManager.stopSimulation();
		this.transitionToTheStartButton()
			.resetAliveCellsComponent()
			.resetSimGenerationCountComponent();

		return this.stateManager.resetSimulation();
	}

	/**
	 * Starts and stops the simulation.
	 */
	toggleSimulation() {
		let button = getElementById('play_pause_button');
		let isInDrawingMode = getElementById('seed').value === 'draw';
		switch (button.innerText) {
			case 'Start':
				this.transitionToThePauseButton();
				this.stateManager.preventDrawing();
				this.stateManager.startSimulation();
				break;
			case 'Pause':
				this.transitionToTheResumeButton();
				this.stateManager.stopSimulation();
				isInDrawingMode && this.stateManager.pauseSimulationInDrawingMode();
				break;
			case 'Resume':
				this.transitionToThePauseButton();
				this.stateManager.preventDrawing();
				isInDrawingMode
					? this.stateManager.startSimulation()
					: this.stateManager.resumeSimulation();
				break;
			default:
				throw new Error('Unknown button state.');
		}
	}

	/**
	 * Changes the current state of the simulation button.
	 * @private
	 * @returns {Main} Returns the instance of the main thread being modified.
	 */
	transitionToTheStartButton() {
		getElementById('play_pause_button').innerText = 'Start';
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

	resetAliveCellsComponent() {
		setElementValue('alive_cells_count', 0);
		return this;
	}

	resetSimGenerationCountComponent() {
		setElementValue('sim_generation_count', 0);
		return this;
	}

	/**
	 * Event handler for when the grid checkbox is clicked.
	 */
	handleGridBackgroundClicked() {
		getElementById('display_grid_background').checked
			? this.requestToDrawGrid()
			: this.stateManager.clearRender(Layers.GRID);
	}

	/**
	 * Requests the grid worker to generate a grid scene.
	 * @private
	 */
	requestToDrawGrid() {
		let cellSize = getCellSize();
		this.stateManager.sendWorkerMessage(Layers.GRID, {
			command: WorkerCommands.LifeCycle.PROCESS_CYCLE,
			parameters: {
				cellWidth: cellSize,
				cellHeight: cellSize,
				gridWidth: this.config.canvas.width,
				gridHeight: this.config.canvas.height,
			},
		});
	}

	/**
	 * Command all registered workers to set their display storage setting.
	 */
	toggleDisplayStorageStructure() {
		this.stateManager.broadcast({
			command: WorkerCommands.LifeSystemCommands.DISPLAY_STORAGE,
			displayStorage: getElementById('display_storage').checked,
		});
	}

	/**
	 * Command all registered workers to set their cell size.
	 */
	changedCellSize() {
		this.stateManager.broadcast({
			command: WorkerCommands.LifeSystemCommands.SET_CELL_SIZE,
			cellSize: getCellSize(),
		});
		this.handleGridBackgroundClicked();
	}

	/**
	 * Updates the UI based on a message sent from a web worker.
	 * If the value is present in the message, the corrisponding UI component is updated.
	 * @param {*} message
	 * @returns {AppStateManager} The instance.
	 */
	updateUI(message) {
		message.aliveCellsCount &&
			setElementValue('alive_cells_count', message.aliveCellsCount);

		message.numberOfSimulationIterations &&
			setElementValue(
				'sim_generation_count',
				message.numberOfSimulationIterations
			);
		return this;
	}
} //End of Main Class

module.exports = Main;
