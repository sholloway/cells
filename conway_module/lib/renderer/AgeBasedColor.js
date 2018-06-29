/* Given an object, with an integer property 'age' return a color indicating how old it is*/
module.exports = (superclass) => class extends superclass{
	fillStyle(){
		if (this.age == undefined || this.age == null){
			throw new Error('The mixin ageBasedColor requires a property "age" be set to a number.')
		}

		let color = null;
		switch (true){
			case this.age <= 1:
				color = 'rgb(141, 203, 239)' //light blue
				break;
			case this.age > 1 && this.age <= 5:
			color = 'rgb(76, 179, 239)' //darker blue
				break;
			case this.age > 5 && this.age <= 10:
				color = 'rgb(237, 61, 61)' //red
				break;
			case this.age > 10:
				color = 'rgb(3, 153, 18)' //green
				break;
			default:
				throw new Error(`Unexpected Age: ${this.age}`)
		}
		return color
	}
}
