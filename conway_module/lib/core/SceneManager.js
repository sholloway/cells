class SceneManager{
	constructor(){
		this.stack = []
	}

	//TODO: The whole partial class Entity thing is a mess. Replace.
	//TODO: Doesn't support nested arrays.
	//TODO: Need a transformation pipeline before rendering.
	//TODO: The GameManager is passing in QuadTree cells, the Grid Manager is passing in Rendering Cells.
	push(entity){
		if(Array.isArray(entity)){
			this.stack = this.stack.concat(entity)
		}else{
			this.stack.push(entity)
		}
		return this
	}

	nextEntity(){
		return this.stack.shift()
	}

	fullyRendered(){
		return !(this.stack.length > 0)
	}
}

module.exports = SceneManager
