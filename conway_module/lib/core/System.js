/**
 * An animation system for drawing to an HTML Canvas.
 * @module system/canvas
 */

const HTMLCanvasRenderer = require('./../renderer/HTMLCanvasRenderer.js');
const SceneManager = require('./SceneManager.js');

/**
 * The possible states the drawing system can be in.
 * @private
 */
const SystemState = {
	STOPPED: 1,
	PAUSED: 2,
	RUNNING: 3,
};

/**
 * The supported events the system notifies on.
 */
const SystemEvents = {
	TICKED: 'ticked',
};

/**
 * Runs the simulation for the required number of ticks.
 * @private
 * @param {number} numTicks - The number of times to update the simulation.
 */
function queueUpdates(numTicks) {
	for (var i = 0; i < numTicks; i++) {
		this.lastTick = this.lastTick + this.config.game.tickLength;
		this.simIterationCounter++;
		this.update(this.lastTick);
		notify.bind(this)(SystemEvents.TICKED);
	}
}

/**
 * The internal method for notifying all System event subscribers.
 * @private
 */
function notify(eventName) {
	if (!this.observers.has(eventName)) {
		return;
	}
	this.observers.get(eventName).forEach((observer) => observer(this));
}

/**
 * Abstract class.
 */
class BrowserSystem {
	/**
	 * Creates a playable system in the context of a browser.
	 * @param {Window} window - The DOM's window object.
	 */
	constructor(window, config) {
		this.window = window;
		this.state = SystemState.STOPPED;
		this.simIterationCounter = 0;
		this.observers = new Map();
		this.config = config;
	}

	/**
	 * Provides the current simulation tick.
	 * @returns {number}
	 */
	numberOfSimulationIterations() {
		return this.simIterationCounter;
	}

	/**
	 * An optional initialization method that is invoked when start() is called.
	 * @abstract
	 */
	initializeSimulation() {
		//optional. Override if desired.
	}

	/**
	 * Begins the simulation
	 */
	start() {
		if (this.state == SystemState.STOPPED) {
			this.initializeSimulation();
			this.lastTick = this.window.performance.now();
			// Pretend the first draw was on first update.
			this.lastRender = this.lastTick;
			this.state = SystemState.RUNNING;
			this.simIterationCounter = 0;
		}
	}

	/**
	 * Stops the system. Not intended to be restarted.
	 */
	stop() {
		if (this.state == SystemState.RUNNING) {
			this.state = SystemState.STOPPED;
		}
	}

	/**
	 * Pauses the system. Can be restarted.
	 */
	pause() {
		if (this.state == SystemState.RUNNING) {
			this.lastTick = this.window.performance.now();
			this.state = SystemState.PAUSED;
		}
	}

	/**
	 * Continue the system.
	 */
	resume() {
		if (this.state == SystemState.STOPPED || this.state == SystemState.PAUSED) {
			this.state = SystemState.RUNNING;
			this.lastTick = this.window.performance.now();
		}
	}

	/**
	 * The main loop of the simulation.
	 * @param {number} tFrame - The current frame.
	 */
	main(tFrame) {
		// Looping via callback. Will pass the current time.
		// Can use window.cancelAnimationFrame() to stop if needed.
		this.stopMain = this.window.requestAnimationFrame(this.main.bind(this));
		if (this.state == SystemState.RUNNING) {
			var nextTick = this.lastTick + this.config.game.tickLength;
			var numTicks = 0;

			// If tFrame < nextTick then 0 ticks need to be updated (0 is default for numTicks).
			// If tFrame = nextTick then 1 tick needs to be updated (and so forth).
			// Note: As we mention in summary, you should keep track of how large numTicks is.
			// If it is large, then either your game was asleep, or the machine cannot keep up.
			if (tFrame > nextTick) {
				var timeSinceTick = tFrame - this.lastTick;
				numTicks = Math.floor(timeSinceTick / this.config.game.tickLength);
			}

			queueUpdates.bind(this)(numTicks);
			this.afterUpdates();
			this.lastRender = tFrame;
		}
	}

	/**
	 * Progresses the simulation forward by one tick.
	 * @abstract
	 * @param {number} frame - Reserved. Not currently used.
	 */
	update(frame) {
		throw new Error(
			'Children of BrowserSystem must implement an update() method'
		);
	}

	/**
	 * Perform post system update logic (e.g. rendering changes).
	 * @abstract
	 */
	afterUpdates() {
		throw new Error('Children of BrowserSystem must implement afterUpdates().');
	}

	/**
	 * Implementation of the observer pattern. Provides the ability
	 * to register an event lister.
	 * @param {string} eventName - The event to subscribe to.
	 * @param {function} observer - The function to be invoked when the event occurs.
	 */
	subscribe(eventName, observer) {
		if (!this.observers.has(eventName)) {
			this.observers.set(eventName, []);
		}
		this.observers.get(eventName).push(observer);
	}
}

/**
 * Abstract class. Runs an animation on an HTML Canvas.
 * @extends BrowserSystem
 */
class CanvasBasedSystem extends BrowserSystem {
	/**
	 *
	 * @param {Window} window - The DOM's window object.
	 * @param {HTMLCanvasContext} htmlCanvasContext - An HTML5 Canvas 2D context.
	 * @param {object} config - A configuration object.
	 */
	constructor(window, htmlCanvasContext, config) {
		super(window, config);
		this.htmlCanvasContext = htmlCanvasContext;
		this.scene = new SceneManager();
		this.renderer = new HTMLCanvasRenderer(this.htmlCanvasContext, this.config);
		this.displayStorageStructure = false;
	}

	/**
	 * Returns the state manager.
	 * @abstract
	 */
	getStateManager() {
		throw new Error(
			'Children of CanvasBasedSystem must implement getStateManager()'
		);
	}

	afterUpdates() {
		if (!this.scene.fullyRendered()) {
			this.renderer.render(this.scene);
		}
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
	 * Clears the simulation.
	 */
	reset() {
		this.scene.clear();
		this.getStateManager().clear();
		this.renderer.clear();
	}
}

module.exports = {
	BrowserSystem,
	CanvasBasedSystem,
	SystemEvents,
	SystemState,
};
