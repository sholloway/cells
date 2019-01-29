const { CellStates } = require('./CellStates.js')
const {Cell} = require('./Quadtree.js')

function randomAliveOrDead(){
  return getRandomIntInclusive(CellStates.DEAD, CellStates.ALIVE)
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

class Seeder{
	constructor(){
		this.cells = []
	}

	seed(width, height){
		throw new Error('Seeder implementations must implement the seed(width, height) method.')
	}

	setCells(cells){
		this.cells = cells
	}
}
class RandomSeeder extends Seeder{
	constructor(){
		super()
	}

	seed(width, height){
		for(let x = 0; x < width; x++){
			for (let y = 0; y < height; y++){
				let birthChance = randomAliveOrDead()
				if (birthChance == 1){
					this.cells.push(new Cell(x,y, 1))
				}
			}
		}
		return this.cells
	}
}

class StaticCellsSeeder extends Seeder{
	constructor(){
		super()
	}

	seed(width, height){
		return this.cells
	}
}

SeederModels = {
	DRAWING: 'draw',
	RANDOM: 'random'
}

class SeederFactory{
	constructor(){
	}

	static build(modelName){
		let seeder = null;
		switch (modelName){
			case SeederModels.RANDOM:
				seeder = new RandomSeeder()
				break
			case SeederModels.DRAWING:
				seeder = new StaticCellsSeeder()
				break
			default:
				throw new Error(`Unknown seeder model name: ${modelName}`)
		}
		return seeder
	}
}

module.exports = {SeederFactory, SeederModels}
