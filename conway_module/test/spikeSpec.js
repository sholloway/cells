const chai = require('chai')
const expect = chai.expect

describe("Conway's Game of Life Spike", function(){
	it("should debug stuff", function(){
		let config = {
			canvas: {
				width: 5,
				height: 5
			},
			cell:{
				width: 1,
				height: 1
			}
		}

		let state = {
			currentState: [],
			nextState: []
		}

		// triggerLife(config, state)
		createBlinker(state)
		console.log(`CS: ${arraySum(state.currentState)}, NS: ${arraySum(state.nextState)}`)
		console.log('--cycle--')
		console.log(state.currentState)
		for (let i = 0; i < 10; i++){
			evaluateCells(config, state)
			console.log(state.currentState)
			swapState(state)
			console.log(`CS: ${arraySum(state.currentState)}, NS: ${arraySum(state.nextState)}`)
		}
	})
})

function arraySum(array){
	let sum = 0;
	for(let i = 0; i < array.length; i++){
		for (let j = 0; j < array[i].length; j++){
			sum += array[i][j]
		}
	}
	return sum
}

function createBlock(state){
	state.currentState = [ [0,0,0,0,0],
												 [0,0,0,0,0],
												 [0,0,1,1,0],
												 [0,0,1,1,0],
												 [0,0,0,0,0]]

	state.nextState =    [	[0,0,0,0,0],
													[0,0,0,0,0],
													[0,0,0,0,0],
													[0,0,0,0,0],
													[0,0,0,0,0]]
}

function createBlinker(state){
	state.currentState = [ [0,0,0,0,0],
												 [0,0,1,0,0],
												 [0,0,1,0,0],
												 [0,0,1,0,0],
												 [0,0,0,0,0]]

	state.nextState =    [	[0,0,0,0,0],
													[0,0,0,0,0],
													[0,0,0,0,0],
													[0,0,0,0,0],
													[0,0,0,0,0]]
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

// function swapState(state){
// 	let tmp = state.currentState
// 	state.currentState = state.nextState
// 	state.nextState = tmp
// }

function swapState(state){
	state.currentState = state.nextState
	state.nextState = new Array(state.currentState.length)
	for(let i = 0; i < state.currentState.length; i++){
		state.nextState[i] = new Array(state.currentState[i].length)
		for (let j = 0; j < state.currentState[i].length; j++){
			state.nextState[i][j] = 0
		}
	}
}

let state = {
	currentState: [[1,2,3],[4,5,6],[7,8,9]],
	nextState: [[10,11],[12,13]]
}
