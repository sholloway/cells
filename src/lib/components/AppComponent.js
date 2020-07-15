const Layers = require('../app/AppLayers.js');
const { LitElement, html, css } = require('lit-element');
const { grid } = require('./SharedCss.js');
const AppBuilder = require('../app/AppBuilder.js');
const AppEventHandler = require('./AppEventHandler.js');

const {
	updateConfiguredLandscape,
} = require('../ui/UIConfigurationUtilities.js');

/**
 * The top level component for the app.
 */
class AppComponent extends LitElement {
	constructor() {
		super();
		AppBuilder.buildApp(this);
		this.handler = new AppEventHandler(
			this,
			this.shadowRoot,
			this.config,
			this.stateManager,
			this.displayManager
		);
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
				:host {
					display: block;
					border: 1px solid black;
				}

				#canvas_container {
					background-color: #ffffff;
					border: 1px solid black;
					z-index: 0;
					position: relative;
					margin: 1;
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
				<div id="control_bar">
					<div class="container row">
						<game-selector
							event="game-changed"
							@game-changed=${this.handler.gameChanged.bind(this.handler)}
						></game-selector>
						<cell-size-control
							event="cell-size-changed"
							min="5"
							max="100"
							value="20"
							@cell-size-changed=${this.handler.cellSizeChanged.bind(
								this.handler
							)}
						></cell-size-control>
						<speed-selector
							event="speed-changed"
							@speed-changed=${this.handler.gameSpeedChanged.bind(this.handler)}
						></speed-selector>
						<start-button
							state="IDLE"
							@sim-event-start-requested=${this.handler.startButtonClicked.bind(
								this.handler
							)}
							@sim-event-pause-requested=${this.handler.pauseButtonClicked.bind(
								this.handler
							)}
							@sim-event-resume-requested=${this.handler.resumeButtonClicked.bind(
								this.handler
							)}
						></start-button>
						<event-button
							id="reset_button"
							event="sim-reset-requested"
							@sim-reset-requested=${this.handler.resetSimulation.bind(
								this.handler
							)}
						>
							Reset
						</event-button>
						<event-button
							id="fullscreen_button"
							event="fullscreen-requested"
							@fullscreen-requested=${this.handler.launchFullScreen.bind(
								this.handler
							)}
						>
							Fullscreen
						</event-button>
					</div>
					<div class="container row">
						<event-checkbox
							id="display_grid"
							event="dispay-grid-toggle"
							@dispay-grid-toggle=${this.handler.gridBackgroundClicked.bind(
								this.handler
							)}
						>
							Display Grid
						</event-checkbox>

						<event-checkbox
							id="display_fullscreen"
							event="enable-fullscreen-toggle"
							@enable-fullscreen-toggle=${this.handler.fullScreenClicked.bind(
								this.handler
							)}
						>
							Fullscreen
						</event-checkbox>

						<event-checkbox
							id="random_start"
							event="random-start-toggle"
							@random-start-toggle=${this.handler.randomStartClicked.bind(
								this.handler
							)}
						>
							Random Start
						</event-checkbox>
					</div>
				</div>
				<div
					id="canvas_container"
					@contextmenu="${this.handler.displayContextMenu.bind(this.handler)}"
				>
					<canvas id="grid_canvas"></canvas>
					<canvas id="sim_canvas"></canvas>
					<canvas
						id="draw_canvas"
						@click=${this.handler.drawCanvasClicked.bind(this.handler)}
						@mousemove=${this.handler.drawCanvasMouseMoved.bind(this.handler)}
					></canvas>
					<context-menu
						event="context-menu-command"
						@context-menu-command=${this.handler.contextMenuCommand.bind(
							this.handler
						)}
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
		this.config.canvas.height = fullscreen ? screen.height : 400;

		let canvasContainerDiv = this.shadowRoot.getElementById('canvas_container');
		let controlBar = this.shadowRoot.getElementById('control_bar');

		//WARNING: Setting the canvas height changes the body
		//width so always set the height before the width.
		canvasContainerDiv.style.height = `${this.config.canvas.height}px`;
		let canvases = this.shadowRoot.querySelectorAll('canvas');
		canvases.forEach((c) =>
			c.setAttribute('height', this.config.canvas.height)
		);

		this.config.canvas.width = fullscreen
			? window.innerWidth
			: controlBar.clientWidth - 2; //account for the 1px boarder on the canvas container.

		canvasContainerDiv.style.width = `${this.config.canvas.width}px`;
		canvases.forEach((c) => c.setAttribute('width', this.config.canvas.width));
	}

	isFullscreen() {
		return document.fullscreenElement != null;
	}

	/**
	 * Event handler for reacting to when the hosting web page is resized.
	 * @param {*} event
	 * @private
	 */
	handlePageResize(event) {
		this.sizeCanvas();
		updateConfiguredLandscape(this.config);
		this.handler.refreshGrid();
		this.handler.setflagAsDirty(Layers.DRAWING);
	}

	/**
	 * Updates the UI based on a message sent from a web worker.
	 * If the value is present in the message, the corrisponding UI component is updated.
	 * @param {*} message
	 * @returns {App} The instance.
	 */
	updateUI(message) {
		message.aliveCellsCount &&
			this.handler.setAliveCellsCount(message.aliveCellsCount);

		message.numberOfSimulationIterations &&
			this.handler.setSimGenerationCountComponent(
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
			this.shadowRoot.querySelector('start-button').enabled = true;
		} else if (currentDrawingCellsCount > 0 && nextDrawingCellsCount == 0) {
			this.shadowRoot.querySelector('start-button').enabled = false;
		}
	}

	getCanvasContext(elementId) {
		let canvas = this.shadowRoot.getElementById(elementId);
		if (!canvas) {
			throw new Error(`Could not find a canvas element with ID: ${elementId}`);
		}
		return canvas.getContext('2d');
	}

	setCellShapeOption(event) {
		this.config.cell.shape = event.detail.shape;
	}
}

customElements.define('conways-game', AppComponent);
