const { LitElement, html, css } = require('lit-element');

class ShapePicker extends LitElement {
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
			select {
				height: 25px;
			}
		`;
	}

	render() {
		return html`
			<label>
				Cell Shape
				<select @change="${this.handleChange}">
					<option value="circle">Circle</option>
					<option value="square">Square</option>
				</select>
			</label>
		`;
	}

	handleChange(event) {
		let selectElement = this.shadowRoot.querySelector('select');
		this.dispatchEvent(
			new CustomEvent(this.event, {
				bubbles: this.eventBubbles,
				composed: this.eventBubbles,
				detail: {
					shape: selectElement.value,
				},
			})
		);
	}
}

customElements.define('shape-picker', ShapePicker);
