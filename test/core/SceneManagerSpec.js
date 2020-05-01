const chai = require('chai');
const expect = chai.expect;
const ArrayAssertions = require('./ArrayAssertions.js');
const SceneManager = require('./../../lib/core/SceneManager.js');

describe('Scene Manager', function () {
	it('should store items in a FIFO fashion', function () {
		let scene = new SceneManagerSpy();
		expect(scene.getStack().length).to.equal(0);
		expect(scene.fullyRendered()).to.be.true;
		scene.push('Q');
		expect(scene.getStack().length).to.equal(1);
		expect(scene.fullyRendered()).to.be.false;
		scene.push('A');
		scene.push('ZZ');
		scene.push('T1-1000');
		expect(scene.getStack().length).to.equal(4);
		ArrayAssertions.assertEqualArrays(
			['Q', 'A', 'ZZ', 'T1-1000'],
			scene.getStack()
		);

		expect(scene.nextEntity()).to.equal('Q');
		expect(scene.getStack().length).to.equal(3);

		expect(scene.nextEntity()).to.equal('A');
		expect(scene.getStack().length).to.equal(2);

		expect(scene.nextEntity()).to.equal('ZZ');
		expect(scene.getStack().length).to.equal(1);

		expect(scene.fullyRendered()).to.be.false;
		expect(scene.nextEntity()).to.equal('T1-1000');
		expect(scene.getStack().length).to.equal(0);
		expect(scene.fullyRendered()).to.be.true;
	});

	it('should return undefined when asking for next entity and the scene is fully rendered', function () {
		let scene = new SceneManagerSpy();
		expect(scene.fullyRendered()).to.be.true;
		expect(scene.getStack().length).to.equal(0);
		expect(scene.nextEntity()).to.be.undefined;
	});
});

class SceneManagerSpy extends SceneManager {
	constructor() {
		super();
	}

	getStack() {
		return this.stack;
	}
}
