const { EntityBatchArrayBuffer } = require('../entity-system/Entities.js');
const {
	BatchDrawingCellsFromBuffer,
	FillStyle,
	OutlineStyle,
} = require('../entity-system/Traits.js');

class LifeSceneBuilder {
	//TODO: Remove stack as a parameter. It is redundant
	static buildScene(scene, config, stack, message) {
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
		}
	}
}

module.exports = LifeSceneBuilder;
