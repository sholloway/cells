
let DefaultConfig = {
	canvas: {
		width: 600,
		height: 400,
	},
	game: {
		interval: 125, //# of milliseconds to loop on.
		tickLength: 125, // Sets the simulation to run at 20Hz (Every 50ms)
	},
	landscape: {
		//used by quad tree implementation.
		width: 30,
		height: 20,
		topology: 'finite-plane',
	},
	zoom: 20, //The projection amount to convert a 1x1 grid cell to something that is viewable on the HTML Canvas.
};

module.exports = DefaultConfig;
