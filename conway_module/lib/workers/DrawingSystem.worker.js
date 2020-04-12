/**
 * A web worker that is responsible for the drawing system.
 */

const DrawingSystemWorkerController = require('./DrawingSystemWorkerController.js');

const { establishWorkerContext } = require('./WorkerUtils.js');

let controller = new DrawingSystemWorkerController(establishWorkerContext());

function getController() {
	return controller;
}

onmessage = function (event) {
	controller.process(event.data);
};

// These are to enable unit tests. Do not invoke directly.
module.exports = {
	onmessage,
	establishWorkerContext,
	getController,
};
