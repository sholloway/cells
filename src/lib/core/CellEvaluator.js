const CellStates = require('./../entity-system/CellStates.js');

const Any = 'any';
/**
 * Enforces the simulation (game) rules.
 */
class CellEvaluator {
	/**
	 * Creates a new evaluator.
	 * @param {number[]} birthRules - The required alive neighbors for a cell to be born.
	 * @param {number[]} survivalRules - The required alive neighbors for a cell to stay alive.
	 */
	constructor(birthRules, survivalRules) {
		this.birthRules = birthRules;
		this.survivalRules = survivalRules;
	}

	evaluate(neighborsCount, currentCellState) {
		let nextCellState = CellStates.DEAD; //Be dead by default
		if (
			currentCellState == CellStates.DEAD &&
			this.birthRules.includes(neighborsCount)
		) {
			nextCellState = CellStates.ACTIVE; //Be Born
		} else if (
			currentCellState == CellStates.ACTIVE &&
			this.survivalRules.includes(neighborsCount)
		) {
			nextCellState = CellStates.ACTIVE; //Survive
		}
		return nextCellState;
	}
}

/**
 * An evaluator for Life that is slightly optimized.
 */
class LifeEvaluator extends CellEvaluator {
	constructor(birthRules, survivalRules) {
		super(birthRules, survivalRules);
	}

	evaluate(neighborsCount, currentCellState) {
		let nextCellState = CellStates.DEAD; //Be dead by default
		if (currentCellState == CellStates.DEAD) {
			if (neighborsCount == 3) {
				nextCellState = CellStates.ACTIVE; //Born
			}
		} else if (currentCellState == CellStates.ACTIVE) {
			if (neighborsCount == 2 || neighborsCount == 3) {
				nextCellState = CellStates.ACTIVE; //Survives
			}
		}
		return nextCellState;
	}
}

class LifeLike extends CellEvaluator {
	constructor(birthRules, survivalRules) {
		super(birthRules, survivalRules);
	}
}

class GenerationalCellEvaluator extends CellEvaluator {
	/**
	 * Creates a new evaluator.
	 * @param {number[]} birthRules - The required alive neighbors for a cell to be born.
	 * @param {number[]} survivalRules - The required alive neighbors for a cell to stay alive.
	 */
	constructor(birthRules, survivalRules, maxAge) {
		super(birthRules, survivalRules);
		this.maxAge = maxAge;
	}

	/**
	 * Evaluates a cell's next state based on the generations algorithm.
	 * Generations Algorithm
	 *  1. Dead cells can be born if the number of Moore active neighbors are included in the birth rules.
	 *  2. Alive cells can stay "active" if the number of Moore neighbors are included in the survive rules.
	 * 		 Cells aren't aging while active.
	 * 		 Cells move into the retired stage once the above rule fails.
	 *  3. Cells increment their age until they hit the max age then they die.
	 * @param {number} neighborsCount - The number of a live cells the current cell has.
	 * @param {CellState} currentCellState - the current state of cell.
	 * @returns {CellState} The state the cell should be set to.
	 */
	evaluate(neighborsCount, currentCellState) {
		let nextCellState = CellStates.DEAD; //Be dead by default
		if (currentCellState === CellStates.DEAD) {
			if (this.birthRules.includes(neighborsCount)) {
				nextCellState = CellStates.ACTIVE; //Be Born
			}
		} else if (currentCellState === CellStates.ACTIVE) {
			//Determine if the cell should stay active.
			nextCellState = this.survivalRules.includes(neighborsCount)
				? CellStates.ACTIVE //Stay Active
				: CellStates.RETIRED; //Start aging...
		} else {
			//Aging
			nextCellState =
				currentCellState < this.maxAge
					? currentCellState + 1 // Age
					: (nextCellState = CellStates.DEAD); //Die
		}

		return nextCellState;
	}
}

module.exports = { CellEvaluator, GenerationalCellEvaluator, LifeEvaluator };
