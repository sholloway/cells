const Games = require('./Games.js');
let DefaultConfig = {
	canvas: {
		width: 600,
		height: 400,
	},
	cell: {
		shape: 'square',
	},
	game: {
		/*
		tickLength controls the target frames per second.
		1 second = 1000 ms
		A tickLength of 125 is 1000/125 = 8 FPS
		A tickLength of 62 is 1000/62 = 16 FPS
		A tickLength of 41 is 1000/41 = 24 FPS
		*/
		tickLength: 125, // Sets the simulation to run at 20Hz (Every 50ms)
		rules: {
			birth: [3],
			survive: [2, 3],
		},
		activeGame: Games[0], //The CA the user picked to run. The default is the first one.
	},
	landscape: {
		//used by quad tree implementation.
		width: 30,
		height: 20,
		topology: 'finite-plane',
		displayGrid: true,
	},
	zoom: 20, //The projection amount to convert a 1x1 grid cell to something that is viewable on the HTML Canvas.
	elementaryCAs: {
		useRandomStart: false,
	},
};

module.exports = DefaultConfig;
