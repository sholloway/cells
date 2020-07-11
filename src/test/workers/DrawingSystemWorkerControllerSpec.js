const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const DrawingSystemWorkerController = require('./../../lib/workers/DrawingSystemWorkerController.js');
const WorkerCommands = require('./../../lib/workers/WorkerCommands');
const { Cell } = require('./../../lib/entity-system/Entities.js');

describe('DrawingSystemWorkerController', function () {
	let controller;
	beforeEach(function () {
		controller = new DrawingSystemWorkerController({
			postMessage: () => {},
		});
	});

	describe('Command Routing', function () {
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
			).to.throw(
				Error,
				'Cannot process the command SET_CELLS: The cells or numberOfCells were not provided.'
			);
		});

		it('should allow setting the cells', function () {
			expect(controller.drawingSystem.getCells().length).to.equal(0);
			expect(() =>
				controller.process({
					command: WorkerCommands.DrawingSystemCommands.SET_CELLS,
					numberOfCells: 2,
					cells: Uint16Array.from([7, 14, 11, 1]),
					//cells: [new Cell(7, 14, 41), new Cell(11, 1, 42)],
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

		it('should throw an error if the config is not provided during reset', function () {
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
					.find((c) => c.row === 7 && c.col === 14)
			).to.be.undefined;
			controller.process({
				command: WorkerCommands.DrawingSystemCommands.TOGGLE_CELL,
				cx: 7,
				cy: 14,
			});

			expect(
				controller.drawingSystem
					.getCells()
					.find((c) => c.row === 7 && c.col === 14)
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
