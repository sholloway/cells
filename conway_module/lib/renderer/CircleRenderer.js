const TWO_PI = Math.PI * 2
module.exports = (superclass) => class extends superclass{
	/*
	TODO: Make the cell color change based on its lifespan.
	*/
	render(htmlCanvasContext){
		htmlCanvasContext.fillStyle = this.fillStyle()
		htmlCanvasContext.strokeStyle = this.strokeStyle()
		//find center
		//this.x, this.y, this.width, this.height
		let cx = this.x + (this.width/2)
		let cy = this.y + (this.height/2)
		let radius = this.width/2

		htmlCanvasContext.beginPath()
		htmlCanvasContext.arc(cx, cy, radius, 0, TWO_PI, true)
		htmlCanvasContext.fill()
		htmlCanvasContext.stroke()
	}

	fillStyle(){
		return 'rgb(44, 193, 59)'
	}

	strokeStyle(){
		return 'rgb(0, 0, 0)'
	}
}
