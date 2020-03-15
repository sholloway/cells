/**
 * A web worker designed that is responsible for the drawing system.
 * 
 * TODO:
 * - Need to have the BrowserSystem.main() function which depends on window.requestAnimationFrame to be centralized 
 *   and in the main thread. That should send messages to the workers. Or find an alternative to window.requestAnimationFrame
 * - ConwayTimer -> Update Function -> Pings all active workers.
 *    Use Obersver Pattern.
 */

const WorkerCommands = require('./WorkerCommands.js').DrawingSystemCommands;
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
const DrawingStateManager = require('./../core/DrawingStateManager');

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
    this.getStateManager().stageStorage(this.scene, this.displayStorageStructure)
    this.getStateManager().processCells(this.scene)
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
    this.getStateManager().toggleCell(x, y)
  }

  /**
	 * Sets whether to draw the quad tree.
	 * @param {boolean} display
	 */
  displayStorage(display) {
    this.displayStorageStructure = display
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
    //TODO: Look at the Worker onerror function for an idomatic way of doing this.
    console.error(`DrawingSystem Worker.${commandName}: ${errMsg}`);
  }
}

function routeCommandToProcessor(msg){
  if (!msg.command) {
    console.error('Unexpected messaged received in DrawingSystem Worker.');
    console.error(event);
    return;
  }

  switch (msg.command) {
    case WorkerCommands.SEND_SCENE:
      processCmd(msg, WorkerCommands.SEND_SCENE,
        (msg) => workerState == WorkerState.RUNNING,
        (msg) => {
          // TODO: Add awareness to stop/start of the thread.
          drawingSystem.update(); //TODO: Rename this method.
          let scene = drawingSystem.getScene()
          let sceneMsg = JSON.stringify(scene);
          postMessage(JSON.stringify(sceneMsg));
        },
        '');
      break;
    case WorkerCommands.SET_CELLS:
      processCmd(msg, WorkerCommands.SET_CELLS,
        (msg) => msg.cells,
        (msg) => drawingSystem.setCells(msg.cells),
        'The cells were not provided.');
      break;
    case WorkerCommands.SET_CELL_SIZE:
      processCmd(msg, WorkerCommands.SET_CELL_SIZE,
        (msg) => msg.cellSize,
        (msg) => drawingSystem.setCellSize(msg.cellSize),
        'The cell size was not provided.');
      break;
    case WorkerCommands.RESET:
      processCmd(msg, WorkerCommands.RESET,
        (msg) => msg.config,
        (msg) => drawingSystem.setConfig(msg.config),
        'The configuration was not provided.');
      break;
    case WorkerCommands.TOGGLE_CELL:
      processCmd(msg, WorkerCommands.TOGGLE_CELL,
        (msg) => msg.cx !== undefined && msg.cy !== undefined,
        (msg) => drawingSystem.toggleCell(msg.cx, msg.cy),
        'The cx and cy were both not provided.');
      break;
    case WorkerCommands.START:
      console.log('Msg Recieved: START');
      workerState = WorkerState.RUNNING;
      break;
    case WorkerCommands.STOP:
      console.log('Msg Recieved: STOP');
      workerState = WorkerState.STOPPED;
      break;
    case WorkerCommands.DISPLAY_STORAGE:
      processCmd(msg, WorkerCommands.DISPLAY_STORAGE,
        (msg) => msg.displayStorage,
        (msg) => drawingSystem.displayStorage(msg.displayStorage),
        'The displayStorage field was not provided.');
      break;
    default:
      console.error(`Unsupported command ${msg.command} was received in DrawingSystem Worker.`);
      break;
  }
}

onmessage = function (event) {
  let msg = event.data;
  routeCommandToProcessor(msg);
}