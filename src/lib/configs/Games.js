/*
Array.includes is slow. 
It would be better to have explicit branching. But can't serialize that.
On strategy would be to define lambda functions here, doen't serialize them,
and look up the function on the worker side.

Steps
1. Make it work with Array.includes.
2. Optimize...

Questions
- Can we transfer a Set rather than arrays?
- Is checking a Set faster than Array.includes for small arrays?
*/
const Any = 'any';

const Games = [
	{
		key: 'conways-game-of-life',
		label: 'Life',
		born: [3],
		survive: [2, 3]
	},
	{
		key: 'brians-brain',
		label: 'Brain',
		born: [2],
		survive: [], //Brain spends just once cycle in the Active state.
		maxAge: 2,
	},
	{
		key: 'caterpillars',
		label: 'Caterpillars',
		born: [3, 7, 8],
		survive: [1, 2, 4, 5, 6, 7],
		maxAge: 4,
	},
	{
		key: 'worms',
		label: 'Worms',
		born: [2, 5],
		survive: [3, 4, 6, 7],
		maxAge: 6,
	},
];

module.exports = Games;
