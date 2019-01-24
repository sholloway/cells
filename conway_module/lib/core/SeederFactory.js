function randomAliveOrDead(){
  return getRandomIntInclusive(CellStates.DEAD, CellStates.ALIVE)
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

class Seeder{
	constructor(){}
	seed(width, height){
		throw new Error('Seeder implementations must implement the seed(width, height) method.')
	}
}
class RandomSeeder extends Seeder{
	constructor(){
		this.super()
	}

	seed(width, height){
		let aliveCells = []
		for(let x = 0; x < width; x++){
			for (let y = 0; y < height; y++){
				let birthChance = randomAliveOrDead()
				if (birthChance == 1){
					aliveCells.push(new Cell(x,y, 1))
				}
			}
		}
		return aliveCells
	}
}

class StaticCellsSeeder extends Seeder{
	constructor(){
		this.super()
		this.staticCells = null
	}

	setCells(cells){
		this.staticCells = cell
	}

	seed(width, height){
		return this.staticCells
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
			case SeederFactory.DRAWING:
				seeder = new StaticCellsSeeder()
				break
			default:
				throw new Error(`Unknown seeder model name: ${modelName}`)
		}
		return seeder
	}
}

modules.export = {SeederFactory, SeederModels}
