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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * A module for defining render-able entities with traits.
 * @module entity_system
 */

const CellStates = __webpack_require__(0);

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

const CellStates = __webpack_require__(0);

/**
 * Enforces the simulation (game) rules.
 */
class CellEvaluator {
	/**
	 * Creates a new evaluator.
	 * @param {number[]} birthRules - The required alive neighbors for a cell to be born.
	 * @param {number[]} survivalRules - The required alive neighbors for a cell to stay alive.
	 */
	constructor(birthRules, survivalRules) {
		this.birthRules = birthRules;
		this.survivalRules = survivalRules;
	}

	evaluate(neighborsCount, currentCellState) {
		let nextCellState = CellStates.DEAD; //Be dead by default
		if (
			currentCellState == CellStates.DEAD &&
			this.birthRules.includes(neighborsCount)
		) {
			nextCellState = CellStates.ACTIVE; //Be Born
		} else if (
			currentCellState == CellStates.ACTIVE &&
			this.survivalRules.includes(neighborsCount)
		) {
			nextCellState = CellStates.ACTIVE; //Survive
		}
		return nextCellState;
	}
}

/**
 * An evaluator for Life that is slightly optimized.
 */
class LifeEvaluator extends CellEvaluator {
	constructor(birthRules, survivalRules) {
		super(birthRules, survivalRules);
	}

	evaluate(neighborsCount, currentCellState) {
		let nextCellState = CellStates.DEAD; //Be dead by default
		if (currentCellState == CellStates.DEAD) {
			if (neighborsCount == 3) {
				nextCellState = CellStates.ACTIVE; //Born
			}
		} else if (currentCellState == CellStates.ACTIVE) {
			if (neighborsCount == 2 || neighborsCount == 3) {
				nextCellState = CellStates.ACTIVE; //Survives
			}
		}
		return nextCellState;
	}
}

class LifeLike extends CellEvaluator {
	constructor(birthRules, survivalRules) {
		super(birthRules, survivalRules);
	}
}

class GenerationalCellEvaluator extends CellEvaluator {
	/**
	 * Creates a new evaluator.
	 * @param {number[]} birthRules - The required alive neighbors for a cell to be born.
	 * @param {number[]} survivalRules - The required alive neighbors for a cell to stay alive.
	 */
	constructor(birthRules, survivalRules, maxAge) {
		super(birthRules, survivalRules);
		this.maxAge = maxAge;
	}

	/**
	 * Evaluates a cell's next state based on the generations algorithm.
	 * Generations Algorithm
	 *  1. Dead cells can be born if the number of Moore active neighbors are included in the birth rules.
	 *  2. Alive cells can stay "active" if the number of Moore neighbors are included in the survive rules.
	 * 		 Cells aren't aging while active.
	 * 		 Cells move into the retired stage once the above rule fails.
	 *  3. Cells increment their age until they hit the max age then they die.
	 * @param {number} neighborsCount - The number of a live cells the current cell has.
	 * @param {CellState} currentCellState - the current state of cell.
	 * @returns {CellState} The state the cell should be set to.
	 */
	evaluate(neighborsCount, currentCellState) {
		let nextCellState = CellStates.DEAD; //Be dead by default
		if (currentCellState === CellStates.DEAD) {
			if (this.birthRules.includes(neighborsCount)) {
				nextCellState = CellStates.ACTIVE; //Be Born
			}
		} else if (currentCellState === CellStates.ACTIVE) {
			//Determine if the cell should stay active.
			nextCellState = this.survivalRules.includes(neighborsCount)
				? CellStates.ACTIVE //Stay Active
				: CellStates.RETIRED; //Start aging...
		} else {
			//Aging
			nextCellState =
				currentCellState < this.maxAge
					? currentCellState + 1 // Age
					: (nextCellState = CellStates.DEAD); //Die
		}

		return nextCellState;
	}
}

module.exports = { CellEvaluator, GenerationalCellEvaluator, LifeEvaluator };


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Conway's Game Initial State Seeder Module
 * @module seeders
 */
const CellStates = __webpack_require__(0);
const { Cell } = __webpack_require__(1);

/**
 * Randomly selects 0 or 1.
 * @private
 * @returns {number}
 */
function randomAliveOrDead() {
	return getRandomIntInclusive(CellStates.DEAD, CellStates.ACTIVE);
}

/**
 * Finds a random integer in the set defined by two bounds.
 * @private
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

/**
 * Abstract class. Defines a seeder.
 */
class Seeder {
	/**
	 * Initialize a new seeder.
	 */
	constructor() {
		this.cells = [];
	}

	/**
	 * The algorithm to seed the simulation with.
	 * @abstract
	 * @param {number} width
	 * @param {number} height
	 */
	seed(width, height) {
		throw new Error(
			'Seeder implementations must implement the seed(width, height) method.'
		);
	}

	/**
	 * Initial cells to use by the seeder.
	 * @param {Cell[]} cells
	 */
	setCells(cells) {
		this.cells = cells;
		return this;
	}
}

/**
 * Seeds a simulation with randomly selecting alive or dead for each cell.
 * @extends Seeder
 */
class RandomSeeder extends Seeder {
	constructor() {
		super();
	}

	seed(width, height) {
		for (let x = 0; x < width; x++) {
			for (let y = 0; y < height; y++) {
				let birthChance = randomAliveOrDead();
				if (birthChance == 1) {
					this.cells.push(new Cell(x, y, 1));
				}
			}
		}
		return this.cells;
	}
}

/**
 * Seeds a simulation with a provided set of alive cells.
 * @extends Seeder
 */
class StaticCellsSeeder extends Seeder {
	constructor() {
		super();
	}

	seed(width, height) {
		return this.cells;
	}
}

/**
 * The set of supported seeder models.
 */
SeederModels = {
	DRAWING: 'draw',
	RANDOM: 'random',
};

/**
 * Creates a new seeder based on a specified seeder model name.
 */
class SeederFactory {
	/**
	 * Initializes a new seeder.
	 * @param {string} modelName
	 * @returns {Seeder}
	 */
	static build(modelName) {
		let seeder = null;
		switch (modelName) {
			case SeederModels.RANDOM:
				seeder = new RandomSeeder();
				break;
			case SeederModels.DRAWING:
				seeder = new StaticCellsSeeder();
				break;
			default:
				throw new Error(`Unknown seeder model name: ${modelName}`);
		}
		return seeder;
	}
}

module.exports = { Seeder, SeederFactory, SeederModels };


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * A web worker that is responsible for the Conway's Game of Life system.
 */
const { establishWorkerContext } = __webpack_require__(6);
const LifeSystemWorkerController = __webpack_require__(7);

let controller = new LifeSystemWorkerController(establishWorkerContext());

function getController() {
	return controller;
}

onmessage = function (event) {
	controller.process(event.data);
};

module.exports = {
	getController,
	onmessage,
};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

function establishWorkerContext() {
	return 'undefined' !== typeof WorkerGlobalScope ? self : this;
}

module.exports = { establishWorkerContext };


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const WorkerCommands = __webpack_require__(2);
const LifeSystemCmds = WorkerCommands.LifeSystemCommands;
const LifeSystem = __webpack_require__(8);

const {
	AbstractWorkerController,
	PackingConstants,
} = __webpack_require__(12);
const { SeederFactory } = __webpack_require__(4);

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
						this.lifeSystem.reset(this.findPromisedProperty(msg, 'config'));
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
						let cells = this.lifeSystem.getCells();
						let response = {
							id: msg.id,
							promisedResponse: msg.promisedResponse,
							command: msg.command,
							numberOfCells: cells.length,
							cells: this.packScene(cells),
						};
						this.sendMessageToClient(response, [response.cells.buffer]);
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
			case LifeSystemCmds.SET_CONFIG:
				this.processCmd(
					msg,
					msg.command,
					(msg) => this.findPromisedProperty(msg, 'config'),
					(msg) =>
						this.lifeSystem.setConfig(this.findPromisedProperty(msg, 'config')),
					'The config field was not provided.'
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

			let response = {
				command: msg.command,
				stack: this.packScene(sceneStack),
				aliveCellsCount: aliveCellsCount,
				numberOfSimulationIterations: this.lifeSystem.numberOfSimulationIterations(),
				numberOfCells: sceneStack.length,
				cellFieldsCount: PackingConstants.FIELDS_PER_CELL,
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
		let cells = this.unpackCells(
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
}

module.exports = LifeSystemWorkerController;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const GameManager = __webpack_require__(9);
const SceneManager = __webpack_require__(11);
const {
	CellEvaluator,
	GenerationalCellEvaluator,
	LifeEvaluator,
} = __webpack_require__(3);
/**
 * The possible states the drawing system can be in.
 * @private
 */
const States = {
	IDLE: 'IDLE',
	UPDATING: 'UPDATING',
};

/**
 * A Quad tree based Conway's Game of Life simulation.
 */
class LifeSystem {
	constructor() {
		this.config = {};
		this.tickCounter = 0;
		this.scene = new SceneManager();
		this.stateManager = new GameManager(this.config);
		this.displayStorageStructure = false;
		this.state = States.IDLE;
		this.seeder = null;
		this.simulationInitialized = false;
		this.cellEvaluator = undefined; //Will be set when calling this.setConfig()
	}

	/**
	 * Getter for the internal system state.
	 * @returns {State} Returns the active state.
	 */
	getState() {
		return this.state;
	}

	/**
	 * Replaces the current configuration.
	 * @param {*} config The configuration.
	 */
	setConfig(config) {
		this.config = config;
		this.getStateManager().setConfig(this.config);
		this.cellEvaluator = this.createCellEvaluator(this.config.game.activeGame);
		return this;
	}

	/**
	 * @returns {SceneManager} The current scene.
	 */
	getScene() {
		return this.scene;
	}

	/**
	 * @returns {GameManager} Returns the state manager for the drawing system.
	 */
	getStateManager() {
		return this.stateManager;
	}

	/**
	 * Calculates if the system can perform an update or not.
	 * @returns {Boolean}
	 */
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
	 * @param {number} size The cell size
	 */
	setCellSize(size) {
		if (!this.config) {
			this.config = {};
		}
		this.config.zoom = size;
	}

	/**
	 * Sets whether to draw the quad tree.
	 * @param {boolean} display The display value.
	 */
	displayStorage(display) {
		this.displayStorageStructure = display;
	}

	getDisplayStorage() {
		return this.displayStorageStructure;
	}

	/**
	 * Getter for the number of currently alive cells.
	 * @returns {number} The count of alive cells.
	 */
	aliveCellsCount() {
		return this.getStateManager().aliveCellsCount();
	}

	/**
	 * Sets the simulation seeder to be used.
	 * @param {Seeder} seeder - An implementation of the Seeder abstract class.
	 */
	setSeeder(seeder) {
		this.seeder = seeder;
		return this;
	}

	/**
	 * Processes the scene for one tick of the simulation.
	 * @throws {Error} Throws an error if called before the simulation has been intialized.
	 * @returns {LifeSystem} Returns the LifeSystem instance.
	 */
	update() {
		if (this.simulationInitialized) {
			this.scene.clear();
			this.getStateManager()
				.evaluateCells(this.scene, this.cellEvaluator)
				.activateNext();
			this.tickCounter++;
		} else {
			throw new Error(
				'Cannot update. The simulation has not been initialized yet.'
			);
		}
		return this;
	}

	createCellEvaluator(game) {
		let evaluator;
		if (game.key == 'conways-game-of-life') {
			evaluator = new LifeEvaluator(game.born, game.survive);
		} else if (game.maxAge) {
			//Generational Games
			evaluator = new GenerationalCellEvaluator(
				game.born,
				game.survive,
				game.maxAge
			);
		} else {
			evaluator = new CellEvaluator(game.born, game.survive);
		}
		return evaluator;
	}

	/**
	 * Seeds the world when the simulation starts.
	 * @returns {LifeSystem} Returns the LifeSystem instance.
	 */
	initializeSimulation() {
		if (!this.simulationInitialized) {
			this.getStateManager().seedWorld(this.seeder);
			this.simulationInitialized = true;
		}
		return this;
	}

	/**
	 * Clears the simulation.
	 * @returns {LifeSystem} Returns the LifeSystem instance.
	 */
	reset(config) {
		this.tickCounter = 0;
		this.simulationInitialized = false;
		this.setConfig(config);
		this.scene.clear();
		this.getStateManager().clear();
		return this;
	}

	/**
	 * Returns the number of simulation ticks the life system has been updated.
	 * @returns {number} Simulation ticks.
	 */
	numberOfSimulationIterations() {
		return this.tickCounter;
	}
}

module.exports = LifeSystem;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

const { CellMortonStore } = __webpack_require__(10);
const { CellEvaluator } = __webpack_require__(3);
const { Cell } = __webpack_require__(1);
const CellStates = __webpack_require__(0);
const { SeederFactory, SeederModels } = __webpack_require__(4);

/**
 * Create the default cell evaluator.
 * @private
 * @returns {CellEvaluator}
 */
function defaultCellEvaluator() {
	return new CellEvaluator();
}

/**
 * Create the default simulation seeder.
 * @private
 * @returns {Seeder}
 */
function defaultSeeder() {
	return SeederFactory.build(SeederModels.RANDOM);
}

/**
 * Orchestrates Conway's Game of Life.
 */
class GameManager {
	/**
	 * Create a new GameManager instance.
	 * @param {object} config - The simulation's configuration object.
	 */
	constructor(config) {
		this.config = config;
		this.currentStore = new CellMortonStore();
		this.nextStore = new CellMortonStore();
	}

	setConfig(config) {
		this.config = config;
	}

	/**
	 * The number of cells currently alive in the simulation.
	 * @returns {number}
	 */
	aliveCellsCount() {
		return this.currentStore.size();
	}

	/**
	 * Creates a deep copy of the cells in the drawing.
	 * @returns {Cell[]} The copy of the cells.
	 */
	getCells() {
		return this.currentStore.cells();
	}

	/**
	 * Populates the current tree.
	 */
	seedWorld(seeder = defaultSeeder()) {
		let aliveCells = seeder.seed(
			this.config.landscape.width,
			this.config.landscape.height
		);
		this.currentStore.addList(aliveCells);
	}

	evaluateCells(scene, evaluator = defaultCellEvaluator()) {
		//1. Traverse every possible cell on the landscape, building up a list of new alive cells.
		// prettier-ignore
		let aliveNeighborsCount, nextCellState, x, y, xx, yy, cellsInArea, currentCellState;
		let nextAliveCells = [];
		let cellBin = new CellBin();

		for (let row = 0; row < this.config.landscape.width; row++) {
			for (let col = 0; col < this.config.landscape.height; col++) {
				cellsInArea = this.currentStore.neighborhood(
					{ row: row, col: col },
					this.config.landscape.width,
					this.config.landscape.height
				);

				//Assume the cell is dead.
				currentCellState = CellStates.DEAD;
				aliveNeighborsCount = 0;

				//Find the current cell's state and the count of active cells.
				for (let i = 0; i < cellsInArea.length; i++) {
					if (cellsInArea[i].row == row && cellsInArea[i].col == col) {
						currentCellState = cellsInArea[i].state;
						continue; //Don't count the current cell in the neighborhood calculation.
					}

					if (cellsInArea[i].state === CellStates.ACTIVE) {
						aliveNeighborsCount++;
					}
				}

				nextCellState = evaluator.evaluate(
					aliveNeighborsCount,
					currentCellState
				);

				if (nextCellState !== CellStates.DEAD) {
					// nextAliveCells.push(new Cell(row, col, nextCellState));
					cellBin.add(new Cell(row, col, nextCellState));
				}
			}
		}

		//Merge the bins into a single pre-sorted array of cells.
		nextAliveCells = cellBin.merge();
		cellBin.clear();

		//2. Create a new hash store from the list of active and aging cells.
		this.nextStore.clear();
		this.nextStore.addList(nextAliveCells);

		//3. Feed the cells to the scene manager.
		scene.push(nextAliveCells);
		return this;
	}

	/**
	 * Replace the current tree with the next state tree and re-initializes the next tree to be empty.
	 */
	activateNext() {
		this.currentStore.clear();
		this.currentStore = null;
		this.currentStore = this.nextStore;
		this.nextStore = new CellMortonStore();
		return this;
	}

	/**
	 * Purges the game manager of all alive cells.
	 */
	clear() {
		this.currentStore.clear();
		this.nextStore.clear();
	}
}

/**
 * Stores cells in arrays partitioned by their state.
 */
class CellBin {
	constructor() {
		this.bin = new Map();
	}

	add(cell) {
		if (cell && cell.state) {
			this.bin.has(cell.state)
				? this.bin.get(cell.state).push(cell)
				: this.bin.set(cell.state, [cell]);
		} else {
			throw new Error('Cannot add an undeclared Cell.');
		}
		return this;
	}

	/**
	 * Creates a new array by combining the bins in increasing key order.
	 * @returns {Cell[]} An array of cells.
	 */
	merge() {
		let cells = [];
		let groupedCells;
		let keys = Array.from(this.bin.keys()).sort();
		//keys.forEach((k) => cells.push(...this.bin.get(k)));
		for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
			groupedCells = this.bin.get(keys[keyIndex]);
			for (let cellIndex = 0; cellIndex < groupedCells.length; cellIndex++) {
				cells.push(groupedCells[cellIndex]);
			}
		}
		return cells;
	}

	clear() {
		this.bin.clear();
	}
}
module.exports = GameManager;


/***/ }),
/* 10 */
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
/* 11 */
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
/* 12 */
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


/***/ })
/******/ ]);
//# sourceMappingURL=2.f7e82d3e535da9f8882a.worker.js.map