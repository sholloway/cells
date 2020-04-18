const CellStates = require('./../entity-system/CellStates.js');

/**
 * Enforces the simulation (game) rules.
 */
class CellEvaluator {
	/**
	 * Creates a new evaluator.
	 * @param {number[]} birthRules - The required alive neighbors for a cell to be born.
	 * @param {number[]} survivalRules - The required alive neighbors for a cell to stay alive.
	 */
	constructor(birthRules = [3], survivalRules = [2, 3]) {
		this.birthRules = birthRules;
		this.survivalRules = survivalRules;
	}

	/**
	 * Evaluates a cell's next state.
	 * @param {number} neighborsCount - The number of a live cells the current cell has.
	 * @param {CellState} currentCellState - the current state of cell.
	 * @returns {CellState} The state the cell should be set to.
	 */
	evaluate(neighborsCount, currentCellState) {
		let nextCellState;
		switch (currentCellState) {
			case CellStates.DEAD:
				nextCellState = this.birthRules.includes(neighborsCount)
					? CellStates.ALIVE
					: CellStates.DEAD;
				break;
			case CellStates.ALIVE:
				nextCellState = this.survivalRules.includes(neighborsCount)
					? CellStates.ALIVE
					: CellStates.DEAD;
				break;
			default:
				throw new Error(
					`Cannot evaluate cell. Unknown cell state: ${currentCellState}`
				);
		}
		return nextCellState;
	}
}

module.exports = CellEvaluator;
