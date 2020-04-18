const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const rewiremock = require('rewiremock/node');

const {
	getElementById,
	setElementValue,
} = require('./../../lib/dom/DomUtilities.js');

describe('DomUtils', function () {
	it('getElementById() should throw an error if no element found', function () {
		global.document = {
			getElementById: sinon.stub().returns(),
		};
		expect(() => {
			getElementById('BLAH');
		}).to.throw(Error, 'No element could be found with the ID of BLAH');
	});

	it('getElementById() should return the found element', function () {
		global.document = {
			getElementById: sinon.stub().returns({}),
		};
		getElementById('a');
		expect(document.getElementById.calledOnce).to.be.true;
	});

	it('should setElementValue()', function () {
		let element = {
			value: '',
		};
		global.document = {
			getElementById: sinon.stub().returns(element),
		};
		setElementValue('a', 'abc');
		expect(element.value).to.equal('abc');
	});
});
