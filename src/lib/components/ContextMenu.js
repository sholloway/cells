const { LitElement, html, css, nothing } = require('lit-element');

const { convertToCell } = require('./../ui/CanvasUtilities.js');

const MenuStates = {
	SHOW: 'SHOW',
	HIDE: 'HIDE',
};

class ContextMenu extends LitElement {
	constructor() {
		super();
		this.eventBubbles = true;
		this.display = false;
		this.state = MenuStates.HIDE;

		this.menuHeight = 316;
		this.menuWidth = 160;
		this.activeCell = null;
		this._menuPosition = { x: 0, y: 0 };

		this.commands = new Map();
		this.commands.set('runSim', {
			key: 'runSim',
			activeState: 'start',
			states: {
				start: { label: 'Start', next: 'pause', command: 'start-sim' },
				pause: { label: 'Pause', next: 'resume', command: 'pause-sim' },
				resume: { label: 'Resume', next: 'pause', command: 'resume-sim' },
			},
		});

		this.commands.set('reset', {
			key: 'reset',
			activeState: 'reset',
			states: { reset: { label: 'Reset', next: 'reset', command: 'reset' } },
		});

		this.topLevelOptions = [
			{ command: 'conways-memorial', label: 'The Man' },
			{ command: 'dice-roll', label: 'Dice Roll' },
		];

		this.submenus = [
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
				label: 'Ships',
				items: [
					{ command: 'glider', label: 'Glider' },
					{ command: 'light-ship', label: 'Light Space Ship' },
				],
			},
			// {
			// 	label: 'Wolfram',
			// 	items: [
			// 		{ command: 'wr-rule-30', label: 'wr-rule-30' },
			// 		{ command: 'wr-rule-90', label: 'wr-rule-90' },
			// 		{ command: 'wr-rule-110', label: 'wr-rule-110' },
			// 		{ command: 'wr-rule-250', label: 'wr-rule-250' },
			// 	],
			// },
			{
				label: 'Uniform',
				items: [{ command: 'wr-rule-232', label: '232' }],
			},
			{
				label: 'Repitition',
				items: [
					{ command: 'wr-rule-45', label: '45' },
					{ command: 'wr-rule-54', label: '54' },
					{ command: 'wr-rule-57', label: '57' },
					{ command: 'wr-rule-62', label: '62' },
					{ command: 'wr-rule-63', label: '63' },
					{ command: 'wr-rule-69', label: '69' },
					{ command: 'wr-rule-77', label: '77' },
					{ command: 'wr-rule-78', label: '78' },
					{ command: 'wr-rule-79', label: '79' },
					{ command: 'wr-rule-90', label: '90' },
					{ command: 'wr-rule-94', label: '94' },
					{ command: 'wr-rule-99', label: '99' },
					{ command: 'wr-rule-102', label: '102' },
					{ command: 'wr-rule-105', label: '105' },
					{ command: 'wr-rule-109', label: '109' },
					{ command: 'wr-rule-118', label: '118' },
					{ command: 'wr-rule-129', label: '129' },
					{ command: 'wr-rule-131', label: '131' },
					{ command: 'wr-rule-137', label: '137' },
					{ command: 'wr-rule-151', label: '151' },
					{ command: 'wr-rule-153', label: '153' },
					{ command: 'wr-rule-181', label: '181' },
					{ command: 'wr-rule-182', label: '182' },
					{ command: 'wr-rule-183', label: '183' },
					{ command: 'wr-rule-191', label: '191' },
					{ command: 'wr-rule-193', label: '193' },
					{ command: 'wr-rule-195', label: '195' },
					{ command: 'wr-rule-246', label: '246' },
					{ command: 'wr-rule-250', label: '250' },
					{ command: 'wr-rule-254', label: '254' },
				],
			},
			{
				label: 'Random',
				items: [
					{ command: 'wr-rule-30', label: '30' },
					{ command: 'wr-rule-60', label: '60' },

					{ command: 'wr-rule-74', label: '74' },
					{ command: 'wr-rule-76', label: '76' },
					
					{ command: 'wr-rule-86', label: '86' },
					{ command: 'wr-rule-124', label: '124' },
					{ command: 'wr-rule-135', label: '135' },
				],
			},
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
		];
	}

	/**
	 * The properties of the component.
	 * @returns {object}
	 */
	static get properties() {
		return {
			event: { type: String },
			eventBubbles: { type: Boolean },
			display: { type: Boolean },
			state: { type: String },
			menuPosition: { type: Object },
			updateCommandState: { type: Object },
		};
	}

	set updateCommandState(cmdToChangeStr) {
		let cmdToChange = JSON.parse(cmdToChangeStr);
		this.commands.get(cmdToChange.key).activeState = cmdToChange.activeState;
	}

	get menuPosition() {
		return this._menuPosition;
	}

	set menuPosition(input) {
		const oldValue = this._menuPosition;

		this.activeCell = convertToCell(
			input.clickEvent,
			input.boundary,
			input.zoom
		);

		let situation = this.findMenuScenario(input.clickEvent, input.boundary);
		this._menuPosition = this.findMenuLocation(
			input.clickEvent,
			input.boundary,
			situation
		);

		this.positionSubMenus(situation);

		this.requestUpdate('menuPostion', oldValue);
	}

	findMenuScenario(clickEvent, boundary) {
		let distFromBottom = boundary.bottom - clickEvent.clientY;
		let distFromRight = boundary.right - clickEvent.clientX;
		let tooCloseToRight = distFromRight < this.menuWidth;
		let willSubMenuFit = distFromRight > this.menuWidth * 2;
		return {
			distFromBottom: distFromBottom,
			tooCloseToRight: tooCloseToRight,
			willSubMenuFit: willSubMenuFit,
		};
	}

	//The menu should only be displayed inside of the canvas
	findMenuLocation(clickEvent, boundary, situation) {
		//Make sure there is room from the bottom.
		let py =
			situation.distFromBottom >= this.menuHeight
				? clickEvent.clientY
				: boundary.bottom - this.menuHeight;

		//Make sure there is room from the right boundary.
		let px;
		if (situation.tooCloseToRight) {
			px = boundary.right - this.menuWidth; //Align the menu to the right boundary.
		} else {
			px = clickEvent.clientX;
		}
		return { x: px, y: py };
	}

	positionSubMenus(situation) {
		let direction = situation.willSubMenuFit ? 'right' : 'left';
		this.submenus.forEach((menu) => {
			menu.direction = direction;
		});
	}

	/**
	 * The CSS styles for the component.
	 * @returns {string}
	 */
	static get styles() {
		return css`
			.context-menu {
				width: 160px;
				border-radius: 10px;
				background-color: #edefed;
				box-shadow: 0 4px 5px 3px rgba(0, 0, 0, 0.2);
				position: fixed;
				z-index: 4;
				display: block;
				transition: 0.2s display ease-in;
			}

			.context-menu hr {
				border: 0;
				background: #dddddd;
				height: 1px;
			}

			.menu-options {
				list-style: none;
				padding: 10px 0;
				margin: 0;
			}
		`;
	}

	/**
	 * Life Cycle Method: Draws the component.
	 */
	render() {
		return this.display ? this.menuTemplate() : nothing;
	}

	menuTemplate() {
		return html`
			<div
				class="context-menu"
				style="left: ${this._menuPosition.x}px; top: ${this._menuPosition.y}px;"
			>
				<ul class="menu-options">
					${Array.from(this.commands.values()).map((c) =>
						this.renderStatefulMenuItem(c)
					)}
					<hr />
					${this.topLevelOptions.map((c) => this.renderMenuItem(c))}
					<hr />
					${this.submenus.map((sm) => this.renderSubMenu(sm))}
				</ul>
			</div>
		`;
	}

	renderStatefulMenuItem(item) {
		return html`<stateful-menu-item
			key=${item.key}
			activeState=${item.activeState}
			next=${item.states[item.activeState].next}
			label=${item.states[item.activeState].label}
			command=${item.states[item.activeState].command}
			@menu-item-clicked="${this.handleCommandClicked}"
		></stateful-menu-item>`;
	}

	renderMenuItem(item) {
		return html`
			<menu-item
				command="${item.command}"
				label="${item.label}"
				@menu-item-clicked="${this.handleMenuItems}"
			></menu-item>
		`;
	}

	renderSubMenu(submenu) {
		return html`
			<context-submenu
				label=${submenu.label}
				items=${JSON.stringify(submenu.items)}
				direction=${submenu.direction}
				@submenu-item-clicked=${this.handleMenuItems}
			></context-submenu>
		`;
	}

	handleMenuItems(event) {
		event.stopPropagation();
		this.dispatchEvent(
			new CustomEvent(this.event, {
				bubbles: this.eventBubbles,
				composed: this.eventBubbles,
				cancelable: true,
				detail: {
					row: this.activeCell.x,
					col: this.activeCell.y,
					command: event.detail.command,
				},
			})
		);
		this.display = false;
	}

	handleCommandClicked(event) {
		event.stopPropagation();
		this.dispatchEvent(
			new CustomEvent(this.event, {
				bubbles: this.eventBubbles,
				composed: this.eventBubbles,
				cancelable: true,
				detail: {
					row: this.activeCell.x,
					col: this.activeCell.y,
					command: event.detail.command,
					simCommand: true,
				},
			})
		);
		this.commands.get(event.detail.key).activeState = event.detail.next;
		this.display = false;
	}
}

customElements.define('context-menu', ContextMenu);
