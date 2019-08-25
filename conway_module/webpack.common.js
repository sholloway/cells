const path = require('path');

module.exports = {
	entry: './lib/index.js',
	output: {
		filename: 'conways-game.js',
		path: path.resolve(__dirname, 'public','dist'),
		library: 'Conways'
	}
};
