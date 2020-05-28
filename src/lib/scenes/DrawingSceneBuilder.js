const {
	Cell,
	EntityBatch,
	EntityBatchArrayBuffer,
} = require('../entity-system/Entities.js');

const {
	BatchDrawingBoxes,
	BatchDrawingBoxesFromBuffer,
	BatchDrawingCells,
	BatchDrawingCellsFromBuffer,
	FillStyle,
	GridCellToRenderingEntity,
	OutlineStyle,
	RectOutlineTrait,
	ScaleTransformer,
	StrokeStyle,
} = require('../entity-system/Traits');

class DrawingSceneBuilder {
	static original_buildScene(scene, config, objs) {
		if (objs && objs.length > 0) {
			//Draw the cells
			let cellsBatch = new EntityBatch();
			cellsBatch
				.register(new OutlineStyle(2, '#0d47a1'))
				.register(new FillStyle('#263238'))
				.register(new BatchDrawingCells(config.zoom, 10, 'square'))
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

		//Highlight which cell the mouse is over, if any.
		if (config.activeCell) {
			let activeCell = new Cell(config.activeCell.x, config.activeCell.y);
			activeCell
				.register(new GridCellToRenderingEntity())
				.register(new ScaleTransformer(config.zoom))
				.register(new StrokeStyle('#f3fc53')) //yellow
				.register(new RectOutlineTrait());
			scene.push(activeCell);
		}
	}

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

		//Highlight which cell the mouse is over, if any.
		if (config.activeCell) {
			let activeCell = new Cell(config.activeCell.x, config.activeCell.y);
			activeCell
				.register(new GridCellToRenderingEntity())
				.register(new ScaleTransformer(config.zoom))
				.register(new StrokeStyle('#f3fc53')) //yellow
				.register(new RectOutlineTrait());
			scene.push(activeCell);
		}
	}
}
module.exports = DrawingSceneBuilder;
