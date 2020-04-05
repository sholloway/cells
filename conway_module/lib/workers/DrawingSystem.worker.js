/**
 * A web worker that is responsible for the drawing system.
 */

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

let drawingSystem = new DrawingSystem();
let workerState = WorkerState.STOPPED;

function processCmd(msg, commandName, commandCriteria, cmdProcessor, errMsg) {
  if (commandCriteria(msg)) {
    cmdProcessor(msg)
  } else {
    throw new Error(`Cannot process command DrawingSystem Worker.${commandName}: ${errMsg}`);
  }
}

function systemRunning(){
  return workerState === WorkerState.RUNNING;
}

function processScene(msg) {
  if (systemRunning() && drawingSystem.canUpdate()) {
    drawingSystem.update();
    postMessage({
      id: msg.id,
      promisedResponse: msg.promisedResponse,
      command: msg.command,
      stack: drawingSystem.getScene().getStack()
    });
  }
}

function routeCommandToProcessor(msg) {
  if (!msg.command) {
    throw new Error('DrawingSystem.worker: Command not provided in message.');
  }

  switch (msg.command) {
    case LifeCycle.PROCESS_CYCLE:
      processScene(msg);
      break;
    case LifeCycle.START:
      workerState = WorkerState.RUNNING;
      break;
    case LifeCycle.STOP:
      workerState = WorkerState.STOPPED;
      break;
    case LifeCycle.PAUSE:
      break;
    case DrawingSystemCommands.SET_CELLS:
      processCmd(msg, DrawingSystemCommands.SET_CELLS,
        (msg) => msg.cells,
        (msg) => drawingSystem.setCells(msg.cells),
        'The cells were not provided.');
      break;
    case DrawingSystemCommands.SET_CELL_SIZE:
      processCmd(msg, DrawingSystemCommands.SET_CELL_SIZE,
        (msg) => msg.cellSize,
        (msg) => drawingSystem.setCellSize(msg.cellSize),
        'The cell size was not provided.');
      break;
    case DrawingSystemCommands.RESET:
      processCmd(msg, DrawingSystemCommands.RESET,
        (msg) => (msg.promisedResponse)? msg.params.config : msg.config,
        (msg) => {
          drawingSystem.setConfig(msg.config)
          drawingSystem.reset();
          if(msg.promisedResponse){
            postMessage({
              id: msg.id,
              promisedResponse: msg.promisedResponse,
              command: msg.command
            });
          }
        },
        'The configuration was not provided.');
      break;
    case DrawingSystemCommands.TOGGLE_CELL:
      processCmd(msg, DrawingSystemCommands.TOGGLE_CELL,
        (msg) => msg.cx !== undefined && msg.cy !== undefined,
        (msg) => drawingSystem.toggleCell(msg.cx, msg.cy),
        'The cx and cy were both not provided.');
      break;
    case DrawingSystemCommands.DISPLAY_STORAGE:
      processCmd(msg, DrawingSystemCommands.DISPLAY_STORAGE,
        (msg) => msg.displayStorage !== undefined,
        (msg) => drawingSystem.displayStorage(msg.displayStorage),
        'The displayStorage field was not provided.');
      break;
    case DrawingSystemCommands.SEND_CELLS:
      processCmd(msg, DrawingSystemCommands.SEND_CELLS,
        () => true,
        (msg) => {
          postMessage({
            id: msg.id,
            promisedResponse: msg.promisedResponse,
            command: msg.command,
            cells: drawingSystem.getCells()
          });
        },
        'Could not send the drawing system cells.');
      break;
    default:
      throw new Error(`Unsupported command ${msg.command} was received in DrawingSystem Worker.`);
  }
}

onmessage = function (event) {
  let msg = event.data;
  routeCommandToProcessor(msg);
}