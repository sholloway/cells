/**
 * A web worker that is responsible for the Conway's Game of Life system.
 */
const { establishWorkerContext } = require('./WorkerUtils.js');
const LifeSystemWorkerController = require('./LifeSystemWorkerController');

let controller = new LifeSystemWorkerController(establishWorkerContext());

function getController() {
	return controller;
}

onmessage = function (event) {
	controller.process(event.data);
};

module.exports = {
	getController,
	onmessage,
};
