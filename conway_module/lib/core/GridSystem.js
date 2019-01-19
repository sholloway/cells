class GridSystem{
	constructor(htmlCanvasContext, cellSize){
		this.htmlCanvasContext = htmlCanvasContext
		this.cellSize = cellSize
	}

	setCellSize(size){
		this.cellSize = size
	}

	drawGrid(width, height){
		this.htmlCanvasContext.strokeStyle = '#757575'
		this.htmlCanvasContext.lineWidth = 0.5
		for (let x = 0; x < width; x += this.cellSize){
			this.htmlCanvasContext.beginPath()
			this.htmlCanvasContext.moveTo(x,0)
			this.htmlCanvasContext.lineTo(x, height)
			this.htmlCanvasContext.stroke()
		}

		for (let y = 0; y < height; y += this.cellSize){
			this.htmlCanvasContext.beginPath
			this.htmlCanvasContext.moveTo(0,y)
			this.htmlCanvasContext.lineTo(width, y)
			this.htmlCanvasContext.stroke()
		}
	}

	clear(x,y, width, height){
		this.htmlCanvasContext.clearRect(x,y,width,height)
	}
}

module.exports = GridSystem
