
const defaultConfig = require('./DefaultConfig.js')
const GameStateManager = require('./GameStateManager.js')
const HTMLCanvasRenderer = require('./../renderer/HTMLCanvasRenderer.js')
const SceneManager = require('./../core/SceneManager.js')

const LifeSystemState = {
	STOPPED: 1,
	PAUSED: 2,
	RUNNING: 3
}

//Private methods
function gameLoop(){
	this.gridStateManager.evaluateCells(this.scene, this.evaluator)
	/*
	Options:
	- Manage a render stack in the render.
	- Manage a stack of entities in the grid state manager.
	- Have a dedicated data structure shared between the renderer & GSM.
	*/
	this.renderer.render(this.scene)
	this.gridStateManager.activateNextGrid()
}

class LifeSystem{
	constructor(window, htmlCanvasContext, config = defaultConfig){
		//TODO: I want to be able to override the default config with out defining the entire thing.
		this.config = config
		this.window = window
		this.htmlCanvasContext = htmlCanvasContext
		this.scene = new SceneManager()
		this.gridStateManager = new GameStateManager(this.config)
		this.renderer = new HTMLCanvasRenderer(this.htmlCanvasContext, this.config)
		this.gameState = LifeSystemState.STOPPED
	}

	start(){
		if (this.gameState == LifeSystemState.STOPPED){
			this.gameState = LifeSystemState.RUNNING
			this.gridStateManager.seedWorld()
			this.gameLoopHandle = this.window.setInterval(gameLoop.bind(this), this.config.game.interval)
		}
	}

	stop(){
		if (this.gameState == LifeSystemState.RUNNING){
			this.gameState = LifeSystemState.STOPPED
			this.window.clearInterval(this.gameLoopHandle)
		}
	}

	pause(){
		if (this.gameState == LifeSystemState.RUNNING){
			this.gameState = LifeSystemState.PAUSED
			this.window.clearInterval(this.gameLoopHandle)
		}
	}

	resume(){
		if(this.gameState == LifeSystemState.STOPPED || this.gameState == LifeSystemState.PAUSED){
			this.gameState = LifeSystemState.RUNNING
			this.gameLoopHandle =  window.setInterval(gameLoop.bind(this), this.config.game.interval)
		}
	}
}

module.exports = LifeSystem
