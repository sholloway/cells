let chai = require('chai')
let expect = chai.expect
let sinon = require('sinon')
let fake = sinon.fake

let Cell = require('./../../lib/renderer/Cell.js')
describe('Cell Rendering', function(){
	/*
	TODO: Re-think the use of mixins.
	*/
	it.skip ('should render a rectangle', function(){
		let cell = new Cell(5,10, 20, 40, 6)
		let ctx = {
			fillRect: fake(),
			strokeRect: fake()
		}
		cell.render(ctx)
		expect(ctx.strokeStyle).to.equal('rgb(200, 0, 0)')
		expect(ctx.fillRect.callCount).to.equal(1)
		expect(ctx.strokeRect.callCount).to.equal(1)
		expect(ctx.fillRect.calledWith(5,10, 20, 40)).to.be.true
		expect(ctx.strokeRect.calledWith(5,10, 20, 40)).to.be.true
	})

	it ('should render a circle', function(){
		let cell = new Cell(5,10, 20, 40, 6)
		let ctx = {
			beginPath: fake(),
			arc: fake(),
			fill: fake(),
			stroke: fake()
		}
		cell.render(ctx)
		expect(ctx.beginPath.callCount).to.equal(1)
		expect(ctx.arc.callCount).to.equal(1)

		expect(ctx.arc.calledWith(15,30,10,0,6.283185307179586,true)).to.be.true
		expect(ctx.fill.callCount).to.equal(1)
		expect(ctx.stroke.callCount).to.equal(1)

		expect(ctx.strokeStyle).to.equal('rgb(0, 0, 0)')
		expect(ctx.fillStyle).to.equal('rgb(237, 61, 61)')
	})

	it ('should select the color fill by the age', function(){
		let ctx = {
			beginPath: fake(),
			arc: fake(),
			fill: fake(),
			stroke: fake()
		}
		new Cell(5,10, 20, 40, 0).render(ctx)
		expect(ctx.fillStyle).to.equal('rgb(141, 203, 239)')

		new Cell(5,10, 20, 40, 3).render(ctx)
		expect(ctx.fillStyle).to.equal('rgb(76, 179, 239)')

		new Cell(5,10, 20, 40, 6).render(ctx)
		expect(ctx.fillStyle).to.equal('rgb(237, 61, 61)')

		new Cell(5,10, 20, 40, 3245678).render(ctx)
		expect(ctx.fillStyle).to.equal('rgb(3, 153, 18)')
	})
})
