const { Box, Cell, EntityBatch } = require('../entity-system/Entities.js');
const {
	BatchDrawingBoxes,
	BatchDrawingCells,
	ColorByContents,
	FilledRectTrait,
	FillStyle,
	GridCellToRenderingEntity,
	OutlineStyle,
	ProcessBoxAsRect,
	RectOutlineTrait,
	ScaleTransformer,
	StrokeStyle,
} = require('../entity-system/Traits');

class DrawingSceneBuilder {
	static buildScene(scene, config, objs) {
		if (objs && objs.length > 0) {
			//Draw the cells
			let cellsBatch = new EntityBatch();
			cellsBatch
				.register(new OutlineStyle(2, '#0d47a1'))
				.register(new FillStyle('#263238'))
				.register(new BatchDrawingCells(config.zoom))
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
}
module.exports = DrawingSceneBuilder;
