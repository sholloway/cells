const WorkerCommands = require('./WorkerCommands.js');
const LifeCycle = WorkerCommands.LifeCycle;
const LifeSystemCmds = WorkerCommands.LifeSystemCommands;
const LifeSystem = require('./LifeSystem.js');
const { AbstractWorkerController } = require('./AbstractWorkerController.js');

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
			case LifeCycle.START:
				this.workerState = WorkerState.RUNNING;
				console.log('LifeSystem: START');
				break;
			case LifeCycle.STOP:
				this.workerState = WorkerState.STOPPED;
				console.log('LifeSystem: STOP');
				break;
			case LifeCycle.PAUSE:
				console.log('LifeSystem: PAUSE');
				break;
			case LifeCycle.PROCESS_CYCLE:
				console.log('LifeSystem: PROCESS_CYCLE');
				// this.processScene(msg);
				break;
			case LifeSystemCmds.RESET:
				console.log('LifeSystem: ');
				break;
			case LifeSystemCmds.RESUME:
				console.log('LifeSystem: RESET');
				break;
			case LifeSystemCmds.SEND_ALIVE_CELLS_COUNT:
				console.log('LifeSystem: ');
				break;
			case LifeSystemCmds.SEND_CELLS:
				console.log('LifeSystem: SEND_ALIVE_CELLS_COUNT');
				break;
			case LifeSystemCmds.SEND_SIMULATION_ITERATIONS_COUNT:
				console.log('LifeSystem: ');
				break;
			case LifeSystemCmds.SET_CELL_SIZE:
				console.log('LifeSystem: SEND_SIMULATION_ITERATIONS_COUNT');
				break;
			case LifeSystemCmds.SET_SEEDER:
				console.log('LifeSystem: SET_SEEDER');
				break;
			case LifeSystemCmds.DISPLAY_STORAGE:
				console.log('LifeSystem: DISPLAY_STORAGE');
				break;
			default:
				throw new Error(
					`Unsupported command ${msg.command} was received in LifeSystem Worker.`
				);
		}
	}
}

module.exports = LifeSystemWorkerController;
