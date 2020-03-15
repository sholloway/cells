module.exports.DefaultConfig = require('./core/DefaultConfig.js');
module.exports.DrawingSystem = require('./core/DrawingSystem.js');
module.exports.GridSystem = require('./core/GridSystem.js');
module.exports.LifeSystem = require('./core/AlternativeLifeSystem.js');
module.exports.SceneManager = require('./core/SceneManager');
module.exports.SeederFactoryModule = require('./core/SeederFactory.js');
module.exports.WorkerSystem = require('./core/WorkerSystem.js');

module.exports.HTMLCanvasRenderer = require('./renderer/HTMLCanvasRenderer.js');

module.exports.TraitBuilderFactory = require('./entity-system/TraitBuilderFactory.js');

module.exports.WorkerCommands = require('./workers/WorkerCommands.js');
module.exports.ConwayBroker = require('worker-loader!./workers/ConwayBroker.worker.js');
module.exports.GridSystemWorker = require('worker-loader!./workers/GridSystem.worker.js');
module.exports.DrawingSystemWorker = require('worker-loader!./workers/DrawingSystem.worker.js');