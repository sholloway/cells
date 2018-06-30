const isCellValid = function(array, row, col){
  return row >= 0 &&
    row < array.length &&
    col >= 0 &&
    col < array[row].length
}

const scanNeighbors = function(array, row, col){
	let neighborsCount = 0

	//Define the bounds of the grid subset where the upper leftmost
	//corner is at location (upperX, upperY) and the lower rightmost
	//corner is at the location (lowerX, lowerY).
	let upperX = row - 1
	let upperY = col - 1
	let lowerX = row + 1
	let lowerY = col + 1

	//Traverse every element in the subset including the cell at the
	//center of the subset.
	for(let x = upperX; x <= lowerX; x++){
		for(let y = upperY; y <= lowerY; y++){
			if(!(x == row && y == col) && //Ignore the cell we're evaluating.
			isCellValid(array, x, y)){
				neighborsCount += array[x][y]
			}
		}
	}
	return neighborsCount
}

module.exports = {
	isCellValid,
  scanNeighbors
}
