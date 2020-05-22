const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
	entry: './src/lib/index.js',
	output: {
		filename: 'conways-game.js',
		path: path.resolve(__dirname, 'dist'),
		library: 'Conways',
	},
	optimization: {
		minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: './src/html/index.html',
			favicon: 'src/images/favicon.ico',
			inject: false,
			minify: {
				removeComments: true,
				collapseWhitespace: true,
			},
		}),
		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[id].css',
		}),
	],
	module: {
		rules: [
			{ test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
		],
	},
	devServer: {
		contentBase: './dist',
		compress: true,
		port: 8080,
		writeToDisk: true,
	},
};
