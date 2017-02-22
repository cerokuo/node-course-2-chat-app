const expect = require('expect');

//import isRealstring
const {isRealString} = require('./validation');


describe('isRealString', () =>{
	//should reject non-string values
	it('should reject non-string values', () =>{
		var isString = isRealString(23);
		expect(isString).toBe(false);
	});

	it('should reject strings with only spaces', () =>{
		var isString = isRealString('     ');
		expect(isString).toBe(false);
	});

	it('should allow string with non-space characters', () =>{
		var isString = isRealString('   example test text   ');
		expect(isString).toBe(true);

	});

});

