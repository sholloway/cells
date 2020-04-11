/**
 * This will replace the AlternativeLifeSystem.
 */

const GameManager = require('./../../lib/core/GameManager.js');
const SceneManager = require('./../../lib/core/SceneManager.js');

/**
 * The possible states the drawing system can be in.
 * @private
 */
const States = {
	IDLE: 'IDLE',
	UPDATING: 'UPDATING',
};

class LifeSystem {
	constructor() {
		this.config = {};
		this.tickCounter = 0;
		this.scene = new SceneManager();
		this.stateManager = new GameManager(this.config);
		this.displayStorageStructure = false;
		this.state = States.IDLE;
		this.seeder = null;
		this.simulationInitialized = false;
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
		this.getStateManager().setConfig(this.config);
		return this;
	}

	/**
	 * @returns {SceneManager} The current scene.
	 */
	getScene() {
		return this.scene;
	}

	/**
	 * @returns {GameManager} Returns the state manager for the drawing system.
	 */
	getStateManager() {
		return this.stateManager;
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
	 * Sets whether to draw the quad tree.
	 * @param {boolean} display
	 */
	displayStorage(display) {
		this.displayStorageStructure = display;
	}

	/**
	 * Getter for the number of currently alive cells.
	 * @returns {number} The count of alive cells.
	 */
	aliveCellsCount() {
		return this.getStateManager().aliveCellsCount();
	}

	/**
	 * Sets the simulation seeder to be used.
	 * @param {Seeder} seeder - An implementation of the Seeder abstract class.
	 */
	setSeeder(seeder) {
		this.seeder = seeder;
		return this;
	}

	update() {
		if (this.simulationInitialized) {
			this.scene.clear();
			this.getStateManager().evaluateCellsFaster(this.scene, this.evaluator);
			this.getStateManager().stageStorage(
				this.scene,
				this.displayStorageStructure
			);
			this.getStateManager().activateNext();
			this.tickCounter++;
		} else {
			throw new Error(
				'Cannot update. The simulation has not been initialized yet.'
			);
		}
	}

	/**
	 * Seeds the world when the simulation starts.
	 */
	initializeSimulation() {
		if (!this.simulationInitialized) {
			this.getStateManager().seedWorld(this.seeder);
			this.simulationInitialized = true;
		}
	}

	/**
	 * Clears the simulation.
	 */
	reset(config) {
		this.tickCounter = 0;
		this.simulationInitialized = false;
		this.setConfig(config);
		this.scene.clear();
		this.getStateManager().clear();
	}

	numberOfSimulationIterations() {
		return this.tickCounter;
	}
}

module.exports = LifeSystem;
