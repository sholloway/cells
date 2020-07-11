/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const { Cell } = __webpack_require__(1);

class DrawingTemplate {
	constructor() {}

	generateCells(x, y) {
		let cells = this.makeCellsFrom2DArray(this.pattern());
		let patternOrigin = this.origin();
		let shift = {
			x: x + patternOrigin.x,
			y: y + patternOrigin.y,
		};

		cells.forEach((c) => {
			c.row += shift.x;
			c.col += shift.y;
		});
		return cells;
	}

	pattern() {
		throw new Error('Children of DrawingTemplate must implement pattern().');
	}

	origin() {
		return { x: 0, y: 0 };
	}

	makeCellsFrom2DArray(grid) {
		let cells = [];
		grid.forEach((row, rowIndex) => {
			row.forEach((value, colIndex) => {
				if (value == 1) {
					cells.push(new Cell(colIndex, rowIndex, 1));
				}
			});
		});
		return cells;
	}
}

module.exports = DrawingTemplate;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * A module for defining render-able entities with traits.
 * @module entity_system
 */

const CellStates = __webpack_require__(6);

/**
 * A render-able entity. The entity is defined by registering traits.
 */
class Entity {
	/**
	 * Create a new Entity.
	 */
	constructor() {
		this.traits = [];
		this.className = 'Entity';
	}

	/**
	 * Process all register traits.
	 * @param {HTMLCanvasContext} rendererContext
	 */
	render(rendererContext) {
		let context = {
			rendererContext: rendererContext,
			entity: this,
		};
		this.traits.forEach((trait) => {
			trait.process(context);
		});
	}

	/**
	 * Expands the definition of the entity by registering traits.
	 * @param {Trait} trait - An implementation of the Trait abstract class.
	 */
	register(trait) {
		this.traits.push(trait);
		return this;
	}

	/**
	 * Automatically called by JSON.stringify().
	 * Injects the original class name as a property when serialized
	 * which an be used to rebuild a Scene after communicated from a thread.
	 * @returns Entity
	 */
	toJSON() {
		this.className = this.constructor.name;
		return this;
	}

	copyParams(original) {
		for (var key in original) {
			if (key != 'className' && key != 'traits') {
				this[key] = original[key];
			}
		}
		return this;
	}

	initTraits(original, traitBuilderFactory) {
		this.traits = original.traits.map((traitLit) => {
			var traitBuilder = traitBuilderFactory(traitLit.className);
			return traitBuilder ? traitBuilder(traitLit) : new Trait();
		});
		return this;
	}
}

class EntityBatch extends Entity {
	constructor() {
		super();
		this.entities = [];
	}

	add(entity) {
		if (entity && Array.isArray(entity) && entity.length > 0) {
			this.entities = this.entities.concat(entity);
		} else {
			entity && this.entities.push(entity);
		}
		return this;
	}
}

class EntityBatchArrayBuffer extends Entity {
	constructor(buffer, offset, numberOfEntities, entityFieldsCount) {
		super();
		this.buffer = buffer;
		this.initialOffset = offset;
		this.bufferEnd = offset + numberOfEntities * entityFieldsCount;
		this.numberOfEntities = numberOfEntities;
		this.entityFieldsCount = entityFieldsCount;
	}
}

const CELL_WIDTH = 1;
const CELL_HEIGHT = 1;

/**
 * Represents a single unit on an abstract 2D grid.
 *
 * The width and height of the cell are the equal.
 * The grid is uniform.
 * @extends Entity
 */
class Cell extends Entity {
	/**
	 * Create a new cell.
	 * @param {number} row - The horizontal location of the cell on a grid.
	 * @param {number} col - The vertical location of the cell on a grid.
	 */
	constructor(row, col, state = CellStates.ACTIVE) {
		super();
		this.className = 'Cell';
		this.row = row;
		this.col = col;
		this.state = state;
	}

	/**
	 * Intersection Test. Is the cell inside of a provided rectangle.
	 * @param {number} x
	 * @param {number} y
	 * @param {number} xx
	 * @param {number} yy
	 * @returns {boolean}
	 */
	isInsideRect(x, y, xx, yy) {
		return x <= this.row && this.row <= xx && y <= this.col && this.col <= yy;
	}

	/**
	 * Create a deep copy of the cell.
	 * @returns {Cell}
	 */
	clone() {
		return new Cell(this.row, this.col);
	}

	rightBoundary() {
		return this.row + CELL_WIDTH;
	}

	lowerBoundary() {
		return this.col + CELL_HEIGHT;
	}

	static buildInstance(params) {
		return new Cell().copyParams(params);
	}

	static mergeObjsWithCells(cells, objs) {
		objs.forEach((obj) => {
			//Don't include any boxes.
			if (
				obj.className === 'Cell' &&
				!cells.some((c) => c.row == obj.row && c.col == obj.col)
			) {
				cells.push(this.buildInstance(obj));
			}
		});
	}
}

class DeadCell extends Cell {
	constructor(row, col) {
		super(row, col);
	}

	getState() {
		return CellStates.DEAD;
	}
}

/**
 * A grid.
 */
class GridEntity extends Entity {
	/**
	 * Creates a new grid entity
	 * @param {number} width - The total width of the grid.
	 * @param {number} height - The total height of the grid.
	 * @param {number} cWidth - The width of a grid cell.
	 * @param {number} cHeight - The height of a grid cell.
	 */
	constructor(width = null, height = null, cWidth = null, cHeight = null) {
		super();
		this.width = width;
		this.height = height;
		this.cell = { width: cWidth, height: cHeight };
		this.className = 'GridEntity';
	}

	static buildInstance(params, traitBuilderMap = null) {
		let entity = new GridEntity().copyParams(params);
		traitBuilderMap && entity.initTraits(params, traitBuilderMap);
		return entity;
	}
}

/**
 * Represents a box that can be processed via Traits.
 */
class Box extends Entity {
	/**
	 * Creates a new Box.
	 * @param {number} x - Left most X coordinate.
	 * @param {number} y - Upper most Y coordinate.
	 * @param {number} xx - Right most X coordinate.
	 * @param {number} yy - Lower most Y coordinate.
	 * @param {boolean} alive - If the cell is alive or not.
	 */
	constructor(x = null, y = null, xx = null, yy = null, alive = null) {
		super();
		this.x = x;
		this.y = y;
		this.xx = xx;
		this.yy = yy;
		this.alive = alive;
		this.className = 'Box';
	}

	static buildInstance(params, traitBuilderMap = null) {
		let box = new Box().copyParams(params);
		traitBuilderMap && box.initTraits(params, traitBuilderMap);
		return box;
	}
}

module.exports = {
	Box,
	Cell,
	DeadCell,
	Entity,
	EntityBatch,
	EntityBatchArrayBuffer,
	GridEntity,
	CELL_HEIGHT,
	CELL_WIDTH,
};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

const handler = {
	get: function (obj, prop) {
		return prop in obj ? obj[prop] : 'Undefined Command';
	},
};

module.exports = new Proxy(
	{
		LifeCycle: new Proxy(
			{
				START: 'START',
				STOP: 'STOP',
				PAUSE: 'PAUSE',
				PROCESS_CYCLE: 'PROCESS_CYCLE',
			},
			handler
		),
		DrawingSystemCommands: new Proxy(
			{
				SET_CELLS: 'SET_CELLS',
				SET_CELL_SIZE: 'SET_CELL_SIZE',
				SEND_CELLS: 'SEND_CELLS',
				RESET: 'RESET',
				TOGGLE_CELL: 'TOGGLE_CELL',
				DISPLAY_STORAGE: 'DISPLAY_STORAGE',
				DRAW_TEMPLATE: 'DRAW_TEMPLATE',
				DRAW_LINEAR_ELEMENTRY_CA: 'DRAW_LINEAR_ELEMENTRY_CA',
			},
			handler
		),
		LifeSystemCommands: new Proxy(
			{
				DISPLAY_STORAGE: 'DISPLAY_STORAGE',
				RESET: 'RESET',
				SEND_ALIVE_CELLS_COUNT: 'SEND_ALIVE_CELLS_COUNT',
				SEND_CELLS: 'SEND_CELLS',
				SEND_SIMULATION_ITERATIONS_COUNT: 'SEND_SIMULATION_ITERATIONS_COUNT',
				SET_CELL_SIZE: 'SET_CELL_SIZE',
				SET_CONFIG: 'SET_CONFIG',
				SET_SEEDER: 'SET_SEEDER',
			},
			handler
		),
	},
	handler
);


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * A web worker that is responsible for the drawing system.
 */

const DrawingSystemWorkerController = __webpack_require__(4);

const { establishWorkerContext } = __webpack_require__(22);

let controller = new DrawingSystemWorkerController(establishWorkerContext());

function getController() {
	return controller;
}

onmessage = function (event) {
	event && event.data && controller.process(event.data);
};

// These are to enable unit tests. Do not invoke directly.
module.exports = {
	onmessage,
	establishWorkerContext,
	getController,
};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const {
	AbstractWorkerController,
	PackingConstants,
} = __webpack_require__(5);
const DrawingSystem = __webpack_require__(7);
const WorkerCommands = __webpack_require__(2);
const Layers = __webpack_require__(21);
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
			let response = {
				id: msg.id,
				promisedResponse: msg.promisedResponse,
				command: msg.command,
				origin: Layers.DRAWING,
				numberOfCells: sceneStack.length,
				cellFieldsCount: PackingConstants.FIELDS_PER_CELL,
				stack: this.packScene(sceneStack),
			};
			this.sendMessageToClient(response, [response.stack.buffer]);
		}
	}
}

module.exports = DrawingSystemWorkerController;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const WorkerCommands = __webpack_require__(2);
const LifeCycle = WorkerCommands.LifeCycle;
const { Cell } = __webpack_require__(1);

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
	packScene(sceneStack) {
		// prettier-ignore
		let bufferLength = PackingConstants.BYTES_PER_NUMBER * PackingConstants.FIELDS_PER_CELL * sceneStack.length;
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


/***/ }),
/* 6 */
/***/ (function(module, exports) {

/**
 * Defines the possible states a Cell can have.
 */
const CellStates = {
	DEAD: 0,
	ACTIVE: 1,
	RETIRED: 2
};

module.exports = CellStates;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const DrawingStateManager = __webpack_require__(8);
const SceneManager = __webpack_require__(10);
const TemplateFactory = __webpack_require__(11);
const { Cell } = __webpack_require__(1);
/**
 * The possible states the drawing system can be in.
 * @private
 */
const States = {
	IDLE: 'IDLE',
	UPDATING: 'UPDATING',
};

/**
 * A system for drawing on a grid. Designed to be used in the context of a web worker.
 */
class DrawingSystem {
	/**
	 * Creates a new drawing system.
	 */
	constructor() {
		this.config = {
			zoom: 1,
		};
		this.stateManager = new DrawingStateManager(this.config);
		this.scene = new SceneManager();
		this.displayStorageStructure = false;
		this.state = States.IDLE;
	}

	/**
	 * @returns {State} Returns the active state.
	 */
	getState() {
		return this.state;
	}

	/**
	 * Replaces the current configuration.
	 * @param {*} config
	 */
	setConfig(config) {
		this.config = config;
		this.stateManager.setConfig(this.config);
	}

	/**
	 * @returns {SceneManager} The current scene.
	 */
	getScene() {
		return this.scene;
	}

	/**
	 * @returns {DrawingStateManager} Returns the state manager for the drawing system.
	 */
	getStateManager() {
		return this.stateManager;
	}

	update() {
		this.state = States.UPDATING;
		this.scene.clear();
		this.getStateManager().processCells(this.scene);
		this.state = States.IDLE;
	}

	canUpdate() {
		return this.state === States.IDLE;
	}

	/**
	 * Used to preload the drawing system with alive cells.
	 * @param {Cell[]} cells - An array of alive cells.
	 */
	setCells(cells) {
		this.getStateManager().setCells(cells);
	}

	/**
	 * Provides a deep copy of the currently alive cells.
	 * @returns {Cell[]}
	 */
	getCells() {
		return this.getStateManager().getCells();
	}

	/**
	 * Sets the cell size to use.
	 * @param {number} size
	 */
	setCellSize(size) {
		if (!this.config) {
			this.config = {};
		}
		this.config.zoom = size;
	}

	/**
	 * Flips a grid cell to alive or dead.
	 * @param {number} x - The X coordinate of the cell.
	 * @param {number} y - The Y coordinate of the cell.
	 */
	toggleCell(x, y) {
		if (this.state === States.IDLE) {
			this.state = States.UPDATING;
			this.getStateManager().toggleCell(x, y);
			this.state = States.IDLE;
		}
	}

	/**
	 * Sets whether to draw the quad tree.
	 * @param {boolean} display
	 */
	displayStorage(display) {
		this.displayStorageStructure = display;
	}

	/**
	 * Clears the simulation.
	 */
	reset() {
		this.scene.clear();
		this.getStateManager().clear();
	}

	drawTemplate(templateName, row, col, config) {
		let newCells = TemplateFactory.generate(templateName, row, col, config);
		Cell.mergeObjsWithCells(newCells, this.getCells());
		this.setCells(newCells);
	}
}

module.exports = DrawingSystem;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const { CellMortonStore } = __webpack_require__(9);
const { Cell } = __webpack_require__(1);

/**
 * Orchestrates drawing.
 */
class DrawingStateManager {
	/**
	 * Create a new DrawingStateManager.
	 * @param {object} config - The simulation configuration object.
	 */
	constructor(config) {
		this.config = config;
		this.currentStore = new CellMortonStore();
	}

	setConfig(config) {
		this.config = config;
	}

	/**
	 * Set's what cells should be in the initial drawing.
	 * @param {Cell[]} cells - An array of alive cells.
	 */
	setCells(cells) {
		this.clear();
		this.currentStore.addList(cells);
	}

	/**
	 * Creates a deep copy of the cells in the drawing.
	 * @returns {Cell[]} The copy of the cells.
	 */
	getCells() {
		return this.currentStore.cells();
	}

	/**
	 * Draws a cell or removes it.
	 * @param {number} x - The X coordinate on the simulation's grid.
	 * @param {number} y - The Y coordinate on the simulation's grid.
	 */
	toggleCell(x, y) {
		//Assume it's already there and try to delete it.
		if (!this.currentStore.delete(x, y)) {
			//If the delete failed, then it wasn't already there, so add it.
			this.currentStore.add(new Cell(x, y));
		}
	}

	/**
	 * Prepares the alive cells to be drawn.
	 * @param {SceneManager} scene - The scene to add the cells to.
	 */
	processCells(scene) {
		scene.push(this.currentStore.cells());
	}

	/**
	 * Empties the drawing simulation.
	 */
	clear() {
		this.currentStore.clear();
	}
}

module.exports = DrawingStateManager;


/***/ }),
/* 9 */
/***/ (function(module, exports) {

//Borrowed from: https://github.com/mikolalysenko/bit-twiddle/blob/master/twiddle.js
function encode(x, y) {
	x &= 0xffff; //Constrain to 16 bits. 0xffff is 65535 which is the number range of 16 bits. 1111111111111111 in binary. Numbers larger than 65535 will roll over.
	x = (x | (x << 8)) & 0x00ff00ff; //Shift to the left by 8. Mask: 111111110000000011111111
	x = (x | (x << 4)) & 0x0f0f0f0f; //Mask: 1111000011110000111100001111
	x = (x | (x << 2)) & 0x33333333; //Mask: 110011001100110011001100110011
	x = (x | (x << 1)) & 0x55555555; //Mask: 1010101010101010101010101010101

	y &= 0xffff;
	y = (y | (y << 8)) & 0x00ff00ff;
	y = (y | (y << 4)) & 0x0f0f0f0f;
	y = (y | (y << 2)) & 0x33333333;
	y = (y | (y << 1)) & 0x55555555;

	return x | (y << 1);
}

function decode(zcode) {
	return [deinterleave(zcode, 0), deinterleave(zcode, 1)];
}

//Based on https://github.com/mikolalysenko/bit-twiddle/blob/master/twiddle.js
function deinterleave(zcode, component) {
	zcode = (zcode >>> component) & 0x55555555; // 1010101010101010101010101010101
	zcode = (zcode | (zcode >>> 1)) & 0x33333333; // 110011001100110011001100110011
	zcode = (zcode | (zcode >>> 2)) & 0x0f0f0f0f; // 1111000011110000111100001111
	zcode = (zcode | (zcode >>> 4)) & 0x00ff00ff; // 111111110000000011111111
	zcode = (zcode | (zcode >>> 8)) & 0x000ffff; // 1111111111111111
	return (zcode << 16) >> 16;
}

function clip(value, min, max) {
	return Math.min(max, Math.max(min, value));
}

class CellMortonStore {
	constructor(width, height) {
		this.map = new Map();
	}

	size() {
		return this.map.size;
	}

	addList(cells) {
		for (var i = 0; i < cells.length; i++) {
			this.map.set(encode(cells[i].row, cells[i].col), cells[i]);
		}
		return this;
	}

	add(cell) {
		this.map.set(encode(cell.row, cell.col), cell);
		return this;
	}

	search(x, y) {
		return this.get(encode(x, y));
	}

	has(zcode) {
		return this.map.has(zcode);
	}

	get(zcode) {
		return this.map.get(zcode);
	}

	delete(x, y) {
		return this.map.delete(encode(x, y));
	}

	clear() {
		this.map.clear();
		return this;
	}

	cells() {
		return [...this.map.values()];
	}

	/**
	 * Find all of the cells in a given cell's Moore neighborhood.
	 *
	 * {@link https://www.conwaylife.com/wiki/Cellular_automaton#Common_dimensions_and_neighborhoods | Moore Neighborhood}
	 *
	 * @param {*} cell
	 */
	neighborhood(cell, width, height) {
		let found = [];
		let current;

		//constrain the neigborhood to the boundaries of the grid
		let left = clip(cell.row - 1, 0, width);
		let right = clip(cell.row + 1, 0, width);
		let bottom = clip(cell.col - 1, 0, height);
		let top = clip(cell.col + 1, 0, height);

		for (var row = left; row <= right; row++) {
			for (var col = bottom; col <= top; col++) {
				current = this.get(encode(row, col));
				current && found.push(current);
			}
		}
		return found;
	}
}

module.exports = { decode, encode, CellMortonStore, clip };


/***/ }),
/* 10 */
/***/ (function(module, exports) {

/**
 * Data structure for storing the entities ready to render.
 */
class SceneManager {
	/**
	 * Create a new SceneManager
	 */
	constructor() {
		this.stack = [];
	}

	/**
	 * Add a a single entity or an array of entities to the scene to be rendered.
	 * @param {Entity | Entity[]} entity
	 * @return {SceneManager} Returns the instance of the SceneManager.
	 */
	push(entity) {
		if (Array.isArray(entity)) {
			this.stack = this.stack.concat(entity);
		} else {
			this.stack.push(entity);
		}
		return this;
	}

	/**
	 * Pop the next entity off the scene's stack.
	 * @returns {Entity} The next entity to render.
	 */
	nextEntity() {
		return this.stack.shift();
	}

	/**
	 * Determine if the stack is empty or not.
	 * @returns {boolean}
	 */
	fullyRendered() {
		return !(this.stack.length > 0);
	}

	/**
	 * Removes all entities from the stack.
	 */
	clear() {
		this.stack = [];
	}

	getStack() {
		return this.stack;
	}

	serializeStack() {
		return JSON.stringify(this.stack);
	}
}

module.exports = SceneManager;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

const ConwayMemorial = __webpack_require__(12);
const Block = __webpack_require__(13);
const HorizontalSpinner = __webpack_require__(14);
const VerticalSpinner = __webpack_require__(15);
const Toad = __webpack_require__(16);
const Glider = __webpack_require__(17);
const LightSpaceShip = __webpack_require__(18);
const LinearCellularAutomaton = __webpack_require__(19);
const RandomDiceRoll = __webpack_require__(20);

class TemplateFactory {
	static generate(commandName, x, y, config) {
		let template = commandName.startsWith('wr-rule-')
			? this.generateElementaryCA(commandName, config)
			: this.generateRegisteredTemplate(commandName, config);
		return template.generateCells(x, y);
	}

	static generateElementaryCA(commandName, config) {
		let tokens = commandName.split('-');
		let caRuleName = tokens[tokens.length - 1];
		let ruleNumber = Number.parseInt(caRuleName);
		return new LinearCellularAutomaton(
			config,
			ruleNumber,
			config.elementaryCAs.useRandomStart
		);
	}

	static generateRegisteredTemplate(commandName, config) {
		let template;
		switch (commandName) {
			case 'conways-memorial':
				template = new ConwayMemorial();
				break;
			case 'da-block':
				template = new Block();
				break;
			case 'vert-spinner':
				template = new VerticalSpinner();
				break;
			case 'horiz-spinner':
				template = new HorizontalSpinner();
				break;
			case 'toad':
				template = new Toad();
				break;
			case 'glider':
				template = new Glider();
				break;
			case 'light-ship':
				template = new LightSpaceShip();
				break;
			case 'wr-rule-110':
				template = new LinearCellularAutomaton(
					config,
					110
				).setInitializationAlgorithm((width) => width);
				break;
			case 'dice-roll':
				template = new RandomDiceRoll(config);
				break;
			default:
				throw new Error('Unknown template name.');
		}
		return template;
	}
}

module.exports = TemplateFactory;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

const DrawingTemplate = __webpack_require__(0);

class ConwayMemorial extends DrawingTemplate {
	constructor() {
		super();
	}

	pattern() {
		return [
			[0, 0, 1, 1, 1, 0, 0],
			[0, 0, 1, 0, 1, 0, 0],
			[0, 0, 1, 0, 1, 0, 0],
			[0, 0, 0, 1, 0, 0, 0],
			[1, 0, 1, 1, 1, 0, 0],
			[0, 1, 0, 1, 0, 1, 0],
			[0, 0, 0, 1, 0, 0, 1],
			[0, 0, 1, 0, 1, 0, 0],
			[0, 0, 1, 0, 1, 0, 0],
		];
	}

	//The center of origin for the pattern.
	origin() {
		return { x: -3, y: -4 };
	}
}

module.exports = ConwayMemorial;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

const DrawingTemplate = __webpack_require__(0);

class Block extends DrawingTemplate {
	constructor() {
		super();
	}

	pattern() {
		return [
			[1, 1],
			[1, 1],
		];
	}
}

module.exports = Block;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

const DrawingTemplate = __webpack_require__(0);

class HorizontalSpinner extends DrawingTemplate {
	constructor() {
		super();
	}

	pattern() {
		return [[1, 1, 1]];
	}
}

module.exports = HorizontalSpinner;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

const DrawingTemplate = __webpack_require__(0);

class VerticalSpinner extends DrawingTemplate {
	constructor() {
		super();
	}

	pattern() {
		// prettier-ignore
		return [
			[1], 
			[1], 
			[1]
		];
	}
}

module.exports = VerticalSpinner;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

const DrawingTemplate = __webpack_require__(0);

class Toad extends DrawingTemplate {
	constructor() {
		super();
	}

	pattern() {
		return [
			[0, 1, 1, 1],
			[1, 1, 1, 0],
		];
	}
}

module.exports = Toad;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

const DrawingTemplate = __webpack_require__(0);

class Glider extends DrawingTemplate {
	pattern() {
		return [
			[0, 1, 0],
			[0, 0, 1],
			[1, 1, 1],
		];
	}
}

module.exports = Glider;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

const DrawingTemplate = __webpack_require__(0);

class LightSpaceShip extends DrawingTemplate {
	pattern() {
		return [
			[0, 1, 0, 0, 1],
			[1, 0, 0, 0, 0],
			[1, 0, 0, 0, 1],
			[1, 1, 1, 1, 0],
		];
	}
}

module.exports = LightSpaceShip;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

const DrawingTemplate = __webpack_require__(0);

const INVALID_RULE_MSG = 'Can only process rules in the in range [0,255].';
class LinearCellularAutomaton extends DrawingTemplate {
	constructor(config, rule = 0, useRandomStart = false) {
		super();
		this.config = config;
		this.useRandomStart = useRandomStart; //TODO: This is also in the config param. Remove it.
		this.enforceRuleSet(rule)
			.setRuleSet(this.generateRuleSet(rule))
			.establishInitializationAlgorithm();
	}

	establishInitializationAlgorithm() {
		this.initializationAlgorithm = (width) => {
			//The default is to start the CA in the middle of row zero.
			return Math.floor(width / 2);
		};
		return this;
	}

	enforceRuleSet(rule) {
		if (rule < 0 || rule > 255) {
			throw new Error(INVALID_RULE_MSG);
		}
		return this;
	}

	/**
	 *
	 * @param {number} rule - An integer in the range [1,255].
	 * @returns number[] An integer represented as an 8 bit binary number.
	 */
	generateRuleSet(rule) {
		let binaryStr = rule.toString(2);
		let paddedStr = binaryStr.padStart(8, '0');
		return [...paddedStr].map((s) => parseInt(s));
	}

	generateCells(x, y) {
		return this.makeCellsFrom2DArray(this.pattern());
	}

	pattern() {
		let height = Math.floor(this.config.landscape.height);
		let width = Math.floor(this.config.landscape.width);
		let ca = Array(height);
		ca[0] = this.useRandomStart
			? this.randomStartingPoint(width)
			: this.traditionalStartingPoint(width);

		//Generate the next row based on the current row.
		let neighborhood;
		for (let row = 0; row < height; row++) {
			ca[row + 1] = Array(width);
			for (let col = 0; col < width; col++) {
				neighborhood = this.findNeighborHood(ca[row], col);
				ca[row + 1][col] = this.evaluateRules(neighborhood);
			}
		}
		return ca;
	}

	/**
	 * Generate the traditional starting point for elementary CAs.
	 * All zeros except for the center.
	 * @returns {Number[]}
	 */
	traditionalStartingPoint(width) {
		let startingPoint = this.findStartingIndex(width);
		//The first row is initialized to zero except for its starting point.
		let initialRow = Array(width).fill(0);
		initialRow[startingPoint] = 1;
		return initialRow;
	}

	randomStartingPoint(width) {
		return Array(width).fill(0).map((i) => this.rollDice());
	}

	//floor(random() * (max - min + 1)) + min
	//floor(random() * (1 - 0 + 1)) + 0
	//floor(random() * (2))
	rollDice() {
		return Math.floor(Math.random() * 2);
	}

	setInitializationAlgorithm(algorithm) {
		this.initializationAlgorithm = algorithm;
		return this;
	}

	findStartingIndex(width) {
		return this.initializationAlgorithm(width);
	}

	findNeighborHood(generation, index) {
		return [
			this.findArrayValue(generation, index - 1),
			this.findArrayValue(generation, index),
			this.findArrayValue(generation, index + 1),
		];
	}

	findArrayValue(array, index) {
		// Hard Dead Border
		// if (index < 0 || index > array.length - 1) {
		// 	return 0;
		// }

		//Wrap the border
		let value;
		if (index < 0) {
			value = array[array.length - 1];
		} else if (index > array.length - 1) {
			value = index[0];
		} else {
			value = array[index];
		}
		return value;
	}

	evaluateRules(neighborhood) {
		let ruleIndex = parseInt(neighborhood.join(''), 2);
		return this.getRule(ruleIndex);
	}

	getRule(ruleIndex) {
		return this.rulesSet[ruleIndex];
	}

	/**
	 * Stores the rule set in reverse order from Wolfram's Specificiation to enable binary lookup.
	 * @param {number[]} ruleSet
	 */
	setRuleSet(ruleSet) {
		this.rulesSet = ruleSet.reverse();
		return this;
	}

	getRulesSetStr() {
		return this.rulesSet.reverse().join('');
	}
}

module.exports = LinearCellularAutomaton;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

const DrawingTemplate = __webpack_require__(0);

class RandomDiceRoll extends DrawingTemplate {
	constructor(config) {
		super();
		this.config = config;
	}

  generateCells(x, y) {
		return this.makeCellsFrom2DArray(this.pattern());
  }
  
	pattern() {
		let height = Math.ceil(this.config.landscape.height);
		let width = Math.ceil(this.config.landscape.width);
		let birthRules = this.config.game.rules.birth;
		let grid = Array(height);
		for (let row = 0; row < height; row++) {
			grid[row] = Array(width);
			for (let col = 0; col < width; col++) {
				grid[row][col] = birthRules.includes(this.rollDice()) ? 1 : 0;
			}
		}
		return grid;
	}

	/**
	 * A cell can have 8 neighbors. Rolling the dice randomly selects a number
	 * in the range [0,8].
	 */
	rollDice() {
		//Leverages the pattern: Math.floor(Math.random() * (max - min + 1)) + min
		//                       Math.floor(Math.random() * (8 - 0 + 1)) + 0
		//                       Math.floor(Math.random() * (9))
		return Math.floor(Math.random() * 9);
	}
}

module.exports = RandomDiceRoll;


/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = {
	GRID: 'GRID',
	DRAWING: 'DRAWING',
	SIM: 'SIMULATION',
};


/***/ }),
/* 22 */
/***/ (function(module, exports) {

function establishWorkerContext() {
	return 'undefined' !== typeof WorkerGlobalScope ? self : this;
}

module.exports = { establishWorkerContext };


/***/ })
/******/ ]);
//# sourceMappingURL=1.cf60ffdef3cb1f37e5db.worker.js.map