const { LitElement, html, css } = require('lit-element');

/**
 * A simple checkbox with label that fires an event when clicked.
 */
class EventCheckbox extends LitElement {
	constructor() {
		super();
		this.eventBubbles = true;
		this.checked = false;
	}

	/**
	 * The properties of the component.
	 * @returns {object}
	 */
	static get properties() {
		return {
			checked: { type: Boolean },
			event: { type: String },
			eventBubbles: { type: Boolean },
		};
	}

	/**
	 * The CSS styles for the component.
	 * @returns {string}
	 */
	static get styles() {
		return css`
			:host {
				margin-left: 2px;
				margin-right: 2px;
			}
		`;
	}

	/**
	 * Life Cycle Method: Draws the component.
	 */
	render() {
		return html`
			<label>
				<input
					type="checkbox"
					@click="${this.handleClick}"
					?checked=${this.checked}
				/>
				<slot></slot>
			</label>
		`;
	}

	/**
	 * Event handler for when the button is clicked.
	 * @private
	 */
	handleClick() {
		this.dispatchEvent(
			new CustomEvent(this.event, {
				bubbles: this.eventBubbles,
				composed: this.eventBubbles,
				detail: {
					checked: this.shadowRoot.querySelector('input').checked,
				},
			})
		);
	}
}

customElements.define('event-checkbox', EventCheckbox);
