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
						if (msg.promisedResponse) {
							this.sendMessageToClient({
								id: msg.id,
								promisedResponse: msg.promisedResponse,
								command: msg.command,
							});
						}
					},
					'The configuration was not provided.'
				);
				break;
			case LifeSystemCmds.SEND_CELLS:
				this.processCmd(
					msg,
					msg.command,
					() => true,
					(msg) => {
						this.sendMessageToClient({
							id: msg.id,
							promisedResponse: msg.promisedResponse,
							command: msg.command,
							cells: this.lifeSystem.getCells(),
						});
					},
					'Could not send the drawing system cells.'
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

	//TODO: YUCK!! Refactor to make this flow like a pipeline.
	initializeSeeder(msg) {
		let seedSetting = this.findPromisedProperty(msg, 'seedSetting');
		let seeder = SeederFactory.build(seedSetting);
		let cells = this.findPromisedProperty(msg, 'cells');
		if (cells) {
			seeder.setCells(cells.map((c) => Cell.buildInstance(c)));
		}
		let config = this.findPromisedProperty(msg, 'config');
		if (config) {
			this.lifeSystem.setConfig(config);
		}
		this.lifeSystem.setSeeder(seeder);
		this.lifeSystem.initializeSimulation();
		if (msg.promisedResponse) {
			this.sendMessageToClient({
				id: msg.id,
				promisedResponse: msg.promisedResponse,
				command: msg.command,
			});
		}
	}
}

module.exports = LifeSystemWorkerController;
