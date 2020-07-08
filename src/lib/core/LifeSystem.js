const GameManager = require('./GameManager.js');
const SceneManager = require('./SceneManager.js');
const {
	CellEvaluator,
	GenerationalCellEvaluator,
	LifeEvaluator,
} = require('./CellEvaluator.js');
/**
 * The possible states the drawing system can be in.
 * @private
 */
const States = {
	IDLE: 'IDLE',
	UPDATING: 'UPDATING',
};

/**
 * A Quad tree based Conway's Game of Life simulation.
 */
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
		this.cellEvaluator = undefined; //Will be set when calling this.setConfig()
	}

	/**
	 * Getter for the internal system state.
	 * @returns {State} Returns the active state.
	 */
	getState() {
		return this.state;
	}

	/**
	 * Replaces the current configuration.
	 * @param {*} config The configuration.
	 */
	setConfig(config) {
		this.config = config;
		this.getStateManager().setConfig(this.config);
		this.cellEvaluator = this.createCellEvaluator(this.config.game.activeGame);
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

	/**
	 * Calculates if the system can perform an update or not.
	 * @returns {Boolean}
	 */
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
	 * @param {number} size The cell size
	 */
	setCellSize(size) {
		if (!this.config) {
			this.config = {};
		}
		this.config.zoom = size;
	}

	/**
	 * Sets whether to draw the quad tree.
	 * @param {boolean} display The display value.
	 */
	displayStorage(display) {
		this.displayStorageStructure = display;
	}

	getDisplayStorage() {
		return this.displayStorageStructure;
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

	/**
	 * Processes the scene for one tick of the simulation.
	 * @throws {Error} Throws an error if called before the simulation has been intialized.
	 * @returns {LifeSystem} Returns the LifeSystem instance.
	 */
	update() {
		if (this.simulationInitialized) {
			this.scene.clear();
			this.getStateManager()
				.evaluateCells(this.scene, this.cellEvaluator)
				.activateNext();
			this.tickCounter++;
		} else {
			throw new Error(
				'Cannot update. The simulation has not been initialized yet.'
			);
		}
		return this;
	}

	createCellEvaluator(game) {
		let evaluator;
		if (game.key == 'conways-game-of-life') {
			evaluator = new LifeEvaluator(game.born, game.survive);
		} else if (game.maxAge) {
			//Generational Games
			evaluator = new GenerationalCellEvaluator(
				game.born,
				game.survive,
				game.maxAge
			);
		} else {
			evaluator = new CellEvaluator(game.born, game.survive);
		}
		return evaluator;
	}

	/**
	 * Seeds the world when the simulation starts.
	 * @returns {LifeSystem} Returns the LifeSystem instance.
	 */
	initializeSimulation() {
		if (!this.simulationInitialized) {
			this.getStateManager().seedWorld(this.seeder);
			this.simulationInitialized = true;
		}
		return this;
	}

	/**
	 * Clears the simulation.
	 * @returns {LifeSystem} Returns the LifeSystem instance.
	 */
	reset(config) {
		this.tickCounter = 0;
		this.simulationInitialized = false;
		this.setConfig(config);
		this.scene.clear();
		this.getStateManager().clear();
		return this;
	}

	/**
	 * Returns the number of simulation ticks the life system has been updated.
	 * @returns {number} Simulation ticks.
	 */
	numberOfSimulationIterations() {
		return this.tickCounter;
	}
}

module.exports = LifeSystem;
