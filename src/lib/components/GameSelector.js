const { LitElement, html, css } = require('lit-element');
const Games = require('../configs/Games.js');

class GameSelector extends LitElement {
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
				Game
				<select @change="${this.handleChange}">
					${Games.map((game) => this.renderGameOption(game))}
				</select>
			</label>
		`;
	}
	renderGameOption(game) {
		return html`<option value=${game.key}>${game.label}</option>`;
	}

	handleChange(event) {
		let selectElement = this.shadowRoot.querySelector('select');
		let game = Games.find((game) => game.key === selectElement.value);
		this.dispatchEvent(
			new CustomEvent(this.event, {
				bubbles: this.eventBubbles,
				composed: this.eventBubbles,
				detail: {
					game: game,
				},
			})
		);
	}
}

customElements.define('game-selector', GameSelector);
