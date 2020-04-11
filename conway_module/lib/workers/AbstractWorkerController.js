const WorkerCommands = require('./WorkerCommands.js');
const LifeCycle = WorkerCommands.LifeCycle;

const WorkerState = {
	STOPPED: 1,
	PAUSED: 2,
	RUNNING: 3,
};

class AbstractWorkerController {
	constructor(worker) {
		this.worker = worker;
		this.workerState = WorkerState.STOPPED;
	}

	/**
	 * The core logic of the controller. Responsible for routing incomming messages to
	 * the appropriate command.
	 * @param {*} msg
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
				this.workerState = WorkerState.STOPPED;
				break;
			case LifeCycle.PAUSE:
				break;
			case LifeCycle.PROCESS_CYCLE:
				this.processScene(msg);
				break;
			default:
				this.routeCommand(msg);
		}
	}

	/**
	 * Route the inbound command to the appropriate processor.
	 * @param {*} msg The message to be routed.
	 */
	routeCommand(msg) {
		throw new Error(
			'Child classes of AbstractWorkerController must implement the method routeCommand().'
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

	//Maybe we can standardize this... Maybe not...
	processScene(msg) {}

	/**
	 * @returns {Boolean} Determines if the service is running or not.
	 */
	systemRunning() {
		return this.workerState === WorkerState.RUNNING;
	}

	/**
	 * Sends a message to the web worker's client (main thread).
	 * @param {*} msg
	 */
	sendMessageToClient(msg) {
		this.worker.postMessage(msg);
	}
}

module.exports = { AbstractWorkerController, WorkerState };
