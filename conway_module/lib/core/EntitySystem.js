class Trait{
	constructor(){}
	process(context){throw new Error('Must implement a process method.')}
}

/*
Light Blue to Dark
This might be better if the stages followed a natural curve like e, a log or Fibonacci.
Possibilities:
* Fibonacci Numbers - Smooth curve: 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89
* Bernoulli Numbers - Increasing, but jagged
*
* Color Scheme: https://material.io/tools/color/#!/?view.left=0&view.right=0&primary.color=1E88E5&secondary.color=FFEB3B
*/
function fillStyle(age){
	if (typeof age !== 'number'){
		console.log(`Entity Age was: ${age}. Type was: ${typeof age}`)
		throw new Error('The trait ageBasedColor requires a property "age" be set to a number.')
	}

	let color = null;
	switch (true){
		case age <= 1:
			color = '#e3f2fd'
			break;
		case age == 2:
			color = '#bbdefb'
			break;
		case age == 3:
			color = '#90caf9'
			break;
		case age > 3 && age <= 5:
			color = '#64b5f6'
			break;
		case age > 5 && age <= 8:
			color = '#42a5f5'
			break;
		case age > 8 && age <= 13:
			color = '#2196f3'
			break;
		case age > 13 && age <= 21:
			color = '#1e88e5'
			break;
		case age > 21 && age <= 34:
			color = '#1976d2'
			break;
		case age > 34 && age <= 55:
			color = '#1565c0'
			break;
		case age > 55 && age <= 89:
			color = '#0d47a1'
			break;
		case age > 89 && age <= 144:
			color = '#263238' //Dark Blue Grey
			break;
		case age > 144 && age <= 233:
			color = '#870000' //Dark Orange
			break;
		case age > 233 && age <= 377:
			color = '#bf360c'
			break;
		case age > 377:
			color = '#ffeb3b' //Bright Yellow
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
		context.lineWidth = 2
		context.strokeStyle = (context.entity.alive)? '#c41c00': '#0d47a1'
	}
}

class DarkFillTrait extends Trait{
	constructor(){
		super()
	}

	process(context){
		context.fillStyle = '#263238'
		context.strokeStyle = '#263238'
	}
}
class RectOutlineTrait extends Trait{
	constructor(){
		super()
	}

	process(context){
		context.rendererContext.strokeStyle = context.strokeStyle || DEFAULT_CIRCLE_STROKE_STYLE
		context.rendererContext.strokeRect(context.rendering.entity.x, context.rendering.entity.y, context.rendering.entity.width, context.rendering.entity.height)
	}
}

class FilledRectTrait extends Trait{
	constructor(){
		super()
	}

	process(context){
		context.rendererContext.fillStyle = context.fillStyle || DEFAULT_CIRCLE_FILL_STYLE
		context.rendererContext.fillRect(context.rendering.entity.x, context.rendering.entity.y, context.rendering.entity.width, context.rendering.entity.height)
	}
}

class DarkThinLines extends Trait{
	constructor(){
		super()
	}

	process(context){
		//TODO Make Background #f5f5f. Background is it's own enity.
		context.rendererContext.strokeStyle = '#757575'
		context.rendererContext.lineWidth = 0.5
	}
}

class GridPattern extends Trait{
	constructor(){
		super()
	}

	process(context){
		//Draw vertical lines
		for (let x = 0; x < context.entity.width; x += context.entity.cell.width){
			context.rendererContext.beginPath()
			context.rendererContext.moveTo(x,0)
			context.rendererContext.lineTo(x, context.entity.height)
			context.rendererContext.stroke()
		}

		for (let y = 0; y < context.entity.height; y += context.entity.cell.height){
			context.rendererContext.beginPath()
			context.rendererContext.moveTo(0,y)
			context.rendererContext.lineTo(context.entity.width, y)
			context.rendererContext.stroke()
		}
	}
}

class GridEntity extends Entity{
	constructor(width, height, cWidth, cHeight){
		super()
		this.width = width
		this.height = height
		this.cell = { width: cWidth, height: cHeight}
	}
}

module.exports = {
	CircleTrait,
	ColorByAgeTrait,
	ColorByContents,
	DarkThinLines,
	Entity,
	GridCellToRenderingEntity,
	GridEntity,
	GridPattern,
	ProcessBoxAsRect,
	ScaleTransformer,
	DarkFillTrait,
	RectOutlineTrait,
	FilledRectTrait
}
