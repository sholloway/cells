const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const {
	onmessage,
	getController,
} = require('./../../lib/workers/LifeSystem.worker');

describe('Life System Worker', function () {
	it('should invoke the controller process method on message', function () {
		sinon.stub(getController(), 'process');
		expect(getController().process.calledOnce).to.be.false;
		onmessage({});
		expect(getController().process.calledOnce).to.be.true;
	});
});
