const { LitElement, html, css } = require('lit-element');

class CellSizeControl extends LitElement {
	constructor() {
		super();
		this.eventBubbles = true;
		this.currentCellSize = this.value;
	}

	/**
	 * The properties of the component.
	 * @returns {object}
	 */
	static get properties() {
		return {
			event: { type: String },
			min: { type: Number },
			max: { type: Number },
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
				margin-left: 2px;
				margin-right: 2px;
			}
		`;
	}

	render() {
		return html`
			<label>
				Cell Size
				<input
					type="range"
					min=${this.min}
					max=${this.max}
					value=${this.value}
					step="1"
					@change="${this.handleChange}"
				/>
			</label>
		`;
	}

	handleChange(event) {
		let inputElement = this.shadowRoot.querySelector('input');
		let newValue = inputElement.valueAsNumber;

		//Don't allow transmitting a non-number
		if (Number.isNaN(newValue)) {
			inputElement.value = this.currentCellSize; //use the pervious value.
		} else {
			this.currentCellSize = newValue;
			this.dispatchEvent(
				new CustomEvent(this.event, {
					bubbles: this.eventBubbles,
					composed: this.eventBubbles,
					detail: {
						cellSize: newValue,
					},
				})
			);
		}
	}
}

customElements.define('cell-size-control', CellSizeControl);
