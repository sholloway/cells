const GridSystemWorker = require('worker-loader!./GridSystem.worker.js');
const DrawingSystemWorker = require('worker-loader!./DrawingSystem.worker.js');
const LifeSystemWorker = require('worker-loader!./LifeSystem.worker.js');

module.exports = {
	GridSystemWorker,
	DrawingSystemWorker,
	LifeSystemWorker,
};
