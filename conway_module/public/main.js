/*
Next Steps
* JSDocs for LifeSystemWorkerController and LifeSystem.
* Put tests around LifeSystem
* Refactor the DrawingSystemController to extend the AbstractController.
* Refactor Main.js. Some functions are sloppy. Remove conditionals where possible.
* Optimize Worker messaging
* Add page level error handling? 
  * Every cmd in a try/catch
  * A way to display errors to the user.
  * Still want trace info going to the console.
* Remove the conway_module directory. Flatten the code base.
* Add markdown to prettier.
* Move Cell into Entities.js
* Move QTNode into its own file.
* Rename entities.js and traits.js to be capitialized.
* Organize the JSDoc modules.
*/

//TODO: Inline all of this to reduce the file length.
const Cell = Conways.Cell;
const DrawingSceneBuilder = Conways.DrawingSceneBuilder;
const LifeSceneBuilder = Conways.LifeSceneBuilder;
const HTMLCanvasRenderer = Conways.HTMLCanvasRenderer;
const SceneManager = Conways.SceneManager;
const SeederFactoryModule = Conways.SeederFactoryModule;
const SeederFactory = SeederFactoryModule.SeederFactory;
const SeederModels = SeederFactoryModule.SeederModels;
const TraitBuilderFactory = Conways.TraitBuilderFactory;
const WorkerCommands = Conways.WorkerCommands;
const WorkerSystem = Conways.WorkerSystem;

const processDrawingWorker = 'Render Drawing Scene';

const Workers = {
	DRAWING_SYSTEM: 'DRAWING_SYSTEM_WORKER',
	LIFE_SYSTEM: 'LIFE_SYSTEM',
};

class Main {
	constructor(gridCanvas, simCanvas, drawCanvas) {
		this.setupProperties(gridCanvas, simCanvas, drawCanvas)
			.setupRenderers()
			.setupScenes()
			.setupWorkers();
	}

	setupProperties() {
		this.config = Conways.DefaultConfig;
		this.drawingAllowed = true;
		this.gridCanvas = gridCanvas;
		this.simCanvas = simCanvas;
		this.drawCanvas = drawCanvas;
		return this;
	}

	setupRenderers() {
		this.gridRender = new HTMLCanvasRenderer(
			this.gridCanvas.getContext('2d'),
			this.config
		);
		this.drawingSystemRender = new HTMLCanvasRenderer(
			this.drawCanvas.getContext('2d'),
			this.config
		);

		this.lifeSystemRender = new HTMLCanvasRenderer(
			this.simCanvas.getContext('2d'),
			this.config
		);
		return this;
	}

	setupScenes() {
		this.drawingScene = new SceneManager();
		this.lifeScene = new SceneManager();
		return this;
	}

	setupWorkers() {
		this.gridWorker = new Conways.GridSystemWorker();
		this.drawingWorker = new Conways.DrawingSystemWorker();
		this.lifeWorker = new Conways.LifeSystemWorker();

		this.workerSystem = new WorkerSystem(window, this.config);
		this.gridWorker.onmessage = this.handleMessageFromGridWorker.bind(this);
		this.drawingWorker.onmessage = this.handleMsgFromDrawingWorker.bind(this);
		this.lifeWorker.onmessage = this.handleMessageFromLifeWorker.bind(this);

		//We don't want to fully register the gridWorker because it is only rendered on demand.
		this.gridWorker.onerror = this.workerSystem.workerErrorHandler.bind(
			this.workerSystem
		);

		this.workerSystem
			.registerWorker(Workers.DRAWING_SYSTEM, this.drawingWorker)
			.registerWorker(Workers.LIFE_SYSTEM, this.lifeWorker);
		return this;
	}

	/**
	 * Kicks off the main loop for all workers.
	 */
	initialize() {
		this.workerSystem.start();
	}

	/**
	 * Render the grid canvas when a message is received from the GridSystemWorker.
	 */
	handleMessageFromGridWorker(envelope) {
		if (envelope.data) {
			let sceneObj = JSON.parse(envelope.data);
			let scene = SceneManager.fromObject(sceneObj, TraitBuilderFactory.select);
			let htmlCanvasContext = this.gridCanvas.getContext('2d');
			htmlCanvasContext.strokeStyle = '#757575';
			htmlCanvasContext.lineWidth = 0.5;
			this.gridRender.render(scene);
		}
	}

	handleMsgFromDrawingWorker(envelope) {
		if (envelope.data) {
			if (envelope.data.promisedResponse) {
				this.workerSystem.attemptToProcessPendingWork(envelope.data);
			} else {
				this.processMessageFromDrawingWorker(envelope.data);
			}
		}
	}

	handleMessageFromLifeWorker(envelope) {
		if (envelope.data) {
			if (envelope.data.promisedResponse) {
				this.workerSystem.attemptToProcessPendingWork(envelope.data);
			} else {
				this.processMessageFromLifeSystemWorker(envelope.data);
			}
		}
	}

	processMessageFromDrawingWorker(message) {
		switch (message.command) {
			case WorkerCommands.LifeCycle.PROCESS_CYCLE:
				this.drawingScene.clear();
				DrawingSceneBuilder.buildScene(
					this.drawingScene,
					this.config,
					message.stack
				);
				this.drawingSystemRender.render(this.drawingScene);
				break;
			default:
				console.error(
					`An unexpected message was sent from the Drawing Worker. ${message}`
				);
		}
	}

	processMessageFromLifeSystemWorker(message) {
		switch (message.command) {
			case WorkerCommands.LifeCycle.PROCESS_CYCLE:
				this.lifeScene.clear();
				LifeSceneBuilder.buildScene(this.lifeScene, this.config, message.stack);
				this.lifeSystemRender.render(this.lifeScene);

				//update the related controls.
				document.getElementById('alive_cells_count').value =
					message.aliveCellsCount;
				document.getElementById('sim_generation_count').value =
					message.numberOfSimulationIterations;
				break;
			default:
				console.error(
					`An unexpected message was sent from the Life System Worker. ${message}`
				);
		}
	}

	handlePageLoad(event) {
		sizeCanvas(this.config);
		let now = window.performance.now();
		this.workerSystem.main(now);
		this.allowDrawing();
	}

	handlePageResize(event) {
		sizeCanvas(this.config);
		this.handleGridBackground();
	}

	handleDrawCanvasClicked(clickEvent) {
		if (this.drawingAllowed) {
			//Get Pixel clicked.
			let boundary = this.drawCanvas.getBoundingClientRect();
			let px = clickEvent.clientX - boundary.left;
			let py = clickEvent.clientY - boundary.top;

			//Project to a Cell
			let cx = Math.floor(px / this.config.zoom);
			let cy = Math.floor(py / this.config.zoom);

			this.drawingWorker.postMessage({
				command: WorkerCommands.DrawingSystemCommands.TOGGLE_CELL,
				cx: cx,
				cy: cy,
			});
		}
	}

	allowDrawing() {
		this.drawingAllowed = true;
		this.drawingWorker.postMessage({
			command: WorkerCommands.LifeCycle.START,
		});
	}

	preventDrawing() {
		this.drawingAllowed = false;
		this.drawingWorker.postMessage({
			command: WorkerCommands.LifeCycle.STOP,
		});
	}

	setSeedingOption() {
		let option = document.getElementById('seed');
		switch (option.value) {
			case 'draw':
				this.resetSimulation();
				this.allowDrawing();
				break;
			default:
				this.preventDrawing();
				this.resetSimulation();
				break;
		}
	}

	//TODO: Yuck. Improve this. Isolate knowledge about the DOM.
	toggleSimulation() {
		let button = document.getElementById('play_pause_button');
		let isInDrawingMode = document.getElementById('seed').value === 'draw';
		switch (button.innerText) {
			case 'Start':
				button.innerText = 'Pause';
				this.preventDrawing();
				this.startSimulation();
				break;
			case 'Pause':
				button.innerText = 'Resume';
				this.stopSimulation();
				if (isInDrawingMode) {
					this.workerSystem
						.promiseResponse(
							Workers.LIFE_SYSTEM,
							WorkerCommands.LifeSystemCommands.SEND_CELLS
						)
						.then((response) => {
							this.drawingWorker.postMessage({
								command: WorkerCommands.DrawingSystemCommands.SET_CELLS,
								cells: response.cells,
							});
							this.lifeWorker.postMessage({
								command: WorkerCommands.LifeSystemCommands.RESET,
								config: this.config,
							});
							this.lifeSystemRender.clear();
							this.allowDrawing();
						})
						.catch((reason) => {
							console.error(
								`There was an error trying to pause the simulation.\n${reason}`
							);
						});
				}
				break;
			case 'Resume':
				button.innerText = 'Pause';
				this.preventDrawing();
				if (isInDrawingMode) {
					this.startSimulation();
				} else {
					this.resumeSimulation();
				}
				break;
			default:
				break;
		}
	}

	resetSimulation() {
		this.stopSimulation();
		let button = document.getElementById('play_pause_button');
		button.innerText = 'Start';
		document.getElementById('alive_cells_count').value = 0;
		document.getElementById('sim_generation_count').value = 0;

		this.workerSystem
			.promiseResponse(
				Workers.LIFE_SYSTEM,
				WorkerCommands.LifeSystemCommands.RESET,
				{ config: this.config }
			)
			.then(() => {
				this.lifeScene.clear();
				this.lifeSystemRender.clear();
			});

		this.workerSystem
			.promiseResponse(
				Workers.DRAWING_SYSTEM,
				WorkerCommands.DrawingSystemCommands.RESET,
				{ config: this.config }
			)
			.then(() => this.drawingSystemRender.clear());
	}

	handleGridBackground() {
		let displayGridBackground = document.getElementById(
			'display_grid_background'
		);
		if (displayGridBackground.checked) {
			this.requestToDrawGrid();
		} else {
			this.requestToClearGrid();
		}
	}

	requestToDrawGrid() {
		let cellSize = getCellSize();
		this.gridWorker.postMessage({
			command: 'CREATE_GRID', //TODO: Make a constant
			parameters: {
				cellWidth: cellSize,
				cellHeight: cellSize,
				gridWidth: this.config.canvas.width,
				gridHeight: this.config.canvas.height,
			},
		});
	}

	requestToClearGrid() {
		this.gridRender.clear();
	}

	startSimulation() {
		/**
		 * First we are fetching the cells, then asynchronously telling the
		 * drawing system to reset. Finally we're building up the seeder
		 * and starting the simulation.
		 */
		this.workerSystem
			.promiseResponse(
				Workers.DRAWING_SYSTEM,
				WorkerCommands.DrawingSystemCommands.SEND_CELLS
			)
			.then((response) => {
				return new Promise((resolve, reject) => {
					this.drawingWorker.postMessage({
						command: WorkerCommands.DrawingSystemCommands.RESET,
						config: this.config,
					});
					this.drawingSystemRender.clear();
					if (response.cells) {
						resolve(response.cells);
					} else {
						reject('Cells were not provided.');
					}
				});
			})
			.then((drawingCells) => {
				this.config.zoom = getCellSize();
				this.config.landscape.width =
					this.config.canvas.width / this.config.zoom;
				this.config.landscape.height =
					this.config.canvas.height / this.config.zoom;
				let seedPicker = document.getElementById('seed');
				let seedSetting = seedPicker.value;

				return this.workerSystem.promiseResponse(
					Workers.LIFE_SYSTEM,
					WorkerCommands.LifeSystemCommands.SET_SEEDER,
					{
						seedSetting: seedSetting,
						config: this.config,
						cells: drawingCells,
					}
				);
			})
			.then(() => {
				this.lifeWorker.postMessage({
					command: WorkerCommands.LifeCycle.START,
				});
			})
			.catch((reason) => {
				console.error(
					`There was an error trying to build the seeder.\n${reason}`
				);
			});
	}

	stopSimulation() {
		this.lifeWorker.postMessage({
			command: WorkerCommands.LifeCycle.STOP,
		});
	}

	resumeSimulation() {
		this.lifeWorker.postMessage({
			command: WorkerCommands.LifeCycle.START,
		});
	}

	toggleDisplayStorageStructure() {
		let displayStorageCheckbox = document.getElementById('display_storage');

		this.lifeWorker.postMessage({
			command: WorkerCommands.LifeSystemCommands.DISPLAY_STORAGE,
			displayStorage: displayStorageCheckbox.checked,
		});

		this.drawingWorker.postMessage({
			command: WorkerCommands.DrawingSystemCommands.DISPLAY_STORAGE,
			displayStorage: displayStorageCheckbox.checked,
		});
	}

	changedCellSize() {
		let cellSize = getCellSize();

		this.lifeWorker.postMessage({
			command: WorkerCommands.LifeSystemCommands.SET_CELL_SIZE,
			cellSize: cellSize,
		});

		this.drawingWorker.postMessage({
			command: WorkerCommands.DrawingSystemCommands.SET_CELL_SIZE,
			cellSize: cellSize,
		});
		this.handleGridBackground();
	}
}

function sizeCanvas(config) {
	//Override the default configuration to size the HTML Canvas
	//to fit the document. Note: This will use the same padding/margins
	//as the HTML Body.
	let blockElement = document.getElementById('block');
	let headerElement = document.getElementById('header');
	let controlBarElement = document.getElementById('control_bar');
	let statusBarElement = document.getElementById('status_bar');
	let bodyMargin = 8 * 2; //Padding on body element in CSS is 8 top and bottom.

	config.canvas.height =
		window.innerHeight -
		bodyMargin -
		(blockElement.offsetHeight +
			headerElement.offsetHeight +
			controlBarElement.offsetHeight +
			statusBarElement.offsetHeight);

	let canvasContainerDiv = document.getElementById('canvas_container');
	let gridCanvas = document.getElementById('grid_canvas');
	let simCanvas = document.getElementById('sim_canvas');
	let drawCanvas = document.getElementById('draw_canvas');

	//WARNING: Setting the canvas height changes the body
	//width so always set the height before the width.
	canvasContainerDiv.style.height = `${config.canvas.height}px`;
	gridCanvas.setAttribute('height', config.canvas.height);
	simCanvas.setAttribute('height', config.canvas.height);
	drawCanvas.setAttribute('height', config.canvas.height);

	config.canvas.width = document.body.clientWidth;
	canvasContainerDiv.style.width = `${config.canvas.width}px`;
	gridCanvas.setAttribute('width', config.canvas.width);
	simCanvas.setAttribute('width', config.canvas.width);
	drawCanvas.setAttribute('width', config.canvas.width);
}

function getCellSize() {
	let cellSizeControl = document.getElementById('cell_size');
	return Number.parseInt(cellSizeControl.value);
}
