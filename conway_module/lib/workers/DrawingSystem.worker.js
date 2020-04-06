/**
 * A web worker that is responsible for the drawing system.
 */

const {DrawingSystemWorkerController} = require('./DrawingSystemWorkerController.js');

let that;
if ('undefined' !== typeof WorkerGlobalScope){
  that = self;
}else{
  that = this;
}

let controller = new DrawingSystemWorkerController(that);

onmessage = function (event) {
  controller.process(event.data);
}

// This is to enable unit tests. Do not invoke directly.
module.exports = {
  onmessage
}