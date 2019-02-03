/**
 * A module for defining render-able entities with traits.
 * @module entity_system
 */

/**
 * Abstract class. Defines a render-able trait that can be processed.
 */
class Trait{
	/**
	 * Creates a new trait.
	 */
	constructor(){}
	/**
	 * Function that controls what the trait does.
	 * @abstract
	 * @param {object} context - The render context.
	 */
	process(context){
		throw new Error('Traits must implement a process method.')
	}
}

/**
 * A render-able entity. The entity is defined by registering traits.
 */
class Entity{
	/**
	 * Create a new Entity.
	 */
	constructor(){
		this.traits = []
	}

	/**
	 * Process all register traits.
	 * @param {HTMLCanvasContext} rendererContext
	 */
	render(rendererContext){
		let context = {
			rendererContext: rendererContext,
			entity: this
		}
		this.traits.forEach((trait) =>{
			trait.process(context)
		})
	}

	/**
	 * Expands the definition of the entity by registering traits.
	 * @param {Trait} trait - An implementation of the Trait abstract class.
	 */
	register(trait){
		this.traits.push(trait)
		return this
	}
}

/**
 * Selects a color based on the provided age.
 * @param {number} age
 * @returns {string} color
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

/**
 * Sets the fill and stroke style by the entity's age.
 */
class ColorByAgeTrait extends Trait{
	constructor(){
		super()
	}

	process(context){
		context.fillStyle = fillStyle(context.entity.age)
		context.strokeStyle = 'rgb(0, 0, 0)'
	}
}

/**
 * Creates a new render-able entity in the rendering context.
 */
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

/**
 * Scales a rendering entity by a constant scaling factor.
 */
class ScaleTransformer extends Trait{
	/**
	 * Create a new scale transformer.
	 * @param {number} scalingFactor
	 */
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

/**
 * Draws a filled in circle with a stroke.
 */
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

/**
 * Creates a new render-able entity.
 */
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

/**
 * Defines the stroke style based on if an entity is alive.
 */
class ColorByContents extends Trait{
	constructor(){
		super()
	}

	process(context){
		context.lineWidth = 2
		context.strokeStyle = (context.entity.alive)? '#c41c00': '#0d47a1'
	}
}

/**
 * Defines a dark fill and stroke style.
 */
class DarkFillTrait extends Trait{
	constructor(){
		super()
	}

	process(context){
		context.fillStyle = '#263238'
		context.strokeStyle = '#263238'
	}
}

/**
 * Stroke style pass through.
 */
class StrokeStyle extends Trait{
	constructor(strokeStyle){
		super()
		this.strokeStyle = strokeStyle
	}

	process(context){
		context.strokeStyle = this.strokeStyle
	}
}

/**
 * Fill Style pass through.
 */
class FillStyle extends Trait{
	constructor(fillStyle){
		super()
		this.fillStyle = fillStyle
	}

	process(context){
		context.fillStyle = this.fillStyle
	}
}

/** Draws a rectangle. */
class RectOutlineTrait extends Trait{
	constructor(){
		super()
	}

	process(context){
		context.rendererContext.strokeStyle = context.strokeStyle || DEFAULT_CIRCLE_STROKE_STYLE
		context.rendererContext.strokeRect(context.rendering.entity.x, context.rendering.entity.y, context.rendering.entity.width, context.rendering.entity.height)
	}
}

/**
 * Fills a rectangle.
 */
class FilledRectTrait extends Trait{
	constructor(){
		super()
	}

	process(context){
		context.rendererContext.fillStyle = context.fillStyle || DEFAULT_CIRCLE_FILL_STYLE
		context.rendererContext.fillRect(context.rendering.entity.x, context.rendering.entity.y, context.rendering.entity.width, context.rendering.entity.height)
	}
}

/**
 * Sets the stroke style to a thin, dark line.
 */
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

/**
 * Draws a grid.
 */
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

/**
 * A grid.
 */
class GridEntity extends Entity{
	/**
	 * Creates a new grid entity
	 * @param {number} width - The total width of the grid.
	 * @param {number} height - The total height of the grid.
	 * @param {number} cWidth - The width of a grid cell.
	 * @param {number} cHeight - The height of a grid cell.
	 */
	constructor(width, height, cWidth, cHeight){
		super()
		this.width = width
		this.height = height
		this.cell = { width: cWidth, height: cHeight}
	}
}

/**
 * Represents a box that can be processed via Traits.
 */
class Box extends Entity{
	/**
	 * Creates a new Box.
	 * @param {number} x - Left most X coordinate.
	 * @param {number} y - Upper most Y coordinate.
	 * @param {number} xx - Right most X coordinate.
	 * @param {number} yy - Lower most Y coordinate.
	 * @param {boolean} alive - If the cell is alive or not.
	 */
	constructor(x,y,xx,yy, alive){
		super()
		this.x = x
		this.y = y
		this.xx = xx
		this.yy = yy
		this.alive = alive
	}
}

module.exports = {
	Box,
	CircleTrait,
	ColorByAgeTrait,
	ColorByContents,
	DarkFillTrait,
	DarkThinLines,
	Entity,
	FilledRectTrait,
	FillStyle,
	GridCellToRenderingEntity,
	GridEntity,
	GridPattern,
	ProcessBoxAsRect,
	RectOutlineTrait,
	ScaleTransformer,
	StrokeStyle,
	Trait
}
