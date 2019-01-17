const defaultConfig = require('./DefaultConfig.js')
const GameManager = require('./GameManager.js')
const HTMLCanvasRenderer = require('./../renderer/HTMLCanvasRenderer.js')
const SceneManager = require('./../core/SceneManager.js')

const LifeSystemState = {
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
	this.gameStateManager.stageGrid(this.scene,this.displayGridBackground)
	this.gameStateManager.evaluateCells(this.scene, this.evaluator)
	this.gameStateManager.stageStorage(this.scene, this.displayStorageStructure)
	this.gameStateManager.activateNext();
}

class AltLifeSystem{
	constructor(window, htmlCanvasContext, config = defaultConfig){
		//TODO: I want to be able to override the default config without defining the entire thing.
		this.config = config
		this.window = window
		this.htmlCanvasContext = htmlCanvasContext
		this.scene = new SceneManager()
		this.gameStateManager = new GameManager(this.config)
		this.renderer = new HTMLCanvasRenderer(this.htmlCanvasContext, this.config)
		this.gameState = LifeSystemState.STOPPED
		this.displayStorageStructure = false;
		this.displayGridBackground = false;
	}

	setCellSize(size){
		this.config.zoom = size
	}

	displayStorage(display){
		this.displayStorageStructure = display
	}

	displayGrid(display){
		this.displayGridBackground = display
	}

	start(){
		if (this.gameState == LifeSystemState.STOPPED){
			this.gameStateManager.seedWorld()
			this.lastTick = window.performance.now();
  		this.lastRender = this.lastTick; // Pretend the first draw was on first update.
			this.gameState = LifeSystemState.RUNNING
		}
	}

	stop(){
		if (this.gameState == LifeSystemState.RUNNING){
			this.gameState = LifeSystemState.STOPPED
		}
	}

	pause(){
		if (this.gameState == LifeSystemState.RUNNING){
			this.lastTick = window.performance.now();
  		// this.lastRender = this.lastTick; // Pretend the first draw was on first update.
			this.gameState = LifeSystemState.PAUSED
		}
	}

	reset(){
		this.scene.purge()
		this.gameStateManager.clear()
		this.renderer.clear()
	}

	resume(){
		if(this.gameState == LifeSystemState.STOPPED || this.gameState == LifeSystemState.PAUSED){
			this.gameState = LifeSystemState.RUNNING
			this.lastTick = window.performance.now()
		}
	}

	main(tFrame){
		// Looping via callback. Will pass the current time.
		// Can use window.cancelAnimationFrame() to stop if needed.
		this.stopMain = window.requestAnimationFrame(this.main.bind(this));
		if (this.gameState == LifeSystemState.RUNNING){
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

module.exports = AltLifeSystem
