const { CellMortonStore } = require('./CellMortonStore.js');
const { Cell } = require('../entity-system/Entities.js');
const CellStates = require('../entity-system/CellStates.js');

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
