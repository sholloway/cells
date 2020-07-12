const { LitElement, html, css } = require('lit-element');
const FPS = require('../configs/SupportedFrameRates.js');

class SpeedSelector extends LitElement {
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
			select:focus {
				outline: none !important;
				border: 2px solid #039be5;
			}
		`;
	}

	render() {
		return html`
			<label>
				Speed
				<select @change="${this.handleChange}">
					${FPS.map((fps) => this.renderOption(fps))}
				</select>
			</label>
		`;
	}
	renderOption(fps) {
		return html`<option value=${fps.key}>${fps.label}</option>`;
	}

	handleChange(event) {
		let selectElement = this.shadowRoot.querySelector('select');
		let fps = FPS.find((fps) => fps.key === selectElement.value);
		this.dispatchEvent(
			new CustomEvent(this.event, {
				bubbles: this.eventBubbles,
				composed: this.eventBubbles,
				detail: {
					fps: fps,
				},
			})
		);
	}
}

customElements.define('speed-selector', SpeedSelector);
