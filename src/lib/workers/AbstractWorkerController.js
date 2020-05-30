const WorkerCommands = require('./WorkerCommands.js');
const LifeCycle = WorkerCommands.LifeCycle;
const { Cell } = require('./../entity-system/Entities.js');

/**
 * The possible states a web worker can be in.
 */
const WorkerState = {
	STOPPED: 1,
	PAUSED: 2, //Reserved. Not currently used.
	RUNNING: 3,
};

const PackingConstants = {
	BYTES_PER_NUMBER: 2,
	FIELDS_PER_CELL: 3,
	FIELDS_PER_BOX: 4,
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

	//TODO: Put the buffer packing methods into their own class. This should be delegated.
	/*
	Packs the active scene as a Uint16Array. 
	- Number range is [0,65535]
	- Each number is 2 bytes.

	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays
	*/
	packScene(sceneStack, storageStack = []) {
		// prettier-ignore
		let sceneStackByteLength = PackingConstants.BYTES_PER_NUMBER * PackingConstants.FIELDS_PER_CELL * sceneStack.length;
		// prettier-ignore
		let storageStackByteLength = PackingConstants.BYTES_PER_NUMBER * PackingConstants.FIELDS_PER_BOX * storageStack.length;
		let bufferLength = sceneStackByteLength + storageStackByteLength;

		let buffer = new ArrayBuffer(bufferLength);
		let dataView = new Uint16Array(buffer);
		let offset;
		
		//First pack all the cells.
		for (var current = 0; current < sceneStack.length; current++) {
			offset = PackingConstants.FIELDS_PER_CELL * current;
			dataView[offset] = sceneStack[current].row;
			dataView[offset + 1] = sceneStack[current].col;
			dataView[offset + 2] = sceneStack[current].state;
		}

		//Then pack all of the boxes (if any) after the cells.
		//This shouldn't run when storageStack.length is 0.
		offset = PackingConstants.FIELDS_PER_CELL * sceneStack.length;
		for (var current = 0; current < storageStack.length; current++) {
			dataView[offset] = storageStack[current].x;
			dataView[offset + 1] = storageStack[current].y;
			dataView[offset + 2] = storageStack[current].xx;
			dataView[offset + 3] = storageStack[current].yy;
			offset += 4;
		}

		return dataView;
	}

	/**
		Convert a typed array of cells into an array of Cells.
		@param {Uint16Array} buffer - The typed array containing cells.
		@param {number} offset - The index on the typed array to start the conversion.
		@param {number} numberOfCells - How many cells the typed array contains.
		@param {number} cellsFieldsCount - How many fields each cell contains.
		@returns {Cell[]}
	*/
	unpackCells(buffer, offset, numberOfCells, cellsFieldsCount) {
		let cells = [];
		let bufferEnd = offset + numberOfCells * cellsFieldsCount;
		if (buffer && ArrayBuffer.isView(buffer)) {
			for (
				var current = offset;
				current < bufferEnd;
				current += cellsFieldsCount
			) {
				cells.push(
					new Cell(buffer[current], buffer[current + 1], buffer[current + 2])
				);
			}
		}
		return cells;
	}
}

module.exports = { AbstractWorkerController, PackingConstants, WorkerState };
