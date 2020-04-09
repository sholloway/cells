/**
 * A web worker that is responsible for the Conway's Game of Life system.
 */
const { establishWorkerContext } = require('./WorkerUtils.js');
const LifeSystemWorkerController = require('./LifeSystemWorkerController');

let controller = new LifeSystemWorkerController(establishWorkerContext());

onmessage = function (event) {
	controller.process(event.data);
};
