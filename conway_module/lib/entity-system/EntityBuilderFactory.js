
const { Box, Entity, GridEntity } = require('./entities.js');
class EntityBuilderFactory{
	static select(entityName){
		let builder;
		switch (entityName){
			case 'Box':
				builder = (params, traitBuilderFactory) => { return Box.buildInstance(params, traitBuilderFactory);};
				break;
			case 'GridEntity':
				builder = (params, traitBuilderFactory) => { return GridEntity.buildInstance(params, traitBuilderFactory); };
				break;
			case 'Cell':
				builder = (params) => { return Cell.buildInstance(params); };
			case 'Entity':
			default:
				builder = () => { return new Entity(); };
				break;
		}
		return builder;
	}
}

module.exports = {EntityBuilderFactory};
