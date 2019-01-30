const defaultConfig = require('./DefaultConfig.js')
const GameManager = require('./GameManager.js')
const HTMLCanvasRenderer = require('./../renderer/HTMLCanvasRenderer.js')
const SceneManager = require('./../core/SceneManager.js')

const LifeSystemState = {
	STOPPED: 1,
	PAUSED: 2,
	RUNNING: 3
}

/**
 * Runs the simulation for the required number of ticks.
 * @private
 * @param {*} numTicks - The number of times to update the simulation.
 */
function queueUpdates(numTicks){
	for(var i=0; i < numTicks; i++) {
		this.lastTick = this.lastTick + this.config.game.tickLength;
		update.bind(this)(this.lastTick);
	}
}

/**
 * Progresses the simulation forward by one tick.
 * @param {number} frame - Reserved. Not currently used.
 */
function update(frame){
	this.gameStateManager.evaluateCells(this.scene, this.evaluator)
	this.gameStateManager.stageStorage(this.scene, this.displayStorageStructure)
	this.gameStateManager.activateNext();
	this.simIterationCounter++
	notify.bind(this)(LifeEvents.TICKED)
}

const LifeEvents = {
	TICKED: 'ticked'
}

/**
 * The internal method for notifying all LifeSystem event subscribers.
 * @private
 */
function notify(eventName){
	if(!this.observers.has(eventName)){
		return
	}
	this.observers.get(eventName).forEach(observer => observer(this))
}

/**
 *  A Quad tree based Conway's Game of Life simulation.
 */
class AltLifeSystem{
	/**
	 *
	 * @param {Window} window - The DOM's window object.
	 * @param {HTMLCanvasContext} htmlCanvasContext - An HTML5 Canvas 2D context.
	 * @param {object} config - A configuration object.
	 */
	constructor(window, htmlCanvasContext, config = defaultConfig){
		this.config = config
		this.window = window
		this.htmlCanvasContext = htmlCanvasContext
		this.scene = new SceneManager()
		this.gameStateManager = new GameManager(this.config)
		this.renderer = new HTMLCanvasRenderer(this.htmlCanvasContext, this.config)
		this.gameState = LifeSystemState.STOPPED
		this.displayStorageStructure = false;
		this.seeder = null
		this.observers = new Map()
		this.simIterationCounter = 0
	}

	/**
	 * Getter for the number of currently alive cells.
	 * @returns {number} The count of alive cells.
	 */
	aliveCellsCount(){
		return this.gameStateManager.aliveCellsCount()
	}

	/**
	 * Provides a deep copy of the currently alive cells.
	 * @returns {Cell[]}
	 */
	getCells(){
		return this.gameStateManager.getCells()
	}

	/**
	 * Provides the current simulation tick.
	 * @returns {number}
	 */
	numberOfSimulationIterations(){
		return this.simIterationCounter
	}

	/**
	 * Implementation of the observer patter. Provides the ability
	 * to register an event lister.
	 * @param {string} eventName - The event to subscribe to.
	 * @param {function} observer - The function to be invoked when the event occurs.
	 */
	subscribe(eventName, observer){
		if(!this.observers.has(eventName)){
			this.observers.set(eventName, [])
		}
		this.observers.get(eventName).push(observer)
	}

	/**
	 * Sets the simulation seeder to be used.
	 * @param {Seeder} seeder - An implementation of the Seeder abstract class.
	 */
	setSeeder(seeder){
		this.seeder = seeder
	}

	/**
	 * Set's the cell size to use.
	 * @param {number} size
	 */
	setCellSize(size){
		this.config.zoom = size
	}

	/**
	 * Sets whether to draw the quad tree.
	 * @param {boolean} display
	 */
	displayStorage(display){
		this.displayStorageStructure = display
	}

	/**
	 * Begins the simulation
	 */
	start(){
		if (this.gameState == LifeSystemState.STOPPED){
			this.gameStateManager.seedWorld(this.seeder)
			this.lastTick = window.performance.now();
  		this.lastRender = this.lastTick; // Pretend the first draw was on first update.
			this.gameState = LifeSystemState.RUNNING
			this.simIterationCounter = 0
		}
	}

	/**
	 * Stops the simulation. Not intended to be restarted.
	 */
	stop(){
		if (this.gameState == LifeSystemState.RUNNING){
			this.gameState = LifeSystemState.STOPPED
		}
	}

	/**
	 * Pauses the simulation. Can be restarted.
	 */
	pause(){
		if (this.gameState == LifeSystemState.RUNNING){
			this.lastTick = window.performance.now();
  		// this.lastRender = this.lastTick; // Pretend the first draw was on first update.
			this.gameState = LifeSystemState.PAUSED
		}
	}

	/**
	 * Clears the simulation.
	 */
	reset(){
		this.scene.purge()
		this.gameStateManager.clear()
		this.renderer.clear()
	}

	/**
	 * Restart the simulation.
	 */
	resume(){
		if(this.gameState == LifeSystemState.STOPPED || this.gameState == LifeSystemState.PAUSED){
			this.gameState = LifeSystemState.RUNNING
			this.lastTick = window.performance.now()
		}
	}

	/**
	 * The main loop of the simulation.
	 * @param {number} tFrame - The current frame.
	 */
	main(tFrame){
		// Looping via callback. Will pass the current time.
		// Can use window.cancelAnimationFrame() to stop if needed.
		this.stopMain = window.requestAnimationFrame(this.main.bind(this));
		if (this.gameState == LifeSystemState.RUNNING){
			var nextTick = this.lastTick + this.config.game.tickLength;
			var numTicks = 0;

			// If tFrame < nextTick then 0 ticks need to be updated (0 is default for numTicks).
			// If tFrame = nextTick then 1 tick needs to be updated (and so forth).
			// Note: As we mention in summary, you should keep track of how large numTicks is.
			// If it is large, then either your game was asleep, or the machine cannot keep up.
			if (tFrame > nextTick) {
				var timeSinceTick = tFrame - this.lastTick;
				numTicks = Math.floor( timeSinceTick / this.config.game.tickLength );
			}

			queueUpdates.bind(this)(numTicks);
			if (!this.scene.fullyRendered()){
				this.renderer.render(this.scene);
			}
			this.lastRender = tFrame;
		}
	}
}

module.exports = AltLifeSystem
