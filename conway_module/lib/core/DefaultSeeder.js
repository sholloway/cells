//TODO: Delete this file.


const { CellStates } = require('./CellStates.js')

//This would be more fun if there was a way to tune the
//probability of a cell being alive or dead.
//Traditionally, Conway's game initializes all the cells in parallel.
function randomAliveOrDead(){
  return getRandomIntInclusive(CellStates.DEAD, CellStates.ALIVE)
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
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

module.exports = DefaultSeeder
