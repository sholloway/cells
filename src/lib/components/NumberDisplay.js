const { LitElement, html, css } = require('lit-element');

/**
 * A simple checkbox with label that fires an event when clicked.
 */
class NumberDisplay extends LitElement {
	constructor() {
		super();
		this.value = '0';
	}

	/**
	 * The properties of the component.
	 * @returns {object}
	 */
	static get properties() {
		return {
			label: { type: String },
			value: { type: Number },
		};
	}

	/**
	 * The CSS styles for the component.
	 * @returns {string}
	 */
	static get styles() {
		return css`
			:host {
				margin-left: 4px;
				margin-right: 4px;
			}

			.display-value {
				color: #039be5;
			}
		`;
	}

	/**
	 * Life Cycle Method: Draws the component.
	 */
	render() {
		return html`
			<span>
				<span class="display-label">${this.label}</span>:
				<span class="display-value">${this.value}</span>
			</span>
		`;
	}
}

customElements.define('number-display', NumberDisplay);
