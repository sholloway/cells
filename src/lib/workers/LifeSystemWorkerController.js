const WorkerCommands = require('./WorkerCommands.js');
const LifeSystemCmds = WorkerCommands.LifeSystemCommands;
const LifeSystem = require('./../core/LifeSystem.js');
const { Cell } = require('./../entity-system/Entities.js');
const { AbstractWorkerController } = require('./AbstractWorkerController.js');
const { SeederFactory } = require('./../core/SeederFactory.js');

/**
 * Controller for the Life System web worker.
 * @extends AbstractWorkerController
 */
class LifeSystemWorkerController extends AbstractWorkerController {
	/**
	 * Creates a new instance of a LifeSystemWorkerController.
	 * @param {WorkerGlobalScope} worker - The web worker that the controller performs orchestration for.
	 */
	constructor(worker) {
		super(worker);
		this.lifeSystem = new LifeSystem();
	}

	/**
	 * Route the inbound command to the appropriate processor.
	 * @param {*} msg The message to be routed.
	 * @override
	 */
	routeCommand(msg) {
		switch (msg.command) {
			case LifeSystemCmds.RESET:
				this.processCmd(
					msg,
					msg.command,
					(msg) => this.findPromisedProperty(msg, 'config'),
					(msg) => {
						this.lifeSystem.reset(msg.config);
						msg.promisedResponse &&
							this.sendMessageToClient({
								id: msg.id,
								promisedResponse: msg.promisedResponse,
								command: msg.command,
							});
					},
					'The configuration was not provided.'
				);
				break;
			case LifeSystemCmds.SEND_CELLS:
				this.processCmd(
					msg,
					msg.command,
					(msg) => this.findPromisedProperty(msg, 'promisedResponse'),
					(msg) => {
						this.sendMessageToClient({
							id: msg.id,
							promisedResponse: msg.promisedResponse,
							command: msg.command,
							cells: this.lifeSystem.getCells(),
						});
					},
					'Could not send the life system cells.'
				);
				break;
			case LifeSystemCmds.SET_CELL_SIZE:
				this.processCmd(
					msg,
					msg.command,
					(msg) => msg.cellSize,
					(msg) => this.lifeSystem.setCellSize(msg.cellSize),
					'The cell size was not provided.'
				);
				break;
			case LifeSystemCmds.SET_SEEDER:
				this.processCmd(
					msg,
					msg.command,
					(msg) =>
						this.findPromisedProperty(msg, 'config') &&
						this.findPromisedProperty(msg, 'seedSetting'),
					(msg) => this.initializeSeeder(msg),
					'Setting the seeder requires including the config and seedingSetting properties. The cells property is optional.'
				);
				break;
			case LifeSystemCmds.DISPLAY_STORAGE:
				this.processCmd(
					msg,
					msg.command,
					(msg) => msg.displayStorage !== undefined,
					(msg) => this.lifeSystem.displayStorage(msg.displayStorage),
					'The displayStorage field was not provided.'
				);
				break;
			default:
				throw new Error(
					`Unsupported command ${msg.command} was received in LifeSystem Worker.`
				);
		}
	}

	/**
	 * Updates the drawing scene and sends it to the client.
	 * @override
	 * @param {*} msg - The message to process.
	 */
	processScene(msg) {
		if (this.systemRunning() && this.lifeSystem.canUpdate()) {
			this.lifeSystem.update();
			let aliveCellsCount = this.lifeSystem.aliveCellsCount();
			let isSimulationDone = aliveCellsCount == 0;
			isSimulationDone && this.stop();
			let response = {
				command: msg.command,
				// stack: this.lifeSystem.getScene().getStack(),
				stack: this.packScene(this.lifeSystem.getScene().getStack()),
				aliveCellsCount: aliveCellsCount,
				numberOfSimulationIterations: this.lifeSystem.numberOfSimulationIterations(),
				simulationStopped: isSimulationDone,
			};
			this.sendMessageToClient(response, [response.stack.buffer]);
		}
	}

	/*
	Packs the active scene as a Uint16Array. 
	- Number range is [0,65535]
	- Each number is 2 bytes.

	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays
	*/
	packScene(stack){
		const BYTES_PER_NUMBER = 2;
		const FIELDS_PER_CELL = 2;
		let buffer = new ArrayBuffer(BYTES_PER_NUMBER * FIELDS_PER_CELL * stack.length);
		let dataView = new Uint16Array(buffer);
		for (let current = 0; current < stack.length; current++){
			dataView[FIELDS_PER_CELL * current] = stack[current].row;
			dataView[FIELDS_PER_CELL * current + 1] = stack[current].col;
		}
		return dataView
	}

	/**
	 * Initializes the seeder for the life system. Sends a message back to the
	 * client if promised a response.
	 * @param {*} msg - The message to process.
	 */
	initializeSeeder(msg) {
		let cells = this.findPromisedProperty(msg, 'cells') || [];
		let seeder = SeederFactory.build(
			this.findPromisedProperty(msg, 'seedSetting')
		).setCells(cells.map((c) => Cell.buildInstance(c)));

		this.lifeSystem
			.setConfig(this.findPromisedProperty(msg, 'config'))
			.setSeeder(seeder)
			.initializeSimulation();

		msg.promisedResponse &&
			this.sendMessageToClient({
				id: msg.id,
				promisedResponse: msg.promisedResponse,
				command: msg.command,
				stack: this.lifeSystem.getScene().getStack(),
				aliveCellsCount: this.lifeSystem.aliveCellsCount(),
				numberOfSimulationIterations: this.lifeSystem.numberOfSimulationIterations(),
			});
	}
}

module.exports = LifeSystemWorkerController;
