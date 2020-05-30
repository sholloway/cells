const {
	AbstractWorkerController,
	PackingConstants,
} = require('./AbstractWorkerController.js');
const DrawingSystem = require('./../core/DrawingSystem.js');
const WorkerCommands = require('./WorkerCommands.js');
const Layers = require('./../app/AppLayers.js');
const DrawingSystemCommands = WorkerCommands.DrawingSystemCommands;

/**
 * Controller for the Drawing System web worker.
 * @extends AbstractWorkerController
 */
class DrawingSystemWorkerController extends AbstractWorkerController {
	/**
	 * Creates a new instance of a DrawingSystemWorkerController.
	 * @param {WorkerGlobalScope} worker
	 */
	constructor(worker) {
		super(worker);
		this.drawingSystem = new DrawingSystem();
	}

	/**
	 * Route the inbound command to the appropriate processor.
	 * @param {*} msg The message to be routed.
	 * @override
	 */
	routeCommand(msg) {
		switch (msg.command) {
			case DrawingSystemCommands.SET_CELLS:
				this.processCmd(
					msg,
					DrawingSystemCommands.SET_CELLS,
					(msg) => msg.cells && msg.numberOfCells,
					(msg) => {
						let cells = this.unpackCells(
							msg.cells,
							0,
							msg.numberOfCells,
							PackingConstants.FIELDS_PER_CELL
						);
						this.drawingSystem.setCells(cells);
					},
					'The cells or numberOfCells were not provided.'
				);
				break;
			case DrawingSystemCommands.SET_CELL_SIZE:
				this.processCmd(
					msg,
					DrawingSystemCommands.SET_CELL_SIZE,
					(msg) => msg.cellSize,
					(msg) => this.drawingSystem.setCellSize(msg.cellSize),
					'The cell size was not provided.'
				);
				break;
			case DrawingSystemCommands.RESET:
				this.processCmd(
					msg,
					DrawingSystemCommands.RESET,
					(msg) => (msg.promisedResponse ? msg.params.config : msg.config),
					(msg) => {
						this.drawingSystem.setConfig(msg.config);
						this.drawingSystem.reset();
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
			case DrawingSystemCommands.TOGGLE_CELL:
				this.processCmd(
					msg,
					DrawingSystemCommands.TOGGLE_CELL,
					(msg) => msg.cx !== undefined && msg.cy !== undefined,
					(msg) => this.drawingSystem.toggleCell(msg.cx, msg.cy),
					'Either cx or cy was not provided.'
				);
				break;
			case DrawingSystemCommands.DISPLAY_STORAGE:
				this.processCmd(
					msg,
					DrawingSystemCommands.DISPLAY_STORAGE,
					(msg) => msg.displayStorage !== undefined,
					(msg) => this.drawingSystem.displayStorage(msg.displayStorage),
					'The displayStorage field was not provided.'
				);
				break;
			case DrawingSystemCommands.SEND_CELLS:
				this.processCmd(
					msg,
					DrawingSystemCommands.SEND_CELLS,
					() => true,
					(msg) => {
						let sceneStack = this.drawingSystem.getScene().getStack();
						let response = {
							id: msg.id,
							promisedResponse: msg.promisedResponse,
							command: msg.command,
							numberOfCells: sceneStack.length,
							cellFieldsCount: PackingConstants.FIELDS_PER_CELL,
							numberOfStorageBoxes: 0,
							boxFieldCount: 0,
							stack: this.packScene(sceneStack),
						};
						this.sendMessageToClient(response, [response.stack.buffer]);
					},
					'Could not send the drawing system cells.'
				);
				break;
			case DrawingSystemCommands.DRAW_TEMPLATE:
				this.processCmd(
					msg,
					msg.command,
					() => true,
					(msg) =>
						this.drawingSystem.drawTemplate(
							msg.templateName,
							msg.row,
							msg.col,
							msg.config
						),
					'Could not send the drawing system cells.'
				);
				break;
			default:
				throw new Error(
					`Unsupported command ${msg.command} was received in DrawingSystem Worker.`
				);
		}
	}

	/**
	 * Updates the drawing scene and sends it to the client.
	 * @param {*} msg
	 */
	processScene(msg) {
		if (this.systemRunning() && this.drawingSystem.canUpdate()) {
			this.drawingSystem.update();
			let sceneStack = this.drawingSystem.getScene().getStack();
			let storageStack = this.drawingSystem.getStorageScene().getStack();
			let response = {
				id: msg.id,
				promisedResponse: msg.promisedResponse,
				command: msg.command,
				origin: Layers.DRAWING,
				numberOfCells: sceneStack.length,
				cellFieldsCount: PackingConstants.FIELDS_PER_CELL,
				numberOfStorageBoxes: storageStack.length,
				boxFieldCount: PackingConstants.FIELDS_PER_BOX,
				stack: this.packScene(sceneStack, storageStack),
			};
			this.sendMessageToClient(response, [response.stack.buffer]);
		}
	}
}

module.exports = DrawingSystemWorkerController;
