const {Cell, QuadTree, cloneCells} = require('./Quadtree.js')

const { Box } = require('../entity-system/entities')

const { ColorByContents, FilledRectTrait,
	FillStyle, GridCellToRenderingEntity, ProcessBoxAsRect,
	RectOutlineTrait,ScaleTransformer, StrokeStyle } = require('../entity-system/traits')


class DrawingSceneBuilder{
	static buildScene(scene, config, objs){
		let entities = objs.map((obj) => {
			let entity;
			if(obj.className === 'Box'){
				entity = Box.buildInstance(obj);
				entity.register(new ProcessBoxAsRect())
					.register(new ScaleTransformer(config.zoom))
					.register(new ColorByContents())
					.register(new RectOutlineTrait());
			}else if(obj.className === 'Cell'){
				entity = Cell.buildInstance(obj);
				entity.register(new GridCellToRenderingEntity())
					.register(new ScaleTransformer(config.zoom))
					.register(new StrokeStyle('#ffeb3b'))
					.register(new FillStyle('#263238'))
					.register(new FilledRectTrait())
					.register(new RectOutlineTrait());
			}else{
				entity = new Entity();
			}
			return entity;
		});
		scene.push(entities);
	}
}

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
		this.config = config;
		this.cells = [];
		this.currentTree = QuadTree.empty();
		this.nextTree = QuadTree.empty();
		this.currentTree.index(this.cells);
	}

	setConfig(config){
    this.config = config;
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
		let totalTime='toggleCell total time';
		console.time(totalTime);
		let node = this.currentTree.search(new Cell(x,y));
		if (node.isNullNode){ //The node doesn't exist. Add it.
			this.cells.push(new Cell(x,y,1));
			this.nextTree.clear();
			this.nextTree.index(this.cells);
		}else{
			//remove it.
			this.cells.splice(node.index, 1);
			this.nextTree.clear();
			this.nextTree.index(this.cells);
		}
		this.activateNext(); 
		console.timeEnd(totalTime);
	}

	/*
	Next Steps
	* Refactor the quadtree's index() and search() functions to be maintainable.
	* Populate the life simulation from the drawing system.
	* Get test converage working through the IDE.
	* setup prettifier. I want to add ; to every line.
	*/

	/**
	 * Prepares the alive cells to be drawn.
	 * @param {SceneManager} scene - The scene to add the cells to.
	 */
	processCells(scene){
	//	let clones = cloneCells(this.cells)
	//	registerCellTraits(this.config, clones)
		// scene.push(clones)
		scene.push(this.cells);
	}

	/**
	 * Replaces the current tree with the next state tree and re-initializes the next
	 * tree to be empty.
	 */
	activateNext(){
		// this.currentTree = QuadTree.clone(this.nextTree)
		// this.nextTree.clear().index();

		//Purge the current tree and then point the current state to the future state.
		this.currentTree.clear();
		this.currentTree = null; 
		this.currentTree = this.nextTree;

		//Free the nextTree pointer and then provision a new tree for the future state.
		this.nextTree = null;
		this.nextTree = QuadTree.empty();
		this.nextTree.index();
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
		if (display){	
			let boxes = []
			collectBoxes(this.currentTree.root,boxes)
	//		registerBoxTraits(this.config, boxes)
			scene.push(boxes)
		}
	}
}

module.exports = {
	DrawingStateManager,
	DrawingSceneBuilder
}
