function clear(htmlCanvasContext, config){
  htmlCanvasContext.clearRect(0,0, config.canvas.width, config.canvas.height)
}

class HTMLCanvasRenderer{
	constructor(htmlCanvasContext, config){
		this.htmlCanvasContext = htmlCanvasContext
		this.config = config
	}

	render(scene){
		clear(this.htmlCanvasContext, this.config)
		while(!scene.fullyRendered()){
			let entity = scene.nextEntity()
			entity.render(this.htmlCanvasContext)
		}
	}
}

module.exports = HTMLCanvasRenderer
