const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const HTMLCanvasRenderer = require('./../../lib/renderer/HTMLCanvasRenderer.js');
const SceneManager = require('./../../lib/core/SceneManager.js');

describe('HTMLCanvasRenderer', function () {
	it('should render all entities in a scene', function () {
		let fakeCanvasContext = {};
		fakeCanvasContext.clearRect = sinon.spy();
		let oneFakeEntity = {};
		oneFakeEntity.render = sinon.spy();

		let anotherFakeEntity = {};
		anotherFakeEntity.render = sinon.spy();

		let scene = new SceneManager();
		scene.push(oneFakeEntity).push(anotherFakeEntity);

		let config = {
			canvas: {
				width: 1,
				height: 1,
			},
		};

		let renderer = new HTMLCanvasRenderer(fakeCanvasContext, config);
		renderer.render(scene);

		expect(fakeCanvasContext.clearRect.calledOnce).to.be.true;
	});
});
