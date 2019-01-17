function clearCanvas(htmlCanvasContext, config){
  htmlCanvasContext.clearRect(0,0, config.canvas.width, config.canvas.height)
}

class HTMLCanvasRenderer{
	constructor(htmlCanvasContext, config){
		this.htmlCanvasContext = htmlCanvasContext
		this.config = config
	}

	render(scene){
		this.clear()
		while(!scene.fullyRendered()){
			let entity = scene.nextEntity()
			entity.render(this.htmlCanvasContext)
		}
	}

	clear(){
		clearCanvas(this.htmlCanvasContext, this.config)
	}
}

module.exports = HTMLCanvasRenderer
