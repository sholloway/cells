module.exports = (superclass) => class extends superclass{
	/*
	TODO: Make the cell color change based on its lifespan.
	*/
	render(htmlCanvasContext){
		htmlCanvasContext.fillStyle = this.fillStyle()
		htmlCanvasContext.strokeStyle = this.strokeStyle()
		htmlCanvasContext.fillRect(this.x, this.y, this.width, this.height)
		htmlCanvasContext.strokeRect(this.x, this.y, this.width, this.height)
	}

	fillStyle(){
		return 'rgb(44, 193, 59)'
	}

	strokeStyle(){
		return 'rgb(200, 0, 0)'
	}
}
