/*
Next Steps
* Full Screen Drawing
	* From full screen, should be able to start the simulation.
* Add a CSS spinner/Progress bar for generating seeder and templates.
* Make the seed generation display before starting the simulation.
* Controll CSS with webpack.
* Toggle: Transferable Array Buffers
* Make sure the entire code base is over 90% test coverage
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
const {
	getElementById,
	querySelector,
	querySelectorAll,
	setElementValue,
} = require('../dom/DomUtilities.js');
const { Cell } = require('./../entity-system/Entities.js');

const WorkerCommands = require('./../workers/WorkerCommands.js');

const Workers = require('../workers/WorkerNames.js');
const { convertToCell, sizeCanvas } = require('../ui/CanvasUtilities.js');

const {
	updateConfiguredZoom,
	updateConfiguredLandscape,
	getCellSize,
} = require('../ui/UIConfigurationUtilities.js');

const TemplateFactory = require('./../templates/TemplateFactory.js');

const DISPLAY_TRANSITION_ERR_MSG =
	'There was an error attempting to change display modes.';

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
		this.canvasContextMenu.initialize(
			querySelector('.context-menu'),
			this.canvasContextMenuEventHandler.bind(this)
		);
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
		this.drawCanvas.addEventListener(
			'mousemove',
			this.handleDrawCanvasMouseMoved.bind(this)
		);
		//  = function(e){}
		return this;
	}

	handleDrawCanvasMouseMoved(event) {
		let boundary = this.drawCanvas.getBoundingClientRect();
		let cellLocation = convertToCell(event, boundary, this.config.zoom);
		this.stateManager.setActiveCell(cellLocation);
	}

	/**
	 * Event handler for reacting to when the hosting web page is loaded.
	 * @param {*} event
	 * @private
	 */
	handlePageLoad(event) {
		sizeCanvas(this);
		updateConfiguredLandscape(this.config);
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
		updateConfiguredZoom(this.config);
		updateConfiguredLandscape(this.config);
		this.handleGridBackgroundClicked();
	}

	/**
	 * Event handler for processing a user click when in drawing mode.
	 * @param {Event} clickEvent Event generated when the draw canvas is clicked.
	 */
	handleDrawCanvasClicked(clickEvent) {
		if (this.canvasContextMenu.isVisibile()) {
			this.canvasContextMenu.hideMenu();
			return;
		}

		if (this.stateManager.isDrawingAllowed()) {
			let boundary = this.drawCanvas.getBoundingClientRect();
			let cellLocation = convertToCell(clickEvent, boundary, this.config.zoom);
			this.stateManager.sendWorkerMessage(Layers.DRAWING, {
				command: WorkerCommands.DrawingSystemCommands.TOGGLE_CELL,
				cx: cellLocation.x,
				cy: cellLocation.y,
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

	setTopology() {
		this.config.landscape.topology = getElementById('topology').value;
		this.stateManager.setTopology();
	}

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
		let promise;
		switch (button.innerText) {
			case 'Start':
				promise = this.handleStartButtonClicked();
				break;
			case 'Pause':
				promise = this.handlePauseButtonClicked(isInDrawingMode);
				break;
			case 'Resume':
				promise = this.handleResumeButtonClicked(isInDrawingMode);
				break;
			default:
				throw new Error('Unknown button state.');
		}
		return promise;
	}

	handleStartButtonClicked() {
		return new Promise((resolve, reject) => {
			this.transitionToThePauseButton();
			this.displayManager
				.setDisplayMode(this.stateManager.getDisplayPreference())
				.catch((reason) => {
					console.error(DISPLAY_TRANSITION_ERR_MSG);
					console.error(reason);
				})
				.then(() => {
					document.fullscreenElement && this.handlePageResize();
					this.stateManager.preventDrawing();
					this.stateManager.startSimulation();
				});
		});
	}

	handlePauseButtonClicked(isInDrawingMode) {
		this.transitionToTheResumeButton();
		this.stateManager.stopSimulation();
		isInDrawingMode && this.stateManager.pauseSimulationInDrawingMode();
	}

	handleResumeButtonClicked(isInDrawingMode) {
		this.transitionToThePauseButton();
		this.displayManager
			.setDisplayMode(this.stateManager.getDisplayPreference())
			.catch((reason) => {
				console.error(DISPLAY_TRANSITION_ERR_MSG);
				console.error(reason);
			})
			.then(() => {
				document.fullscreenElement && this.handlePageResize();
				this.stateManager.preventDrawing();
				isInDrawingMode
					? this.stateManager.startSimulation()
					: this.stateManager.resumeSimulation();
			});
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
	 * @returns {App} The instance.
	 */
	updateUI(message) {
		message.aliveCellsCount &&
			setElementValue('alive_cells_count', message.aliveCellsCount);

		message.numberOfSimulationIterations &&
			setElementValue(
				'sim_generation_count',
				message.numberOfSimulationIterations
			);

		if (message.simulationStopped) {
			document && document.exitFullscreen();
			this.resetSimulation();
		}
		return this;
	}

	handleFullScreenClicked() {
		this.stateManager.setDisplayPreference(
			getElementById('display_fullscreen').checked
		);
	}

	displayContextMenu(clickEvent) {
		clickEvent.preventDefault();
		let boundary = this.drawCanvas.getBoundingClientRect();
		this.canvasContextMenu.setMenuPosition(
			clickEvent,
			boundary,
			this.config.zoom
		);
		return false;
	}

	/**
	 * Handles processing the context menu item clicked.
	 * @param {number} row - The horizontal coordinate of the cell clicked.
	 * @param {number} col - The vertical coordinate of the cell clicked.
	 * @param {string} cmdName - The command clicked in the context menu
	 */
	canvasContextMenuEventHandler(row, col, cmdName) {
		if (cmdName === 'start-sim') {
			this.handleStartButtonClicked();
			return;
		} else if (cmdName === 'reset') {
			this.resetSimulation();
			this.stateManager.allowDrawing();
			return;
		}

		let cells = TemplateFactory.generate(cmdName, row, col, this.config);
		if (cells.length > 0) {
			this.stateManager
				.promiseResponse(
					Layers.DRAWING,
					WorkerCommands.DrawingSystemCommands.SEND_CELLS
				)
				.then((response) => {
					Cell.mergeObjsWithCells(cells, response.cells);
					this.stateManager.sendWorkerMessage(Layers.DRAWING, {
						command: WorkerCommands.DrawingSystemCommands.SET_CELLS,
						cells: cells,
					});
				});
		}
	}

	launchFullScreen() {
		return new Promise((resolve, reject) => {
			this.displayManager
				.setDisplayMode(true)
				.catch((reason) => {
					console.error(DISPLAY_TRANSITION_ERR_MSG);
					console.error(reason);
				})
				.then(() => {
					document.fullscreenElement && this.handlePageResize();
				});
		});
	}
} //End of Main Class

module.exports = Main;
