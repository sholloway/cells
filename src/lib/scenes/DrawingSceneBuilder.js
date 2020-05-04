const { Box, Cell } = require('../entity-system/Entities.js');
const {
	ColorByContents,
	FilledRectTrait,
	FillStyle,
	GridCellToRenderingEntity,
	ProcessBoxAsRect,
	RectOutlineTrait,
	ScaleTransformer,
	StrokeStyle,
} = require('../entity-system/Traits');

class DrawingSceneBuilder {
	static buildScene(scene, config, objs) {
		let entities = objs.map((obj) => {
			let entity;
			if (obj.className === 'Box') {
				entity = Box.buildInstance(obj);
				entity
					.register(new ProcessBoxAsRect())
					.register(new ScaleTransformer(config.zoom))
					.register(new ColorByContents())
					.register(new RectOutlineTrait());
			} else if (obj.className === 'Cell') {
				entity = Cell.buildInstance(obj);
				entity
					.register(new GridCellToRenderingEntity())
					.register(new ScaleTransformer(config.zoom))
					.register(new StrokeStyle('#ffeb3b'))
					.register(new FillStyle('#263238'))
					.register(new FilledRectTrait())
					.register(new RectOutlineTrait());
			} else {
				entity = new Entity();
			}
			return entity;
		});
		//Highlight which cell the mouse is over, if any.
		if (config.activeCell) {
			let activeCell = new Cell(config.activeCell.x, config.activeCell.y);
			activeCell
				.register(new GridCellToRenderingEntity())
				.register(new ScaleTransformer(config.zoom))
				.register(new StrokeStyle('#f3fc53')) //yellow
				.register(new RectOutlineTrait());
			entities.push(activeCell);
		}
		scene.push(entities);
	}
}
module.exports = DrawingSceneBuilder;
