const {CanvasBasedSystem} = require('./System.js')
const DefaultConfig = require('./DefaultConfig.js')
const DrawingStateManager = require('./DrawingStateManager.js')


class DrawingSystem extends CanvasBasedSystem{
	constructor(window, htmlCanvasContext, config = DefaultConfig){
		super(window, htmlCanvasContext, config)
		this.stateManager = new DrawingStateManager(this.config)
	}

	getStateManager(){
		return this.stateManager
	}

	update(frame){
		this.getStateManager().stageStorage(this.scene, this.displayStorageStructure)
		this.getStateManager().processCells(this.scene)
	}

	setCells(cells){
		this.getStateManager().setCells(cells)
	}

	toggleCell(x,y){
		this.getStateManager().toggleCell(x,y)
	}
}

module.exports = DrawingSystem
