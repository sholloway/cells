const Layers = require('./AppLayers.js');
const AppBuilder = require('./AppBuilder.js');
const {
	getElementById,
	querySelector,
	querySelectorAll,
	setElementValue,
} = require('../dom/DomUtilities.js');
const { Cell } = require('../entity-system/Entities.js');

const WorkerCommands = require('../workers/WorkerCommands.js');

const Workers = require('../workers/WorkerNames.js');
const { convertToCell, sizeCanvas } = require('../ui/CanvasUtilities.js');

const {
	updateConfiguredLandscape,
} = require('../ui/UIConfigurationUtilities.js');

const TemplateFactory = require('../templates/TemplateFactory.js');

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
		startButton,
		instance = new Main()
	) {
		return AppBuilder.buildApp(
			gridCanvas,
			simCanvas,
			drawCanvas,
			startButton,
			instance
		);
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
		this.drawCanvas.addEventListener(
			'mousemove',
			this.handleDrawCanvasMouseMoved.bind(this)
		);

		this.startButton.addEventListener(
			'sim-event-start-requested',
			this.handleStartButtonClicked.bind(this)
		);

		this.startButton.addEventListener(
			'sim-event-pause-requested',
			this.handlePauseButtonClicked.bind(this)
		);

		this.startButton.addEventListener(
			'sim-event-resume-requested',
			this.handleResumeButtonClicked.bind(this)
		);

		getElementById('reset_button').addEventListener(
			'sim-reset-requested',
			this.resetSimulation.bind(this)
		);

		getElementById('fullscreen_button').addEventListener(
			'fullscreen-requested',
			this.launchFullScreen.bind(this)
		);

		querySelector('shape-picker').addEventListener(
			'cell-shape-changed',
			this.setCellShapeOption.bind(this)
		);

		querySelector('cell-size-control').addEventListener(
			'cell-size-changed',
			this.changedCellSize.bind(this)
		);

		getElementById('display_quadtree').addEventListener(
			'dispay-tree-toggle',
			this.toggleDisplayStorageStructure.bind(this)
		);

		getElementById('display_grid').addEventListener(
			'dispay-grid-toggle',
			this.handleGridBackgroundClicked.bind(this)
		);

		getElementById('display_fullscreen').addEventListener(
			'enable-fullscreen-toggle',
			this.handleFullScreenClicked.bind(this)
		);

		querySelector('context-menu').addEventListener(
			'context-menu-command',
			this.handleContextMenuCommand.bind(this)
		);

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
		updateConfiguredLandscape(this.config);
		this.refreshGrid();
	}

	/**
	 * Event handler for processing a user click when in drawing mode.
	 * @param {Event} clickEvent Event generated when the draw canvas is clicked.
	 */
	handleDrawCanvasClicked(clickEvent) {
		let menu = querySelector('context-menu');
		if (menu.display) {
			menu.display = false;
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

	setCellShapeOption(event) {
		this.config.cell.shape = event.detail.shape;
	}

	/**
	 * Resets all web workers and the UI.
	 */
	resetSimulation() {
		this.stateManager.stopSimulation();
		querySelector('context-menu').updateCommandState = JSON.stringify({
			key: 'runSim',
			activeState: 'start',
		});
		this.transitionToTheStartButton()
			.resetAliveCellsComponent()
			.resetSimGenerationCountComponent();
		return this.stateManager.allowDrawing().resetSimulation();
	}

	handleStartButtonClicked() {
		querySelector('context-menu').updateCommandState = JSON.stringify({
			key: 'runSim',
			activeState: 'pause',
		});
		return new Promise((resolve, reject) => {
			Promise.resolve(
				this.displayManager.setDisplayMode(
					this.stateManager.getDisplayPreference()
				)
			)
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

	handlePauseButtonClicked() {
		this.stateManager.stopSimulation();
		this.stateManager.pauseSimulationInDrawingMode();
		querySelector('context-menu').updateCommandState = JSON.stringify({
			key: 'runSim',
			activeState: 'resume',
		});
	}

	handleResumeButtonClicked() {
		querySelector('context-menu').updateCommandState = JSON.stringify({
			key: 'runSim',
			activeState: 'pause',
		});
		Promise.resolve(
			this.displayManager.setDisplayMode(
				this.stateManager.getDisplayPreference()
			)
		)
			.catch((reason) => {
				console.error(DISPLAY_TRANSITION_ERR_MSG);
				console.error(reason);
			})
			.then(() => {
				document.fullscreenElement && this.handlePageResize();
				this.stateManager.preventDrawing();
				this.stateManager.startSimulation();
			});
	}

	/**
	 * Changes the current state of the simulation button.
	 * @private
	 * @returns {Main} Returns the instance of the main thread being modified.
	 */
	transitionToTheStartButton() {
		this.startButton.state = 'IDLE';
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
	handleGridBackgroundClicked(event) {
		this.stateManager.displayGrid = event.detail.checked;
		this.refreshGrid();
	}

	refreshGrid() {
		this.stateManager.displayGrid
			? this.requestToDrawGrid()
			: this.stateManager.clearRender(Layers.GRID);
	}

	/**
	 * Requests the grid worker to generate a grid scene.
	 * @private
	 */
	requestToDrawGrid() {
		this.stateManager.sendWorkerMessage(Layers.GRID, {
			command: WorkerCommands.LifeCycle.PROCESS_CYCLE,
			parameters: {
				cellWidth: this.config.zoom,
				cellHeight: this.config.zoom,
				gridWidth: this.config.canvas.width,
				gridHeight: this.config.canvas.height,
			},
		});
	}

	/**
	 * Command all registered workers to set their display storage setting.
	 */
	toggleDisplayStorageStructure(event) {
		this.stateManager.broadcast({
			command: WorkerCommands.LifeSystemCommands.DISPLAY_STORAGE,
			displayStorage: event.detail.checked,
		});
	}

	/**
	 * Command all registered workers to set their cell size.
	 */
	changedCellSize(event) {
		this.config.zoom = event.detail.cellSize;
		//Inform the drawing system and Life Simulation of the change.
		this.stateManager.broadcast({
			command: WorkerCommands.LifeSystemCommands.SET_CELL_SIZE,
			cellSize: this.config.zoom,
		});
		this.refreshGrid();
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

		if (message.origin && message.origin == Layers.DRAWING && message.stack) {
			this.manageStartButtonEnablement(
				this.stateManager.getDrawingCellsCount(),
				message.stack.length
			);
			this.stateManager.setDrawingCellsCount(message.stack.length);
		}

		if (message.simulationStopped) {
			document && document.fullscreenElement && document.exitFullscreen();
			this.resetSimulation();
		}
		return this;
	}

	/** 
		Enables or disables the start button based on if the drawing contains
		any cells. 

   	Rules: 
    	- When the drawing cell count drops to zero, disable Start Button.
    	- When the drawing cell count increases past zero enable the start button.
	*/
	manageStartButtonEnablement(currentDrawingCellsCount, nextDrawingCellsCount) {
		if (currentDrawingCellsCount == 0 && nextDrawingCellsCount > 0) {
			this.startButton.enabled = true;
		} else if (currentDrawingCellsCount > 0 && nextDrawingCellsCount == 0) {
			this.startButton.enabled = false;
		}
	}

	handleFullScreenClicked(event) {
		this.stateManager.setDisplayPreference(event.detail.checked);
	}

	displayContextMenu(clickEvent) {
		clickEvent.preventDefault();
		let boundary = this.drawCanvas.getBoundingClientRect();
		let contextMenu = querySelector('context-menu');

		contextMenu.menuPosition = {
			clickEvent: clickEvent,
			boundary: boundary,
			zoom: this.config.zoom,
		};

		contextMenu.display = true;
		return false;
	}

	/**
	 * Handles processing the context menu item clicked.
	 * @param {number} row - The horizontal coordinate of the cell clicked.
	 * @param {number} col - The vertical coordinate of the cell clicked.
	 * @param {string} cmdName - The command clicked in the context menu
	 */
	handleContextMenuCommand(event) {
		event.detail.simCommand
			? this.processContextMenuSimCommand(event)
			: this.stateManager.sendWorkerMessage(Layers.DRAWING, {
					command: WorkerCommands.DrawingSystemCommands.DRAW_TEMPLATE,
					templateName: event.detail.command,
					row: event.detail.row,
					col: event.detail.col,
					config: this.config,
			  });
	}

	processContextMenuSimCommand(event) {
		switch (event.detail.command) {
			case 'start-sim':
				this.startButton.state = 'RUNNING';
				this.handleStartButtonClicked();
				break;
			case 'pause-sim':
				this.startButton.state = 'PAUSED';
				this.handlePauseButtonClicked();
				break;
			case 'resume-sim':
				this.startButton.state = 'RUNNING';
				this.handleResumeButtonClicked();
				break;
			case 'reset':
				this.resetSimulation();
				break;
			default:
				throw new Error('Unknown context menu command.');
		}
		return;
	}

	launchFullScreen() {
		return new Promise((resolve, reject) => {
			Promise.resolve(this.displayManager.setDisplayMode(true))
				.catch((reason) => {
					console.error(DISPLAY_TRANSITION_ERR_MSG);
					console.error(reason);
					reject();
				})
				.then(() => {
					document.fullscreenElement && this.handlePageResize();
					resolve();
				});
		});
	}
} //End of Main Class

module.exports = Main;
