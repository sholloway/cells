const DrawingStateManager = require('./DrawingStateManager.js');
const SceneManager = require('./SceneManager.js');

/**
 * The possible states the drawing system can be in.
 * @private
 */
const States = {
	IDLE: 'IDLE',
	UPDATING: 'UPDATING',
};

/**
 * A system for drawing on a grid. Designed to be used in the context of a web worker.
 */
class DrawingSystem {
	/**
	 * Creates a new drawing system.
	 */
	constructor() {
		this.config = {
			zoom: 1,
		};
		this.stateManager = new DrawingStateManager(this.config);
		this.scene = new SceneManager();
		this.displayStorageStructure = false;
		this.state = States.IDLE;
	}

	/**
	 * @returns {State} Returns the active state.
	 */
	getState() {
		return this.state;
	}

	/**
	 * Replaces the current configuration.
	 * @param {*} config
	 */
	setConfig(config) {
		this.config = config;
		this.stateManager.setConfig(this.config);
	}

	/**
	 * @returns {SceneManager} The current scene.
	 */
	getScene() {
		return this.scene;
	}

	/**
	 * @returns {DrawingStateManager} Returns the state manager for the drawing system.
	 */
	getStateManager() {
		return this.stateManager;
	}

	update() {
		this.state = States.UPDATING;
		this.scene.clear();
		this.getStateManager().stageStorage(
			this.scene,
			this.displayStorageStructure
		);
		this.getStateManager().processCells(this.scene);
		this.state = States.IDLE;
	}

	canUpdate() {
		return this.state === States.IDLE;
	}

	/**
	 * Used to preload the drawing system with alive cells.
	 * @param {Cell[]} cells - An array of alive cells.
	 */
	setCells(cells) {
		this.getStateManager().setCells(cells);
	}

	/**
	 * Provides a deep copy of the currently alive cells.
	 * @returns {Cell[]}
	 */
	getCells() {
		return this.getStateManager().getCells();
	}

	/**
	 * Sets the cell size to use.
	 * @param {number} size
	 */
	setCellSize(size) {
		this.config.zoom = size;
	}

	/**
	 * Flips a grid cell to alive or dead.
	 * @param {number} x - The X coordinate of the cell.
	 * @param {number} y - The Y coordinate of the cell.
	 */
	toggleCell(x, y) {
		if (this.state === States.IDLE) {
			this.state = States.UPDATING;
			this.getStateManager().toggleCell(x, y);
			this.state = States.IDLE;
		}
	}

	/**
	 * Sets whether to draw the quad tree.
	 * @param {boolean} display
	 */
	displayStorage(display) {
		this.displayStorageStructure = display;
	}

	/**
	 * Clears the simulation.
	 */
	reset() {
		this.scene.clear();
		this.getStateManager().clear();
	}
}

module.exports = DrawingSystem;
