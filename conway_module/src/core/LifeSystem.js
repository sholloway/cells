
let defaultConfig = require('./DefaultConfig.js')
let GameStateManager = require('./GameStateManager.js')
let Renderer = require('./Renderer.js')

const LifeSystemState = {
	STOPPED: 1,
	PAUSED: 2,
	RUNNING: 3
}

//Private methods
function gameLoop(){
	this.gridStateManager.evaulateCells(this.evaluator)
	this.renderer.render()
	this.gridStateManager.activateNextGrid()
}

class LifeSystem{
	constructor(config = defaultConfig, window, htmlCanvasContext){
		this.config = config
		this.window = window
		this.htmlCanvasContext = htmlCanvasContext
		this.gridStateManager = new GameStateManager()
		this.renderer = new Renderer()
		this.gameState = LifeSystemState.STOPPED
	}

	start(){
		this.gameState = LifeSystemState.RUNNING
		this.gridStateManager.seedWorld() //The "Big Bang" in Conway's Game of Life.
		this.gameLoopHandle = gameLoop.bind(this)
		window.setInterval(this.gameLoopHandle, this.config.game.interval)
	}

	stop(){
		this.gameState = LifeSystemState.STOPPED
		this.window.clearInterval(this.gameLoopHandle)
	}

	pause(){
		this.gameState = LifeSystemState.PAUSED
		this.window.clearInterval(this.gameLoopHandle)
	}

	resume(){
		this.gameState = LifeSystemState.RUNNING
		window.setInterval(this.gameLoopHandle, this.config.game.interval)
	}
}

module.exports = LifeSystem
