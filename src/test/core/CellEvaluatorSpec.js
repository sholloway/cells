const chai = require('chai');
const expect = chai.expect;
const Cames = require('./../../lib/configs/Games');
const {
	CellEvaluator,
	LifeEvaluator,
	GenerationalCellEvaluator,
} = require('./../../lib/core/CellEvaluator.js');
const CellStates = require('./../../lib/entity-system/CellStates.js');

const life = Cames.find((game) => game.key === 'conways-game-of-life');
const brain = Cames.find((game) => game.key === 'brians-brain');

let ce;
describe('Cell Evaluator', function () {
	describe('LifeEvaluator', function () {
		beforeEach(function () {
			ce = new LifeEvaluator(life.born, life.survive);
		});
		it('next state should be active when neighbors are 3 otherwise active', function () {
			expect(ce.evaluate(0, CellStates.DEAD)).to.be.equal(CellStates.DEAD);
			expect(ce.evaluate(1, CellStates.DEAD)).to.be.equal(CellStates.DEAD);
			expect(ce.evaluate(2, CellStates.DEAD)).to.be.equal(CellStates.DEAD);
			expect(ce.evaluate(3, CellStates.DEAD)).to.be.equal(CellStates.ACTIVE);
			expect(ce.evaluate(4, CellStates.DEAD)).to.be.equal(CellStates.DEAD);
			expect(ce.evaluate(5, CellStates.DEAD)).to.be.equal(CellStates.DEAD);
			expect(ce.evaluate(6, CellStates.DEAD)).to.be.equal(CellStates.DEAD);
			expect(ce.evaluate(7, CellStates.DEAD)).to.be.equal(CellStates.DEAD);
			expect(ce.evaluate(8, CellStates.DEAD)).to.be.equal(CellStates.DEAD);
		});

		it('next state should stay active when neighbors are 2 or 3 only', function () {
			expect(ce.evaluate(0, CellStates.ACTIVE)).to.be.equal(CellStates.DEAD);
			expect(ce.evaluate(1, CellStates.ACTIVE)).to.be.equal(CellStates.DEAD);
			expect(ce.evaluate(2, CellStates.ACTIVE)).to.be.equal(CellStates.ACTIVE);
			expect(ce.evaluate(3, CellStates.ACTIVE)).to.be.equal(CellStates.ACTIVE);
			expect(ce.evaluate(4, CellStates.ACTIVE)).to.be.equal(CellStates.DEAD);
			expect(ce.evaluate(5, CellStates.ACTIVE)).to.be.equal(CellStates.DEAD);
			expect(ce.evaluate(6, CellStates.ACTIVE)).to.be.equal(CellStates.DEAD);
			expect(ce.evaluate(7, CellStates.ACTIVE)).to.be.equal(CellStates.DEAD);
			expect(ce.evaluate(8, CellStates.ACTIVE)).to.be.equal(CellStates.DEAD);
		});
	});

	describe('Brians Brain', function () {
		beforeEach(function () {
			ce = new GenerationalCellEvaluator(
				brain.born,
				brain.survive,
				brain.maxAge
			);
		});

		it ('should make the next state active when dead and has two active neighbors', function(){
			expect(ce.evaluate(0, CellStates.DEAD)).to.be.equal(CellStates.DEAD);
			expect(ce.evaluate(1, CellStates.DEAD)).to.be.equal(CellStates.DEAD);
			expect(ce.evaluate(2, CellStates.DEAD)).to.be.equal(CellStates.ACTIVE);
			expect(ce.evaluate(3, CellStates.DEAD)).to.be.equal(CellStates.DEAD);
			expect(ce.evaluate(4, CellStates.DEAD)).to.be.equal(CellStates.DEAD);
			expect(ce.evaluate(5, CellStates.DEAD)).to.be.equal(CellStates.DEAD);
			expect(ce.evaluate(6, CellStates.DEAD)).to.be.equal(CellStates.DEAD);
			expect(ce.evaluate(7, CellStates.DEAD)).to.be.equal(CellStates.DEAD);
			expect(ce.evaluate(8, CellStates.DEAD)).to.be.equal(CellStates.DEAD);
		})

		it ('should make the next state start aging when active', function(){
			expect(ce.evaluate(0, CellStates.ACTIVE)).to.be.equal(2);
			expect(ce.evaluate(1, CellStates.ACTIVE)).to.be.equal(2);
			expect(ce.evaluate(2, CellStates.ACTIVE)).to.be.equal(2);
			expect(ce.evaluate(3, CellStates.ACTIVE)).to.be.equal(2);
			expect(ce.evaluate(4, CellStates.ACTIVE)).to.be.equal(2);
			expect(ce.evaluate(5, CellStates.ACTIVE)).to.be.equal(2);
			expect(ce.evaluate(6, CellStates.ACTIVE)).to.be.equal(2);
			expect(ce.evaluate(7, CellStates.ACTIVE)).to.be.equal(2);
			expect(ce.evaluate(8, CellStates.ACTIVE)).to.be.equal(2);
		})

		it ('should make the next state be dead if aging', function(){
			expect(ce.evaluate(0, 2)).to.be.equal(0);
			expect(ce.evaluate(1, 2)).to.be.equal(0);
			expect(ce.evaluate(2, 2)).to.be.equal(0);
			expect(ce.evaluate(3, 2)).to.be.equal(0);
			expect(ce.evaluate(4, 2)).to.be.equal(0);
			expect(ce.evaluate(5, 2)).to.be.equal(0);
			expect(ce.evaluate(6, 2)).to.be.equal(0);
			expect(ce.evaluate(7, 2)).to.be.equal(0);
			expect(ce.evaluate(8, 2)).to.be.equal(0);
		})
	});

	describe('Generational Rules', function(){
		it('should continue aging regardless of neighborhood until max age met', function(){
			ca = new GenerationalCellEvaluator(null, null, 10)
			Array.from([2,3,4,5,6,7,8,9]).forEach(state => {
				expect(ca.evaluate(NaN, state)).to.equal(state+1)
			});
			expect(ca.evaluate(NaN, 10)).to.equal(CellStates.DEAD)
		})
	})
});
