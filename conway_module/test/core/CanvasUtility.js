function drawImageBoarder(ctx, width, height, color) {
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, width, height);
}

let indexedNodes = 0;
function drawTree(node, ctx, depth) {
	// console.log(`${'|\t'.repeat(depth)}| Area: ${node.area} Index: ${node.index}`)
	if (node.index != null) {
		indexedNodes++;
		if (node.children.length != 0) {
			console.log(`Node ${node.id} incorrectly has children.`);
		}
		ctx.strokeStyle = 'green';
		ctx.fillStyle = 'green';
		// ctx.fillRect(node.rect.x, node.rect.y, node.rect.xx - node.rect.x, node.rect.yy - node.rect.y) //x,y, width, height
		ctx.strokeRect(
			node.rect.x,
			node.rect.y,
			node.rect.xx - node.rect.x,
			node.rect.yy - node.rect.y
		); //x,y, width, height
	} else {
		ctx.strokeStyle = 'blue';
		ctx.strokeRect(
			node.rect.x,
			node.rect.y,
			node.rect.xx - node.rect.x,
			node.rect.yy - node.rect.y
		); //x,y, width, height
	}

	// ctx.strokeStyle = (node.index)?'green':'blue'
	if (node.subdivided) {
		node.children().forEach((child) => {
			drawTree(child, ctx, depth + 1);
		});
	}
}

/**
 * Render a cell as a filled in rectangle.
 * @param {Cell[]} listOfCells
 * @param {HTMLCanvasContext} ctx
 * @param {number} width - The constant width of all cells.
 * @param {number} height - The constant height of all cells.
 * @param {string} color - The constant color of all cells.
 */
function drawCells(listOfCells, ctx, width, height, color) {
	ctx.strokeStyle = color;
	listOfCells.forEach((cell) => {
		ctx.strokeRect(cell.location.row, cell.location.col, width, height);
	});
}

const fs = require('fs');
function mkImageFile(filename, canvas, callback) {
	const out = fs.createWriteStream(__dirname + filename);
	const stream = canvas.createPNGStream();
	stream.pipe(out);
	out.on('finish', callback);
}

module.exports = {
	drawImageBoarder,
	drawTree,
	drawCells,
	mkImageFile,
};
