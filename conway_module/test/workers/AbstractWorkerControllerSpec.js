const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const {
	AbstractWorkerController,
	WorkerState,
} = require('./../../lib/workers/AbstractWorkerController.js');

const WorkerCommands = require('./../../lib/workers/WorkerCommands');

describe('Abstract Worker Controller', function () {
	let controller;
	beforeEach(function () {
		controller = new AbstractWorkerController({
			postMessage: () => {},
		});
	});

	it('should define worker states', function () {
		expect(WorkerState.STOPPED).to.equal(1);
		expect(WorkerState.PAUSED).to.equal(2);
		expect(WorkerState.RUNNING).to.equal(3);
	});

	it('should postMessage', function () {
		sinon.stub(controller.worker, 'postMessage');
		expect(controller.worker.postMessage.calledOnce).to.be.false;
		controller.sendMessageToClient('fake message');
		expect(controller.worker.postMessage.calledOnce).to.be.true;
	});

	describe('Command Routing', function () {
		it('should start and stop the system is running', function () {
			expect(controller.systemRunning()).to.be.false;
			controller.process({
				command: WorkerCommands.LifeCycle.START,
			});
			expect(controller.systemRunning()).to.be.true;
			controller.process({
				command: WorkerCommands.LifeCycle.STOP,
			});
			expect(controller.systemRunning()).to.be.false;
		});

		it('should enforce implementing routeCommand(msg)', function () {
			expect(() =>
				controller.process({
					command: 'Non-lifecycle command',
				})
			).to.throw(
				Error,
				'Child classes of AbstractWorkerController must implement the method routeCommand(msg).'
			);
		});

		it('should enforce implementing processScene(msg)', function () {
			controller.process({
				command: WorkerCommands.LifeCycle.START,
			});

			expect(() =>
				controller.process({
					command: WorkerCommands.LifeCycle.PROCESS_CYCLE,
				})
			).to.throw(
				Error,
				'Child classes of AbstractWorkerController must implement the method processScene().'
			);
		});

		it('should process scene', function () {
			sinon.stub(controller, 'processScene');
			controller.process({
				command: WorkerCommands.LifeCycle.PROCESS_CYCLE,
			});

			expect(controller.processScene.calledOnce).to.be.false;
			controller.process({
				command: WorkerCommands.LifeCycle.START,
			});

			controller.process({
				command: WorkerCommands.LifeCycle.PROCESS_CYCLE,
			});
			expect(controller.processScene.calledOnce).to.be.true;
		});

		it('should reserve PAUSE commands', function () {
			sinon.stub(controller, 'routeCommand');
			expect(controller.routeCommand.calledOnce).to.be.false;
			controller.process({
				command: WorkerCommands.LifeCycle.PAUSE,
			});
			expect(controller.routeCommand.calledOnce).to.be.false;
		});

		it('should invoke routeCommand(msg) if not a LifeCycle command', function () {
			sinon.stub(controller, 'routeCommand');
			expect(controller.routeCommand.calledOnce).to.be.false;
			controller.process({
				command: 'Non-lifecycle command',
			});
			expect(controller.routeCommand.calledOnce).to.be.true;
		});

		it('should throw an error if command is not specified', function () {
			expect(() => {
				controller.process({});
			}).to.throw(Error);
		});

		it('should find properties on the message', function () {
			expect(controller.findPromisedProperty({ example: 123 }, 'example')).to
				.not.be.undefined;
			expect(
				controller.findPromisedProperty({ params: { example: 123 } }, 'example')
			).to.not.be.undefined;
			expect(controller.findPromisedProperty({}, 'example')).to.be.undefined;
		});

		it('should process commands only when the criteria is met', function () {
			let trueCommandCriteria = sinon.stub().returns(true);
			let cmdProcessor = sinon.stub();
			let errMsg = 'ERROR';

			controller.processCmd(
				{ a: 123 },
				'FAKE_COMMAND',
				trueCommandCriteria,
				cmdProcessor,
				errMsg
			);

			expect(trueCommandCriteria.calledOnce).to.be.true;
			expect(cmdProcessor.calledOnce).to.be.true;
		});

		it('should notprocess commands when the criteria is not met', function () {
			let falseCommandCriteria = sinon.stub().returns(false);
			let cmdProcessor = sinon.stub();
			let errMsg = 'ERROR';

			expect(() =>
				controller.processCmd(
					{ a: 123 },
					'FAKE_COMMAND',
					falseCommandCriteria,
					cmdProcessor,
					errMsg
				)
			).to.throw(Error, 'Cannot process the command FAKE_COMMAND: ERROR');

			expect(falseCommandCriteria.calledOnce).to.be.true;
			expect(cmdProcessor.calledOnce).to.be.false;
		});
	});
});
