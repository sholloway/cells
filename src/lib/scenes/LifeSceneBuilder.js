const {
	Box,
	Cell,
	EntityBatch,
	EntityBatchArrayBuffer,
} = require('../entity-system/Entities.js');
const {
	BatchDrawingBoxes,
	BatchDrawingBoxesFromBuffer,
	BatchDrawingCells,
	BatchDrawingCellsFromBuffer,
	CircleTrait,
	ColorByAgeTrait,
	ColorByContents,
	FillStyle,
	GridCellToRenderingEntity,
	OutlineStyle,
	ProcessBoxAsRect,
	RectOutlineTrait,
	ScaleTransformer,
} = require('../entity-system/Traits.js');

class LifeSceneBuilder {
	static buildScene_original(scene, config, objs) {
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

	static buildScene_optimizedEntity(scene, config, objs) {
		if (objs && objs.length > 0) {
			//Draw the cells
			let cellsBatch = new EntityBatch();
			cellsBatch
				.register(new OutlineStyle(2, '#0d47a1'))
				.register(new FillStyle('#263238'))
				.register(new BatchDrawingCells(config.zoom, 10, config.cell.shape))
				.add(objs.filter((o) => o.className === 'Cell'));
			scene.push(cellsBatch);

			//Draw the spatial structure if present.
			let boxesBatch = new EntityBatch();
			boxesBatch
				.register(new OutlineStyle(2, '#0d47a1'))
				.register(new BatchDrawingBoxes(config.zoom))
				.add(objs.filter((o) => o.className === 'Box'));
			scene.push(boxesBatch);
		}
	}

	static buildScene(scene, config, stack, message) {
		//TODO: Remove stack as a parameter. It is redundant
		if (stack && ArrayBuffer.isView(stack)) {
			let cellBatch = new EntityBatchArrayBuffer(
				stack,
				0,
				message.numberOfCells,
				message.cellFieldsCount
			);
			cellBatch
				.register(new OutlineStyle(2, '#0d47a1'))
				.register(new FillStyle('#263238'))
				.register(
					new BatchDrawingCellsFromBuffer(config.zoom, 10, config.cell.shape)
				);
			scene.push(cellBatch);

			if (message.numberOfStorageBoxes > 0) {
				let boxBatch = new EntityBatchArrayBuffer(
					stack,
					cellBatch.bufferEnd, 
					message.numberOfStorageBoxes,
					message.boxFieldCount
				);
				boxBatch
					.register(new OutlineStyle(2, '#0d47a1'))
					.register(new BatchDrawingBoxesFromBuffer(config.zoom));
				scene.push(boxBatch);
			}
		}
	}
}

module.exports = LifeSceneBuilder;
