const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon');

const {onmessage, establishWorkerContext, getController} = require('./../../lib/workers/DrawingSystem.worker');
const WorkerCommands = require('./../../lib/workers/WorkerCommands');

describe('Drawing System Worker', function () {
  it ('should invoke the controller process method on message', function(){
    sinon.stub(getController(), "process");
    expect(getController().process.calledOnce).to.be.false;
    onmessage({});
    expect(getController().process.calledOnce).to.be.true;
  });
});