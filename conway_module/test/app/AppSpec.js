const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const rewiremock = require('rewiremock/node');

let getElementByIdValue = '';
let getElementByIdValueInnerText = '';
let getElementByIdChecked = false;

let domUtils = {
	getElementById: () => {
		return {
			value: getElementByIdValue,
			innerText: getElementByIdValueInnerText,
			checked: getElementByIdChecked,
		};
	},
	setElementValue: () => {},
};

rewiremock(() => require('../../lib/workers/WorkersLoader.js')).with({});
rewiremock(() => require('../../lib/dom/DomUtilities.js')).with(domUtils);

rewiremock.enable();

const Game = require('../../lib/app/App.js');

describe('The App', function () {
	let game;
	this.beforeEach(function () {
		game = new Game();
		let stateManager = {
			allowDrawing: sinon.stub(),
			preventDrawing: sinon.stub(),
			broadcast: sinon.stub(),
			startSimulation: sinon.stub(),
			stopSimulation: sinon.stub(),
			pauseSimulationInDrawingMode: sinon.stub(),
			resumeSimulation: sinon.stub(),
			resetSimulation: sinon.stub(),
			clearRender: sinon.stub(),
			startMainLoop: sinon.stub(),
		};
		game.stateManager = stateManager;
	});
	describe('The Public Interface', function () {
		it('should setSeedingOption', function () {
			sinon.stub(game, 'resetSimulation').returns(game);

			getElementByIdValue = 'draw';
			game.setSeedingOption();

			//test for draw
			expect(game.resetSimulation.calledOnce).to.be.true;
			expect(game.stateManager.allowDrawing.calledOnce).to.be.true;
			expect(game.stateManager.preventDrawing.calledOnce).to.be.false;

			//test for random
			getElementByIdValue = 'random';
			game.setSeedingOption();

			expect(game.resetSimulation.calledTwice).to.be.true;
			expect(game.stateManager.preventDrawing.calledOnce).to.be.true;
		});

		it('changedCellSize should broadcast to workers', function () {
			sinon.stub(game, 'handleGridBackgroundClicked');
			game.changedCellSize();
			expect(game.stateManager.broadcast.calledOnce).to.be.true;
			expect(game.handleGridBackgroundClicked.calledOnce).to.be.true;
		});

		it('should toggleSimulation from Start', function () {
			getElementByIdValueInnerText = 'Start';
			sinon.stub(game, 'transitionToThePauseButton').returns(game);
			game.toggleSimulation();
			expect(game.transitionToThePauseButton.calledOnce).to.be.true;
			expect(game.stateManager.preventDrawing.calledOnce).to.be.true;
			expect(game.stateManager.startSimulation.calledOnce).to.be.true;
		});

		it('should toggleSimulation from Pause', function () {
			getElementByIdValueInnerText = 'Pause';

			//In drawing mode
			getElementByIdValue = 'draw';
			sinon.stub(game, 'transitionToTheResumeButton').returns(game);

			game.toggleSimulation();

			expect(game.transitionToTheResumeButton.calledOnce).to.be.true;
			expect(game.stateManager.stopSimulation.calledOnce).to.be.true;
			expect(game.stateManager.pauseSimulationInDrawingMode.calledOnce).to.be
				.true;

			//not in drawing mode
			getElementByIdValue = 'random';
			sinon.resetHistory();
			game.toggleSimulation();

			expect(game.transitionToTheResumeButton.calledOnce).to.be.true;
			expect(game.stateManager.stopSimulation.calledOnce).to.be.true;
			expect(game.stateManager.pauseSimulationInDrawingMode.calledOnce).to.be
				.false;
		});

		it('should toggleSimulation from Resume', function () {
			getElementByIdValueInnerText = 'Resume';

			//In drawing mode
			getElementByIdValue = 'draw';
			sinon.stub(game, 'transitionToThePauseButton').returns(game);

			game.toggleSimulation();

			expect(game.transitionToThePauseButton.calledOnce).to.be.true;
			expect(game.stateManager.preventDrawing.calledOnce).to.be.true;
			expect(game.stateManager.startSimulation.calledOnce).to.be.true;
			expect(game.stateManager.resumeSimulation.calledOnce).to.be.false;

			//not in drawing mode
			getElementByIdValue = 'random';
			sinon.resetHistory();
			game.toggleSimulation();

			expect(game.transitionToThePauseButton.calledOnce).to.be.true;
			expect(game.stateManager.preventDrawing.calledOnce).to.be.true;
			expect(game.stateManager.startSimulation.calledOnce).to.be.false;
			expect(game.stateManager.resumeSimulation.calledOnce).to.be.true;
		});

		it('should toggleSimulation from unknown', function () {
			getElementByIdValueInnerText = 'unkown';
			expect(game.toggleSimulation).to.throw(Error, 'Unknown button state.');
		}); //Make this throw an error.

		it('should resetSimulation', function () {
			sinon.stub(game, 'transitionToTheStartButton').returns(game);
			sinon.stub(game, 'resetAliveCellsComponent').returns(game);
			sinon.stub(game, 'resetSimGenerationCountComponent').returns(game);

			game.resetSimulation();

			expect(game.stateManager.stopSimulation.calledOnce).to.be.true;
			expect(game.transitionToTheStartButton.calledOnce).to.be.true;
			expect(game.resetAliveCellsComponent.calledOnce).to.be.true;
			expect(game.resetSimGenerationCountComponent.calledOnce).to.be.true;
			expect(game.stateManager.resetSimulation.calledOnce).to.be.true;
		});

		it('toggleDisplayStorageStructure() should broadcast the display storage setting', function () {
			game.toggleDisplayStorageStructure();
			expect(game.stateManager.broadcast.calledOnce).to.be.true;
		});

		it('toggle drawing the grid when handleGridBackgroundClicked is invoked', function () {
			sinon.stub(game, 'requestToDrawGrid');
			getElementByIdChecked = true;
			game.handleGridBackgroundClicked();
			expect(game.requestToDrawGrid.calledOnce).to.be.true;
			expect(game.stateManager.clearRender.calledOnce).to.be.false;

			sinon.resetHistory();
			getElementByIdChecked = false;
			game.handleGridBackgroundClicked();
			expect(game.requestToDrawGrid.calledOnce).to.be.false;
			expect(game.stateManager.clearRender.calledOnce).to.be.true;
		});

		it('should register event handlers', function () {
			let fakeWindow = { addEventListener: sinon.stub() };
			game.drawCanvas = { addEventListener: sinon.stub() };
			game.registerEventHandlers(fakeWindow);
			expect(fakeWindow.addEventListener.calledTwice).to.be.true;
			expect(game.drawCanvas.addEventListener.calledOnce).to.be.true;
		});

		it('initializing the game should start the worker system', function () {
			game.initialize();
			expect(game.stateManager.startMainLoop.calledOnce).to.be.true;
		});
	});

	describe('The Game Loop', function () {
		it('should handlePageLoad');
		it('should handlePageResize');
		it('should handleDrawCanvasClicked');

		//State Button Class
		it('should transitionToTheStartButton');
		it('should transitionToTheResumeButton');
		it('should transitionToThePauseButton');
	});
});
