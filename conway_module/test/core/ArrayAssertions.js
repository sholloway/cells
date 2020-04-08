const chai = require('chai');
const expect = chai.expect;
class ArrayAssertions {
	static assertEqual2DArrays(expected, actual) {
		expect(actual.length).to.equal(expected.length);
		for (let i = 0; i < actual.length; i++) {
			expect(actual[i].length).to.equal(expected[i].length);
			for (let j = 0; j < actual[i].length; j++) {
				expect(actual[i][j]).to.equal(expected[i][j]);
			}
		}
	}

	static assertEqualArrays(expected, actual) {
		expect(actual.length).to.equal(expected.length);
		for (let index = 0; index < actual.length; index++) {
			expect(actual[index]).to.equal(expected[index]);
		}
	}
}

module.exports = ArrayAssertions;
