/**
 * A module for defining render-able entities with traits.
 * @module entity_system
 */

const CellStates = require('./CellStates.js');

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

class CellsBatchArrayBuffer extends Entity {
	constructor(buffer) {
		super();
		this.buffer = buffer;
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
	constructor(row, col) {
		super();
		this.className = 'Cell';
		this.row = row;
		this.col = col;
	}

	getState() {
		return CellStates.ALIVE; //We're only dealing with alive cells.
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
	CellsBatchArrayBuffer,
	DeadCell,
	Entity,
	EntityBatch,
	GridEntity,
	CELL_HEIGHT,
	CELL_WIDTH,
};
