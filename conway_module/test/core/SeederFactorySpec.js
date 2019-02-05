const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const {Cell} = require('./../../lib/core/Quadtree.js')

const {SeederFactory, SeederModels, Seeder} = require('./../../lib/core/SeederFactory.js')

describe('Seeder Factory', function(){
	it ('should produce a RandomSeeder', function(){
		let model = SeederFactory.build(SeederModels.RANDOM)
		expect(model.constructor.name).to.equal('RandomSeeder')
	})

	it ('should produce a RandomSeeder', function(){
		let model = SeederFactory.build(SeederModels.DRAWING)
		expect(model.constructor.name).to.equal('StaticCellsSeeder')
	})

	it ('should throw an error on unknown models', function(){
		let badModelName = 'garbage'
		expect(() => SeederFactory.build(badModelName)).to.throw(`Unknown seeder model name: ${badModelName}`)
	})

	describe('Seeder', function(){
		it ('should enforce that children implement seed(width,height)', function(){
			let seeder = new Seeder()
			expect(() => seeder.seed()).to.throw('Seeder implementations must implement the seed(width, height) method.')
		})
	})

	describe('StaticCellsSeeder', function(){
		it ('should just return the cells provided', function(){
			let model = SeederFactory.build(SeederModels.DRAWING)
			let cells = [new Cell(1,2,5), new Cell(33,1,1)]
			model.setCells(cells)
			expect(model.seed()).to.have.deep.ordered.members([new Cell(1,2,5), new Cell(33,1,1)])
		})
	})
})
