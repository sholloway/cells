const Layers = require('../app/AppLayers.js');
const { LitElement, html, css } = require('lit-element');
const { grid } = require('./SharedCss.js');
const { convertToCell } = require('../ui/CanvasUtilities.js');
const WorkerCommands = require('../workers/WorkerCommands.js');
const AppBuilder = require('../app/AppBuilder.js');

const {
	updateConfiguredLandscape,
} = require('../ui/UIConfigurationUtilities.js');

const DISPLAY_TRANSITION_ERR_MSG =
	'There was an error attempting to change display modes.';

/**
 * The top level component for the app.
 */
class AppComponent extends LitElement {
	constructor() {
		super();
		AppBuilder.buildApp(this);
	}

	/**
	 * Life Cycle Method: Invoked when a component is added to the document’s DOM.
	 */
	connectedCallback() {
		super.connectedCallback();
		window.addEventListener('load', this.handlePageLoad.bind(this));
		window.addEventListener('resize', this.handlePageResize.bind(this));
		this.stateManager.startMainLoop(); //TODO: Might need to be in firstUpdated or constructor.
	}

	/**
	 * Life Cycle Method: Invoked when a component is removed from the document’s DOM.
	 */
	disconnectedCallback() {
		window.removeEventListener('load', this.handlePageLoad);
		window.removeEventListener('resize', this.handlePageResize);
		super.disconnectedCallback();
	}

	/**
	 * The CSS styles for the component.
	 * @returns {string}
	 */
	static get styles() {
		return [
			grid,
			css`
				#block {
					height: 24px;
					background-color: #006db3;
				}

				#header {
					background-color: #039be5;
					border-top-width: 1px;
					border-top-color: #3fafe8;
					border-top-style: solid;
				}

				#canvas_container {
					background-color: #ffffff;
					border: 1px solid black;
					z-index: 0;
					position: relative;
				}

				#grid_canvas {
					z-index: 1;
					position: absolute;
				}

				#sim_canvas {
					z-index: 2;
					position: absolute;
				}

				#draw_canvas {
					z-index: 3;
					position: absolute;
				}
			`,
		];
	}

	/**
	 * Life Cycle Method: Draws the component when a property has changed
	 */
	render() {
		return html`
			<div class="container col">
				<div id="block"></div>
				<div id="header">
					<h1>Conway's Game Of Life</h1>
				</div>
				<div id="control_bar">
					<div class="container row">
						<shape-picker
							event="cell-shape-changed"
							@cell-shape-changed=${this.setCellShapeOption}
						></shape-picker>
						<cell-size-control
							event="cell-size-changed"
							min="5"
							max="100"
							value="20"
							@cell-size-changed=${this.changedCellSize}
						></cell-size-control>
						<start-button
							state="IDLE"
							@sim-event-start-requested=${this.handleStartButtonClicked}
							@sim-event-pause-requested=${this.handlePauseButtonClicked}
							@sim-event-resume-requested=${this.handleResumeButtonClicked}
						></start-button>
						<event-button
							id="reset_button"
							event="sim-reset-requested"
							@sim-reset-requested=${this.resetSimulation}
						>
							Reset
						</event-button>
						<event-button
							id="fullscreen_button"
							event="fullscreen-requested"
							@fullscreen-requested=${this.launchFullScreen}
						>
							Fullscreen
						</event-button>
					</div>
					<div class="container row">
						<event-checkbox
							id="display_quadtree"
							event="dispay-tree-toggle"
							@dispay-tree-toggle=${this.toggleDisplayStorageStructure}
						>
							Display Quadtree
						</event-checkbox>

						<event-checkbox
							id="display_grid"
							event="dispay-grid-toggle"
							@dispay-grid-toggle=${this.handleGridBackgroundClicked}
						>
							Display Grid
						</event-checkbox>

						<event-checkbox
							id="display_fullscreen"
							event="enable-fullscreen-toggle"
							@enable-fullscreen-toggle=${this.handleFullScreenClicked}
						>
							Fullscreen
						</event-checkbox>

						<event-checkbox
							id="random_start"
							event="random-start-toggle"
							@random-start-toggle=${this.handleRandomStartClicked}
						>
							Random Start
						</event-checkbox>
					</div>
				</div>
				<div id="canvas_container" @contextmenu="${this.displayContextMenu}">
					<canvas id="grid_canvas"></canvas>
					<canvas id="sim_canvas"></canvas>
					<canvas
						id="draw_canvas"
						@click=${this.handleDrawCanvasClicked}
						@mousemove=${this.handleDrawCanvasMouseMoved}
					></canvas>
					<context-menu
						event="context-menu-command"
						@context-menu-command=${this.handleContextMenuCommand}
					></context-menu>
				</div>
				<div id="status_bar">
					<number-display
						id="alive_cells_count"
						label="Alive Cells"
					></number-display>
					<number-display
						id="sim_generation_count"
						label="Generation"
					></number-display>
				</div>
			</div>
		`;
	}

	/**
	 * Event handler for reacting to when the hosting web page is loaded.
	 * @param {*} event
	 * @private
	 */
	handlePageLoad(event) {
		this.sizeCanvas();
		updateConfiguredLandscape(this.config);
		AppBuilder.setupRenderers(this);
		let now = window.performance.now();
		this.stateManager.start(now);
	}

	sizeCanvas() {
		let fullscreen = this.isFullscreen();
		this.config.canvas.height = fullscreen
			? screen.height
			: this.calculateConfiguredCanvasHeight();

		let canvasContainerDiv = this.shadowRoot.getElementById('canvas_container');

		//WARNING: Setting the canvas height changes the body
		//width so always set the height before the width.
		canvasContainerDiv.style.height = `${this.config.canvas.height}px`;
		let canvases = this.shadowRoot.querySelectorAll('canvas');
		canvases.forEach((c) =>
			c.setAttribute('height', this.config.canvas.height)
		);

		this.config.canvas.width = fullscreen
			? window.innerWidth
			: document.body.clientWidth;

		canvasContainerDiv.style.width = `${this.config.canvas.width}px`;
		canvases.forEach((c) => c.setAttribute('width', this.config.canvas.width));
	}

	isFullscreen() {
		return document.fullscreenElement != null;
	}

	calculateConfiguredCanvasHeight() {
		// Note: This will use the same padding/margins as the HTML Body.
		let blockElement = this.shadowRoot.getElementById('block');
		let headerElement = this.shadowRoot.getElementById('header');
		let controlBarElement = this.shadowRoot.getElementById('control_bar');
		let statusBarElement = this.shadowRoot.getElementById('status_bar');
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

	/**
	 * Event handler for reacting to when the hosting web page is resized.
	 * @param {*} event
	 * @private
	 */
	handlePageResize(event) {
		this.sizeCanvas();
		updateConfiguredLandscape(this.config);
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

	/**
	 * Updates the UI based on a message sent from a web worker.
	 * If the value is present in the message, the corrisponding UI component is updated.
	 * @param {*} message
	 * @returns {App} The instance.
	 */
	updateUI(message) {
		message.aliveCellsCount && this.setAliveCellsCount(message.aliveCellsCount);

		message.numberOfSimulationIterations &&
			this.setSimGenerationCountComponent(message.numberOfSimulationIterations);

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
			this.shadowRoot.querySelector('start-button').enabled = true;
		} else if (currentDrawingCellsCount > 0 && nextDrawingCellsCount == 0) {
			this.shadowRoot.querySelector('start-button').enabled = false;
		}
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

	/**
	 * Changes the current state of the simulation button.
	 * @private
	 * @returns {Main} Returns the instance of the main thread being modified.
	 */
	transitionToTheStartButton() {
		this.shadowRoot.querySelector('start-button').state = 'IDLE';
		return this;
	}

	setAliveCellsCount(count) {
		this.shadowRoot
			.getElementById('alive_cells_count')
			.setAttribute('value', count);
		return this;
	}

	setSimGenerationCountComponent(count) {
		this.shadowRoot
			.getElementById('sim_generation_count')
			.setAttribute('value', count);
		return this;
	}

	getCanvasContext(elementId) {
		let canvas = this.shadowRoot.getElementById(elementId);
		if (!canvas) {
			throw new Error(`Could not find a canvas element with ID: ${elementId}`);
		}
		return canvas.getContext('2d');
	}

	/**
	 * Event handler for processing a user click when in drawing mode.
	 * @param {Event} clickEvent Event generated when the draw canvas is clicked.
	 */
	handleDrawCanvasClicked(clickEvent) {
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

	handleDrawCanvasMouseMoved(event) {
		let boundary = this.shadowRoot
			.getElementById('draw_canvas')
			.getBoundingClientRect();
		let cellLocation = convertToCell(event, boundary, this.config.zoom);
		this.stateManager.setActiveCell(cellLocation);
	}

	handleStartButtonClicked() {
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
					document.fullscreenElement && this.handlePageResize();
					this.stateManager.preventDrawing();
					this.stateManager.startSimulation();
				});
		});
	}

	handlePauseButtonClicked() {
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

	handleResumeButtonClicked() {
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
				document.fullscreenElement && this.handlePageResize();
				this.stateManager.preventDrawing();
				this.stateManager.startSimulation();
			});
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
					document.fullscreenElement && this.handlePageResize();
					resolve();
				});
		});
	}

	setCellShapeOption(event) {
		this.config.cell.shape = event.detail.shape;
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
	 * Command all registered workers to set their display storage setting.
	 */
	toggleDisplayStorageStructure(event) {
		this.stateManager.broadcast({
			command: WorkerCommands.LifeSystemCommands.DISPLAY_STORAGE,
			displayStorage: event.detail.checked,
		});
	}

	/**
	 * Event handler for when the grid checkbox is clicked.
	 */
	handleGridBackgroundClicked(event) {
		this.stateManager.displayGrid = event.detail.checked;
		this.refreshGrid();
	}

	handleFullScreenClicked(event) {
		this.stateManager.setDisplayPreference(event.detail.checked);
	}

	handleRandomStartClicked(event) {
		this.stateManager.setRandomStartPreference(event.detail.checked);
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
			: this.generateTemplate(event);
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

	setflagAsDirty(workerName) {
		this.stateManager.workerSystem.setWorkerDirtyFlag(workerName, true);
		return this;
	}

	processContextMenuSimCommand(event) {
		let startButton = this.shadowRoot.querySelector('start-button');
		switch (event.detail.command) {
			case 'start-sim':
				startButton.state = 'RUNNING';
				this.handleStartButtonClicked();
				break;
			case 'pause-sim':
				startButton.state = 'PAUSED';
				this.handlePauseButtonClicked();
				break;
			case 'resume-sim':
				startButton.state = 'RUNNING';
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
}

customElements.define('conways-game', AppComponent);
