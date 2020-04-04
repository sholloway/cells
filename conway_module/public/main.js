/*
Next Steps
* Make the worker cycle stop when an error is thrown.
* Move the new Drawing System class into it's own file.
* Get test converage working through the IDE.
* setup prettifier. I want to add ; to every line.
* Shift AltSystem to a worker.
*/

const LifeSystem = Conways.LifeSystem;
const SeederFactoryModule = Conways.SeederFactoryModule;
const SeederFactory = SeederFactoryModule.SeederFactory;
const SeederModels = SeederFactoryModule.SeederModels;
const HTMLCanvasRenderer = Conways.HTMLCanvasRenderer;
const TraitBuilderFactory = Conways.TraitBuilderFactory;
const SceneManager = Conways.SceneManager;
const WorkerSystem = Conways.WorkerSystem;
const WorkerCommands = Conways.WorkerCommands;
const DrawingSceneBuilder = Conways.DrawingSceneBuilder;
const Cell = Conways.Cell;

const processDrawingWorker='Render Drawing Scene';

const Workers = {
  DRAWING_SYSTEM: 'DRAWING_SYSTEM_WORKER'
};

class Main {
  constructor(gridCanvas, simCanvas, drawCanvas) {
    this.gridCanvas = gridCanvas;
    this.simCanvas = simCanvas;
    this.drawCanvas = drawCanvas;

    this.config = Conways.DefaultConfig;

    this.gridWorker = new Conways.GridSystemWorker();
    this.drawingWorker = new Conways.DrawingSystemWorker();

    this.gridRender = new HTMLCanvasRenderer(this.gridCanvas.getContext('2d'), this.config);
    this.drawingSystemRender = new HTMLCanvasRenderer(this.drawCanvas.getContext('2d'), this.config);
    this.drawingScene = new SceneManager();
    
    this.workerSystem = new WorkerSystem(window, this.config);
    this.life = new LifeSystem(window, this.simCanvas.getContext('2d'), this.config);    
    this.drawingAllowed = true;

    this.gridWorker.onmessage = this.handleMessageFromGridWorker.bind(this);
    this.gridWorker.onerror = this.workerSystem.workerErrorHandler.bind(this.workerSystem); //We don't want to fully register the gridWorker because it is only rendered on demand.
    
    this.drawingWorker.onmessage = this.handleMessageFromDrawingWorker.bind(this);

    this.workerSystem.registerWorker(Workers.DRAWING_SYSTEM, this.drawingWorker);
  }

  initialize() {
    let simTicked = function (lifeSystem) {
      document.getElementById('alive_cells_count').value = lifeSystem.aliveCellsCount();
      document.getElementById('sim_generation_count').value = lifeSystem.numberOfSimulationIterations();
    }
    this.life.subscribe('ticked', simTicked);

    /*
    This kicks off the main loop for all workers.
    Need to consider the difference between running simulations and the 
    request to get the scene data.
    */
    this.workerSystem.start(); 
  }

  /**
  * Render the grid canvas when a message is received from the GridSystemWorker.
  */
  handleMessageFromGridWorker(message){
    if (message.data) { 
      let sceneObj = JSON.parse(message.data);
      let scene = SceneManager.fromObject(sceneObj, TraitBuilderFactory.select);
      let htmlCanvasContext = this.gridCanvas.getContext('2d');
      htmlCanvasContext.strokeStyle = '#757575';
      htmlCanvasContext.lineWidth = 0.5;
      this.gridRender.render(scene);
    }
  }

  handleMessageFromDrawingWorker(envelope){
    if (envelope.data) { 
      if(envelope.data.promisedResponse){
        this.workerSystem.attemptToProcessPendingWork(envelope.data);
      }else{
        this.processMessageFromDrawingWorker(envelope.data);
      }
    }
  }

  processMessageFromDrawingWorker(message){
    switch (message.command) {
      case WorkerCommands.LifeCycle.PROCESS_CYCLE:
        this.drawingScene.clear();
        DrawingSceneBuilder.buildScene(this.drawingScene, this.config, message.stack);
        this.drawingSystemRender.render(this.drawingScene);
        break;
      default:
        console.error(`An unexpected message was sent from the Drawing Worker. ${message}`);
    }
  }

  handlePageLoad(event) {
    sizeCanvas(this.config);
    let now = window.performance.now();
    this.life.main(now);
    this.workerSystem.main(now);
    this.allowDrawing();
  }

  handlePageResize(event) {
    sizeCanvas(this.config);
    this.handleGridBackground();
  }

  handleDrawCanvasClicked(clickEvent){
    if (this.drawingAllowed) {
      //Get Pixel clicked.
      let boundary = this.drawCanvas.getBoundingClientRect();
      let px = clickEvent.clientX - boundary.left;
      let py = clickEvent.clientY - boundary.top;
  
      //Project to a Cell
      let cx = Math.floor(px / this.config.zoom);
      let cy = Math.floor(py / this.config.zoom);

      this.drawingWorker.postMessage({
        command: WorkerCommands.DrawingSystemCommands.TOGGLE_CELL,
        cx: cx,
        cy: cy
      });
    }
  }

  allowDrawing() {
    this.drawingAllowed = true;
    this.drawingWorker.postMessage({
      command: WorkerCommands.LifeCycle.START
    });
  }

  preventDrawing() {
    this.drawingAllowed = false;
    this.drawingWorker.postMessage({
      command: WorkerCommands.LifeCycle.STOP
    });
  }

  setSeedingOption() {
    let option = document.getElementById('seed');
    switch (option.value) {
      case "draw":
        this.resetSimulation();
        this.allowDrawing();
        break;
      default:
        this.preventDrawing();
        this.resetSimulation();
        break;
    }
  }

  //TODO: Yuck. Improve this. Isolate knowledge about the DOM.
  toggleSimulation() {
    let button = document.getElementById('play_pause_button');
    switch (button.innerText) {
      case 'Start':
        button.innerText = 'Pause';
        this.preventDrawing();
        this.startSimulation();
        break;
      case 'Pause':
        button.innerText = 'Resume'
        if (document.getElementById('seed').value === "draw") {
          //copy the active cells to the drawing system.
          let activeCells = this.life.getCells();
          this.drawingWorker.postMessage({
            command: WorkerCommands.DrawingSystemCommands.SET_CELLS,
            cells: activeCells
          });
          this.life.reset();
          this.allowDrawing();
        }
        this.stopSimulation();
        break;
      case 'Resume':
        button.innerText = 'Pause'
        this.preventDrawing();
        if (document.getElementById('seed').value === "draw") {
          this.startSimulation();
        } else {
          this.resumeSimulation();
        }
        break;
      default:
        break;
    }
  }

  resetSimulation() {
    this.stopSimulation();
    let button = document.getElementById('play_pause_button');
    button.innerText = "Start";
    document.getElementById('alive_cells_count').value = 0;
    document.getElementById('sim_generation_count').value = 0;
    this.life.reset();

    //Reset the Drawing System
    this.workerSystem.promiseResponse(
      Workers.DRAWING_SYSTEM,
      WorkerCommands.DrawingSystemCommands.RESET, 
      { config: this.config})
      .then(() => {
        this.drawingSystemRender.clear();
      });
  }

  handleGridBackground() {
    let displayGridBackground = document.getElementById('display_grid_background')
    if (displayGridBackground.checked) {
      this.requestToDrawGrid();
    } else {
      this.requestToClearGrid();
    }
  }

  requestToDrawGrid() {
    let cellSize = getCellSize();
    this.gridWorker.postMessage({
      command: 'CREATE_GRID', //TODO: Make a constant
      parameters: {
        cellWidth: cellSize, cellHeight: cellSize,
        gridWidth: this.config.canvas.width, gridHeight: this.config.canvas.height
      }
    });
  }

  requestToClearGrid() {
    this.gridRender.clear();
  }

  startSimulation() {
    /**
     * First we are fetching the cells, then asynchronously telling the 
     * drawing system to reset. Finally we're building up the seeder 
     * and starting the simulation.
     */
    this.workerSystem.promiseResponse(
      Workers.DRAWING_SYSTEM,
      WorkerCommands.DrawingSystemCommands.SEND_CELLS
    )
    .then((response) =>{
      return new Promise((resolve, reject) =>{
        this.drawingWorker.postMessage({
          command: WorkerCommands.DrawingSystemCommands.RESET,
          config: this.config
        });
        this.drawingSystemRender.clear();
        if(response.cells){
          resolve(response.cells);
        }else{
          reject('Cells were not provided.');
        }
      });
    })
    .then((drawingCells) => {
      this.config.zoom = getCellSize();
      this.config.landscape.width = this.config.canvas.width / this.config.zoom;
      this.config.landscape.height = this.config.canvas.height / this.config.zoom;
      let seedPicker = document.getElementById('seed')
      let seedSetting = seedPicker.value
      let seeder = SeederFactory.build(seedSetting);
      seeder.setCells(drawingCells.map(c => Cell.buildInstance(c)));
      this.life.setSeeder(seeder);
      this.life.start();
    })
    .catch((reason) => {
      console.error(`There was an error trying to build the seeder.\n${reason}`);
    });
  }

  stopSimulation() {
    this.life.stop();
  }
  
  resumeSimulation() {
    this.life.resume();
  }

  toggleDisplayStorageStructure() {
    let displayStorageCheckbox = document.getElementById('display_storage');
    this.life.displayStorage(displayStorageCheckbox.checked);

    this.drawingWorker.postMessage({
      command: WorkerCommands.DrawingSystemCommands.DISPLAY_STORAGE,
      displayStorage: displayStorageCheckbox.checked
    });
  }

  changedCellSize() {
    let cellSize = getCellSize()
    this.life.setCellSize(cellSize);
    this.drawingWorker.postMessage({
      command: WorkerCommands.DrawingSystemCommands.SET_CELL_SIZE,
      cellSize: cellSize
    });
    this.handleGridBackground()
  }
}

function sizeCanvas(config) {
  //Override the default configuration to size the HTML Canvas
  //to fit the document. Note: This will use the same padding/margins
  //as the HTML Body.
  let blockElement = document.getElementById('block')
  let headerElement = document.getElementById('header')
  let controlBarElement = document.getElementById('control_bar')
  let statusBarElement = document.getElementById('status_bar')
  let bodyMargin = 8 * 2; //Padding on body element in CSS is 8 top and bottom.

  config.canvas.height = window.innerHeight - bodyMargin - 
    (blockElement.offsetHeight + 
      headerElement.offsetHeight + 
      controlBarElement.offsetHeight + 
      statusBarElement.offsetHeight);

  let canvasContainerDiv = document.getElementById('canvas_container')
  let gridCanvas = document.getElementById('grid_canvas')
  let simCanvas = document.getElementById('sim_canvas')
  let drawCanvas = document.getElementById('draw_canvas')

  //WARNING: Setting the canvas height changes the body
  //width so always set the height before the width.
  canvasContainerDiv.style.height = `${config.canvas.height}px`
  gridCanvas.setAttribute('height', config.canvas.height)
  simCanvas.setAttribute('height', config.canvas.height)
  drawCanvas.setAttribute('height', config.canvas.height)

  config.canvas.width = document.body.clientWidth
  canvasContainerDiv.style.width = `${config.canvas.width}px`
  gridCanvas.setAttribute('width', config.canvas.width)
  simCanvas.setAttribute('width', config.canvas.width)
  drawCanvas.setAttribute('width', config.canvas.width)
}

function getCellSize() {
  let cellSizeControl = document.getElementById('cell_size')
  return Number.parseInt(cellSizeControl.value)
}