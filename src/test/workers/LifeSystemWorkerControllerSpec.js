const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const LifeSystemWorkerController = require('./../../lib/workers/LifeSystemWorkerController.js');
const WorkerCommands = require('./../../lib/workers/WorkerCommands.js');
const { Cell } = require('./../../lib/entity-system/Entities.js');
const Games = require('../../lib/configs/Games.js');

describe('Life System Controller', function () {
	let controller;
	beforeEach(function () {
		controller = new LifeSystemWorkerController({
			postMessage: () => {},
		});
	});

	describe('Command Routing', function () {
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
				command: WorkerCommands.LifeSystemCommands.SET_SEEDER,
				id: 123,
				promisedResponse: true,
				params: {
					config: {
						landscape: {
							width: 1,
							height: 1,
						},
						game: {
							activeGame: Games[0],
						},
					},
					seedSetting: 'draw',
					cells: [new Cell(1, 1), new Cell(2, 2)],
				},
			});

			controller.process({
				command: WorkerCommands.LifeCycle.PROCESS_CYCLE,
			});
			//sendMessageToClient is called after setting the sider and
			//after processing the scene.
			expect(controller.sendMessageToClient.calledTwice).to.be.true;
		});

		it('should throw an error if command is unknown', function () {
			expect(() => {
				controller.process({
					command: 'Bad Command',
				});
			}).to.throw(
				Error,
				'Unsupported command Bad Command was received in LifeSystem Worker.'
			);
		});

		it('should throw an error if the config is not provided', function () {
			expect(() => {
				controller.process({
					command: WorkerCommands.LifeSystemCommands.RESET,
				});
			}).to.throw(Error, 'The configuration was not provided.');
		});

		it('should reset the system', function () {
			expect(controller.lifeSystem.config.zoom).to.be.undefined;
			controller.process({
				command: WorkerCommands.LifeSystemCommands.RESET,
				config: { zoom: 15, game: { activeGame: Games[0] } },
			});
			expect(controller.lifeSystem.config.zoom).to.equal(15);
		});

		it('should promise to reset the system', function () {
			sinon.stub(controller, 'sendMessageToClient');
			expect(controller.sendMessageToClient.calledOnce).to.be.false;
			controller.process({
				command: WorkerCommands.DrawingSystemCommands.RESET,
				params: {
					config: { zoom: 15, game: { activeGame: Games[0] } },
				},
				promisedResponse: true,
			});
			expect(controller.sendMessageToClient.calledOnce).to.be.true;
		});

		it('should promise to send cells', function () {
			sinon.stub(controller, 'sendMessageToClient');
			expect(controller.sendMessageToClient.calledOnce).to.be.false;
			controller.process({
				command: WorkerCommands.LifeSystemCommands.SEND_CELLS,
				promisedResponse: true,
			});
			expect(controller.sendMessageToClient.calledOnce).to.be.true;
		});

		it('should throw an error if the cell size is not provided', function () {
			expect(() =>
				controller.process({
					command: WorkerCommands.LifeSystemCommands.SET_CELL_SIZE,
				})
			).to.throw(Error, 'The cell size was not provided.');
		});

		it('should allow setting the cell size', function () {
			expect(controller.lifeSystem.config.zoom).to.be.undefined;
			expect(() =>
				controller.process({
					command: WorkerCommands.LifeSystemCommands.SET_CELL_SIZE,
					cellSize: 5,
				})
			).to.not.throw();
			expect(controller.lifeSystem.config.zoom).to.equal(5);
		});

		it('should set the seeder', function () {
			sinon.stub(controller, 'sendMessageToClient');
			controller.process({
				command: WorkerCommands.LifeSystemCommands.SET_SEEDER,
				id: 123,
				promisedResponse: true,
				params: {
					config: {
						landscape: {
							width: 1,
							height: 1,
						},
						game: { activeGame: Games[0] },
					},
					seedSetting: 'draw',
					cells: [new Cell(1, 1), new Cell(2, 2)],
				},
			});
			expect(controller.sendMessageToClient.calledOnce).to.be.true;
		});
	});
});
