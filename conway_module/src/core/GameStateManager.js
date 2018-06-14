const { CellStates } = require('./CellStates.js')
const CellEvaluator = require('./CellEvaluator.js')
const DefaultSeeder = require('./DefaultSeeder.js')

function calculateWorldSize(config){
	let cellsWide = Math.floor(config.canvas.width/config.cell.width)
	let cellsHigh = Math.floor(config.canvas.height/config.cell.height)
	return {
		cellsWide: cellsWide,
		cellsHigh: cellsHigh}
}

function createDeadArray(width, height){
	let array = new Array(width)
	for(let x = 0; x < width; x++){
		array[x] = new Array(height)
		for (let y = 0; y < height; y++){
			array[x][y] = CellStates.DEAD
		}
	}
	return array
}

function copyArray(array){
	let copy = new Array(array.length)
	for (let i = 0; i < array.length; i++){
		copy[i] = new Array(array[i].length)
		for (let j = 0; j < array[i].length; j++){
			copy[i][j] = array[i][j]
		}
	}
	return copy
}

function defaultSeeder(){
	return new DefaultSeeder()
}

function isCellValid(array, row, col){
  return row >= 0 &&
    row < array.length &&
    col >= 0 &&
    col < array[row].length
}

function defaultCellEvaluator(){
	return new CellEvaluator()
}

function scanNeighbors(array, row, col){
  let neighborsCount = 0
  // Top Row
  for (let c = col - 1; c <= col + 1; c++){
    if(isCellValid(array, row - 1, c)){
      neighborsCount += array[row - 1][c]
    }
  }

  // Residing Row
  //left
  if(isCellValid(array, row, col - 1)){
    neighborsCount += array[row][col - 1]
  }

  //right
  if(isCellValid(array, row, col + 1)){
    neighborsCount += array[row][col + 1]
  }

  // Bottom Row
  for (let c = col - 1; c <= col + 1; c++){
    if(isCellValid(array, row + 1, c)){
      neighborsCount += array[row + 1][c]
    }
	}
	return neighborsCount
}

class GameStateManager{
	constructor(config){
		this.config = config
		this.currentGrid = []
		this.nextGrid = []
	}

	seedWorld(seeder = defaultSeeder()){
		this.worldDimensions = calculateWorldSize(this.config)
		this.currentGrid = seeder.seed(this.worldDimensions.cellsWide, this.worldDimensions.cellsHigh)
		this.nextGrid = createDeadArray(this.worldDimensions.cellsWide, this.worldDimensions.cellsHigh)
	}

	/*
	Returns a clone of the current grid.
	*/
	getCurrentGrid(){
		return copyArray(this.currentGrid)
	}

	/*
	Returns a clone of the current grid.
	*/
	getNextGrid(){
		return copyArray(this.nextGrid)
	}

	/*
	Replaces the current grid with the next grid and reinitializes the next grid with 0s.
	This is similar to double buffering in computer graphics.
	*/
	activateNextGrid(){
		this.currentGrid = this.getNextGrid()
	  this.nextGrid = createDeadArray(this.worldDimensions.cellsWide, this.worldDimensions.cellsHigh)
	}

	/*
	Traverse the current grid, applying the rules defined by the evaluator and
	populate the next grid accordingly. No changes are made to the current grid.
	*/
	evaluateCells(evaluator = defaultCellEvaluator()){
		for (let row = 0; row < this.currentGrid.length; row++){
			for (let col = 0; col < this.currentGrid[row].length; col++){
				let neighborsCount = scanNeighbors(this.currentGrid, row, col)
				let cellLiveOrDead = evaluator.evaluate(neighborsCount, this.currentGrid[row][col])
				this.nextGrid[row][col] = cellLiveOrDead
			}
		}
	}
}

module.exports = GameStateManager
