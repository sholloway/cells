const handler = {
	get: function (obj, prop) {
		return prop in obj ? obj[prop] : 'Undefined Command';
	},
};

module.exports = new Proxy(
	{
		LifeCycle: new Proxy(
			{
				START: 'START',
				STOP: 'STOP',
				PAUSE: 'PAUSE',
				PROCESS_CYCLE: 'PROCESS_CYCLE',
			},
			handler
		),
		DrawingSystemCommands: new Proxy(
			{
				SET_CELLS: 'SET_CELLS',
				SET_CELL_SIZE: 'SET_CELL_SIZE',
				SEND_CELLS: 'SEND_CELLS',
				RESET: 'RESET',
				TOGGLE_CELL: 'TOGGLE_CELL',
				DISPLAY_STORAGE: 'DISPLAY_STORAGE',
				DRAW_TEMPLATE: 'DRAW_TEMPLATE',
				DRAW_LINEAR_ELEMENTRY_CA: 'DRAW_LINEAR_ELEMENTRY_CA',
			},
			handler
		),
		LifeSystemCommands: new Proxy(
			{
				DISPLAY_STORAGE: 'DISPLAY_STORAGE',
				RESET: 'RESET',
				SEND_ALIVE_CELLS_COUNT: 'SEND_ALIVE_CELLS_COUNT',
				SEND_CELLS: 'SEND_CELLS',
				SEND_SIMULATION_ITERATIONS_COUNT: 'SEND_SIMULATION_ITERATIONS_COUNT',
				SET_CELL_SIZE: 'SET_CELL_SIZE',
				SET_CONFIG: 'SET_CONFIG',
				SET_SEEDER: 'SET_SEEDER',
			},
			handler
		),
	},
	handler
);
