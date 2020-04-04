/**
 * A web worker designed that is responsible for the drawing system.
 * 
 * TODO:
 * - Need to have the BrowserSystem.main() function which depends on window.requestAnimationFrame to be centralized 
 *   and in the main thread. That should send messages to the workers. Or find an alternative to window.requestAnimationFrame
 * - ConwayTimer -> Update Function -> Pings all active workers.
 *    Use Obersver Pattern.
 */

const WorkerCommands = require('./WorkerCommands.js');
const LifeCycle = WorkerCommands.LifeCycle;
const DrawingSystemCommands = WorkerCommands.DrawingSystemCommands;

/**
 * Processes a message sent by the main thread.
 *
 * Message Types
 * {command: 'SEND_SCENE'}
 * {command: 'SET_CELLS', parameters: {cells: [] }} - setCells(activeCells)
 * {command: 'RESET', parameters: {}} - reset()
 * {command: 'TOGGLE_CELL', parameters: {CX, CY}}  - toggleCell(cx, cy)
 * {command: 'START', parameters: {}}  - start()
 * {command: 'STOP', parameters: {}}  - stop()
 */

const SceneManager = require('../core/SceneManager.js');
const DrawingStateManager = require('./../core/DrawingStateManager').DrawingStateManager;

//TODO: Move into DrawingSystem file.
const States = {
  IDLE: 'idle',
  UPDATING: 'updating'
};

/**
 * Replaces ./core/DrawingSystem.js
 * Will eventually be in that file.
 */
class DrawingSystem {
  constructor() {
    this.config = {
      zoom: 1
    };
    this.stateManager = new DrawingStateManager(this.config);
    this.scene = new SceneManager();
    this.displayStorageStructure = false;
    this.state = States.IDLE
  }

  getState() {
    return this.state;
  }

  setConfig(config) {
    this.config = config;
    this.stateManager.setConfig(this.config);
  }

  getScene() {
    return this.scene;
  }

  getStateManager() {
    return this.stateManager
  }

  update() {
    this.state = States.UPDATING
    this.scene.clear();
    this.getStateManager().stageStorage(this.scene, this.displayStorageStructure);
    this.getStateManager().processCells(this.scene);
    this.state = States.IDLE;
  }

	/**
	 * Used to preload the drawing system with alive cells.
	 * @param {Cell[]} cells - An array of alive cells.
	 */
  setCells(cells) {
    this.getStateManager().setCells(cells)
  }

  /**
	 * Provides a deep copy of the currently alive cells.
	 * @returns {Cell[]}
	 */
  getCells() {
    return this.getStateManager().getCells()
  }

  /**
	 * Sets the cell size to use.
	 * @param {number} size
	 */
  setCellSize(size) {
    this.config.zoom = size
  }

	/**
	 * Flips a grid cell to alive or dead.
	 * @param {number} x - The X coordinate of the cell.
	 * @param {number} y - The Y coordinate of the cell.
	 */
  toggleCell(x, y) {
    if (this.state === States.IDLE) {
      this.state = States.UPDATING
      this.getStateManager().toggleCell(x, y);
      this.state = States.IDLE;
    }
  }

  /**
	 * Sets whether to draw the quad tree.
	 * @param {boolean} display
	 */
  displayStorage(display) {
    this.displayStorageStructure = display
  }

  /**
	 * Clears the simulation.
	 */
	reset(){
		this.scene.clear()
		this.getStateManager().clear()
	}
}

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

function processScene(msg) {
  if (workerState === WorkerState.RUNNING &&
    drawingSystem.getState() === States.IDLE) {
    drawingSystem.update();
    //  postMessage(drawingSystem.getScene().serializeStack());
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