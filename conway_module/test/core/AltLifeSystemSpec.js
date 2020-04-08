const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const LifeSystem = require('./../../lib/core/AlternativeLifeSystem.js');
const GameManager = require('./../../lib/core/GameManager.js');

describe('Life System', function () {
	it('should implement getStateManager()', function () {
		let ls = new LifeSystem({}, {}, {});
		expect(ls.getStateManager()).to.equal(ls.stateManager);
	});

	it('should run the game manager through its paces on update', function () {
		let fakeGameManager = {};
		fakeGameManager.evaluateCellsFaster = sinon.spy();
		fakeGameManager.stageStorage = sinon.spy();
		fakeGameManager.activateNext = sinon.spy();

		let ls = new LifeSystem({}, {}, {});
		ls.stateManager = fakeGameManager;

		ls.update();

		expect(fakeGameManager.evaluateCellsFaster.calledOnce).to.be.true;
		expect(fakeGameManager.stageStorage.calledOnce).to.be.true;
		expect(fakeGameManager.activateNext.calledOnce).to.be.true;
	});

	it('should provide the alive cell count', function () {
		let fakeGameManager = {};
		fakeGameManager.aliveCellsCount = sinon.spy(function () {
			return 42;
		});

		let ls = new LifeSystem({}, {}, {});
		ls.stateManager = fakeGameManager;

		expect(ls.aliveCellsCount()).to.equal(42);
		expect(fakeGameManager.aliveCellsCount.calledOnce).to.be.true;
	});

	it('should enable manually setting the seeder', function () {
		let ls = new LifeSystem({}, {}, {});
		expect(ls.seeder).to.be.null;
		ls.setSeeder(42);
		expect(ls.seeder).to.equal(42);
	});

	it('should seed the world when initializing the simulation', function () {
		let fakeGameManager = {};
		fakeGameManager.seedWorld = sinon.spy();
		let ls = new LifeSystem({}, {}, {});
		ls.stateManager = fakeGameManager;
		ls.initializeSimulation();
		expect(fakeGameManager.seedWorld.calledOnce).to.be.true;
	});
});
