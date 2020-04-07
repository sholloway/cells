const DrawingSystem = require('./../core/DrawingSystem.js');
const WorkerCommands = require('./WorkerCommands.js');
const LifeCycle = WorkerCommands.LifeCycle;
const DrawingSystemCommands = WorkerCommands.DrawingSystemCommands;

/**
 * The possible states the worker can be in.
 * @private
 */
const WorkerState = {
  STOPPED: 1,
  PAUSED: 2,
  RUNNING: 3
};

/**
 * Controller for the Drawing System web worker.
 */
class DrawingSystemWorkerController{
  /**
   * Creates a new instance of a DrawingSystemWorkerController.
   * @param {WorkerGlobalScope} worker 
   */
  constructor(worker){
    this.worker = worker;
    this.drawingSystem = new DrawingSystem();
    this.workerState = WorkerState.STOPPED;
  }

  /**
   * The core logic of the controller. Responsible for routing incomming messages to 
   * the appropriate command.
   * @param {*} msg 
   */
  process(msg) {
    if (!msg.command) {
      throw new Error('DrawingSystem.worker: Command not provided in message.');
    }
  
    switch (msg.command) {
      case LifeCycle.PROCESS_CYCLE:
        this.processScene(msg);
        break;
      case LifeCycle.START:
        this.workerState = WorkerState.RUNNING;
        break;
      case LifeCycle.STOP:
        this.workerState = WorkerState.STOPPED;
        break;
      case LifeCycle.PAUSE:
        break;
      case DrawingSystemCommands.SET_CELLS:
        this.processCmd(msg, DrawingSystemCommands.SET_CELLS,
          (msg) => msg.cells,
          (msg) => this.drawingSystem.setCells(msg.cells),
          'The cells were not provided.');
        break;
      case DrawingSystemCommands.SET_CELL_SIZE:
        this.processCmd(msg, DrawingSystemCommands.SET_CELL_SIZE,
          (msg) => msg.cellSize,
          (msg) => this.drawingSystem.setCellSize(msg.cellSize),
          'The cell size was not provided.');
        break;
      case DrawingSystemCommands.RESET:
        this.processCmd(msg, DrawingSystemCommands.RESET,
          (msg) => (msg.promisedResponse)? msg.params.config : msg.config,
          (msg) => {
            this.drawingSystem.setConfig(msg.config)
            this.drawingSystem.reset();
            if(msg.promisedResponse){
              this.sendMessageToClient({
                id: msg.id,
                promisedResponse: msg.promisedResponse,
                command: msg.command
              });
            }
          },
          'The configuration was not provided.');
        break;
      case DrawingSystemCommands.TOGGLE_CELL:
        this.processCmd(msg, DrawingSystemCommands.TOGGLE_CELL,
          (msg) => msg.cx !== undefined && msg.cy !== undefined,
          (msg) => this.drawingSystem.toggleCell(msg.cx, msg.cy),
          'Either cx or cy was not provided.');
        break;
      case DrawingSystemCommands.DISPLAY_STORAGE:
        this.processCmd(msg, DrawingSystemCommands.DISPLAY_STORAGE,
          (msg) => msg.displayStorage !== undefined,
          (msg) => this.drawingSystem.displayStorage(msg.displayStorage),
          'The displayStorage field was not provided.');
        break;
      case DrawingSystemCommands.SEND_CELLS:
        this.processCmd(msg, DrawingSystemCommands.SEND_CELLS,
          () => true,
          (msg) => {
            this.sendMessageToClient({
              id: msg.id,
              promisedResponse: msg.promisedResponse,
              command: msg.command,
              cells: this.drawingSystem.getCells()
            });
          },
          'Could not send the drawing system cells.');
        break;
      default:
        throw new Error(`Unsupported command ${msg.command} was received in DrawingSystem Worker.`);
    }
  }

  /**
   * Processes an inbound message.
   * @param {*} msg - The message that was passed to the web worker.
   * @param {String} commandName - The enumerated command to process.
   * @param {Function} commandCriteria - Conditional that determines whether to run the command processor or not.
   * @param {Function} cmdProcessor - The command function to run when the criteria is met.
   * @param {String} errMsg - The error message to throw when the conditional isn't met.
   */
  processCmd(msg, commandName, commandCriteria, cmdProcessor, errMsg) {
    if (commandCriteria(msg)) {
      cmdProcessor(msg)
    } else {
      throw new Error(`Cannot process command DrawingSystem Worker.${commandName}: ${errMsg}`);
    }
  }
  
  /**
   * @returns {Boolean} Determines if the service is running or not.
   */
  systemRunning(){
    return this.workerState === WorkerState.RUNNING;
  }
  
  /**
   * Sends a message to the web worker's client (main thread).
   * @param {*} msg 
   */
  sendMessageToClient(msg){
    this.worker.postMessage(msg);
  }
  
  /**
   * Updates the drawing scene and sends it to the client.
   * @param {*} msg 
   */
  processScene(msg) {
    if (this.systemRunning() && this.drawingSystem.canUpdate()) {
      this.drawingSystem.update();
      this.sendMessageToClient({
        id: msg.id,
        promisedResponse: msg.promisedResponse,
        command: msg.command,
        stack: this.drawingSystem.getScene().getStack()
      });
    }
  }
}

module.exports = {
  DrawingSystemWorkerController,
  WorkerState //exported only for tests
};