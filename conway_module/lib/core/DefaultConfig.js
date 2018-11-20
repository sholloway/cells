let DefaultConfig = {
	canvas: {
    width: 600,
    height: 400
  },
  cell:{
    width: 20,
    height: 20
	},
	game:{
		interval: 125, //# of milliseconds to loop on.
		tickLength: 125 // Sets the simulation to run at 20Hz (Every 50ms)
	}
};

module.exports = DefaultConfig;
