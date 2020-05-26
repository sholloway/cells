const WorkerCommands = require('./WorkerCommands.js');
const LifeCycle = WorkerCommands.LifeCycle;

/**
 * The possible states a web worker can be in.
 */
const WorkerState = {
	STOPPED: 1,
	PAUSED: 2, //Reserved. Not currently used.
	RUNNING: 3,
};

/**
 * Base class that defines the common capabilities of the Web Worker controllers.
 */
class AbstractWorkerController {
	constructor(worker) {
		this.worker = worker;
		this.workerState = WorkerState.STOPPED;
	}

	/**
	 * The core logic of the controller. Responsible for routing incomming messages to
	 * the appropriate command.
	 * @param {*} msg - The message to process.
	 */
	process(msg) {
		if (!msg.command) {
			throw new Error(
				`${this.constructor.name}: Command not provided in message.`
			);
		}
		switch (msg.command) {
			case LifeCycle.START:
				this.workerState = WorkerState.RUNNING;
				break;
			case LifeCycle.STOP:
				this.stop();
				break;
			case LifeCycle.PAUSE:
				break;
			case LifeCycle.PROCESS_CYCLE:
				this.workerState === WorkerState.RUNNING && this.processScene(msg);
				break;
			default:
				this.routeCommand(msg);
		}
	}

	stop() {
		this.workerState = WorkerState.STOPPED;
	}

	/**
	 * Route the inbound command to the appropriate processor.
	 * @param {*} msg The message to be routed.
	 */
	routeCommand(msg) {
		throw new Error(
			'Child classes of AbstractWorkerController must implement the method routeCommand(msg).'
		);
	}

	/**
	 * Processes an inbound message.
	 * @param {*} msg - The message that was passed to the web worker.
	 * @param {String} commandName - The enumerated command to process.
	 * @param {Function} commandCriteria - Conditional that determines whether to run the command processor or not.
	 * @param {Function} cmdProcessor - The command function to run when the criteria is met.
	 * @param {String} errMsg - The error message to throw when the conditional isn't met.
	 */
	processCmd(msg, commandName, commandCriteria, cmdProcessor, errMsg) {
		if (commandCriteria(msg)) {
			cmdProcessor(msg);
		} else {
			throw new Error(`Cannot process the command ${commandName}: ${errMsg}`);
		}
	}

	/**
	 * Finds a property regardless if it is a promised payload or not.
	 * @param {*} msg - The message to inspect.
	 * @param {*} name - The name of the property to find.
	 * @returns The found property. Returns undefined if the property is not present.
	 */
	findPromisedProperty(msg, name) {
		return msg.params ? msg.params[name] : msg[name];
	}

	/**
	 * Processes the scene for a single tick.
	 * @param {*} msg The message to process.
	 */
	processScene(msg) {
		throw new Error(
			'Child classes of AbstractWorkerController must implement the method processScene().'
		);
	}

	/**
	 * @returns {Boolean} Determines if the service is running or not.
	 */
	systemRunning() {
		return this.workerState === WorkerState.RUNNING;
	}

	/**
	 * Sends a message to the web worker's client (main thread).
	 * @param {*} msg The message to send.
	 */
	sendMessageToClient(msg, transferList) {
		this.worker.postMessage(msg, transferList);
	}
}

module.exports = { AbstractWorkerController, WorkerState };
