const {EntityBuilderFactory} = require('../entity-system/EntityBuilderFactory')
const {TraitBuilderFactory} = require('../entity-system/TraitBuilderFactory')

/**
 * Data structure for storing the entities ready to render.
 */
class SceneManager{
	/**
	 * Create a new SceneManager
	 */
	constructor(){
		this.stack = []
	}

	/**
	 * Add a a single entity or an array of entities to the scene to be rendered.
	 * @param {Entity | Entity[]} entity
	 * @return {SceneManager} Returns the instance of the SceneManager.
	 */
	push(entity){
		if(Array.isArray(entity)){
			this.stack = this.stack.concat(entity)
		}else{
			this.stack.push(entity)
		}
		return this
	}

	/**
	 * Pop the next entity off the scene's stack.
	 * @returns {Entity} The next entity to render.
	 */
	nextEntity(){
		return this.stack.shift()
	}

	/**
	 * Determine if the stack is empty or not.
	 * @returns {boolean}
	 */
	fullyRendered(){
		return !(this.stack.length > 0)
	}

	/**
	 * Removes all entities from the stack.
	 */
	clear(){
		this.stack = []
	}

	getStack(){
		return this.stack;
	}

	serializeStack(){
		return JSON.stringify(this.stack);
	}

	/**
 * Builds a scene from a Javascript Literal. Intended to be used to
 * reconstruct a serialized scene by a web worker.
 * @param {Object} sceneObject
 */
	static fromObject(sceneObject, traitFactory){
		let scene = new SceneManager()
		sceneObject.stack.forEach(entityLit => {
			let entityFunc = EntityBuilderFactory.select(entityLit.className)
			let entity = entityFunc(entityLit, traitFactory)
			scene.push(entity) //BUG??: This may be reversing the order.
		})
		return scene
	}
}

module.exports = SceneManager
