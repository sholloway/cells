const DrawingTemplate = require('./DrawingTemplate.js');

class RandomDiceRoll extends DrawingTemplate {
	constructor(config) {
		super();
		this.config = config;
	}

  generateCells(x, y) {
		return this.makeCellsFrom2DArray(this.pattern());
  }
  
	pattern() {
		let height = Math.ceil(this.config.landscape.height);
		let width = Math.ceil(this.config.landscape.width);
		let birthRules = this.config.game.rules.birth;
		let grid = Array(height);
		for (let row = 0; row < height; row++) {
			grid[row] = Array(width);
			for (let col = 0; col < width; col++) {
				grid[row][col] = birthRules.includes(this.rollDice()) ? 1 : 0;
			}
		}
		return grid;
	}

	/**
	 * A cell can have 8 neighbors. Rolling the dice randomly selects a number
	 * in the range [0,8].
	 */
	rollDice() {
		//Leverages the pattern: Math.floor(Math.random() * (max - min + 1)) + min
		//                       Math.floor(Math.random() * (8 - 0 + 1)) + 0
		//                       Math.floor(Math.random() * (9))
		return Math.floor(Math.random() * 9);
	}
}

module.exports = RandomDiceRoll;
