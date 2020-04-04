const {CanvasBasedSystem} = require('./System.js')
const DefaultConfig = require('./DefaultConfig.js')
const {DrawingStateManager} = require('./DrawingStateManager.js');

/**
 * A system for drawing on a grid.
 * @extends CanvasBasedSystem
 */
class DrawingSystem extends CanvasBasedSystem{
	/**
	 * Creates a new drawing system.
	 * @param {Window} window - The DOM's window object.
	 * @param {HTMLCanvasContext} htmlCanvasContext - An HTML5 Canvas 2D context.
	 * @param {object} config - A configuration object.
	 */
	constructor(window, htmlCanvasContext, config = DefaultConfig){
		super(window, htmlCanvasContext, config)
		this.stateManager = new DrawingStateManager(this.config)
	}

	/**
	 * Override parent
	 * @private
	 */
	getStateManager(){
		return this.stateManager
	}

	/**
	 * Override parent
	 * @private
	 */
	update(frame){
		let updateTime = 'Drawing System Update Time';
		console.time(updateTime);
		this.getStateManager().stageStorage(this.scene, this.displayStorageStructure)
		this.getStateManager().processCells(this.scene)
		console.timeEnd(updateTime);
	}

	/**
	 * Used to preload the drawing system with alive cells.
	 * @param {Cell[]} cells - An array of alive cells.
	 */
	setCells(cells){
		this.getStateManager().setCells(cells)
	}

	/**
	 * Flips a grid cell to alive or dead.
	 * @param {number} x - The X coordinate of the cell.
	 * @param {number} y - The Y coordinate of the cell.
	 */
	toggleCell(x,y){
		this.getStateManager().toggleCell(x,y)
	}
}

module.exports = DrawingSystem
