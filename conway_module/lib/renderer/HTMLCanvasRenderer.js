function clear(htmlCanvasContext, config){
  htmlCanvasContext.clearRect(0,0, config.canvas.width, config.canvas.height)
}

class HTMLCanvasRenderer{
	constructor(htmlCanvasContext, config){
		this.htmlCanvasContext = htmlCanvasContext
		this.config = config
	}

	render(scene){
		//Need to either get the config in here or find a way to derive the needed info.
		clear(this.htmlCanvasContext, this.config)
		while(!scene.fullyRendered()){
			let renderable = scene.nextEntity()
			renderable.render(this.htmlCanvasContext)
		}
	}
}

module.exports = HTMLCanvasRenderer
