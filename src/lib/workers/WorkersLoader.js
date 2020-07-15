let Workers = require('../app/AppLayers.js');

function createWorker(name) {
	let worker;
	switch (name) {
		case Workers.GRID:
			worker = new Worker('./GridSystem.worker.js', { type: 'module' });
			break;
		case Workers.DRAWING:
			worker = new Worker('./DrawingSystem.worker.js', { type: 'module' });
			break;
		case Workers.SIM:
			worker = new Worker('./LifeSystem.worker.js', { type: 'module' });
			break;
	}
	return worker;
}

module.exports = {
	createWorker,
};
