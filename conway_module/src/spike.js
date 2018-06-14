/*
Next Steps
- There is a bug. I can't update the array of cells in place. That effects the cells
	that haven't been evaluated yet.
- Pull scan neighbors function out higher so it only runs once per cell.
- Change the triggerLife function to use a weighted distributed rather than pseudo random.
- Refactor to use classes
- Build out as a Visualforce Component
- Build out as a Lightning Component.
- Fun to have different known starting points.
*/

let config = {
  canvas: {
    width: 600,
    height: 400
  },
  cell:{
    width: 20,
    height: 20
  }
}

let state = {
	currentState: [],
	nextState: []
}

let canvas = document.getElementById('grid_canvas')
canvas.setAttribute('width', config.canvas.width)
canvas.setAttribute('height', config.canvas.height)
let ctx = canvas.getContext('2d')

triggerLife(config, state)

let renderFrame = render.bind(this, ctx, config, state)
//window.setInterval(renderFrame, 100)

function render(ctx, config, state){
  clear(ctx, config);
  evaluateCells(config, state)
  //drawGrid(ctx, config)
	drawCells(ctx, config, state)
	swapState(state)
}

function clear(ctx, config){
  ctx.clearRect(0,0, config.canvas.width, config.canvas.height)
}

function drawGrid(ctx, config){
  //Draw background
  ctx.fillStyle = 'rgb(214, 217, 219)'
  ctx.fillRect(0,0, config.canvas.width, config.canvas.height)

  //Draw Lines
  ctx.lineWidth = 1
  ctx.lineCap = 'square'
  ctx.strokeStyle = 'rgb(0,0,0)'

  //Vertical Lines
  for(let i = config.cell.width; i < config.canvas.width; i = i + config.cell.width){
      ctx.moveTo(i,0)
      ctx.lineTo(i,config.canvas.height)
      ctx.stroke()
  }

  //Horizontal lines
  for (let j = config.cell.height; j < config.canvas.height; j = j + config.cell.height){
      ctx.moveTo(0, j)
      ctx.lineTo(config.canvas.width, j)
      ctx.stroke()
  }
}

/*
Populate the currentState and fill the next state with zeros.
*/
function triggerLife(config, state){
  //Create a 2D array to hold all of the cells.
  //The cells array is of the form array[width][height]
  let cellsWide = Math.floor(config.canvas.width/config.cell.width)
	let cellsHigh = Math.floor(config.canvas.height/config.cell.height)

  state.currentState = new Array(cellsWide)
  state.nextState = new Array(cellsWide)
  for (let row = 0; row < cellsWide; row++){
      state.currentState[row] = new Array(cellsHigh)
      state.nextState[row] = new Array(cellsHigh)
      for (let col = 0; col < cellsHigh; col++){
          state.currentState[row][col] = randomAliveOrDead()
          state.nextState[row][col] = 0
      }
  }
}

//This would be more fun if there was a way to tune the probability of a cell being alive or dead.
//Look at my book on world generation.
function randomAliveOrDead(){
  return getRandomIntInclusive(0, 1)
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function evaluateCells(config, state){
  for (let row = 0; row < state.currentState.length; row++){
    for (let col = 0; col < state.currentState[row].length; col++){
      evaluateCell(state, row, col)
    }
  }
}

function evaluateCell(state, row, col){
  if (!isCellValid(state, row, col)){
    return
  }

  if(isCellEmpty(state, row, col)){
    evaluateBirth(state, row, col)
  }else{
    evaluateSurvival(state, row, col)
	}
}

function isCellValid(state, row, col){
  return row >= 0 &&
    row < state.currentState.length &&
    col >= 0 &&
    col < state.currentState[row].length
}

function isCellEmpty(state, row, col){
  return state.currentState[row][col] == 0
}

function evaluateBirth(state, row, col){
  let birthRules = [3] //The rules will need to be passed in through the config to allow for different games.
  let neighborsCount = scanNeighbors(state, row, col)
  if (birthRules.includes(neighborsCount)){
    //A child is born!!!
    state.nextState[row][col] = 1
  }
}

//Explicit Scan
//There is probably a way to structure a loop to do this more elegantly.
function scanNeighbors(state, row, col){
  let neighborsCount = 0
  // Top Row
  for (let c = col - 1; c <= col + 1; c++){
    if(isCellValid(state, row - 1, c)){
      neighborsCount += state.currentState[row - 1][c]
    }
  }

  // Residing Row
  //left
  if(isCellValid(state, row, col - 1)){
    neighborsCount += state.currentState[row][col - 1]
  }

  //right
  if(isCellValid(state, row, col + 1)){
    neighborsCount += state.currentState[row][col + 1]
  }

  // Bottom Row
  for (let c = col - 1; c <= col + 1; c++){
    if(isCellValid(state, row + 1, c)){
      neighborsCount += state.currentState[row + 1][c]
    }
	}
	return neighborsCount
}

function evaluateSurvival(state, row, col){
  let survivalRules = [2, 3] //The rules will need to be passed in through the config to allow for different games.
  let neighborsCount = scanNeighbors(state, row, col)
  if (survivalRules.includes(neighborsCount)){
		state.nextState[row][col] = 1
  }else{
    //Death comes for us all...
    state.nextState[row][col] = 0
	}
}

//Possibly add an effect?
function drawCells(ctx, config, state){
  ctx.fillStyle = 'rgb(44, 193, 59)'
  ctx.strokeStyle = 'rgb(200, 0, 0)'
  for (let x = 0; x < state.nextState.length; x++){
    for (let y = 0; y < state.nextState[x].length; y++){
      if (state.nextState[x][y] == 1){
        //draw a rect
        let upperX = x * config.cell.width
        let upperY = y * config.cell.height
        ctx.fillRect(upperX, upperY, config.cell.width, config.cell.height)
        ctx.strokeRect(upperX, upperY, config.cell.width, config.cell.height)
      }
    }
  }
}

function swapState(state){
	let tmp = state.currentState
	state.currentState = state.nextState
	state.nextState = new Array(state.currentState.length)
	for(let i = 0; i < state.currentState.length; i++){
		state.nextState[i] = new Array(state.currentState[i].length)
		for (let j = 0; j < state.currentState[i].length; j++){
			state.nextState[i][j] = 0
		}
	}
}
