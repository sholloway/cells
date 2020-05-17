const { LitElement, html, css } = require('lit-element');

const ButtonStates = {
	IDLE: {
		name: 'IDLE',
		buttonTitle: 'Start',
		nextState: 'RUNNING',
		event: 'sim-event-start-requested',
	},
	RUNNING: {
		name: 'RUNNING',
		buttonTitle: 'Pause',
		nextState: 'PAUSED',
		event: 'sim-event-pause-requested',
	},
	PAUSED: {
		name: 'PAUSED',
		buttonTitle: 'Resume',
		nextState: 'RUNNING',
		event: 'sim-event-resume-requested',
	},
};

/**
 * A multi-state button.
 */
class StartButton extends LitElement {
	constructor() {
		super();
		this.enabled = false;
	}

	/**
	 * The properties of the component.
	 * @returns {object}
	 */
	static get properties() {
		return {
			state: { type: String },
			enabled: { type: Boolean },
		};
	}

	/**
	 * The CSS styles for the component.
	 * @returns {string}
	 */
	static get styles() {
		return css`
			button {
				cursor: pointer;
				height: 25px;
				border-radius: 5px;
				border: 1px;
				border-style: solid;
				border-color: rgb(216, 216, 216);
				margin-left: 2px;
				margin-right: 2px;
			}
		`;
	}

	/**
	 * Life Cycle Method: Draws the component.
	 */
	render() {
		return html`<button
			type="button"
			@click="${this.handleClick}"
			?disabled="${!this.enabled}"
		>
			${ButtonStates[this.state].buttonTitle}
		</button>`;
	}

	/**
	 * Event handler for when the button is clicked.
	 * @private
	 */
	handleClick() {
		this.dispatchEvent(
			new CustomEvent(ButtonStates[this.state].event, {
				bubbles: true,
				composed: true,
			})
		);
		this.state = ButtonStates[this.state].nextState;
	}
}

customElements.define('start-button', StartButton);
