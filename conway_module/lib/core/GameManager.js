const {QuadTree} = require('./Quadtree.js')
const { CellStates } = require('./CellStates.js')
const { Cell } = require('./Quadtree.js')

function randomAliveOrDead(){
  return getRandomIntInclusive(CellStates.DEAD, CellStates.ALIVE)
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

class QuadTreeSeeder{
	constructor(){}

	static seed(width, height){
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

class GameManager{
	constructor(config){
		this.config = config
		this.currentTree = QuadTree.empty()
		this.nextTree = QuadTree.empty()
	}

	seedWorld(){
		let aliveCells = QuadTreeSeeder.seed(this.config.landscape.width, this.config.landscape.height)
		this.currentTree.index(aliveCells)
		this.nextTree.index()
	}
}

module.exports = GameManager
