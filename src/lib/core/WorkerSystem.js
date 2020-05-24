/**
 * An animation system for orchestrating multiple web workers.
 * Requests the updated scene from all registered workers on a timer.
 *
 * @module system/worker
 */

const { BrowserSystem } = require('./System.js');

const WorkerCommands = require('../workers/WorkerCommands.js').LifeCycle;

const { nanoid } = require('nanoid');

const PROCESS_CYCLE_MSG = {
	command: WorkerCommands.PROCESS_CYCLE,
};

/**
 * Challenges
 * Need to associate multiple web workers that have already been intialized.
 * Each worker should be pinged during the update cycle.
 * Need to notify each renderer that the relevant threads have new stuff to render.
 *   This isn't a given though.
 *
 * register worker
 * register renderer function? On receiving a message from a worker, this could execute the correct renderer.
 *
 * Worker System -> Workers: SEND_SCENE
 */
class WorkerSystem extends BrowserSystem {
	constructor(window, config) {
		super(window, config);
		this.workers = new Map(); //Pattern: name|{thread: worker instance, dirty: Boolean}
		this.promisedMessages = new Map();
	}

	/**
	 * Register a worker. All registered workers will be sent a SEND_SCENE message per tick.
	 * @param {string} name - The worker name.
	 * @param {WebWorker} worker - the worker to ping for update.
	 */
	registerWorker(name, worker) {
		this.workers.set(name, { thread: worker, dirty: true });
		worker.onerror = this.workerErrorHandler.bind(this);
		return this;
	}

	setWorkerDirtyFlag(workerName, flag) {
		if (!this.workers.has(workerName)) {
			throw new Error(
				`Attempted to set the dirty flag on an unregisterd web worker. ${workerName}`
			);
		}
		this.workers.get(workerName).dirty = flag;
	}

	workerErrorHandler(error) {
		this.stop(); //Stop the simulation.
		console.error('The simulation has been stopped.');
		console.group('A web worker had an issue.');
		console.error(`Worker: ${error.filename} Line: ${error.lineno}`);
		console.error(error.message);
		console.groupEnd();
	}

	/**
	 * Override parent
	 * Sends an update notifican to each registered web worker.
	 * @private
	 */
	update(frame) {
		this.workers.forEach((worker, name) => {
			worker.dirty && worker.thread.postMessage(PROCESS_CYCLE_MSG);
		});
	}

	broadcast(msg) {
		this.workers.forEach((worker, name) => {
			worker.thread.postMessage(msg);
		});
	}

	promiseResponse(workerName, command, params) {
		if (!this.workers.has(workerName)) {
			throw new Error(
				`Attempted to send a message to an unregisterd web worker. ${workerName}`
			);
		}
		let message = {
			id: nanoid(),
			promisedResponse: true,
			command: command,
			params: params,
		};
		return new Promise((resolve, reject) => {
			this.promisedMessages.set(message.id, {
				resolve: resolve,
				reject: reject,
			});
			this.workers.get(workerName).thread.postMessage(message);
		});
	}

	promiseResponses(command, params) {
		let promises = [];
		this.workers.forEach((worker, name) => {
			promises.push(this.promiseResponse(name, command, params));
		});
		return promises;
	}

	attemptToProcessPendingWork(message) {
		if (this.promisedMessages.has(message.id)) {
			let work = this.promisedMessages.get(message.id);
			if (work.error) {
				work.reject(work.error);
			} else {
				work.resolve(message);
			}
			this.promisedMessages.delete(message.id);
		} else {
			throw new Error(`Could not find the promised message ${message}`);
		}
	}

	/**
	 * Perform post system update logic (e.g. rendering changes).
	 */
	afterUpdates() {
		//TBD: Not sure yet if this makes sense in the worker world.
	}
}

module.exports = WorkerSystem;
