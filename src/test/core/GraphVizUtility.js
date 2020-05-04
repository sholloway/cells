/**
 * Given a node in a quadtree, map out the set of nodes and
 * relationships to then draw using GraphViz
 * @param {QTNode} node - The current node.
 * @param {*} treeNodes - Hashmap of the tree nodes.
 * @param {*} relationships - Hashmap of the tree relationships.
 */
function buildDag(node, treeNodes, relationships) {
	if (!treeNodes.has(node.id)) {
		let dagNode = {};
		if (node.index != null) {
			dagNode.color = 'green';
			dagNode.label = `${node.toString()}\nCell: ${node.index}`;
		} else {
			dagNode.color = 'blue';
			dagNode.label = `${node.toString()}`;
		}
		treeNodes.set(node.id, dagNode); //of the form: 241 [label="Delete" color=blue]
	}

	if (!relationships.has(node.id)) {
		relationships.set(node.id, []); // of the form: 218->{219 241}
	}

	if (node.subdivided) {
		node.children.forEach((child) => {
			relationships.get(node.id).push(child.id);
			buildDag(child, treeNodes, relationships);
		});
	}
}

/**
 * Generates a dot file for Graphviz.
 * @param {*} treeNodes
 * @param {*} relationships
 */
function createDotFile(treeNodes, relationships) {
	let template = `
	digraph QuadTree{
		graph [
			fontname = "Helvetica",
			fontsize = 10,
			splines = true,
			overlap = true,
			ranksep = 2.5,
			bgcolor = black,
			color=white
		];
		node [shape = note,
			style=filled,
			fontname = "Helvetica",
		];
		edge [color = white];
		${Array.from(relationships.entries())
			.map((entry) => `${entry[0]} ->{ ${entry[1].join(' ')}}`)
			.join('\n\t\t')}
		${Array.from(treeNodes.entries())
			.map(
				(entry) =>
					`${entry[0]} [label="${entry[1].label}" color="${entry[1].color}"]`
			)
			.join('\n\t\t')}
	}
	`;
	return template;
}

const fs = require('fs');
function mkFile(filename, dotFile) {
	fs.writeFile(filename, dotFile, function (err) {
		if (err) {
			return console.log(err);
		}
		console.log(`The file ${filename} was saved!`);
	});
}

module.exports = { buildDag, createDotFile, mkFile };
