module.exports.LifeSystem = require('./core/AlternativeLifeSystem.js')
module.exports.GridSystem = require('./core/GridSystem.js')
module.exports.DefaultConfig = require('./core/DefaultConfig.js')
module.exports.DrawingSystem = require('./core/DrawingSystem.js')
module.exports.SeederFactoryModule = require('./core/SeederFactory.js')
module.exports.HTMLCanvasRenderer = require('./renderer/HTMLCanvasRenderer.js')

module.exports.ConwayBroker = require('worker-loader!./workers/ConwayBroker.worker.js');
module.exports.GridSystemWorker = require('worker-loader!./workers/GridSystem.worker.js');
