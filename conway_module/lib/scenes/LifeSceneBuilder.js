const { Cell } = require('./../core/Quadtree.js');
const { Box } = require('./../entity-system/entities.js');
const {
	CircleTrait,
	ColorByAgeTrait,
	ColorByContents,
	GridCellToRenderingEntity,
	ProcessBoxAsRect,
	RectOutlineTrait,
	ScaleTransformer,
} = require('./../entity-system/traits.js');

class LifeSceneBuilder {
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
					.register(new ColorByAgeTrait())
					.register(new CircleTrait());
			} else {
				entity = new Entity();
			}
			return entity;
		});
		scene.push(entities);
	}
}

module.exports = LifeSceneBuilder;
