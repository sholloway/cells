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
			array[x][y] = 0
		}
	}
	return array
}

//This would be more fun if there was a way to tune the
//probability of a cell being alive or dead.
//Traditionally, Conway's game initializes all the cells in parallel.
function randomAliveOrDead(){
  return getRandomIntInclusive(0, 1)
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
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

class DefaultSeeder{
	seed(width, height){
		let array = new Array(width)
		for(let x = 0; x < width; x++){
			array[x] = new Array(height)
			for (let y = 0; y < height; y++){
				array[x][y] = randomAliveOrDead()
			}
		}
		return array
	}
}

function defaultSeeder(){
	return new DefaultSeeder()
}

class GameStateManager{
	constructor(config){
		this.config = config
		this.currentGrid = []
		this.nextGrid = []
	}

	seedWorld(seeder = defaultSeeder()){
		console.log(`Seeder: ${seeder}`)
		//let width, height = calculateWorldSize(this.config)
		let worldDimensions = calculateWorldSize(this.config)
		this.currentGrid = seeder.seed(worldDimensions.cellsWide, worldDimensions.cellsHigh)
		this.nextGrid = createDeadArray(worldDimensions.cellsWide, worldDimensions.cellsHigh)
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
}

module.exports = GameStateManager
