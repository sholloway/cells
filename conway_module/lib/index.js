//The Core System
module.exports.Cell = require('./core/Quadtree').Cell;
module.exports.DefaultConfig = require('./core/DefaultConfig.js');
module.exports.DrawingSceneBuilder = require('./core/DrawingStateManager.js').DrawingSceneBuilder;
module.exports.GridSystem = require('./core/GridSystem.js');
module.exports.LifeSceneBuilder = require('./core/LifeSceneBuilder.js');
module.exports.LifeSystem = require('./core/AlternativeLifeSystem.js');
module.exports.SceneManager = require('./core/SceneManager');
module.exports.SeederFactoryModule = require('./core/SeederFactory.js');
module.exports.WorkerSystem = require('./core/WorkerSystem.js');

//Rendering System
module.exports.HTMLCanvasRenderer = require('./renderer/HTMLCanvasRenderer.js');

//Entity System
module.exports.TraitBuilderFactory = require('./entity-system/TraitBuilderFactory.js');

//Workers
module.exports.WorkerCommands = require('./workers/WorkerCommands.js');
module.exports.GridSystemWorker = require('worker-loader!./workers/GridSystem.worker.js');
module.exports.DrawingSystemWorker = require('worker-loader!./workers/DrawingSystem.worker.js');
module.exports.LifeSystemWorker = require('worker-loader!./workers/LifeSystem.worker.js');
