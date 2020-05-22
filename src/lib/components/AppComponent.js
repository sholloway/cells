const { LitElement, html, css } = require('lit-element');
const { grid } = require('./SharedCss.js');
const { convertToCell } = require('./../ui/CanvasUtilities.js');
const DefaultConfig = require('../core/DefaultConfig.js');
const {
	AppStateManager,
	AppStateManagerEvents,
} = require('../app/AppStateManager.js');
const DisplayManager = require('../app/DisplayManager.js');
const {
	updateConfiguredLandscape,
} = require('../ui/UIConfigurationUtilities.js');

/**
 * The top level component for the app.
 */
class AppComponent extends LitElement {
	constructor() {
		super();
		this.config = DefaultConfig;
		this.stateManager = new AppStateManager(this.config);
		this.displayManager = new DisplayManager();
	}

	connectedCallback() {
		super.connectedCallback();
		window.addEventListener('load', this.handlePageLoad.bind(this));
		window.addEventListener('resize', this.handlePageResize.bind(this));
	}

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
	 * Life Cycle Method: Draws the component.
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
						<shape-picker event="cell-shape-changed"></shape-picker>
						<cell-size-control
							event="cell-size-changed"
							min="5"
							max="100"
							value="20"
						></cell-size-control>
						<start-button state="IDLE"></start-button>
						<!-- prettier-ignore -->
						<event-button id="reset_button" 
            event="sim-reset-requested">
            Reset
          </event-button>
						<!-- prettier-ignore -->
						<event-button id="fullscreen_button" 
            event="fullscreen-requested">
            Fullscreen
          </event-button>
					</div>
					<div class="container row">
						<event-checkbox id="display_quadtree" event="dispay-tree-toggle">
							Display Quadtree
						</event-checkbox>

						<event-checkbox id="display_grid" event="dispay-grid-toggle">
							Display Grid
						</event-checkbox>

						<event-checkbox
							id="display_fullscreen"
							event="enable-fullscreen-toggle"
						>
							Fullscreen
						</event-checkbox>
					</div>
				</div>
				<div
					id="canvas_container"
					oncontextmenu="main.displayContextMenu(event);"
				>
					<canvas id="grid_canvas"></canvas>
					<canvas id="sim_canvas"></canvas>
					<canvas id="draw_canvas"></canvas>
					<context-menu event="context-menu-command"></context-menu>
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
		let now = window.performance.now();
		this.stateManager.start(now);
	}

	sizeCanvas() {

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
	}
}

customElements.define('conways-game', AppComponent);
