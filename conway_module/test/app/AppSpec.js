const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const rewiremock = require('rewiremock/node');

let getElementResult = {
	value: '',
	innerText: '',
	checked: false,
};

let setElementResult = {
	value: '',
};

let domUtils = {
	getElementById: () => {
		return getElementResult;
	},
	setElementValue: (id, value) => (setElementResult.value = value),
};

const canvasUtilities = { sizeCanvas: sinon.stub() };

const window = {
	performance: {
		now: sinon.stub(),
	},
	addEventListener: sinon.stub(),
};

let uiConfigUtils = {
	getCellSize: sinon.stub().returns(20),
};

rewiremock(() => require('../../lib/ui/UIConfigurationUtilities.js')).with(
	uiConfigUtils
);
rewiremock(() => require('../../lib/workers/WorkersLoader.js')).with({});
rewiremock(() => require('../../lib/dom/DomUtilities.js')).with(domUtils);
rewiremock(() => require('../../lib/ui/CanvasUtilities.js')).with(
	canvasUtilities
);

rewiremock.enable();

const App = require('../../lib/app/App.js');

describe('The App', function () {
	let app;
	this.beforeEach(function () {
		sinon.resetHistory();
		app = new App();
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
			start: sinon.stub(),
			sendWorkerMessage: sinon.stub(),
		};
		app.stateManager = stateManager;
	});
	describe('The Public Interface', function () {
		it('should setSeedingOption', function () {
			sinon.stub(app, 'resetSimulation').returns(app);

			getElementResult.value = 'draw';
			app.setSeedingOption();

			//test for draw
			expect(app.resetSimulation.calledOnce).to.be.true;
			expect(app.stateManager.allowDrawing.calledOnce).to.be.true;
			expect(app.stateManager.preventDrawing.calledOnce).to.be.false;

			//test for random
			getElementResult.value = 'random';
			app.setSeedingOption();

			expect(app.resetSimulation.calledTwice).to.be.true;
			expect(app.stateManager.preventDrawing.calledOnce).to.be.true;
		});

		it('changedCellSize should broadcast to workers', function () {
			sinon.stub(app, 'handleGridBackgroundClicked');
			app.changedCellSize();
			expect(app.stateManager.broadcast.calledOnce).to.be.true;
			expect(app.handleGridBackgroundClicked.calledOnce).to.be.true;
		});

		it('should toggleSimulation from Start', function () {
			getElementResult.innerText = 'Start';
			sinon.stub(app, 'transitionToThePauseButton').returns(app);
			app.toggleSimulation();
			expect(app.transitionToThePauseButton.calledOnce).to.be.true;
			expect(app.stateManager.preventDrawing.calledOnce).to.be.true;
			expect(app.stateManager.startSimulation.calledOnce).to.be.true;
		});

		it('should toggleSimulation from Pause', function () {
			getElementResult.innerText = 'Pause';

			//In drawing mode
			getElementResult.value = 'draw';
			sinon.stub(app, 'transitionToTheResumeButton').returns(app);

			app.toggleSimulation();

			expect(app.transitionToTheResumeButton.calledOnce).to.be.true;
			expect(app.stateManager.stopSimulation.calledOnce).to.be.true;
			expect(app.stateManager.pauseSimulationInDrawingMode.calledOnce).to.be
				.true;

			//not in drawing mode
			getElementResult.value = 'random';
			sinon.resetHistory();
			app.toggleSimulation();

			expect(app.transitionToTheResumeButton.calledOnce).to.be.true;
			expect(app.stateManager.stopSimulation.calledOnce).to.be.true;
			expect(app.stateManager.pauseSimulationInDrawingMode.calledOnce).to.be
				.false;
		});

		it('should toggleSimulation from Resume', function () {
			getElementResult.innerText = 'Resume';

			//In drawing mode
			getElementResult.value = 'draw';
			sinon.stub(app, 'transitionToThePauseButton').returns(app);

			app.toggleSimulation();

			expect(app.transitionToThePauseButton.calledOnce).to.be.true;
			expect(app.stateManager.preventDrawing.calledOnce).to.be.true;
			expect(app.stateManager.startSimulation.calledOnce).to.be.true;
			expect(app.stateManager.resumeSimulation.calledOnce).to.be.false;

			//not in drawing mode
			getElementResult.value = 'random';
			sinon.resetHistory();
			app.toggleSimulation();

			expect(app.transitionToThePauseButton.calledOnce).to.be.true;
			expect(app.stateManager.preventDrawing.calledOnce).to.be.true;
			expect(app.stateManager.startSimulation.calledOnce).to.be.false;
			expect(app.stateManager.resumeSimulation.calledOnce).to.be.true;
		});

		it('should toggleSimulation from unknown', function () {
			getElementResult.innerText = 'unkown';
			expect(app.toggleSimulation).to.throw(Error, 'Unknown button state.');
		}); //Make this throw an error.

		it('should resetSimulation', function () {
			sinon.stub(app, 'transitionToTheStartButton').returns(app);
			sinon.stub(app, 'resetAliveCellsComponent').returns(app);
			sinon.stub(app, 'resetSimGenerationCountComponent').returns(app);

			app.resetSimulation();

			expect(app.stateManager.stopSimulation.calledOnce).to.be.true;
			expect(app.transitionToTheStartButton.calledOnce).to.be.true;
			expect(app.resetAliveCellsComponent.calledOnce).to.be.true;
			expect(app.resetSimGenerationCountComponent.calledOnce).to.be.true;
			expect(app.stateManager.resetSimulation.calledOnce).to.be.true;
		});

		it('toggleDisplayStorageStructure() should broadcast the display storage setting', function () {
			app.toggleDisplayStorageStructure();
			expect(app.stateManager.broadcast.calledOnce).to.be.true;
		});

		it('toggle drawing the grid when handleGridBackgroundClicked is invoked', function () {
			sinon.stub(app, 'requestToDrawGrid');
			getElementResult.checked = true;
			app.handleGridBackgroundClicked();
			expect(app.requestToDrawGrid.calledOnce).to.be.true;
			expect(app.stateManager.clearRender.calledOnce).to.be.false;

			sinon.resetHistory();
			getElementResult.checked = false;
			app.handleGridBackgroundClicked();
			expect(app.requestToDrawGrid.calledOnce).to.be.false;
			expect(app.stateManager.clearRender.calledOnce).to.be.true;
		});

		it('should register event handlers', function () {
			app.drawCanvas = { addEventListener: sinon.stub() };
			app.registerEventHandlers(window);
			expect(window.addEventListener.calledTwice).to.be.true;
			expect(app.drawCanvas.addEventListener.calledOnce).to.be.true;
		});

		it('initializing the app should start the worker system', function () {
			app.initialize();
			expect(app.stateManager.startMainLoop.calledOnce).to.be.true;
		});

		it('should handlePageLoad', function () {
			app.window = window;
			app.handlePageLoad();
			expect(canvasUtilities.sizeCanvas.calledOnce).to.be.true;
			expect(window.performance.now.calledOnce).to.be.true;
			expect(app.stateManager.start.calledOnce).to.be.true;
		});

		it('should handlePageResize', function () {
			sinon.stub(app, 'handleGridBackgroundClicked');
			app.handlePageResize();
			expect(canvasUtilities.sizeCanvas.calledOnce).to.be.true;
			expect(app.handleGridBackgroundClicked.calledOnce).to.be.true;
		});

		it('should handleDrawCanvasClicked when drawing is allowed', function () {
			app.drawCanvas = { getBoundingClientRect: () => {} };
			app.stateManager = {
				sendWorkerMessage: () => {},
				isDrawingAllowed: () => true,
			};

			app.config = { zoom: 20 };

			sinon
				.stub(app.drawCanvas, 'getBoundingClientRect')
				.returns({ left: 1, top: 1 });
			sinon.stub(app.stateManager, 'sendWorkerMessage');

			app.handleDrawCanvasClicked({ clientX: 10, clientY: 10 });

			expect(app.drawCanvas.getBoundingClientRect.calledOnce).to.be.true;
			expect(app.stateManager.sendWorkerMessage.calledOnce).to.be.true;
		});

		it('should not allow toggle cells when drawing is not enabled', function () {
			app.drawCanvas = { getBoundingClientRect: () => {} };
			app.stateManager = {
				sendWorkerMessage: () => {},
				isDrawingAllowed: () => false,
			};

			app.config = { zoom: 20 };

			sinon
				.stub(app.drawCanvas, 'getBoundingClientRect')
				.returns({ left: 1, top: 1 });
			sinon.stub(app.stateManager, 'sendWorkerMessage');

			app.handleDrawCanvasClicked({ clientX: 10, clientY: 10 });

			expect(app.drawCanvas.getBoundingClientRect.calledOnce).to.be.false;
			expect(app.stateManager.sendWorkerMessage.calledOnce).to.be.false;
		});
	});

	describe('The Start/Resume/Pause Button', function () {
		it('should transitionToTheStartButton', function () {
			app.transitionToTheStartButton();
			expect(getElementResult.innerText).to.equal('Start');
		});

		it('should transitionToTheResumeButton', function () {
			app.transitionToTheResumeButton();
			expect(getElementResult.innerText).to.equal('Resume');
		});

		it('should transitionToThePauseButton', function () {
			app.transitionToThePauseButton();
			expect(getElementResult.innerText).to.equal('Pause');
		});
	});

	it('should resetAliveCellsComponent', function () {
		app.resetAliveCellsComponent();
		expect(setElementResult.value).to.equal(0);
	});

	it('should resetSimGenerationCountComponent', function () {
		app.resetSimGenerationCountComponent();
		expect(setElementResult.value).to.equal(0);
	});

	it('should requestToDrawGrid', function () {
		app.config = {
			canvas: {
				width: 10,
				height: 10,
			},
		};
		app.requestToDrawGrid();
		expect(uiConfigUtils.getCellSize.calledOnce).to.be.true;
		expect(app.stateManager.sendWorkerMessage.calledOnce).to.be.true;
	});

	it('updateUI', function () {
		app.updateUI({ aliveCellsCount: 10 });
		expect(setElementResult.value).to.equal(10);

		app.updateUI({ numberOfSimulationIterations: 100 });
		expect(setElementResult.value).to.equal(100);
	});
});