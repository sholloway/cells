const Layers = require('../app/AppLayers.js');
const WorkerCommands = require('../workers/WorkerCommands.js');
const { convertToCell } = require('../ui/CanvasUtilities.js');
const {
	updateConfiguredLandscape,
} = require('../ui/UIConfigurationUtilities.js');

const DISPLAY_TRANSITION_ERR_MSG =
	'There was an error attempting to change display modes.';

class AppEventHandler {
	constructor(app, shadowRoot, config, stateManager, displayManager) {
		this.app = app;
		this.shadowRoot = shadowRoot;
		this.config = config;
		this.stateManager = stateManager;
		this.displayManager = displayManager;
	}

	gameChanged(event) {
		this.config.game.activeGame = event.detail.game;
		this.stateManager.sendWorkerMessage(Layers.SIM, {
			command: WorkerCommands.LifeSystemCommands.SET_CONFIG,
			config: this.config,
		});
	}

	/**
	 * Command all registered workers to set their cell size.
	 */
	cellSizeChanged(event) {
		this.config.zoom = event.detail.cellSize;
		updateConfiguredLandscape(this.config);
		//Inform the drawing system and Life Simulation of the change.
		this.stateManager.broadcast({
			command: WorkerCommands.LifeSystemCommands.SET_CELL_SIZE,
			cellSize: this.config.zoom,
		});
		this.refreshGrid();
		this.setflagAsDirty(Layers.DRAWING);
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

	setflagAsDirty(workerName) {
		this.stateManager.workerSystem.setWorkerDirtyFlag(workerName, true);
		return this;
	}

	gameSpeedChanged(event) {
		this.config.game.tickLength = event.detail.fps.tickLength;
		this.stateManager.sendWorkerMessage(Layers.SIM, {
			command: WorkerCommands.LifeSystemCommands.SET_CONFIG,
			config: this.config,
		});
	}

	startButtonClicked() {
		this.shadowRoot.querySelector(
			'context-menu'
		).updateCommandState = JSON.stringify({
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
					document.fullscreenElement && this.app.handlePageResize();
					this.stateManager.preventDrawing();
					this.stateManager.startSimulation();
				});
		});
	}

	pauseButtonClicked() {
		this.stateManager.stopSimulation();
		this.stateManager.pauseSimulationInDrawingMode();
		this.shadowRoot.querySelector(
			'context-menu'
		).updateCommandState = JSON.stringify({
			key: 'runSim',
			activeState: 'resume',
		});
		this.setflagAsDirty(Layers.DRAWING);
	}

	resumeButtonClicked() {
		this.shadowRoot.querySelector(
			'context-menu'
		).updateCommandState = JSON.stringify({
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
				document.fullscreenElement && this.app.handlePageResize();
				this.stateManager.preventDrawing();
				this.stateManager.startSimulation();
			});
	}

	/**
	 * Resets all web workers and the UI.
	 */
	resetSimulation() {
		this.stateManager.stopSimulation();
		this.shadowRoot.querySelector(
			'context-menu'
		).updateCommandState = JSON.stringify({
			key: 'runSim',
			activeState: 'start',
		});
		this.transitionToTheStartButton()
			.setAliveCellsCount(0)
			.setSimGenerationCountComponent(0);
		return this.stateManager.allowDrawing().resetSimulation();
	}

	launchFullScreen() {
		return new Promise((resolve, reject) => {
			let container = this.shadowRoot.getElementById('canvas_container');
			Promise.resolve(this.displayManager.setDisplayMode(true, container))
				.catch((reason) => {
					console.error(DISPLAY_TRANSITION_ERR_MSG);
					console.error(reason);
					reject();
				})
				.then(() => {
					document.fullscreenElement && this.app.handlePageResize();
					resolve();
				});
		});
	}

	/**
	 * Event handler for when the grid checkbox is clicked.
	 */
	gridBackgroundClicked(event) {
		this.stateManager.displayGrid = event.detail.checked;
		this.refreshGrid();
	}

	fullScreenClicked(event) {
		this.stateManager.setDisplayPreference(event.detail.checked);
	}

	randomStartClicked(event) {
		this.stateManager.setRandomStartPreference(event.detail.checked);
	}

	displayContextMenu(clickEvent) {
		clickEvent.preventDefault();
		let boundary = this.shadowRoot
			.getElementById('draw_canvas')
			.getBoundingClientRect();
		let contextMenu = this.shadowRoot.querySelector('context-menu');

		contextMenu.menuPosition = {
			clickEvent: clickEvent,
			boundary: boundary,
			zoom: this.config.zoom,
		};

		contextMenu.display = true;
		return false;
	}

	/**
	 * Event handler for processing a user click when in drawing mode.
	 * @param {Event} clickEvent Event generated when the draw canvas is clicked.
	 */
	drawCanvasClicked(clickEvent) {
		let menu = this.shadowRoot.querySelector('context-menu');
		if (menu.display) {
			menu.display = false;
			return;
		}

		if (this.stateManager.isDrawingAllowed()) {
			let boundary = this.shadowRoot
				.getElementById('draw_canvas')
				.getBoundingClientRect();
			let cellLocation = convertToCell(clickEvent, boundary, this.config.zoom);
			this.setflagAsDirty(Layers.DRAWING);
			this.stateManager.sendWorkerMessage(Layers.DRAWING, {
				command: WorkerCommands.DrawingSystemCommands.TOGGLE_CELL,
				cx: cellLocation.x,
				cy: cellLocation.y,
			});
		}
	}

	drawCanvasMouseMoved(event) {
		let boundary = this.shadowRoot
			.getElementById('draw_canvas')
			.getBoundingClientRect();
		let cellLocation = convertToCell(event, boundary, this.config.zoom);
		this.stateManager.setActiveCell(cellLocation);
	}

	/**
	 * Handles processing the context menu item clicked.
	 * @param {number} row - The horizontal coordinate of the cell clicked.
	 * @param {number} col - The vertical coordinate of the cell clicked.
	 * @param {string} cmdName - The command clicked in the context menu
	 */
	contextMenuCommand(event) {
		event.detail.simCommand
			? this.processContextMenuSimCommand(event)
			: this.generateTemplate(event);
	}

	/**
	 * Changes the current state of the simulation button.
	 * @private
	 * @returns {Main} Returns the instance of the main thread being modified.
	 */
	transitionToTheStartButton() {
		this.shadowRoot.querySelector('start-button').state = 'IDLE';
		return this;
	}

	generateTemplate(event) {
		this.config.elementaryCAs.useRandomStart = this.stateManager.getRandomStartPreference();
		this.stateManager.sendWorkerMessage(Layers.DRAWING, {
			command: WorkerCommands.DrawingSystemCommands.DRAW_TEMPLATE,
			templateName: event.detail.command,
			row: event.detail.row,
			col: event.detail.col,
			config: this.config,
		});
		this.setflagAsDirty(Layers.DRAWING);
	}

	processContextMenuSimCommand(event) {
		let startButton = this.shadowRoot.querySelector('start-button');
		switch (event.detail.command) {
			case 'start-sim':
				startButton.state = 'RUNNING';
				this.startButtonClicked();
				break;
			case 'pause-sim':
				startButton.state = 'PAUSED';
				this.pauseButtonClicked();
				break;
			case 'resume-sim':
				startButton.state = 'RUNNING';
				this.resumeButtonClicked();
				break;
			case 'reset':
				this.resetSimulation();
				break;
			default:
				throw new Error('Unknown context menu command.');
		}
		return;
	}

	setSimGenerationCountComponent(count) {
		this.shadowRoot
			.getElementById('sim_generation_count')
			.setAttribute('value', count);
		return this;
	}

	setAliveCellsCount(count) {
		this.shadowRoot
			.getElementById('alive_cells_count')
			.setAttribute('value', count);
		return this;
	}
}

module.exports = AppEventHandler;
