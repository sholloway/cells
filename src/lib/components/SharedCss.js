const { css } = require('lit-element');
const buttons = css`
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

	button:focus {
		outline: none;
		border: 2px solid lightblue;
	}
`;

module.exports = {
	buttons,
};
