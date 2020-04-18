const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const rewiremock = require('rewiremock/node');

let getElementResult = {
	value: '',
	innerText: '',
	checked: false,
};

let domUtils = {
	getElementById: () => {
		return getElementResult;
	},
};

const configUtils = {
	updateConfiguredZoom: sinon.stub(),
	updateConfiguredLandscape: sinon.stub(),
};

rewiremock(() => require('../../lib/dom/DomUtilities.js')).with(domUtils);
rewiremock(() => require('./../../lib/ui/UIConfigurationUtilities')).with(
	configUtils
);
rewiremock.enable();

const {
	AppStateManager,
	AppStateManagerEvents,
} = require('./../../lib/app/AppStateManager.js');

describe('AppStateManager', function () {
	let stateManager;
	let config;
	this.beforeEach(function () {
		config = {};
		stateManager = new AppStateManager(config);
	});

	it('should isDrawingAllowed', function () {
		expect(stateManager.isDrawingAllowed()).to.be.true;
		stateManager.preventDrawing();
		expect(stateManager.isDrawingAllowed()).to.be.false;
	});

	it('should registerRenderer', function () {
		expect(stateManager.renderers.size).to.equal(0);
		stateManager.registerRenderer('a', {});
		stateManager.registerRenderer('b', {});
		expect(stateManager.renderers.size).to.equal(2);

		stateManager.registerRenderer('a', {});
		expect(stateManager.renderers.size).to.equal(2);
	});

	it('should createScene', function () {
		expect(stateManager.scenes.size).to.equal(0);
		expect(stateManager.sceneBuilders.size).to.equal(0);
		stateManager.createScene('a', {});
		stateManager.createScene('b', {});
		expect(stateManager.scenes.size).to.equal(2);
		expect(stateManager.sceneBuilders.size).to.equal(2);

		stateManager.createScene('a', {});
		expect(stateManager.scenes.size).to.equal(2);
		expect(stateManager.sceneBuilders.size).to.equal(2);
	});

	it('should createWorker', function () {
		let fakeMessageHandler = sinon.stub();
		sinon.stub(stateManager.workerSystem, 'registerWorker');
		stateManager.createWorker('a', FakeWorker, fakeMessageHandler);
		stateManager.createWorker('a', FakeWorker, fakeMessageHandler);
		expect(stateManager.workers.size).to.equal(1);

		stateManager.createWorker('b', FakeWorker, fakeMessageHandler, false);
		expect(stateManager.workerSystem.registerWorker.calledOnce).to.be.true;
	});

	it('start() should start the worker system and enable drawing', function () {
		sinon.stub(stateManager.workerSystem, 'main');
		stateManager.drawingAllowed = false;
		stateManager.start();
		expect(stateManager.workerSystem.main.calledOnce).to.be.true;
		expect(stateManager.isDrawingAllowed()).to.be.true;
	});

	it('should startMainLoop', function () {
		sinon.stub(stateManager.workerSystem, 'start');
		stateManager.startMainLoop();
		expect(stateManager.workerSystem.start.calledOnce).to.be.true;
	});

	it('startWorker() should send a message to the worker', function () {
		stateManager.createWorker('a', FakeWorker, null, false);
		stateManager.workers.get('a').postMessage = sinon.stub();
		stateManager.startWorker('a');
		expect(stateManager.workers.get('a').postMessage.calledOnce).to.be.true;
	});

	it('stopWorker() should send a message to the worker', function () {
		stateManager.createWorker('a', FakeWorker, null, false);
		stateManager.workers.get('a').postMessage = sinon.stub();
		stateManager.stopWorker('a');
		expect(stateManager.workers.get('a').postMessage.calledOnce).to.be.true;
	});

	it('should render', function () {
		stateManager.registerRenderer('a', null).createScene('a', {});
		stateManager.renderers.get('a').render = sinon.stub();
		stateManager.render('a');
		expect(stateManager.renderers.get('a').render.calledOnce).to.be.true;
	});

	it('should updateUI', function () {
		let uiChangesSubscriber = sinon.stub();
		stateManager.subscribe(
			AppStateManagerEvents.UI_CHANGES,
			uiChangesSubscriber
		);
		stateManager.updateUI({});
		expect(uiChangesSubscriber.calledOnce).to.be.true;
	});

	it('should clearRender', function () {
		let fake = {
			clear: sinon.stub(),
		};
		stateManager.renderers.set('a', fake);
		stateManager.clearRender('a');
		expect(fake.clear.calledOnce).to.be.true;
	});

	it('should clearScene', function () {
		let fake = {
			clear: sinon.stub(),
		};
		stateManager.scenes.set('a', fake);
		stateManager.clearScene('a');
		expect(fake.clear.calledOnce).to.be.true;
	});

	it('should getScene', function () {
		stateManager.scenes.set('a', 1);
		expect(stateManager.getScene('a')).to.equal(1);
	});

	it('should buildScene', function () {
		let sceneBuilder = sinon.stub();
		stateManager.createScene('a', sceneBuilder);
		stateManager.buildScene('a', []);
		expect(sceneBuilder.calledOnce).to.be.true;

		//Scenerio B: Unknown Layer
		sceneBuilder.resetHistory();
		stateManager.buildScene('b', []);
		expect(sceneBuilder.calledOnce).to.be.false;
	});

	it('should sendWorkerMessage', function () {
		let worker = { postMessage: sinon.stub() };
		stateManager.workers.set('a', worker);
		stateManager.sendWorkerMessage('a', {});
		expect(worker.postMessage.calledOnce).to.be.true;
	});

	it('should broadcast', function () {
		stateManager.workerSystem.broadcast = sinon.stub();
		stateManager.broadcast({});
		expect(stateManager.workerSystem.broadcast.calledOnce).to.be.true;
	});

	it('should processCycleMessage', function () {
		let errMsg =
			'AppStateManager.processCycleMessage: Can only process messages that are PROCESS_CYCLE and contain a stack.';
		//Scenario 1: Throws an error
		expect(() => {
			stateManager.processCycleMessage('a');
		}).to.throw(Error, errMsg);

		//Scenario 2: Throws an error
		expect(() => {
			stateManager.processCycleMessage('a', {});
		}).to.throw(Error, errMsg);

		//Scenario 3: Throws an error
		expect(() => {
			stateManager.processCycleMessage('a', { command: 'PROCESS_CYCLE' });
		}).to.throw(Error, errMsg);

		//Scenario 4: Happy Path
		stateManager.clearScene = sinon.stub().returns(stateManager);
		stateManager.buildScene = sinon.stub().returns(stateManager);
		stateManager.render = sinon.stub().returns(stateManager);
		stateManager.updateUI = sinon.stub().returns(stateManager);

		stateManager.processCycleMessage('a', {
			command: 'PROCESS_CYCLE',
			stack: [],
		});

		expect(stateManager.clearScene.calledOnce).to.be.true;
		expect(stateManager.buildScene.calledOnce).to.be.true;
		expect(stateManager.render.calledOnce).to.be.true;
		expect(stateManager.updateUI.calledOnce).to.be.true;
	});

	it('allowDrawing() should start the drawing worker', function () {
		stateManager.startWorker = sinon.stub();
		stateManager.drawingAllowed = false;
		stateManager.allowDrawing();
		expect(stateManager.drawingAllowed).to.be.true;
		expect(stateManager.startWorker.calledOnce).to.be.true;
	});

	it('preventDrawing() should stop the drawing worker', function () {
		stateManager.stopWorker = sinon.stub();
		stateManager.drawingAllowed = true;
		stateManager.preventDrawing();
		expect(stateManager.drawingAllowed).to.be.false;
		expect(stateManager.stopWorker.calledOnce).to.be.true;
	});

	it('should startSimulation', function () {
		stateManager.workerSystem.promiseResponse = sinon.stub().resolves({});
		stateManager.resetDrawingSystem = sinon.stub().resolves();
		stateManager.setSeederOnLifeSystem = sinon.stub().resolves();
		stateManager.startWorker = sinon.stub();

		return Promise.resolve(stateManager.startSimulation()).then(() => {
			expect(stateManager.workerSystem.promiseResponse.calledOnce).to.be.true;
			expect(stateManager.resetDrawingSystem.calledOnce).to.be.true;
			expect(configUtils.updateConfiguredZoom.calledOnce).to.be.true;
			expect(configUtils.updateConfiguredLandscape.calledOnce).to.be.true;
			expect(stateManager.setSeederOnLifeSystem.calledOnce).to.be.true;
			expect(stateManager.startWorker.calledOnce).to.be.true;
		});
	});

	it('should pauseSimulationInDrawingMode', function () {
		stateManager.workerSystem.promiseResponse = sinon.stub().resolves({});
		stateManager.sendWorkerMessage = sinon.stub().returns(stateManager);
		stateManager.clearRender = sinon.stub().returns(stateManager);
		stateManager.allowDrawing = sinon.stub().returns(stateManager);

		return Promise.resolve(stateManager.pauseSimulationInDrawingMode()).then(
			() => {
				expect(stateManager.workerSystem.promiseResponse.calledOnce).to.be.true;
				expect(stateManager.sendWorkerMessage.calledTwice).to.be.true;
				expect(stateManager.clearRender.calledOnce).to.be.true;
				expect(stateManager.allowDrawing.calledOnce).to.be.true;
			}
		);
	});

	it('should resolve resetting the drawing system when cells are provided', function () {
		stateManager.sendWorkerMessage = sinon.stub().returns(stateManager);
		stateManager.clearRender = sinon.stub().returns(stateManager);
		return Promise.resolve(stateManager.resetDrawingSystem({ cells: [] })).then(
			() => {
				expect(stateManager.sendWorkerMessage.calledOnce).to.be.true;
				expect(stateManager.clearRender.calledOnce).to.be.true;
			}
		);
	});

	it('should reject resetting the drawing system when cells are not provided', function () {
		stateManager.sendWorkerMessage = sinon.stub().returns(stateManager);
		stateManager.clearRender = sinon.stub().returns(stateManager);
		return Promise.resolve(stateManager.resetDrawingSystem({}))
			.then(() => {
				expect.fail('The promise should have been rejected.');
			})
			.catch((reason) => {
				expect(reason).to.equal('Cells were not provided.');
				expect(stateManager.sendWorkerMessage.calledOnce).to.be.true;
				expect(stateManager.clearRender.calledOnce).to.be.true;
			});
	});

	it('should setSeederOnLifeSystem', function () {
		stateManager.workerSystem.promiseResponse = sinon.stub().resolves({});
		return Promise.resolve(stateManager.setSeederOnLifeSystem([])).then(() => {
			expect(stateManager.workerSystem.promiseResponse.calledOnce).to.be.true;
		});
	});

	it('should stopSimulation', function () {
		stateManager.stopWorker = sinon.stub();
		stateManager.stopSimulation();
		expect(stateManager.stopWorker.calledOnce).to.be.true;
		expect(stateManager.stopWorker.getCall(0).args[0]).to.equal('SIMULATION');
	});

	it('should resumeSimulation', function () {
		stateManager.startWorker = sinon.stub();
		stateManager.resumeSimulation();
		expect(stateManager.startWorker.calledOnce).to.be.true;
		expect(stateManager.startWorker.getCall(0).args[0]).to.equal('SIMULATION');
	});

	it('should resetSimulation', function () {
		stateManager.workerSystem.promiseResponses = sinon
			.stub()
			.returns([sinon.stub().resolves()]);
		stateManager.clearScene = sinon.stub().returns(stateManager);
		stateManager.clearRender = sinon.stub().returns(stateManager);

		return Promise.resolve(stateManager.resetSimulation()).then(() => {
			expect(stateManager.workerSystem.promiseResponses.calledOnce).to.be.true;
			expect(stateManager.clearScene.calledOnce).to.be.true;
			expect(stateManager.clearRender.calledTwice).to.be.true;
		});
	});
});

class FakeWorker {}
