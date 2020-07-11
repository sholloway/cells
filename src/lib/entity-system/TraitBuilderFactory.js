const { GridPattern, ProcessBoxAsRect, Trait } = require('./Traits.js');

class TraitBuilderFactory {
	static select(traitName) {
		let builder;
		switch (traitName) {
			case 'GridPattern':
				builder = (params) => {
					return new GridPattern();
				};
				break;
			case 'ProcessBoxAsRect':
				builder = (params) => {
					return new ProcessBoxAsRect();
				};
				break;
			case 'Trait':
			default:
				builder = (params) => {
					return new Trait();
				};
				break;
		}
		return builder;
	}
}

module.exports = TraitBuilderFactory;
