const { LitElement, html, css, nothing } = require('lit-element');

const ArrowIcons = {
	right: 'arrow_right',
	left: 'arrow_left',
};

class SubMenu extends LitElement {
	constructor() {
		super();
		this.eventBubbles = true;
		this.display = true;
		this.event = 'submenu-item-clicked';
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
			items: { type: Array },
			label: { type: String },
			direction: { type: String }, //left || right
		};
	}

	/**
	 * The CSS styles for the component.
	 * @returns {string}
	 */
	static get styles() {
		return css`
			:host {
			}

			.submenu {
				position: relative;
				padding-left: 20px;
				margin-top: 10px;
				margin-bottom: 10px;
			}

			.submenu:hover {
				background: rgba(0, 0, 0, 0.2);
				cursor: pointer;
			}

			.submenu span {
				font-weight: 500;
				font-size: 14px;
			}

			/* 
      Use the Google Icon: arrow-right for span:after 
      CSS Trick Ref: https://css-tricks.com/ligature-icons/
      */
			[arrow-icon]::after {
				content: attr(arrow-icon);
				font-family: 'Material Icons';
				font-weight: normal;
				font-style: normal;
				font-size: 24px;
				vertical-align: middle;
				width: 1em;
				height: 1em;
				line-height: 1;
				text-transform: none;
				letter-spacing: normal;
				word-wrap: normal;
				white-space: nowrap;
				direction: ltr;
				float: right;

				/* Support for all WebKit browsers. */
				-webkit-font-smoothing: antialiased;

				/* Support for Safari and Chrome. */
				text-rendering: optimizeLegibility;

				/* Support for Firefox. */
				-moz-osx-font-smoothing: grayscale;

				/* Support for IE. */
				font-feature-settings: 'liga';
			}

			[arrow-icon='arrow_left']::after {
				float: left;
			}

			.menu-options {
				list-style: none;
				padding: 10px 0;
				margin: 0;
			}

			/* Happy Path */
			.submenu:hover .menu-options.right {
				display: block;
				width: 160px;
				left: 160px;
				bottom: -20px;
			}

			/* Menu open to the left*/
			.submenu:hover .menu-options.left {
				display: block;
				width: 160px;
				right: 160px;
				bottom: -20px;
			}

			.submenu ul {
				background-color: #edefed;
				box-shadow: 0 4px 5px 3px rgba(0, 0, 0, 0.2);
				position: absolute;
				display: none;
				transition: 0.2s display ease-in;

				border-top-left-radius: 10px;
				border-top-right-radius: 10px;
				border-bottom-right-radius: 10px;
				border-bottom-left-radius: 10px;
			}
		`;
	}

	/**
	 * Life Cycle Method: Draws the component.
	 */
	render() {
		return this.display ? this.template() : nothing;
	}

	template() {
		return html`
			<li
				class="submenu"
				arrow-icon=${ArrowIcons[this.direction]}
				direction=${this.direction}
			>
				<span>${this.label}</span>
				<ul class="menu-options ${this.direction}">
					${this.items.map((i) => this.renderMenuItem(i))}
				</ul>
			</li>
		`;
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

	handleMenuItems(event) {
		event.stopPropagation();
		this.dispatchEvent(
			new CustomEvent(this.event, {
				bubbles: this.eventBubbles,
				composed: this.eventBubbles,
				cancelable: true,
				detail: {
					command: event.detail.command,
				},
			})
		);
	}
}

customElements.define('context-submenu', SubMenu);
