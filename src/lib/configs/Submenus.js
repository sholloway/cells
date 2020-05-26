const Submenus = {
	topLevelOptions: [{ command: 'dice-roll', label: 'Dice Roll' }],
	primatives: [
		{
			label: 'Static Objects',
			items: [{ command: 'da-block', label: 'Block' }],
		},
		{
			label: 'Oscillators',
			items: [
				{ command: 'vert-spinner', label: 'V-Spinner' },
				{ command: 'horiz-spinner', label: 'H-Spinner' },
				{ command: 'toad', label: 'Toad' },
			],
		},
		{
			label: 'Ships & Stuff',
			items: [
				{ command: 'glider', label: 'Glider' },
				{ command: 'light-ship', label: 'Light Space Ship' },
				{ command: 'conways-memorial', label: 'The Man' },
			],
		},
	],
	elementaryCAs: [
		{
			label: 'Complex',
			items: [
				{ command: 'wr-rule-73', label: '73' },
				{ command: 'wr-rule-75', label: '75' },
				{ command: 'wr-rule-89', label: '89' },
				{ command: 'wr-rule-101', label: '101' },
				{ command: 'wr-rule-110', label: '110' },
				{ command: 'wr-rule-133', label: '133' },
				{ command: 'wr-rule-169', label: '169' },
				{ command: 'wr-rule-225', label: '225' },
			],
		},
		{
			label: 'Peaks',
			items: [
				{ command: 'wr-rule-54', label: '54' },
				{ command: 'wr-rule-62', label: '62' },
				{ command: 'wr-rule-94', label: '94' },
				{ command: 'wr-rule-118', label: '118' },
				{ command: 'wr-rule-131', label: '131' },
				{ command: 'wr-rule-246', label: '246' },
				{ command: 'wr-rule-250', label: '250' },
				{ command: 'wr-rule-254', label: '254' },
			],
		},
		{
			label: 'Lines',
			items: [
				{ command: 'wr-rule-57', label: '57' },
				{ command: 'wr-rule-63', label: '63' },
				{ command: 'wr-rule-69', label: '69' },
				{ command: 'wr-rule-77', label: '77' },
				{ command: 'wr-rule-78', label: '78' },
				{ command: 'wr-rule-79', label: '79' },
				{ command: 'wr-rule-99', label: '99' },
				{ command: 'wr-rule-105', label: '105' },
				{ command: 'wr-rule-106', label: '106' },
				{ command: 'wr-rule-109', label: '109' },
			],
		},
		{
			label: 'Random',
			items: [
				{ command: 'wr-rule-30', label: '30' },
				{ command: 'wr-rule-45', label: '45' },
				{ command: 'wr-rule-60', label: '60' },
				{ command: 'wr-rule-74', label: '74' },
				{ command: 'wr-rule-76', label: '76' },
				{ command: 'wr-rule-86', label: '86' },
				{ command: 'wr-rule-124', label: '124' },
				{ command: 'wr-rule-135', label: '135' },
				{ command: 'wr-rule-137', label: '137' },
				{ command: 'wr-rule-193', label: '193' },
			],
		},
		{
			label: 'Triangles',
			items: [
				{ command: 'wr-rule-90', label: '90' },
				{ command: 'wr-rule-102', label: '102' },
				{ command: 'wr-rule-129', label: '129' },
				{ command: 'wr-rule-151', label: '151' },
				{ command: 'wr-rule-153', label: '153' },
				{ command: 'wr-rule-181', label: '181' },
				{ command: 'wr-rule-182', label: '182' },
				{ command: 'wr-rule-183', label: '183' },
				{ command: 'wr-rule-195', label: '195' },
			],
		},
	],
};

const Commands = {
	runSimulation: {
		key: 'runSim',
		activeState: 'start',
		states: {
			start: { label: 'Start', next: 'pause', command: 'start-sim' },
			pause: { label: 'Pause', next: 'resume', command: 'pause-sim' },
			resume: { label: 'Resume', next: 'pause', command: 'resume-sim' },
		},
	},
	reset: {
		key: 'reset',
		activeState: 'reset',
		states: { reset: { label: 'Reset', next: 'reset', command: 'reset' } },
	},
};
module.exports = { Submenus, Commands };
