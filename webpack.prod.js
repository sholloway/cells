const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
	mode: 'production',
	output: { filename: '[name].[contenthash].js' },
	optimization: {
		minimize: false, //Disabling because it seems to not be compatable with the worker-plugin.
	},
	devtool: 'source-map', //Not building the source maps causing an issue with the lit-element map not being included.
});
