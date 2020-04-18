const { Entity, GridEntity } = require('../entity-system/Entities.js');
const { GridPattern, DarkThinLines } = require('../entity-system/Traits.js');

class GridSceneBuilder {
	static buildScene(scene, config, objs) {
		let entities = objs.map((obj) => {
			let entity;
			if (obj.className === 'GridEntity') {
				entity = GridEntity.buildInstance(obj);
				entity.register(new GridPattern()).register(new DarkThinLines());
			} else {
				entity = new Entity();
			}
			return entity;
		});
		scene.push(entities);
	}
}

module.exports = GridSceneBuilder;
