const defaultConfig = require('./DefaultConfig.js')
const DrawingStateManager = require('./DrawingStateManager.js')
const HTMLCanvasRenderer = require('./../renderer/HTMLCanvasRenderer.js')
const SceneManager = require('./../core/SceneManager.js')

const DrawingSystemState ={
	STOPPED: 1,
	PAUSED: 2,
	RUNNING: 3
}

function queueUpdates(numTicks){
	for(var i=0; i < numTicks; i++) {
		this.lastTick = this.lastTick + this.config.game.tickLength;
		update.bind(this)(this.lastTick);
	}
}

function update(frame){
	// this.stateManager.evaluateCells(this.scene, this.evaluator)
	this.stateManager.stageStorage(this.scene, this.displayStorageStructure)
	// this.stateManager.activateNext();
	this.stateManager.processCells(this.scene)
}

/*
TODO: Potential define a parent class for DrawingSystem, AltLifeSystem...
*/
class DrawingSystem{
	constructor(window, htmlCanvasContext, config = defaultConfig){
		this.config = config
		this.window = window
		this.htmlCanvasContext = htmlCanvasContext
		this.scene = new SceneManager()
		this.stateManager = new DrawingStateManager(this.config)
		this.renderer = new HTMLCanvasRenderer(this.htmlCanvasContext, this.config)
		this.state = DrawingSystemState.STOPPED
		this.displayStorageStructure = false;
	}

	setCells(cells){
		this.stateManager.setCells(cells)
	}

	getCells(){
		return this.stateManager.getCells()
	}

	toggleCell(x,y){
		this.stateManager.toggleCell(x,y)
	}

	setCellSize(size){
		this.config.zoom = size
	}

	displayStorage(display){
		this.displayStorageStructure = display
	}

	start(){
		if (this.state == DrawingSystemState.STOPPED){
		//	this.gameStateManager.seedWorld()
			this.lastTick = window.performance.now();
  		this.lastRender = this.lastTick; // Pretend the first draw was on first update.
			this.state = DrawingSystemState.RUNNING
		}
	}

	stop(){
		if (this.state == DrawingSystemState.RUNNING){
			this.state = DrawingSystemState.STOPPED
		}
	}

	pause(){
		if (this.state == DrawingSystemState.RUNNING){
			this.lastTick = window.performance.now();
			this.state = DrawingSystemState.PAUSED
		}
	}

	reset(){
		this.scene.purge()
		this.stateManager.clear()
		this.renderer.clear()
	}

	resume(){
		if(this.state == DrawingSystemState.STOPPED || this.state == DrawingSystemState.PAUSED){
			this.state = DrawingSystemState.RUNNING
			this.lastTick = window.performance.now()
		}
	}

	main(tFrame){
		// Looping via callback. Will pass the current time.
		// Can use window.cancelAnimationFrame() to stop if needed.
		this.stopMain = window.requestAnimationFrame(this.main.bind(this));
		if (this.state == DrawingSystemState.RUNNING){
			var nextTick = this.lastTick + this.config.game.tickLength;
			var numTicks = 0;

			// If tFrame < nextTick then 0 ticks need to be updated (0 is default for numTicks).
			// If tFrame = nextTick then 1 tick needs to be updated (and so forth).
			// Note: As we mention in summary, you should keep track of how large numTicks is.
			// If it is large, then either your game was asleep, or the machine cannot keep up.
			if (tFrame > nextTick) {
				var timeSinceTick = tFrame - this.lastTick;
				numTicks = Math.floor( timeSinceTick / this.config.game.tickLength );
			}

			queueUpdates.bind(this)(numTicks);
			if (!this.scene.fullyRendered()){
				this.renderer.render(this.scene);
			}
			this.lastRender = tFrame;
		}
	}
}

module.exports = DrawingSystem
