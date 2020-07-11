const GridSystemWorker = require('worker-plugin/loader!./GridSystem.worker.js');
const DrawingSystemWorker = require('worker-plugin/loader!./DrawingSystem.worker.js');
const LifeSystemWorker = require('worker-plugin/loader!./LifeSystem.worker.js');

module.exports = {
	GridSystemWorker,
	DrawingSystemWorker,
	LifeSystemWorker,
};
