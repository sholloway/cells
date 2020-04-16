const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const rewiremock = require('rewiremock/node');

rewiremock(() => require('./../../lib/workers/WorkersLoader.js')).with({});
rewiremock.enable();

const AppBuilder = require('../../lib/app/AppBuilder.js');

describe('AppBuilder', function () {
	this.beforeEach(function () {});
	it('buildApp() should setup the game', function () {
		sinon.stub(AppBuilder, 'setupProperties');
		sinon.stub(AppBuilder, 'setupRenderers');
		sinon.stub(AppBuilder, 'setupScenes');
		sinon.stub(AppBuilder, 'setupWorkers');

		AppBuilder.buildApp();

		expect(AppBuilder.setupProperties.calledOnce).to.be.true;
		expect(AppBuilder.setupRenderers.calledOnce).to.be.true;
		expect(AppBuilder.setupScenes.calledOnce).to.be.true;
		expect(AppBuilder.setupWorkers.calledOnce).to.be.true;
	});
});
