const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	entry: './src/lib/index.js',
	output: {
		filename: 'conways-game.js',
		path: path.resolve(__dirname, 'dist'),
		library: 'Conways',
	},
	plugins: [
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({ filename: 'styles.css' }),
		new HtmlWebpackPlugin({
			template: './src/html/index.html',
			favicon: 'src/images/favicon.ico',
			inject: false,
		}),
	],
	module: {
		rules: [
			{ test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },

			// {
			// 	test: /\.worker\.js$/,
			// 	exclude: /node_modules/,
			// 	use: { loader: 'worker-loader' }
			// }
		],
	},
};
