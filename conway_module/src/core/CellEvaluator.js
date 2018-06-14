const { CellStates } = require('./CellStates.js')

/*
The Default Evaluator leverages the Game B3/S23.
Born Requirements: 3 Neighbors
Survival Requirements: {2, 3} Neighbors
*/
class CellEvaluator{
	constructor(birthRules=[3], survivalRules=[2,3]){
		this.birthRules = birthRules
		this.survivalRules = survivalRules
	}

	evaluate(neghborsCount, currentCellState){
		let nextCellState;
		switch (currentCellState){
			case CellStates.DEAD:
				nextCellState = (this.birthRules.includes(neghborsCount))? CellStates.ALIVE : CellStates.DEAD;
				break
			case CellStates.ALIVE:
				nextCellState = (this.survivalRules.includes(neghborsCount))? CellStates.ALIVE : CellStates.DEAD;
				break
			default:
				throw new Error(`Cannot evaluate cell. Unknown cell state: ${currentCellState}`)
		}
		return nextCellState
	}
}

module.exports = CellEvaluator
