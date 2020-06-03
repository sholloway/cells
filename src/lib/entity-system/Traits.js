const { CELL_HEIGHT, CELL_WIDTH } = require('./Entities.js');
/**
 * Selects a color based on the provided age.
 * @param {number} age
 * @returns {string} color
 */
function fillStyle(age) {
	if (typeof age !== 'number') {
		throw new Error(
			'The trait ageBasedColor requires a property "age" be set to a number.'
		);
	}

	let color = null;
	switch (true) {
		case age <= 1:
			color = '#e3f2fd';
			break;
		case age == 2:
			color = '#bbdefb';
			break;
		case age == 3:
			color = '#90caf9';
			break;
		case age > 3 && age <= 5:
			color = '#64b5f6';
			break;
		case age > 5 && age <= 8:
			color = '#42a5f5';
			break;
		case age > 8 && age <= 13:
			color = '#2196f3';
			break;
		case age > 13 && age <= 21:
			color = '#1e88e5';
			break;
		case age > 21 && age <= 34:
			color = '#1976d2';
			break;
		case age > 34 && age <= 55:
			color = '#1565c0';
			break;
		case age > 55 && age <= 89:
			color = '#0d47a1';
			break;
		case age > 89 && age <= 144:
			color = '#263238'; //Dark Blue Grey
			break;
		case age > 144 && age <= 233:
			color = '#870000'; //Dark Orange
			break;
		case age > 233 && age <= 377:
			color = '#bf360c';
			break;
		case age > 377:
			color = '#ffeb3b'; //Bright Yellow
			break;
		default:
			throw new Error(`Unexpected Age: ${age}`);
	}
	return color;
}

const TWO_PI = Math.PI * 2;
const DEFAULT_CIRCLE_FILL_STYLE = 'rgb(44, 193, 59)';
const DEFAULT_CIRCLE_STROKE_STYLE = 'rgb(0, 0, 0)';

/**
 * Abstract class. Defines a render-able trait that can be processed.
 */
class Trait {
	/**
	 * Creates a new trait.
	 */
	constructor() {}
	/**
	 * Function that controls what the trait does.
	 * @abstract
	 * @param {object} context - The render context.
	 */
	process(context) {
		throw new Error('Traits must implement a process method.');
	}

	/**
	 * Automatically called by JSON.stringify().
	 * Injects the original class name as a property when serialized
	 * which an be used to rebuild a Scene after communicated from a thread.
	 * @returns Trait
	 */
	toJSON() {
		this.className = this.constructor.name;
		return this;
	}
}

/**
 * Sets the fill and stroke style by the entity's age.
 */
class ColorByAgeTrait extends Trait {
	constructor() {
		super();
	}

	process(context) {
		context.fillStyle = fillStyle(context.entity.age);
		context.strokeStyle = 'rgb(0, 0, 0)';
	}
}

/**
 * Creates a new render-able entity in the rendering context.
 */
class GridCellToRenderingEntity extends Trait {
	constructor() {
		super();
	}

	process(context) {
		context.rendering = context.rendering || {};
		context.rendering.entity = {};

		//Define Upper Left Corner (X,Y)
		context.rendering.entity.x = context.entity.row;
		context.rendering.entity.y = context.entity.col;

		//Define width & height
		context.rendering.entity.width = CELL_WIDTH;
		context.rendering.entity.height = CELL_HEIGHT;
	}
}

/**
 * Scales a rendering entity by a constant scaling factor.
 */
class ScaleTransformer extends Trait {
	/**
	 * Create a new scale transformer.
	 * @param {number} scalingFactor
	 */
	constructor(scalingFactor) {
		super();
		this.scalingFactor = scalingFactor;
	}

	process(context) {
		if (
			typeof context.rendering === 'undefined' ||
			typeof context.rendering.entity === 'undefined'
		) {
			throw new Error(
				'ScaleTransformer attempted to process an entity that did not have context.rendering or context.rendering.entity defined.'
			);
		}
		context.rendering.entity.x *= this.scalingFactor;
		context.rendering.entity.y *= this.scalingFactor;
		context.rendering.entity.width *= this.scalingFactor;
		context.rendering.entity.height *= this.scalingFactor;
	}
}

/**
 * Draws a filled in circle with a stroke.
 */
class CircleTrait extends Trait {
	constructor() {
		super();
	}

	process(context) {
		//find center
		//this.x, this.y, this.width, this.height
		let cx = context.rendering.entity.x + context.rendering.entity.width / 2;
		let cy = context.rendering.entity.y + context.rendering.entity.height / 2;
		let radius = context.rendering.entity.width / 2;

		context.rendererContext.fillStyle =
			context.fillStyle || DEFAULT_CIRCLE_FILL_STYLE;
		context.rendererContext.strokeStyle =
			context.strokeStyle || DEFAULT_CIRCLE_STROKE_STYLE;
		context.rendererContext.beginPath();
		context.rendererContext.arc(cx, cy, radius, 0, TWO_PI, true);
		context.rendererContext.fill();
		context.rendererContext.stroke();
	}
}

/**
 * Creates a new render-able entity.
 */
class ProcessBoxAsRect extends Trait {
	constructor() {
		super();
	}

	process(context) {
		context.rendering = context.rendering || {};
		context.rendering.entity = {};
		context.rendering.entity.x = context.entity.x;
		context.rendering.entity.y = context.entity.y;
		context.rendering.entity.width = context.entity.xx - context.entity.x;
		context.rendering.entity.height = context.entity.yy - context.entity.y;
	}
}

/**
 * Defines the stroke style based on if an entity is alive.
 */
class ColorByContents extends Trait {
	constructor() {
		super();
	}

	process(context) {
		context.lineWidth = 2;
		context.strokeStyle = context.entity.alive ? '#c41c00' : '#0d47a1';
	}
}

/**
 * Defines a dark fill and stroke style.
 */
class DarkFillTrait extends Trait {
	constructor() {
		super();
	}

	process(context) {
		context.fillStyle = '#263238';
		context.strokeStyle = '#263238';
	}
}

/**
 * Stroke style pass through.
 */
class StrokeStyle extends Trait {
	constructor(strokeStyle) {
		super();
		this.strokeStyle = strokeStyle;
	}

	process(context) {
		context.strokeStyle = this.strokeStyle;
	}
}

/**
 * Fill Style pass through.
 */
class FillStyle extends Trait {
	constructor(fillStyle) {
		super();
		this.fillStyle = fillStyle;
	}

	process(context) {
		context.fillStyle = this.fillStyle;
	}
}

/** Draws a rectangle. */
class RectOutlineTrait extends Trait {
	constructor() {
		super();
	}

	process(context) {
		context.rendererContext.strokeStyle =
			context.strokeStyle || DEFAULT_CIRCLE_STROKE_STYLE;
		context.rendererContext.strokeRect(
			context.rendering.entity.x,
			context.rendering.entity.y,
			context.rendering.entity.width,
			context.rendering.entity.height
		);
	}
}

/**
 * Fills a rectangle.
 */
class FilledRectTrait extends Trait {
	constructor() {
		super();
	}

	process(context) {
		context.rendererContext.fillStyle =
			context.fillStyle || DEFAULT_CIRCLE_FILL_STYLE;
		context.rendererContext.fillRect(
			context.rendering.entity.x,
			context.rendering.entity.y,
			context.rendering.entity.width,
			context.rendering.entity.height
		);
	}
}

/**
 * Sets the stroke style to a thin, dark line.
 */
class DarkThinLines extends Trait {
	constructor() {
		super();
	}

	process(context) {
		context.rendererContext.strokeStyle = '#757575';
		context.rendererContext.lineWidth = 0.5;
	}
}

/**
 * Draws a grid.
 */
class GridPattern extends Trait {
	constructor() {
		super();
	}

	process(context) {
		//Draw vertical lines
		context.rendererContext.beginPath();
		for (let x = 0; x < context.entity.width; x += context.entity.cell.width) {
			context.rendererContext.moveTo(x, 0);
			context.rendererContext.lineTo(x, context.entity.height);
		}

		//Draw horizontal lines
		for (
			let y = 0;
			y < context.entity.height;
			y += context.entity.cell.height
		) {
			context.rendererContext.moveTo(0, y);
			context.rendererContext.lineTo(context.entity.width, y);
		}

		//Render all lines at once.
		context.rendererContext.stroke();
	}
}

class BatchDrawingCells extends Trait {
	constructor(scalingFactor, strokeThreashold, shape) {
		super();
		this.scalingFactor = scalingFactor;
		this.strokeThreashold = strokeThreashold;
		this.shape = shape;
	}

	process(context) {
		switch (this.shape) {
			case 'circle':
				this.drawCircles(context);
				break;
			case 'square':
				this.drawSquares(context);
				break;
			default:
				throw new Error('Unsupported shape: ' + this.shape);
		}
	}

	drawSquares(context) {
		let cell;
		context.rendererContext.beginPath();
		for (let index = 0; index < context.entity.entities.length; index++) {
			cell = context.entity.entities[index];
			//scale and add a rect to the path.
			if (cell) {
				context.rendererContext.rect(
					cell.row * this.scalingFactor,
					cell.col * this.scalingFactor,
					CELL_WIDTH * this.scalingFactor,
					CELL_HEIGHT * this.scalingFactor
				);
			}
		}
		context.rendererContext.fill();

		//Drawing strokes takes time. Only do it for when we're zoomed out.
		if (this.scalingFactor > this.strokeThreashold) {
			context.rendererContext.stroke();
		}
	}

	//Note: It's more expensive to draw circles than rectangles.
	drawCircles(context) {
		let radius = this.scalingFactor / 2;
		let cell;
		context.rendererContext.beginPath();
		for (let index = 0; index < context.entity.entities.length; index++) {
			cell = context.entity.entities[index];
			if (cell) {
				let cx = cell.row * this.scalingFactor + radius;
				let cy = cell.col * this.scalingFactor + radius;
				context.rendererContext.moveTo(cx + radius, cy);
				context.rendererContext.arc(cx, cy, radius, 0, TWO_PI, true);
			}
		}
		context.rendererContext.fill();
		if (this.scalingFactor > this.strokeThreashold) {
			context.rendererContext.stroke();
		}
	}
}

class BatchDrawingCellsFromBuffer extends Trait {
	constructor(scalingFactor, strokeThreashold, shape) {
		super();
		this.scalingFactor = scalingFactor;
		this.strokeThreashold = strokeThreashold;
		this.shape = shape;

		//TODO: Refactor
		this.colors = new Map();
		this.colors.set(1, '#263238');
		this.colors.set(2, '#77a1b5');
	}

	process(context) {
		let row, col, state;
		context.rendererContext.beginPath();

		let firstState = context.entity.initialOffset + 2;
		let currentState = context.entity.buffer[firstState];
		context.rendererContext.fillStyle = this.colors.get(currentState);

		for (
			let index = context.entity.initialOffset;
			index < context.entity.bufferEnd;
			index += context.entity.entityFieldsCount
		) {
			row = context.entity.buffer[index];
			col = context.entity.buffer[index + 1];
			state = context.entity.buffer[index + 2];

			if (currentState != state) {
				context.rendererContext.fill(); //Render the existing
				context.rendererContext.beginPath();
				currentState = state;
				context.rendererContext.fillStyle = this.colors.has(currentState)
					? this.colors.get(currentState)
					: '#f52811';
			}

			//scale and add a rect to the path.
			context.rendererContext.rect(
				row * this.scalingFactor,
				col * this.scalingFactor,
				CELL_WIDTH * this.scalingFactor,
				CELL_HEIGHT * this.scalingFactor
			);
		}
		context.rendererContext.fill();

		//Drawing strokes takes time. Only do it for when we're zoomed out and can actually see them.
		// if (this.scalingFactor > this.strokeThreashold) {
		// 	context.rendererContext.stroke();
		// }
	}
}

class BatchDrawingBoxesFromBuffer extends Trait {
	constructor(scalingFactor) {
		super();
		this.scalingFactor = scalingFactor;
	}

	process(context) {
		let x, y, xx, yy;
		context.rendererContext.beginPath();
		for (
			let index = context.entity.initialOffset;
			index < context.entity.bufferEnd;
			index += context.entity.entityFieldsCount
		) {
			x = context.entity.buffer[index] * this.scalingFactor;
			y = context.entity.buffer[index + 1] * this.scalingFactor;
			xx = context.entity.buffer[index + 2] * this.scalingFactor;
			yy = context.entity.buffer[index + 3] * this.scalingFactor;
			context.rendererContext.rect(x, y, xx - x, yy - y);
		}
		context.rendererContext.stroke();
	}
}

class BatchDrawingBoxes extends Trait {
	constructor(scalingFactor) {
		super();
		this.scalingFactor = scalingFactor;
	}

	process(context) {
		context.rendererContext.beginPath();
		let box;
		for (let index = 0; index < context.entity.entities.length; index++) {
			box = context.entity.entities[index];
			context.rendererContext.rect(
				box.x * this.scalingFactor,
				box.y * this.scalingFactor,
				(box.xx - box.x) * this.scalingFactor,
				(box.yy - box.y) * this.scalingFactor
			);
		}
		context.rendererContext.stroke();
	}
}

class OutlineStyle extends Trait {
	constructor(lineWidth, strokeStyle) {
		super();
		this.lineWidth = lineWidth;
		this.strokeStyle = strokeStyle;
	}

	process(context) {
		context.rendererContext.lineWidth = this.lineWidth;
		context.rendererContext.strokeStyle = this.strokeStyle;
	}
}

/**
 * Clears an area of a context defined by x,y, width, height.
 */
class ClearArea extends Trait {
	constructor() {
		super();
	}

	process(context) {
		context.rendererContext.clearRect(
			context.rendering.entity.x,
			context.rendering.entity.y,
			context.rendering.entity.width,
			context.rendering.entity.height
		);
	}
}

module.exports = {
	BatchDrawingBoxes,
	BatchDrawingBoxesFromBuffer,
	BatchDrawingCells,
	BatchDrawingCellsFromBuffer,
	CircleTrait,
	ClearArea,
	ColorByAgeTrait,
	ColorByContents,
	DarkFillTrait,
	DarkThinLines,
	FilledRectTrait,
	FillStyle,
	GridCellToRenderingEntity,
	GridPattern,
	OutlineStyle,
	ProcessBoxAsRect,
	RectOutlineTrait,
	ScaleTransformer,
	StrokeStyle,
	Trait,
};
