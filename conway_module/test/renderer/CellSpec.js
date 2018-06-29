let chai = require('chai')
let expect = chai.expect
let sinon = require('sinon')
let fake = sinon.fake

let Cell = require('./../../lib/renderer/Cell.js')
describe('Cell Rendering', function(){
	it ('should render a rectangle', function(){
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

	it ('should select the color fill by the age', function(){
		let ctx = {
			fillRect: fake(),
			strokeRect: fake()
		}
		new Cell(5,10, 20, 40, 0).render(ctx)
		expect(ctx.fillStyle).to.equal('rgb(141, 203, 239)')
		expect(ctx.strokeStyle).to.equal('rgb(200, 0, 0)')

		new Cell(5,10, 20, 40, 3).render(ctx)
		expect(ctx.fillStyle).to.equal('rgb(76, 179, 239)')
		expect(ctx.strokeStyle).to.equal('rgb(200, 0, 0)')

		new Cell(5,10, 20, 40, 6).render(ctx)
		expect(ctx.fillStyle).to.equal('rgb(237, 61, 61)')
		expect(ctx.strokeStyle).to.equal('rgb(200, 0, 0)')

		new Cell(5,10, 20, 40, 3245678).render(ctx)
		expect(ctx.fillStyle).to.equal('rgb(3, 153, 18)')
		expect(ctx.strokeStyle).to.equal('rgb(200, 0, 0)')
	})
})
