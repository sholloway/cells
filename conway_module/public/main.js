/*
Having Conways module passed in as a constructor parameter and then made a class instance is bad.
Need to change that to be available to the entire document.

Figure out how to get window and document available in a clean way.
*/

const LifeSystem = Conways.LifeSystem;
// const GridSystem = Conways.GridSystem;
const DrawingSystem = Conways.DrawingSystem;
const SeederFactoryModule = Conways.SeederFactoryModule;
const SeederFactory = SeederFactoryModule.SeederFactory;
const SeederModels = SeederFactoryModule.SeederModels;
const HTMLCanvasRenderer = Conways.HTMLCanvasRenderer;
const TraitBuilderFactory = Conways.TraitBuilderFactory;
const SceneManager = Conways.SceneManager;

class Main {
  constructor(gridCanvas, simCanvas, drawCanvas) {
    this.gridCanvas = gridCanvas;
    this.simCanvas = simCanvas;
    this.drawCanvas = drawCanvas;

    this.config = Conways.DefaultConfig;

    this.conwayBroker = new Conways.ConwayBroker();
    this.gridWorker = new Conways.GridSystemWorker();

    this.gridRender = new HTMLCanvasRenderer(this.gridCanvas.getContext('2d'), this.config);
    this.life = new LifeSystem(window, this.simCanvas.getContext('2d'), this.config)
    this.drawingSystem = new DrawingSystem(window, this.drawCanvas.getContext('2d'), this.config)
    this.drawingAllowed = true

    /**
    * Render the grid canvas when a message is received from the GridSystemWorker.
    */
    this.gridWorker.onmessage = (event) => {
      if (!event.data) { //TODO: Need better error handling. Enforce that event.data is a SceneManager.
        return;
      }
      let sceneObj = JSON.parse(event.data);
      let scene = SceneManager.fromObject(sceneObj, TraitBuilderFactory.select);
      let htmlCanvasContext = this.gridCanvas.getContext('2d');
      htmlCanvasContext.strokeStyle = '#757575';
      htmlCanvasContext.lineWidth = 0.5;
      this.gridRender.render(scene);
    }
  }

  initialize() {
    let simTicked = function (lifeSystem) {
      document.getElementById('alive_cells_count').value = lifeSystem.aliveCellsCount()
      document.getElementById('sim_generation_count').value = lifeSystem.numberOfSimulationIterations()
    }
    this.life.subscribe('ticked', simTicked);
  }

  handlePageLoad(event) {
    sizeCanvas(this.config);
    this.life.main(window.performance.now());
    this.drawingSystem.main(window.performance.now());
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
  
      this.drawingSystem.toggleCell(cx, cy);
    }
  }

  allowDrawing() {
    this.drawingAllowed = true;
    this.drawingSystem.start();
  }

  preventDrawing() {
    this.drawingAllowed = false;
    this.drawingSystem.stop()
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
          this.drawingSystem.setCells(activeCells);
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
    this.drawingSystem.reset();
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
    // gridWorker.postMessage({
    //   command: 'CLEAR_GRID', //TODO: Make a constant
    //   parameters: {
    //     gridWidth: config.canvas.width, gridHeight: config.canvas.height}
    // });
    this.gridRender.clear();
  }

  startSimulation() {
    this.config.zoom = getCellSize();
    this.config.landscape.width = this.config.canvas.width / this.config.zoom;
    this.config.landscape.height = this.config.canvas.height / this.config.zoom;
    let seeder = this.buildSeeder();
    this.drawingSystem.reset();
    this.life.setSeeder(seeder);
    this.life.start();
  }

  buildSeeder() {
    let seedPicker = document.getElementById('seed')
    let seedSetting = seedPicker.value
    let seeder = SeederFactory.build(seedSetting)
    seeder.setCells(this.drawingSystem.getCells())
    return seeder
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
    this.drawingSystem.displayStorage(displayStorageCheckbox.checked);
  }

  changedCellSize() {
    let cellSize = getCellSize()
    this.life.setCellSize(cellSize);
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

/// Crap below this line
/////////////////////////////////////////////////////////////////////////
//Example Web Worker Integration. TODO: Delete
/*
conwayBroker.onmessage = function (event) {
  console.log('The main thread received a msg from the Conway Broker. It was:')
  console.log(event.data);
}

function sendBrokerMsg() {
  console.log('The button was clicked');
  conwayBroker.postMessage('Hello from the main thread.');
}
*/