/**
 * An animation system for drawing to an HTML Canvas.
 * @exports system/canvas
 */

const HTMLCanvasRenderer = require('./../renderer/HTMLCanvasRenderer.js')
const SceneManager = require('./../core/SceneManager.js')

/**
 * The possible states the drawing system can be in.
 * @private
 */
const SystemState = {
	STOPPED: 1,
	PAUSED: 2,
	RUNNING: 3
}

const SystemEvents = {
	TICKED: 'ticked'
}

/**
 * Runs the simulation for the required number of ticks.
 * @private
 * @param {number} numTicks - The number of times to update the simulation.
 * @param {function} update - The provided update function.
 */
function queueUpdates(numTicks, update){
	for(var i=0; i < numTicks; i++) {
		this.lastTick = this.lastTick + this.config.game.tickLength;
		this.simIterationCounter++
		this.update(this.lastTick);
		notify.bind(this)(SystemEvents.TICKED)
	}
}

/**
 * The internal method for notifying all System event subscribers.
 * @private
 */
function notify(eventName){
	if(!this.observers.has(eventName)){
		return
	}
	this.observers.get(eventName).forEach(observer => observer(this))
}

/**
 * Runs an animation on an HTML Canvas.
 */
class CanvasBasedSystem{
	/**
	 *
	 * @param {Window} window - The DOM's window object.
	 * @param {HTMLCanvasContext} htmlCanvasContext - An HTML5 Canvas 2D context.
	 * @param {object} config - A configuration object.
	 */
	constructor(window, htmlCanvasContext, config){
		this.config = config
		this.window = window
		this.htmlCanvasContext = htmlCanvasContext
		this.scene = new SceneManager()
		this.renderer = new HTMLCanvasRenderer(this.htmlCanvasContext, this.config)
		this.state = SystemState.STOPPED
		this.displayStorageStructure = false;
		this.simIterationCounter = 0
		this.observers = new Map()
	}

	getStateManager(){
		throw new Error('Children of CanvasBasedSystem must implement getStateManager()')
	}

	/**
 * Progresses the simulation forward by one tick.
 * @param {number} frame - Reserved. Not currently used.
 */
	update(frame){
		throw new Error('Children of CanvasBasedSystem must implement an update() method')
	}

	/**
	 * Provides a deep copy of the currently alive cells.
	 * @returns {Cell[]}
	 */
	getCells(){
		return this.getStateManager().getCells()
	}

	/**
	 * Provides the current simulation tick.
	 * @returns {number}
	 */
	numberOfSimulationIterations(){
		return this.simIterationCounter
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
	 * Implementation of the observer pattern. Provides the ability
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

	initializeSimulation(){
		//optional. Override if desired.
	}

	/**
	 * Begins the simulation
	 */
	start(){
		if (this.state == SystemState.STOPPED){
			this.initializeSimulation()
			this.lastTick = window.performance.now();
			// Pretend the first draw was on first update.
  		this.lastRender = this.lastTick;
			this.state = SystemState.RUNNING
			this.simIterationCounter = 0
		}
	}

	/**
	 * Stops the simulation. Not intended to be restarted.
	 */
	stop(){
		if (this.state == SystemState.RUNNING){
			this.state = SystemState.STOPPED
		}
	}

	/**
	 * Pauses the simulation. Can be restarted.
	 */
	pause(){
		if (this.state == SystemState.RUNNING){
			this.lastTick = window.performance.now();
			this.state = SystemState.PAUSED
		}
	}

	/**
	 * Clears the simulation.
	 */
	reset(){
		this.scene.purge()
		this.getStateManager().clear()
		this.renderer.clear()
	}

	/**
	 * Continue the simulation.
	 */
	resume(){
		if(this.state == SystemState.STOPPED || this.state == SystemState.PAUSED){
			this.state = SystemState.RUNNING
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
		if (this.state == SystemState.RUNNING){
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


module.exports = {
	CanvasBasedSystem,
	SystemEvents,
	SystemState
}


