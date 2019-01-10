class Trait{
	constructor(){}
	process(context){throw new Error('Must implement a process method.')}
}

function fillStyle(age){
	if (typeof age !== 'number'){
		console.log(`Entity Age was: ${age}. Type was: ${typeof age}`)
		throw new Error('The trait ageBasedColor requires a property "age" be set to a number.')
	}

	let color = null;
	switch (true){
		case age <= 1:
			color = 'rgb(141, 203, 239)' //light blue
			break;
		case age > 1 && age <= 5:
		color = 'rgb(76, 179, 239)' //darker blue
			break;
		case age > 5 && age <= 10:
			color = 'rgb(237, 61, 61)' //red
			break;
		case age > 10:
			color = 'rgb(3, 153, 18)' //green
			break;
		default:
			throw new Error(`Unexpected Age: ${age}`)
	}
	return color
}

class ColorByAgeTrait extends Trait{
	constructor(){
		super()
	}

	process(context){
		context.fillStyle = fillStyle(context.entity.age)
		context.strokeStyle = 'rgb(0, 0, 0)'
	}
}

class GridCellToRenderingEntity extends Trait{
	constructor(){
		super()
	}

	process(context){
		context.rendering = context.rendering || {}
		context.rendering.entity = {}

		//Define Upper Left Corner (X,Y)
		context.rendering.entity.x = context.entity.location.row
		context.rendering.entity.y = context.entity.location.col

		//Define width & height
		context.rendering.entity.width = context.entity.width
		context.rendering.entity.height = context.entity.height
	}
}

class ScaleTransformer extends Trait{
	constructor(scalingFactor){
		super()
		this.scalingFactor = scalingFactor
	}

	process(context){
		if (typeof context.rendering === 'undefined' || typeof context.rendering.entity === 'undefined'){
			console.log(context)
			throw new Error('ScaleTransformer attempted to process an entity that did not have context.rendering or context.rendering.entity defined.')
		}
		context.rendering.entity.x = context.rendering.entity.x * this.scalingFactor
		context.rendering.entity.y = context.rendering.entity.y * this.scalingFactor
		context.rendering.entity.width = context.rendering.entity.width * this.scalingFactor
		context.rendering.entity.height = context.rendering.entity.height * this.scalingFactor
	}
}

const TWO_PI = Math.PI * 2
const DEFAULT_CIRCLE_FILL_STYLE = 'rgb(44, 193, 59)'
const DEFAULT_CIRCLE_STROKE_STYLE = 'rgb(0, 0, 0)'
class CircleTrait extends Trait{
	constructor(){
		super()
	}

	process(context){
		//find center
		//this.x, this.y, this.width, this.height
		let cx = context.rendering.entity.x + (context.rendering.entity.width/2)
		let cy = context.rendering.entity.y + (context.rendering.entity.height/2)
		let radius = context.rendering.entity.width/2

		context.rendererContext.fillStyle = context.fillStyle || DEFAULT_CIRCLE_FILL_STYLE
		context.rendererContext.strokeStyle = context.strokeStyle || DEFAULT_CIRCLE_STROKE_STYLE
		context.rendererContext.beginPath()
		context.rendererContext.arc(cx, cy, radius, 0, TWO_PI, true)
		context.rendererContext.fill()
		context.rendererContext.stroke()
	}
}

class Entity{
	constructor(){
		this.traits = []
	}

	render(rendererContext){
		let context = {
			rendererContext: rendererContext,
			entity: this
		}
		this.traits.forEach((trait) =>{
			trait.process(context)
		})
	}

	register(trait){
		this.traits.push(trait)
		return this
	}
}

class ProcessBoxAsRect extends Trait{
	constructor(){
		super()
	}

	process(context){
		context.rendering = context.rendering || {}
		context.rendering.entity = {}
		context.rendering.entity.x = context.entity.x
		context.rendering.entity.y = context.entity.y
		context.rendering.entity.width = context.entity.xx - context.entity.x
		context.rendering.entity.height = context.entity.yy - context.entity.y
	}
}

class ColorByContents extends Trait{
	constructor(){
		super()
	}

	process(context){
		// context.fillStyle = (context.entity.alive)? 'rgb(0, 0, 0)':'rgb(0, 0, 0)' //not used now.
		context.strokeStyle = (context.entity.alive)? '#c41c00':'#bbdefb'
	}
}

class RectTrait extends Trait{
	constructor(){
		super()
	}

	process(context){
		context.rendererContext.fillStyle = context.fillStyle || DEFAULT_CIRCLE_FILL_STYLE
		context.rendererContext.strokeStyle = context.strokeStyle || DEFAULT_CIRCLE_STROKE_STYLE
		context.rendererContext.strokeRect(context.rendering.entity.x, context.rendering.entity.y, context.rendering.entity.width, context.rendering.entity.height)
	}
}

module.exports = {
	Entity, ColorByAgeTrait, CircleTrait, ScaleTransformer, GridCellToRenderingEntity, ProcessBoxAsRect, ColorByContents, RectTrait
}
