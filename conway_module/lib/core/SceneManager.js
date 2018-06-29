class SceneManager{
	constructor(){
		this.stack = []
	}

	push(entity){
		this.stack.push(entity)
		return this
	}

	nextEntity(){
		return this.stack.pop()
	}

	fullyRendered(){
		return !(this.stack.length > 0)
	}
}

module.exports = SceneManager
