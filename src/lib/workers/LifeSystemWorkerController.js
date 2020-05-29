const WorkerCommands = require('./WorkerCommands.js');
const LifeSystemCmds = WorkerCommands.LifeSystemCommands;
const LifeSystem = require('./../core/LifeSystem.js');
const { Cell } = require('./../entity-system/Entities.js');
const {
	AbstractWorkerController,
	PackingConstants,
} = require('./AbstractWorkerController.js');
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
			case LifeSystemCmds.SEND_CELLS: //TODO: Make this use transferable. Where is this used?
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
			let sceneStack = this.lifeSystem.getScene().getStack();
			let storageStack = this.lifeSystem.getStorageScene().getStack();
			let response = {
				command: msg.command,
				stack: this.packScene(sceneStack, storageStack),
				aliveCellsCount: aliveCellsCount,
				numberOfSimulationIterations: this.lifeSystem.numberOfSimulationIterations(),
				numberOfCells: sceneStack.length,
				cellFieldsCount: PackingConstants.FIELDS_PER_CELL,
				numberOfStorageBoxes: storageStack.length,
				boxFieldCount: PackingConstants.FIELDS_PER_BOX,
				simulationStopped: isSimulationDone,
			};
			this.sendMessageToClient(response, [response.stack.buffer]);
		}
	}

	/**
	 * Initializes the seeder for the life system. Sends a message back to the
	 * client if promised a response.
	 * @param {*} msg - The message to process.
	 */
	initializeSeeder(msg) {
		let seedSetting = this.findPromisedProperty(msg, 'seedSetting');
		let cellsBuffer = this.findPromisedProperty(msg, 'cellsBuffer');
		let numberOfCells = this.findPromisedProperty(msg, 'numberOfCells');
		let cells = this.bufferToCellsArray(
			cellsBuffer,
			0,
			numberOfCells,
			PackingConstants.FIELDS_PER_CELL
		);
		let seeder = SeederFactory.build(seedSetting).setCells(cells);

		this.lifeSystem
			.setConfig(this.findPromisedProperty(msg, 'config'))
			.setSeeder(seeder)
			.initializeSimulation();

		msg.promisedResponse &&
			this.sendMessageToClient({
				id: msg.id,
				promisedResponse: msg.promisedResponse,
				command: msg.command,
			});
	}

	/**
		Convert a typed array of cells into an array of Cells.
		@param {Uint16Array} buffer - The typed array containing cells.
		@param {number} offset - The index on the typed array to start the conversion.
		@param {number} numberOfCells - How many cells the typed array contains.
		@param {number} cellsFieldsCount - How many fields each cell contains.
		@returns {Cell[]}
	*/
	bufferToCellsArray(buffer, offset, numberOfCells, cellsFieldsCount) {
		let cells = [];
		let bufferEnd = offset + numberOfCells * cellsFieldsCount;
		if (buffer && ArrayBuffer.isView(buffer)) {
			for (
				var current = offset;
				current < bufferEnd;
				current += cellsFieldsCount
			) {
				cells.push(new Cell(buffer[current], buffer[current + 1]));
			}
		}
		return cells;
	}
}

module.exports = LifeSystemWorkerController;
