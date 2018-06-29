const Builder = require('systemjs-builder');

let builder = new Builder('./lib')

if(process.argv.length != 3){
	console.log(`Somethings wrong. Expected an environment to be specified. Aborting.`)
	process.exit(0)
}

switch (process.argv[2]){
	case 'dev':
		buildDev()
		break
	case 'prod':
		buildProd()
		break
	default:
		console.log('Unknown environment specified. Valid options are: dev, prod')
}

function buildDev(){
	builder.buildStatic('./lib/conways_game.js', 'dist/conways-game.js', {
		globalName: 'Conways'
	});
}

/*
BUG: The minification step is throwing an error.
*/
function buildProd(){
	builder.buildStatic('./lib/conways_game.js', 'dist/conways-game-min.js', {
		minify: true,
		sourceMaps: true
	});
}
