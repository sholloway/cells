const {
	Cell,
	EntityBatch,
	EntityBatchArrayBuffer,
} = require('../entity-system/Entities.js');

const {
	BatchDrawingBoxes,
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
