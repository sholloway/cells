const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const rewiremock = require('rewiremock/node');

const messagehandlers = {
	handleMessageFromGridWorker: sinon.stub(),
	handleMsgFromDrawingWorker: sinon.stub(),
	handleMessageFromLifeWorker: sinon.stub(),
	setThreadFlagToClean: sinon.stub(),
};

const rewiredWorkerLoader = {
	createWorker: sinon.stub(),
};
rewiremock(() => require('./../../lib/workers/WorkersLoader.js')).with(
	rewiredWorkerLoader
);
rewiremock(() => require('./../../lib/app/AppMessageHandlers')).with(
	messagehandlers
);
rewiremock.enable();

const AppBuilder = require('../../lib/app/AppBuilder.js');

describe('AppBuilder', function () {
	let app;
	this.beforeEach(function () {
		app = {
			updateUI: sinon.stub(),
			gridCanvas: { getContext: sinon.stub() },
			drawCanvas: { getContext: sinon.stub() },
			simCanvas: { getContext: sinon.stub() },
		};
	});

	it('buildApp() should setup the game', function () {
		sinon.stub(AppBuilder, 'setupProperties');
		sinon.stub(AppBuilder, 'setupScenes');
		sinon.stub(AppBuilder, 'setupWorkers');

		AppBuilder.buildApp();

		expect(AppBuilder.setupProperties.calledOnce).to.be.true;
		expect(AppBuilder.setupScenes.calledOnce).to.be.true;
		expect(AppBuilder.setupWorkers.calledOnce).to.be.true;

		AppBuilder.setupProperties.restore();
		AppBuilder.setupScenes.restore();
		AppBuilder.setupWorkers.restore();
	});

	it('should setupProperties', function () {
		AppBuilder.setupProperties(app);
		expect(app.config).to.not.be.undefined;
		expect(app.stateManager).to.not.be.undefined;
		expect(app.stateManager.observers.size).to.equal(1);

		app.stateManager.notify('ticked', {});
		expect(app.updateUI.calledOnce).to.be.true;
	});

	it('should setupRenderers', function () {
		app.getCanvasContext = sinon.stub();
		app.stateManager = { registerRenderer: () => {} };
		sinon.stub(app.stateManager, 'registerRenderer').returns(app.stateManager);
		AppBuilder.setupRenderers(app);
		expect(app.stateManager.registerRenderer.callCount).to.equal(3);
		expect(app.getCanvasContext.callCount).to.equal(3);
	});

	it('should setupScenes', function () {
		app.stateManager = { createScene: () => {} };
		sinon.stub(app.stateManager, 'createScene').returns(app.stateManager);
		AppBuilder.setupScenes(app);
		expect(app.stateManager.createScene.callCount).to.equal(3);
	});

	it('should setupWorkers', function () {
		app.stateManager = { createWorker: () => {} };
		sinon.stub(app.stateManager, 'createWorker').returns(app.stateManager);
		AppBuilder.setupWorkers(app);
		expect(app.stateManager.createWorker.callCount).to.equal(3);
	});
});
