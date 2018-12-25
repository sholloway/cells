let Entity = require('./Entity.js')
let rectangleRenderer = require('./RectangleRenderer.js')
let circleRenderer = require('./CircleRenderer.js')
let ageBasedColor = require('./AgeBasedColor.js')

class Cell extends ageBasedColor(circleRenderer(Entity)){
	/*
	Parameters:
	- x: The upper left corner on the x-axis.
	- y: The upper left corner on the y-axis.
	- width: The width of the cell.
	- height: The height of the cell.
	- age: The number of game iterations the cell has survived.
	*/
	constructor(x,y, width, height, age){
		super()
		this.x = x
		this.y = y
		this.width = width
		this.height = height
		this.age = age
	}
}

module.exports = Cell
