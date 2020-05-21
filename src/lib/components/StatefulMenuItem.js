const { LitElement, html, css, nothing } = require('lit-element');

class StatefulMenuItem extends LitElement {
	constructor() {
		super();
		this.eventBubbles = true;
		this.display = true;
		this.event = 'menu-item-clicked';
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
			key: { type: String },
			next: { type: String },
			label: { type: String },
			command: { type: String },
		};
	}

	/**
	 * The CSS styles for the component.
	 * @returns {string}
	 */
	static get styles() {
		return css`
			.menu-option {
				font-weight: 500;
				font-size: 14px;
				padding: 10px 40px 10px 20px;
				cursor: pointer;
			}

			.menu-option:hover {
				background: rgba(0, 0, 0, 0.2);
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
		return html` <li class="menu-option" @click=${this.handleClick}>
			${this.label}
		</li>`;
	}

	handleClick(event) {
		this.dispatchEvent(
			new CustomEvent(this.event, {
				bubbles: this.eventBubbles,
				composed: this.eventBubbles,
				cancelable: true,
				detail: {
					command: this.command,
					next: this.next,
					key: this.key,
				},
			})
		);
	}
}

customElements.define('stateful-menu-item', StatefulMenuItem);
