const { Cell } = require('./../core/Quadtree.js');
const { Box } = require('../entity-system/Entities.js');
const {
	ColorByContents,
	FilledRectTrait,
	FillStyle,
	GridCellToRenderingEntity,
	ProcessBoxAsRect,
	RectOutlineTrait,
	ScaleTransformer,
	StrokeStyle,
} = require('../entity-system/traits');

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
		scene.push(entities);
	}
}
module.exports = DrawingSceneBuilder;
