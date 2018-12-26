/*
TODO:
I want to separate the concept of the HTML canvas size and the grid landscape.
The landscape should be huge. The canvas should pan across the landscape.
Rather than a cell width/height should have projection amount to scale by. Like a zoom %.
*/
let DefaultConfig = {
	canvas: {
    width: 600,
    height: 400
  },
  cell:{ //TODO: Remove this.
    width: 20,
    height: 20
	},
	game:{
		interval: 125, //# of milliseconds to loop on.
		tickLength: 125 // Sets the simulation to run at 20Hz (Every 50ms)
	},
	//New stuff below.
	landscape:{ //used by quad tree implementation.
		width: 100,
		height: 100
	},
	zoom: 20 //The projection amount to convert a 1x1 grid cell to something that is viewable on the HTML Canvas.
};

module.exports = DefaultConfig;
