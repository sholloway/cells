const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	entry: './lib/index.js',
	output: {
		filename: 'conways-game.js',
		path: path.resolve(__dirname, 'public', 'dist'),
		library: 'Conways',
	},
	plugins: [new CleanWebpackPlugin()],
	// module: {
	// 	rules: [
	// 		{
	// 			test: /\.worker\.js$/,
	// 			exclude: /node_modules/,
	// 			use: { loader: 'worker-loader' }
	// 		}
	// 	]
	// }
};
