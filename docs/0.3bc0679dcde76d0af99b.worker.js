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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * A module for defining render-able entities with traits.
 * @module entity_system
 */

const CellStates = __webpack_require__(4);

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
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const WorkerCommands = __webpack_require__(2);
/**
 * A web worker dedicated to constructing a 2D grid. Rendered by the main frame.
 */
onmessage = function (event) {
	let msg = event.data;
	if (!msg.command) {
		console.error('Unexpected messaged received in GridSystemWorker.');
		console.error(event);
		return;
	}

	let scene;
	switch (msg.command) {
		case WorkerCommands.LifeCycle.PROCESS_CYCLE:
			//TODO: Add error handling around parameters
			scene = GridBuilder.buildGrid(
				msg.parameters.cellWidth,
				msg.parameters.cellHeight,
				msg.parameters.gridWidth,
				msg.parameters.gridHeight
			);
			break;
		default:
			console.error('Unsupported command received in GridSystemWorker.');
			console.error(msg.command);
			scene = GridBuilder.buildEmptyScene();
			break;
	}
	postMessage({
		command: msg.command,
		stack: scene.getStack(),
	});
};

const SceneManager = __webpack_require__(3);
const { Box, GridEntity } = __webpack_require__(0);
const { ProcessBoxAsRect, GridPattern } = __webpack_require__(5);

class GridBuilder {
	/**
	 * Constructs a scene containing a 2D grid.
	 * @param {number} cellWidth
	 * @param {number} cellHeight
	 * @param {number} gridWidth
	 * @param {number} gridHeight
	 * @returns SceneManager
	 */
	static buildGrid(cellWidth, cellHeight, gridWidth, gridHeight) {
		let scene = new SceneManager();
		let grid = new GridEntity(gridWidth, gridHeight, cellWidth, cellHeight);
		grid.register(new GridPattern());
		return scene.push(grid);
	}

	/**
	 * Constructs a scene that will simply clear the area.
	 * @param {number} gridWidth
	 * @param {number} gridHeight
	 */
	static buildClearedArea(gridWidth, gridHeight) {
		let scene = new SceneManager();
		let area = new Box(0, 0, gridWidth, gridHeight, false);
		area.register(new ProcessBoxAsRect()).register(new ClearArea());
		return scene.push(area);
	}

	/**
	 * Creates an empty scene to support the Null object pattern.
	 */
	static buildEmptyScene() {
		return new SceneManager();
	}
}


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
/* 4 */
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const { CELL_HEIGHT, CELL_WIDTH } = __webpack_require__(0);
/**
 * Selects a color based on the provided age.
 * @param {number} age
 * @returns {string} color
 */
function fillStyle(age) {
	if (typeof age !== 'number') {
		throw new Error(
			'The trait ageBasedColor requires a property "age" be set to a number.'
		);
	}

	let color = null;
	switch (true) {
		case age <= 1:
			color = '#e3f2fd';
			break;
		case age == 2:
			color = '#bbdefb';
			break;
		case age == 3:
			color = '#90caf9';
			break;
		case age > 3 && age <= 5:
			color = '#64b5f6';
			break;
		case age > 5 && age <= 8:
			color = '#42a5f5';
			break;
		case age > 8 && age <= 13:
			color = '#2196f3';
			break;
		case age > 13 && age <= 21:
			color = '#1e88e5';
			break;
		case age > 21 && age <= 34:
			color = '#1976d2';
			break;
		case age > 34 && age <= 55:
			color = '#1565c0';
			break;
		case age > 55 && age <= 89:
			color = '#0d47a1';
			break;
		case age > 89 && age <= 144:
			color = '#263238'; //Dark Blue Grey
			break;
		case age > 144 && age <= 233:
			color = '#870000'; //Dark Orange
			break;
		case age > 233 && age <= 377:
			color = '#bf360c';
			break;
		case age > 377:
			color = '#ffeb3b'; //Bright Yellow
			break;
		default:
			throw new Error(`Unexpected Age: ${age}`);
	}
	return color;
}

const TWO_PI = Math.PI * 2;
const DEFAULT_CIRCLE_FILL_STYLE = 'rgb(44, 193, 59)';
const DEFAULT_CIRCLE_STROKE_STYLE = 'rgb(0, 0, 0)';

/**
 * Abstract class. Defines a render-able trait that can be processed.
 */
class Trait {
	/**
	 * Creates a new trait.
	 */
	constructor() {}
	/**
	 * Function that controls what the trait does.
	 * @abstract
	 * @param {object} context - The render context.
	 */
	process(context) {
		throw new Error('Traits must implement a process method.');
	}

	/**
	 * Automatically called by JSON.stringify().
	 * Injects the original class name as a property when serialized
	 * which an be used to rebuild a Scene after communicated from a thread.
	 * @returns Trait
	 */
	toJSON() {
		this.className = this.constructor.name;
		return this;
	}
}

/**
 * Sets the fill and stroke style by the entity's age.
 */
class ColorByAgeTrait extends Trait {
	constructor() {
		super();
	}

	process(context) {
		context.fillStyle = fillStyle(context.entity.age);
		context.strokeStyle = 'rgb(0, 0, 0)';
	}
}

/**
 * Creates a new render-able entity in the rendering context.
 */
class GridCellToRenderingEntity extends Trait {
	constructor() {
		super();
	}

	process(context) {
		context.rendering = context.rendering || {};
		context.rendering.entity = {};

		//Define Upper Left Corner (X,Y)
		context.rendering.entity.x = context.entity.row;
		context.rendering.entity.y = context.entity.col;

		//Define width & height
		context.rendering.entity.width = CELL_WIDTH;
		context.rendering.entity.height = CELL_HEIGHT;
	}
}

/**
 * Scales a rendering entity by a constant scaling factor.
 */
class ScaleTransformer extends Trait {
	/**
	 * Create a new scale transformer.
	 * @param {number} scalingFactor
	 */
	constructor(scalingFactor) {
		super();
		this.scalingFactor = scalingFactor;
	}

	process(context) {
		if (
			typeof context.rendering === 'undefined' ||
			typeof context.rendering.entity === 'undefined'
		) {
			throw new Error(
				'ScaleTransformer attempted to process an entity that did not have context.rendering or context.rendering.entity defined.'
			);
		}
		context.rendering.entity.x *= this.scalingFactor;
		context.rendering.entity.y *= this.scalingFactor;
		context.rendering.entity.width *= this.scalingFactor;
		context.rendering.entity.height *= this.scalingFactor;
	}
}

/**
 * Draws a filled in circle with a stroke.
 */
class CircleTrait extends Trait {
	constructor() {
		super();
	}

	process(context) {
		//find center
		//this.x, this.y, this.width, this.height
		let cx = context.rendering.entity.x + context.rendering.entity.width / 2;
		let cy = context.rendering.entity.y + context.rendering.entity.height / 2;
		let radius = context.rendering.entity.width / 2;

		context.rendererContext.fillStyle =
			context.fillStyle || DEFAULT_CIRCLE_FILL_STYLE;
		context.rendererContext.strokeStyle =
			context.strokeStyle || DEFAULT_CIRCLE_STROKE_STYLE;
		context.rendererContext.beginPath();
		context.rendererContext.arc(cx, cy, radius, 0, TWO_PI, true);
		context.rendererContext.fill();
		context.rendererContext.stroke();
	}
}

/**
 * Creates a new render-able entity.
 */
class ProcessBoxAsRect extends Trait {
	constructor() {
		super();
	}

	process(context) {
		context.rendering = context.rendering || {};
		context.rendering.entity = {};
		context.rendering.entity.x = context.entity.x;
		context.rendering.entity.y = context.entity.y;
		context.rendering.entity.width = context.entity.xx - context.entity.x;
		context.rendering.entity.height = context.entity.yy - context.entity.y;
	}
}

/**
 * Defines the stroke style based on if an entity is alive.
 */
class ColorByContents extends Trait {
	constructor() {
		super();
	}

	process(context) {
		context.lineWidth = 2;
		context.strokeStyle = context.entity.alive ? '#c41c00' : '#0d47a1';
	}
}

/**
 * Defines a dark fill and stroke style.
 */
class DarkFillTrait extends Trait {
	constructor() {
		super();
	}

	process(context) {
		context.fillStyle = '#263238';
		context.strokeStyle = '#263238';
	}
}

/**
 * Stroke style pass through.
 */
class StrokeStyle extends Trait {
	constructor(strokeStyle) {
		super();
		this.strokeStyle = strokeStyle;
	}

	process(context) {
		context.strokeStyle = this.strokeStyle;
	}
}

/**
 * Fill Style pass through.
 */
class FillStyle extends Trait {
	constructor(fillStyle) {
		super();
		this.fillStyle = fillStyle;
	}

	process(context) {
		context.fillStyle = this.fillStyle;
	}
}

/** Draws a rectangle. */
class RectOutlineTrait extends Trait {
	constructor() {
		super();
	}

	process(context) {
		context.rendererContext.strokeStyle =
			context.strokeStyle || DEFAULT_CIRCLE_STROKE_STYLE;
		context.rendererContext.strokeRect(
			context.rendering.entity.x,
			context.rendering.entity.y,
			context.rendering.entity.width,
			context.rendering.entity.height
		);
	}
}

/**
 * Fills a rectangle.
 */
class FilledRectTrait extends Trait {
	constructor() {
		super();
	}

	process(context) {
		context.rendererContext.fillStyle =
			context.fillStyle || DEFAULT_CIRCLE_FILL_STYLE;
		context.rendererContext.fillRect(
			context.rendering.entity.x,
			context.rendering.entity.y,
			context.rendering.entity.width,
			context.rendering.entity.height
		);
	}
}

/**
 * Sets the stroke style to a thin, dark line.
 */
class DarkThinLines extends Trait {
	constructor() {
		super();
	}

	process(context) {
		context.rendererContext.strokeStyle = '#757575';
		context.rendererContext.lineWidth = 0.5;
	}
}

/**
 * Draws a grid.
 */
class GridPattern extends Trait {
	constructor() {
		super();
	}

	process(context) {
		//Draw vertical lines
		context.rendererContext.beginPath();
		for (let x = 0; x < context.entity.width; x += context.entity.cell.width) {
			context.rendererContext.moveTo(x, 0);
			context.rendererContext.lineTo(x, context.entity.height);
		}

		//Draw horizontal lines
		for (
			let y = 0;
			y < context.entity.height;
			y += context.entity.cell.height
		) {
			context.rendererContext.moveTo(0, y);
			context.rendererContext.lineTo(context.entity.width, y);
		}

		//Render all lines at once.
		context.rendererContext.stroke();
	}
}

class BatchDrawingCells extends Trait {
	constructor(scalingFactor, strokeThreashold, shape) {
		super();
		this.scalingFactor = scalingFactor;
		this.strokeThreashold = strokeThreashold;
		this.shape = shape;
	}

	process(context) {
		switch (this.shape) {
			case 'circle':
				this.drawCircles(context);
				break;
			case 'square':
				this.drawSquares(context);
				break;
			default:
				throw new Error('Unsupported shape: ' + this.shape);
		}
	}

	drawSquares(context) {
		let cell;
		context.rendererContext.beginPath();
		for (let index = 0; index < context.entity.entities.length; index++) {
			cell = context.entity.entities[index];
			//scale and add a rect to the path.
			if (cell) {
				context.rendererContext.rect(
					cell.row * this.scalingFactor,
					cell.col * this.scalingFactor,
					CELL_WIDTH * this.scalingFactor,
					CELL_HEIGHT * this.scalingFactor
				);
			}
		}
		context.rendererContext.fill();

		//Drawing strokes takes time. Only do it for when we're zoomed out.
		if (this.scalingFactor > this.strokeThreashold) {
			context.rendererContext.stroke();
		}
	}

	//Note: It's more expensive to draw circles than rectangles.
	drawCircles(context) {
		let radius = this.scalingFactor / 2;
		let cell;
		context.rendererContext.beginPath();
		for (let index = 0; index < context.entity.entities.length; index++) {
			cell = context.entity.entities[index];
			if (cell) {
				let cx = cell.row * this.scalingFactor + radius;
				let cy = cell.col * this.scalingFactor + radius;
				context.rendererContext.moveTo(cx + radius, cy);
				context.rendererContext.arc(cx, cy, radius, 0, TWO_PI, true);
			}
		}
		context.rendererContext.fill();
		if (this.scalingFactor > this.strokeThreashold) {
			context.rendererContext.stroke();
		}
	}
}

const missingStateHandler = {
	get: function (obj, prop) {
		return prop in obj ? obj[prop] : '#f52811'; //Redish
	},
};

class MapWithDefault extends Map {
	constructor(defaultValue, entries) {
		super(entries);
		this.defaultValue = defaultValue;
	}

	/**
	 * Overrides get(key) to provide a default value.
	 * @param {*} key
	 * @override
	 */
	get(key) {
		return this.has(key) ? super.get(key) : this.defaultValue;
	}
}

class BatchDrawingCellsFromBuffer extends Trait {
	constructor(scalingFactor, strokeThreashold, shape) {
		super();
		this.scalingFactor = scalingFactor;
		this.strokeThreashold = strokeThreashold;
		this.shape = shape;

		//TODO: Refactor
		//Only changing colors on the fib seq numbers.
		this.colors = new MapWithDefault('#f52811'); //Default Red-ish
		this.colors.set(1, '#263238'); //Active
		this.colors.set(2, '#77a1b5'); //Begin Aging
		this.colors.set(3, '#a8e4ff'); //Fib Change
		this.colors.set(4, '#a8e4ff');
		this.colors.set(5, '#a8fff3'); //Fib Change
		this.colors.set(6, '#a8fff3');
		this.colors.set(7, '#a8fff3');
		this.colors.set(8, '#a8ffaf'); //Fib Change
		this.colors.set(9, '#a8ffaf');
		this.colors.set(10, '#a8ffaf');
		this.colors.set(11, '#a8ffaf');
		this.colors.set(12, '#a8ffaf');
		this.colors.set(13, '#feffa8'); //Fib Change
		this.colors.set(14, '#feffa8');
		this.colors.set(15, '#feffa8');
		this.colors.set(16, '#feffa8');
		this.colors.set(17, '#feffa8');
		this.colors.set(18, '#feffa8');
		this.colors.set(19, '#feffa8');
		this.colors.set(20, '#feffa8');
		this.colors.set(21, '#ffa8a8'); //Fib Change
	}

	process(context) {
		let row, col, state;
		context.rendererContext.beginPath();

		let firstState = context.entity.initialOffset + 2;
		let currentState = context.entity.buffer[firstState];
		context.rendererContext.fillStyle = this.colors.get(currentState);

		for (
			let index = context.entity.initialOffset;
			index < context.entity.bufferEnd;
			index += context.entity.entityFieldsCount
		) {
			row = context.entity.buffer[index];
			col = context.entity.buffer[index + 1];
			state = context.entity.buffer[index + 2];

			if (currentState != state) {
				context.rendererContext.fill(); //Render the existing
				context.rendererContext.beginPath();
				currentState = state;
				context.rendererContext.fillStyle = this.colors.get(currentState);
			}

			//scale and add a rect to the path.
			context.rendererContext.rect(
				row * this.scalingFactor,
				col * this.scalingFactor,
				CELL_WIDTH * this.scalingFactor,
				CELL_HEIGHT * this.scalingFactor
			);
		}
		context.rendererContext.fill();
	}
}

class BatchDrawingBoxesFromBuffer extends Trait {
	constructor(scalingFactor) {
		super();
		this.scalingFactor = scalingFactor;
	}

	process(context) {
		let x, y, xx, yy;
		context.rendererContext.beginPath();
		for (
			let index = context.entity.initialOffset;
			index < context.entity.bufferEnd;
			index += context.entity.entityFieldsCount
		) {
			x = context.entity.buffer[index] * this.scalingFactor;
			y = context.entity.buffer[index + 1] * this.scalingFactor;
			xx = context.entity.buffer[index + 2] * this.scalingFactor;
			yy = context.entity.buffer[index + 3] * this.scalingFactor;
			context.rendererContext.rect(x, y, xx - x, yy - y);
		}
		context.rendererContext.stroke();
	}
}

class BatchDrawingBoxes extends Trait {
	constructor(scalingFactor) {
		super();
		this.scalingFactor = scalingFactor;
	}

	process(context) {
		context.rendererContext.beginPath();
		let box;
		for (let index = 0; index < context.entity.entities.length; index++) {
			box = context.entity.entities[index];
			context.rendererContext.rect(
				box.x * this.scalingFactor,
				box.y * this.scalingFactor,
				(box.xx - box.x) * this.scalingFactor,
				(box.yy - box.y) * this.scalingFactor
			);
		}
		context.rendererContext.stroke();
	}
}

class OutlineStyle extends Trait {
	constructor(lineWidth, strokeStyle) {
		super();
		this.lineWidth = lineWidth;
		this.strokeStyle = strokeStyle;
	}

	process(context) {
		context.rendererContext.lineWidth = this.lineWidth;
		context.rendererContext.strokeStyle = this.strokeStyle;
	}
}

/**
 * Clears an area of a context defined by x,y, width, height.
 */
class ClearArea extends Trait {
	constructor() {
		super();
	}

	process(context) {
		context.rendererContext.clearRect(
			context.rendering.entity.x,
			context.rendering.entity.y,
			context.rendering.entity.width,
			context.rendering.entity.height
		);
	}
}

module.exports = {
	BatchDrawingBoxes,
	BatchDrawingBoxesFromBuffer,
	BatchDrawingCells,
	BatchDrawingCellsFromBuffer,
	CircleTrait,
	ClearArea,
	ColorByAgeTrait,
	ColorByContents,
	DarkFillTrait,
	DarkThinLines,
	FilledRectTrait,
	FillStyle,
	GridCellToRenderingEntity,
	GridPattern,
	OutlineStyle,
	ProcessBoxAsRect,
	RectOutlineTrait,
	ScaleTransformer,
	StrokeStyle,
	Trait,
};


/***/ })
/******/ ]);
//# sourceMappingURL=0.3bc0679dcde76d0af99b.worker.js.map