const { LitElement, html, css } = require('lit-element');
const { buttons } = require('./SharedCss.js');
/**
 * A simple button that fires an event when clicked.
 */
class EventButton extends LitElement {
	constructor() {
		super();
		this.eventBubbles = true;
	}

	/**
	 * The properties of the component.
	 * @returns {object}
	 */
	static get properties() {
		return {
			event: { type: String },
			eventBubbles: { type: Boolean },
		};
	}

	/**
	 * The CSS styles for the component.
	 * @returns {string}
	 */
	static get styles() {
		return [buttons, css``];
	}

	/**
	 * Life Cycle Method: Draws the component.
	 */
	render() {
		return html`<button type="button" @click="${this.handleClick}">
			<slot></slot>
		</button>`;
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
			})
		);
	}
}

module.exports = EventButton;

customElements.define('event-button', EventButton);
