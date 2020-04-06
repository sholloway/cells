const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon');

const {DrawingSystemWorkerController, WorkerState} = require('./../../lib/workers/DrawingSystemWorkerController.js');
const WorkerCommands = require('./../../lib/workers/WorkerCommands');

describe('DrawingSystemWorkerController', function(){
  it('should define worker states', function () {
    expect(WorkerState.STOPPED).to.equal(1);
    expect(WorkerState.PAUSED).to.equal(2);
    expect(WorkerState.RUNNING).to.equal(3);
  });

  describe('Command Routing', function () {
    it('should start and stop the system is running', function () {
      let controller = new DrawingSystemWorkerController();
      expect(controller.systemRunning()).to.be.false;
      controller.process({
        command: WorkerCommands.LifeCycle.START
      });
      expect(controller.systemRunning()).to.be.true;
      controller.process({
        command: WorkerCommands.LifeCycle.STOP
      });
      expect(controller.systemRunning()).to.be.false;
    });

    it('should throw an error if command is not specified', function(){
      let controller = new DrawingSystemWorkerController();
      expect( () => {
        controller.process({});
      }).to.throw(Error, 'DrawingSystem.worker: Command not provided in message.');
    });

    it('should throw an error if command is unknown', function(){
      let controller = new DrawingSystemWorkerController();
      expect( () => {
        controller.process({
          command: 'Bad Command'
        });
      }).to.throw(Error, 'Unsupported command Bad Command was received in DrawingSystem Worker.');
    });

    // it('should process scene', function(){
    //   sinon.stub(DrawingSystem,'sendMessageToClient').returns(0);
    //   console.log(DrawingSystem);
    //   DrawingSystem.onmessage.bind(DrawingSystem)({
    //     data: {
    //       command: WorkerCommands.LifeCycle.PROCESS_CYCLE
    //     }
    //   });
    //   expect(DrawingSystem.sendMessageToClient.calledOnce).to.be.false;
    //   DrawingSystem.onmessage.bind(DrawingSystem)({
    //     data: {
    //       command: WorkerCommands.LifeCycle.START
    //     }
    //   });
    //   DrawingSystem.onmessage.bind(DrawingSystem)({
    //     data: {
    //       command: WorkerCommands.LifeCycle.PROCESS_CYCLE
    //     }
    //   });
    //   expect(DrawingSystem.sendMessageToClient.calledOnce).to.be.true;
    // });

    it('should process set cells');
    it('should reserve PAUSE commands');
    it('should set cells size');
    it('should reset the system');
    it('should toggle cell');
    it('should set display storage');
    it('should promise to send cells');
  });
});