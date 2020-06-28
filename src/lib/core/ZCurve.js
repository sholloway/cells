//Borrowed from: https://github.com/mikolalysenko/bit-twiddle/blob/master/twiddle.js
function encode(x, y) {
	x &= 0xffff; //Constrain to 16 bits. 0xffff is 65535 which is the number range of 16 bits. 1111111111111111 in binary. Numbers larger than 65535 will roll over.
	x = (x | (x << 8)) & 0x00ff00ff; //Shift to the left by 8. Mask: 111111110000000011111111
	x = (x | (x << 4)) & 0x0f0f0f0f; //Mask: 1111000011110000111100001111
	x = (x | (x << 2)) & 0x33333333; //Mask: 110011001100110011001100110011
	x = (x | (x << 1)) & 0x55555555; //Mask: 1010101010101010101010101010101

	y &= 0xffff;
	y = (y | (y << 8)) & 0x00ff00ff;
	y = (y | (y << 4)) & 0x0f0f0f0f;
	y = (y | (y << 2)) & 0x33333333;
	y = (y | (y << 1)) & 0x55555555;

	return x | (y << 1);
}

function decode(zcode) {
	return [deinterleave(zcode, 0), deinterleave(zcode, 1)];
}

function deinterleave(zcode, component) {
	zcode = (zcode >>> component) & 0x55555555; // 1010101010101010101010101010101
	zcode = (zcode | (zcode >>> 1)) & 0x33333333; // 110011001100110011001100110011
	zcode = (zcode | (zcode >>> 2)) & 0x0f0f0f0f; // 1111000011110000111100001111
	zcode = (zcode | (zcode >>> 4)) & 0x00ff00ff; // 111111110000000011111111
	zcode = (zcode | (zcode >>> 8)) & 0x000ffff; // 1111111111111111
	return (zcode << 16) >> 16;
}

class ZCurve {
	constructor() {
		this.curve = [];
	}

	index(cells) {
		this.curve = cells.map((c) => {
			return {
				zcode: encode(c.row, c.col),
				row: c.row,
				col: c.col,
			};
		});
		//Order the curve by sorting the z-code.
		this.curve.sort((a, b) => a.zcode - b.zcode); 
	}
}

module.exports = { encode, decode, ZCurve };
