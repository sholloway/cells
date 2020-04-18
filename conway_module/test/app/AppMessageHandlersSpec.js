const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const rewiremock = require('rewiremock/node');

const {
	handleMessageFromGridWorker,
	handleMsgFromDrawingWorker,
	handleMessageFromLifeWorker,
} = require('../../lib/app/AppMessageHandlers.js');

describe('AppMessageHandlers', function () {
	it('should handleMessageFromGridWorker', function () {
		let stateManager = {
			workerSystem: {
				attemptToProcessPendingWork: sinon.stub(),
			},
			processCycleMessage: sinon.stub(),
		};

		let handler = handleMessageFromGridWorker.bind(stateManager);

		//Scenerio 1: No Envelope
		handler(); //Does Nothing

		//Scenario 2: No Envelope Data
		handler({}); //Does Nothing

		//Scenario 3: Cycle Message
		handler({ data: {} });
		expect(stateManager.processCycleMessage.calledOnce).to.be.true;

		//Scenario 4: Promised Response
		handler({ data: { promisedResponse: true } });
		expect(stateManager.workerSystem.attemptToProcessPendingWork.calledOnce).to
			.be.true;
	});

	it('should handleMsgFromDrawingWorker', function () {
		let stateManager = {
			workerSystem: {
				attemptToProcessPendingWork: sinon.stub(),
			},
			processCycleMessage: sinon.stub(),
		};

		let handler = handleMsgFromDrawingWorker.bind(stateManager);

		//Scenerio 1: No Envelope
		handler(); //Does Nothing

		//Scenario 2: No Envelope Data
		handler({}); //Does Nothing

		//Scenario 3: Cycle Message
		handler({ data: {} });
		expect(stateManager.processCycleMessage.calledOnce).to.be.true;

		//Scenario 4: Promised Response
		handler({ data: { promisedResponse: true } });
		expect(stateManager.workerSystem.attemptToProcessPendingWork.calledOnce).to
			.be.true;
	});

	it('should handleMessageFromLifeWorker', function () {
		let stateManager = {
			workerSystem: {
				attemptToProcessPendingWork: sinon.stub(),
			},
			processCycleMessage: sinon.stub(),
		};

		let handler = handleMessageFromLifeWorker.bind(stateManager);

		//Scenerio 1: No Envelope
		handler(); //Does Nothing

		//Scenario 2: No Envelope Data
		handler({}); //Does Nothing

		//Scenario 3: Cycle Message
		handler({ data: {} });
		expect(stateManager.processCycleMessage.calledOnce).to.be.true;

		//Scenario 4: Promised Response
		handler({ data: { promisedResponse: true } });
		expect(stateManager.workerSystem.attemptToProcessPendingWork.calledOnce).to
			.be.true;
	});
});
