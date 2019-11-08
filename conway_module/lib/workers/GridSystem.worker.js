/**
 * A web worker dedicated to constructing a 2D grid. Rendered by the main frame.
 */

/**
 * Processes a message sent by the main thread.
 *
 * Message Types
 * {command: 'CREATE_GRID', parameters: { cellWidth: Integer, cellHeight: Integer, gridWidth: Integer, gridHeight: Integer}}
 * {command: 'CLEAR_GRID', parameters: { gridWidth: Integer, gridHeight: Integer}}
 */
onmessage = function(event) {
	let msg = event.data;
	if (!msg.command){
		console.error('Unexpected messaged received in GridSystemWorker.');
		console.error(event);
		return;
	}

	let scene;
	switch (msg.command){
		case 'CREATE_GRID':
			//TODO: Add error handling around parameters
			scene = GridBuilder.buildGrid(
				msg.parameters.cellWidth, msg.parameters.cellHeight,
				msg.parameters.gridWidth, msg.parameters.gridHeight);
			break;
		case 'CLEAR_GRID':
			scene = GridBuilder.buildClearedArea(msg.parameters.gridWidth, msg.parameters.gridHeight);
			break;
		default:
			console.error('Unsupported command received in GridSystemWorker.');
			console.error(msg.command);
			scene = GridBuilder.buildEmptyScene();
			break;
	}
	postMessage(JSON.stringify(scene));
}

const SceneManager = require('../core/SceneManager.js');
const {Box, ProcessBoxAsRect, GridPattern, GridEntity} = require('../core/EntitySystem.js');
class GridBuilder{
	/**
	 * Constructs a scene containing a 2D grid.
	 * @param {number} cellWidth
	 * @param {number} cellHeight
	 * @param {number} gridWidth
	 * @param {number} gridHeight
	 * @returns SceneManager
	 */
	static buildGrid(cellWidth, cellHeight, gridWidth, gridHeight){
		let scene = new SceneManager();
		let grid = new GridEntity(gridWidth, gridHeight, cellWidth, cellHeight);
		grid.register(new GridPattern());
		return scene.push(grid);
	}

	/**
	 * Constructs a scene that will simply clear the area.
	 * @param {number} gridWidth
	 * @param {number} gridHeight
	 */
	static buildClearedArea(gridWidth, gridHeight){
		let scene = new SceneManager();
		let area = new Box(0, 0, gridWidth, gridHeight, false);
		area.register(new ProcessBoxAsRect())
			.register(new ClearArea());
		return scene.push(area);
	}

	/**
	 * Creates an empty scene to support the Null object pattern.
	 */
	static buildEmptyScene(){
		return new SceneManager();
	}
}
