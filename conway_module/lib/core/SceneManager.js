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

	purge(){
		this.stack = []
	}
}



module.exports = SceneManager

/*
What do I need?
- Render Quad tree as rectangle outlines
- Render alive cells as shapes.
- Cells age drives colors.
- Cells and rectangles are in grid space coordinate system. They need to be projected into the HTML canvas coordinate system.
- Easily swap out different rendering strategies for entities. Bolt on/Snap on style.
	- Traits, Strategies, Composites
*/
