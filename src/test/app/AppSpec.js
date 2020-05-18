const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const rewiremock = require('rewiremock/node');

let getElementResult = {
	value: '',
	innerText: '',
	checked: false,
	addEventListener: sinon.stub(),
};

let setElementResult = {
	value: '',
};

let domUtils = {
	getElementById: () => {
		return getElementResult;
	},
	setElementValue: (id, value) => (setElementResult.value = value),
	querySelector: () => {
		return { addEventListener: sinon.stub() };
	},
};

const canvasUtilities = {
	sizeCanvas: sinon.stub(),
	convertToCell: sinon.stub().returns({ x: 0, y: 0 }),
};

const window = {
	performance: {
		now: sinon.stub(),
	},
	addEventListener: sinon.stub(),
};

let uiConfigUtils = {
	updateConfiguredZoom: sinon.stub(),
	updateConfiguredLandscape: sinon.stub(),
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
		app.canvasContextMenu = {
			initialize: sinon.stub(),
			isVisibile: () => false,
			setMenuPosition: sinon.stub(),
		};
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
		it('changedCellSize should broadcast to workers', function () {
			app.config = { zoom: 0 };
			sinon.stub(app, 'refreshGrid');
			let event = {
				detail: {
					cellSize: 20,
				},
			};

			app.changedCellSize(event);
			expect(app.stateManager.broadcast.calledOnce).to.be.true;
			expect(app.refreshGrid.calledOnce).to.be.true;
		});

		it('should resetSimulation', function () {
			sinon.stub(app, 'transitionToTheStartButton').returns(app);
			sinon.stub(app, 'resetAliveCellsComponent').returns(app);
			sinon.stub(app, 'resetSimGenerationCountComponent').returns(app);
			app.stateManager.allowDrawing.returns(app.stateManager);

			app.resetSimulation();

			expect(app.stateManager.stopSimulation.calledOnce).to.be.true;
			expect(app.transitionToTheStartButton.calledOnce).to.be.true;
			expect(app.resetAliveCellsComponent.calledOnce).to.be.true;
			expect(app.resetSimGenerationCountComponent.calledOnce).to.be.true;
			expect(app.stateManager.resetSimulation.calledOnce).to.be.true;
		});

		it('toggleDisplayStorageStructure() should broadcast the display storage setting', function () {
			app.toggleDisplayStorageStructure({
				detail: { checked: true },
			});
			expect(app.stateManager.broadcast.calledOnce).to.be.true;
		});

		it('toggle drawing the grid when handleGridBackgroundClicked is invoked', function () {
			sinon.stub(app, 'requestToDrawGrid');
			app.handleGridBackgroundClicked({ detail: { checked: true } });
			expect(app.requestToDrawGrid.calledOnce).to.be.true;
			expect(app.stateManager.clearRender.calledOnce).to.be.false;

			sinon.resetHistory();
			app.handleGridBackgroundClicked({ detail: { checked: false } });
			expect(app.requestToDrawGrid.calledOnce).to.be.false;
			expect(app.stateManager.clearRender.calledOnce).to.be.true;
		});

		it('should register event handlers', function () {
			app.drawCanvas = { addEventListener: sinon.stub() };
			app.startButton = { addEventListener: sinon.stub() };
			app.registerEventHandlers(window);
			expect(window.addEventListener.calledTwice).to.be.true;
			expect(app.drawCanvas.addEventListener.calledTwice).to.be.true;
			expect(app.startButton.addEventListener.calledThrice).to.be.true;
		});

		it('initializing the app should start the worker system', function () {
			app.initialize();
			expect(app.stateManager.startMainLoop.calledOnce).to.be.true;
		});

		it('should initialize the context menu when intitializing the app', function () {
			app.initialize();
			expect(app.canvasContextMenu.initialize.calledOnce).to.be.true;
		});

		it('should handlePageLoad', function () {
			app.window = window;
			app.handlePageLoad();
			expect(canvasUtilities.sizeCanvas.calledOnce).to.be.true;
			expect(window.performance.now.calledOnce).to.be.true;
			expect(app.stateManager.start.calledOnce).to.be.true;
		});

		it('should handlePageResize', function () {
			sinon.stub(app, 'refreshGrid');
			app.handlePageResize();
			expect(canvasUtilities.sizeCanvas.calledOnce).to.be.true;
			expect(app.refreshGrid.calledOnce).to.be.true;
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

			expect(canvasUtilities.convertToCell.calledOnce).to.be.true;
			expect(app.drawCanvas.getBoundingClientRect.calledOnce).to.be.true;
			expect(app.stateManager.sendWorkerMessage.calledOnce).to.be.true;
			expect(app.canvasContextMenu.setMenuPosition.calledOnce).to.be.false;
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
		expect(app.stateManager.sendWorkerMessage.calledOnce).to.be.true;
	});

	it('updateUI', function () {
		app.updateUI({ aliveCellsCount: 10 });
		expect(setElementResult.value).to.equal(10);

		app.updateUI({ numberOfSimulationIterations: 100 });
		expect(setElementResult.value).to.equal(100);
	});
});
