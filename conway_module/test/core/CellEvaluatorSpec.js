const chai = require('chai')
const expect = chai.expect

const CellEvaluator = require('./../../src/core/CellEvaluator.js')
const {CellStates} = require('./../../src/core/CellStates.js')

describe('Cell Evaluator', function(){
	it('should use the default of [3] for birth rules', function(){
		let ce = new CellEvaluator()
		expect(ce.evaluate(3, CellStates.DEAD)).to.be.equal(CellStates.ALIVE)
		expect(ce.evaluate(2, CellStates.DEAD)).to.be.equal(CellStates.DEAD)
		expect(ce.evaluate(4, CellStates.DEAD)).to.be.equal(CellStates.DEAD)
	})

	it('should use the default of [2,3] for survival rules', function(){
		let ce = new CellEvaluator()
		expect(ce.evaluate(2,CellStates.ALIVE)).to.equal(CellStates.ALIVE)
		expect(ce.evaluate(3,CellStates.ALIVE)).to.equal(CellStates.ALIVE)
		expect(ce.evaluate(1,CellStates.ALIVE)).to.equal(CellStates.DEAD)
		expect(ce.evaluate(4,CellStates.ALIVE)).to.equal(CellStates.DEAD)
	})

	it('should throw an error if the cell state is unknown', function(){
		let ce = new CellEvaluator()
		let testFunction = ce.evaluate.bind(ce, 8, -1)
		expect(testFunction).throws("Cannot evaluate cell. Unknown cell state: -1")
	})
})
