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
			throw new Error('LifeSystem.worker: Command not provided in message.');
		}
		this.routeCommand(msg);
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
}

module.exports = { AbstractWorkerController, WorkerState };
