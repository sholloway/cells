const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const {
	DrawingSystemWorkerController,
	WorkerState,
} = require('./../../lib/workers/DrawingSystemWorkerController.js');
const WorkerCommands = require('./../../lib/workers/WorkerCommands');
const { Cell } = require('./../../lib/core/Quadtree.js');

describe('DrawingSystemWorkerController', function () {
	let controller;
	beforeEach(function () {
		controller = new DrawingSystemWorkerController({
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

		it('should throw an error if command is not specified', function () {
			expect(() => {
				controller.process({});
			}).to.throw(
				Error,
				'DrawingSystem.worker: Command not provided in message.'
			);
		});

		it('should throw an error if command is unknown', function () {
			expect(() => {
				controller.process({
					command: 'Bad Command',
				});
			}).to.throw(
				Error,
				'Unsupported command Bad Command was received in DrawingSystem Worker.'
			);
		});

		it('should process scene', function () {
			sinon.stub(controller, 'sendMessageToClient');

			controller.process({
				command: WorkerCommands.LifeCycle.PROCESS_CYCLE,
			});

			expect(controller.sendMessageToClient.calledOnce).to.be.false;
			controller.process({
				command: WorkerCommands.LifeCycle.START,
			});

			controller.process({
				command: WorkerCommands.LifeCycle.PROCESS_CYCLE,
			});
			expect(controller.sendMessageToClient.calledOnce).to.be.true;
		});

		it('should throw an error if the cells are not provided', function () {
			expect(() =>
				controller.process({
					command: WorkerCommands.DrawingSystemCommands.SET_CELLS,
				})
			).to.throw(Error, 'The cells were not provided.');
		});

		it('should allow setting the cells', function () {
			expect(controller.drawingSystem.getCells().length).to.equal(0);
			expect(() =>
				controller.process({
					command: WorkerCommands.DrawingSystemCommands.SET_CELLS,
					cells: [new Cell(7, 14, 41), new Cell(11, 1, 42)],
				})
			).to.not.throw();
			expect(controller.drawingSystem.getCells().length).to.equal(2);
		});

		it('should reserve PAUSE commands', function () {
			expect(() =>
				controller.process({
					command: WorkerCommands.LifeCycle.PAUSE,
				})
			).to.not.throw();
		});

		it('should throw an error if the cell size is not provided', function () {
			expect(() =>
				controller.process({
					command: WorkerCommands.DrawingSystemCommands.SET_CELL_SIZE,
				})
			).to.throw(Error, 'The cell size was not provided.');
		});

		it('should allow setting the cell size', function () {
			expect(controller.drawingSystem.config.zoom).to.equal(1);
			expect(() =>
				controller.process({
					command: WorkerCommands.DrawingSystemCommands.SET_CELL_SIZE,
					cellSize: 5,
				})
			).to.not.throw();
			expect(controller.drawingSystem.config.zoom).to.equal(5);
		});

		it('should throw an error if the config is not provided', function () {
			expect(() => {
				controller.process({
					command: WorkerCommands.DrawingSystemCommands.RESET,
				});
			}).to.throw(Error, 'The configuration was not provided.');
		});

		it('should reset the system', function () {
			expect(controller.drawingSystem.config.zoom).to.equal(1);
			controller.process({
				command: WorkerCommands.DrawingSystemCommands.RESET,
				config: { zoom: 15 },
			});
			expect(controller.drawingSystem.config.zoom).to.equal(15);
		});

		it('should promise to reset the system', function () {
			sinon.stub(controller, 'sendMessageToClient');
			expect(controller.sendMessageToClient.calledOnce).to.be.false;
			controller.process({
				command: WorkerCommands.DrawingSystemCommands.RESET,
				params: {
					config: { zoom: 15 },
				},
				promisedResponse: true,
			});
			expect(controller.sendMessageToClient.calledOnce).to.be.true;
		});

		it('should toggle cell', function () {
			expect(
				controller.drawingSystem
					.getCells()
					.find((c) => c.location.row === 7 && c.location.col === 14)
			).to.be.undefined;
			controller.process({
				command: WorkerCommands.DrawingSystemCommands.TOGGLE_CELL,
				cx: 7,
				cy: 14,
			});

			expect(
				controller.drawingSystem
					.getCells()
					.find((c) => c.location.row === 7 && c.location.col === 14)
			).to.not.be.undefined;
		});

		it('should throw an error when cx or cy is not provided', function () {
			expect(() => {
				controller.process({
					command: WorkerCommands.DrawingSystemCommands.TOGGLE_CELL,
					cx: 7,
				});
			}).to.throw(Error, 'Either cx or cy was not provided.');

			expect(() => {
				controller.process({
					command: WorkerCommands.DrawingSystemCommands.TOGGLE_CELL,
					cy: 14,
				});
			}).to.throw(Error, 'Either cx or cy was not provided.');
		});

		it('should throw an error when the display storage field is not provided', function () {
			expect(() => {
				controller.process({
					command: WorkerCommands.DrawingSystemCommands.DISPLAY_STORAGE,
				});
			}).to.throw(Error, 'The displayStorage field was not provided.');
		});

		it('should set display storage', function () {
			expect(controller.drawingSystem.displayStorageStructure).to.be.false;
			controller.process({
				command: WorkerCommands.DrawingSystemCommands.DISPLAY_STORAGE,
				displayStorage: true,
			});
			expect(controller.drawingSystem.displayStorageStructure).to.be.true;
		});

		it('should promise to send cells', function () {
			sinon.stub(controller, 'sendMessageToClient');
			expect(controller.sendMessageToClient.calledOnce).to.be.false;
			controller.process({
				command: WorkerCommands.DrawingSystemCommands.SEND_CELLS,
				promisedResponse: true,
			});
			expect(controller.sendMessageToClient.calledOnce).to.be.true;
		});
	});
});
