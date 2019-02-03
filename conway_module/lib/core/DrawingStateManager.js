const {Cell, QuadTree, cloneCells} = require('./Quadtree.js')

const {Box, ScaleTransformer, GridCellToRenderingEntity,
	ProcessBoxAsRect, ColorByContents, RectOutlineTrait, FilledRectTrait, StrokeStyle,
	FillStyle} = require('./EntitySystem.js')

/**
 * Specify what traits to render the cells with.
 * @private
 * @param {object} config - The simulation configuration object.
 * @param {Cell[]} cells - The cells to configure with traits.
 */
function registerCellTraits(config, cells){
	cells.forEach((cell) => {
		cell.register(new GridCellToRenderingEntity())
			.register(new ScaleTransformer(config.zoom))
			.register(new StrokeStyle('#ffeb3b'))
			.register(new FillStyle('#263238'))
			.register(new FilledRectTrait())
			.register(new RectOutlineTrait())
	});
}

/**
 * Recursively traverses a quad tree and adds the partition boxes to the provided array.
 * @private
 * @param {QTNode} currentNode - The current node to process.
 * @param {Box[]} boxes - The array to add the partition boxes to.
 */
function collectBoxes(currentNode, boxes){
	let containsAliveCell = currentNode.index != null
	boxes.push(new Box(currentNode.rect.x, currentNode.rect.y, currentNode.rect.xx, currentNode.rect.yy, containsAliveCell))
	if(currentNode.subdivided){
		currentNode.children().forEach((child)=>{
			collectBoxes(child, boxes)
		})
	}
}

/**
 * Specify what traits to render the quad tree boxes with.
 * @private
 * @param {object} config - The simulation configuration object.
 * @param {Box[]} boxes - An array of boxes to add traits to.
 */
function registerBoxTraits(config, boxes){
	boxes.forEach(box => {
		box.register(new ProcessBoxAsRect())
			.register(new ScaleTransformer(config.zoom))
			.register(new ColorByContents())
			.register(new RectOutlineTrait())
	})
}

/**
 * Orchestrates drawing.
 */
class DrawingStateManager{
	/**
	 * Create a new DrawingStateManager.
	 * @param {object} config - The simulation configuration object.
	 */
	constructor(config){
		this.config = config
		this.cells = []
		this.currentTree = QuadTree.empty()
		this.nextTree = QuadTree.empty()
		this.currentTree.index(this.cells)
	}

	/**
	 * Set's what cells should be in the initial drawing.
	 * @param {Cell[]} cells - An array of alive cells.
	 */
	setCells(cells){
		this.clear()
		this.cells = cells
		this.currentTree.index(this.cells)
	}

	/**
	 * Creates a deep copy of the cells in the drawing.
	 * @returns {Cell[]} The copy of the cells.
	 */
	getCells(){
		return cloneCells(this.cells)
	}

	/**
	 * Draws a cell or removes it.
	 * @param {number} x - The X coordinate on the simulation's grid.
	 * @param {number} y - The Y coordinate on the simulation's grid.
	 */
	toggleCell(x,y){
		let node = this.currentTree.search(new Cell(x,y))
		if (node == null){ //Doesn't exist. Add it.
			this.cells.push(new Cell(x,y,1))
			this.nextTree.clear()
			this.nextTree.index(this.cells)
		}else{
			//remove it.
			this.cells.splice(node.index, 1)
			this.nextTree.clear()
			this.nextTree.index(this.cells)
		}
		this.activateNext()
	}

	/**
	 * Prepares the alive cells to be drawn.
	 * @param {SceneManager} scene - The scene to add the cells to.
	 */
	processCells(scene){
		let clones = cloneCells(this.cells)
		registerCellTraits(this.config, clones)
		scene.push(clones)
	}

	/**
	 * Replaces the current tree with the next state tree and re-initializes the next
	 * tree to be empty.
	 */
	activateNext(){
		this.currentTree = QuadTree.clone(this.nextTree)
		this.nextTree.clear().index()
	}

	/**
	 * Empties the drawing simulation.
	 */
	clear(){
		this.currentTree.clear().index()
		this.nextTree.clear().index()
		this.cells = []
	}

	/**
	 * Traverses the next state data structure and adds it to the scene to be rendered.
	 * @param {SceneManager} scene - The active list of things that need to be rendered.
	 */
	stageStorage(scene, display){
		if (!display){
			return
		}
		let boxes = []
		collectBoxes(this.currentTree.root,boxes)
		registerBoxTraits(this.config, boxes)
		scene.push(boxes)
	}
}

module.exports = DrawingStateManager
