const { LitElement, html, css, nothing } = require('lit-element');

const { convertToCell } = require('./../ui/CanvasUtilities.js');
const {Commands, Submenus} = require('./../configs/Submenus.js');

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

		this.menuHeight = 407;
		this.menuWidth = 160;
		this.activeCell = null;
		this._menuPosition = { x: 0, y: 0 };

		this.commands = new Map();
		this.commands.set('runSim', Commands.runSimulation);
		this.commands.set('reset', Commands.reset);
		this.primatives = Submenus.primatives
		this.elementaryCAs = Submenus.elementaryCAs
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
		this.primatives.forEach((menu) => {
			menu.direction = direction;
		});
		this.elementaryCAs.forEach((menu) => {
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
					${Submenus.topLevelOptions.map((c) => this.renderMenuItem(c))}
					<hr />
					${this.primatives.map((sm) => this.renderSubMenu(sm))}
					<hr />
					${this.elementaryCAs.map((sm) => this.renderSubMenu(sm))}
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
