const WorkerCommands = require('./WorkerCommands.js');
const LifeCycle = WorkerCommands.LifeCycle;
const LifeSystemCmds = WorkerCommands.LifeSystemCommands;
const LifeSystem = require('./LifeSystem.js');
const { Cell } = require('./../core/Quadtree.js');
const { AbstractWorkerController } = require('./AbstractWorkerController.js');
const { SeederFactory } = require('./../core/SeederFactory.js');
/**
 * Controller for the Life System web worker.
 */
class LifeSystemWorkerController extends AbstractWorkerController {
	/**
	 * Creates a new instance of a DrawingSystemWorkerController.
	 * @param {WorkerGlobalScope} worker
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
	 * @param {*} msg
	 */
	processScene(msg) {
		if (this.systemRunning() && this.lifeSystem.canUpdate()) {
			this.lifeSystem.update();
			this.sendMessageToClient({
				command: msg.command,
				stack: this.lifeSystem.getScene().getStack(),
				aliveCellsCount: this.lifeSystem.aliveCellsCount(),
				numberOfSimulationIterations: this.lifeSystem.numberOfSimulationIterations(),
			});
		}
	}

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
			});
	}
}

module.exports = LifeSystemWorkerController;
