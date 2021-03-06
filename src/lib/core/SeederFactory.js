/**
 * Conway's Game Initial State Seeder Module
 * @module seeders
 */
const CellStates = require('./../entity-system/CellStates.js');
const { Cell } = require('./../entity-system/Entities.js');

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
