const {CanvasBasedSystem} = require('./System.js')
const DefaultConfig = require('./DefaultConfig.js')
const GameManager = require('./GameManager.js')


/**
 * A Quad tree based Conway's Game of Life simulation.
 * @extends CanvasBasedSystem
 */
class AltLifeSystem extends CanvasBasedSystem{
	/**
	 * Creates a new AltLifeSystem.
	 * @param {Window} window - The DOM's window object.
	 * @param {HTMLCanvasContext} htmlCanvasContext - An HTML5 Canvas 2D context.
	 * @param {object} config - A configuration object.
	 */
	constructor(window, htmlCanvasContext, config = DefaultConfig){
		super(window, htmlCanvasContext, config)
		this.stateManager = new GameManager(this.config)
		this.seeder = null
	}

	/**
	 * Override parent
	 * @private
	 */
	getStateManager(){
		return this.stateManager
	}

	/**
	 * Override parent
	 * @private
	 */
	update(frame){
		this.getStateManager().evaluateCells(this.scene, this.evaluator)
		this.getStateManager().stageStorage(this.scene, this.displayStorageStructure)
		this.getStateManager().activateNext();
	}

	/**
	 * Getter for the number of currently alive cells.
	 * @returns {number} The count of alive cells.
	 */
	aliveCellsCount(){
		return this.getStateManager().aliveCellsCount()
	}

	/**
	 * Sets the simulation seeder to be used.
	 * @param {Seeder} seeder - An implementation of the Seeder abstract class.
	 */
	setSeeder(seeder){
		this.seeder = seeder
	}

	/**
	 * Seeds the world when the simulation starts.
	 * Overrides parent.
	 */
	initializeSimulation(){
		this.getStateManager().seedWorld(this.seeder)
	}
}

module.exports = AltLifeSystem
