'use strict';

/* jasmine specs for filters go here */

//describe('filter', function(uimConstants) {
describe('filter', function() {

	var filter;
	
	beforeEach(module('uimApp'));
	beforeEach(module('uimFilters'));

	// init variables
	
	beforeEach(inject(function ($filter) {
		filter = $filter;
	}));	
	
	
	describe('Pagination Range', function() {
		
		var index = 1;
		
	    it(index + '. should convert input parameters to an array', function() {

	    	var rangeFilterRes = filter('range')( [1, 7], 1);
	    	expect(rangeFilterRes instanceof Array).toBe(true);
	    	
	    });

	    index ++;
	    
	    it(index + '. it should accept an array with only 1 entry', function() {

	    	var rangeFilterRes = filter('range')( [1], 1);
	    	expect(rangeFilterRes instanceof Array).toBe(true);
	    	
	    });

	    index ++;
	    
	    it(index + '. it should accept an array with 2 entries', function() {

	    	var rangeFilterRes = filter('range')( [1], 1);
	    	expect(rangeFilterRes instanceof Array).toBe(true);
	    	
	    });

	    index ++;
	    
	    it(index + '. it should reject empty arrays', function() {

	    	var rangeFilterRes = filter('range')( [], 1);
	    	expect(rangeFilterRes).toBe(null);
	    	
	    });

	    index ++;
	    
	    it(index + '. it should reject arrays with more than 2 entries', function() {

	    	var rangeFilterRes = filter('range')( [1,2,3], 1);
	    	expect(rangeFilterRes).toBe(null);
	    	
	    });

	    index ++;
	    
	    it(index + '. the pagination range should not exceed the defined constant maximum', function() {
	    	
	    	var expectedButtonCount = 6;
	    	var rangeFilterRes = filter('range')( [1, 1000], 1, expectedButtonCount);
	
	    	console.log('high / low = ' + 1 + ' / ' + 1000);
	    	console.log('result = ' + JSON.stringify(rangeFilterRes));
	    	
	    	expect(rangeFilterRes.length).toBe(expectedButtonCount);
    	});

	    index ++;

	    // specific results testing - 7 pages

	    it(index + '. Test 7 pages, 6 buttons, current of 4', function() {

	    	var rangeFilterRes = filter('range')( [1, 7], 4, 6);
	    	
	    	console.log( JSON.stringify(rangeFilterRes) );

	    	var expected = [1, null, 4, 5, 6, 7];
	    	
	    	expect(JSON.stringify(rangeFilterRes)).toBe(JSON.stringify(expected));
	    	
	    });

	    index ++;

	    it(index + '. Test 7 pages, 6 buttons, current of 3', function() {

	    	var rangeFilterRes = filter('range')( [1, 7], 3, 6);
	    	
	    	console.log( JSON.stringify(rangeFilterRes) );

	    	var expected = [1, 2, 3, 4, null, 7];
	    	
	    	expect(JSON.stringify(rangeFilterRes)).toBe(JSON.stringify(expected));
	    	
	    });

	    index ++;

	    // specific results testing - 12 pages

	    it(index + '. Test 12 pages, 8 buttons, current of 1', function() {

	    	var rangeFilterRes = filter('range')( [1, 12], 1, 8);
	    	
	    	console.log( JSON.stringify(rangeFilterRes) );

	    	var expected = [1, 2, 3, 4, 5, 6, null, 12];
	    	
	    	expect(JSON.stringify(rangeFilterRes)).toBe(JSON.stringify(expected));
	    	
	    });

	    index ++;

	    it(index + '. Test 12 pages, 8 buttons, current of 2', function() {

	    	var rangeFilterRes = filter('range')( [1, 12], 2, 8);
	    	
	    	console.log( JSON.stringify(rangeFilterRes) );

	    	var expected = [1, 2, 3, 4, 5, 6, null, 12];
	    	
	    	expect(JSON.stringify(rangeFilterRes)).toBe(JSON.stringify(expected));
	    	
	    });

	    index ++;


	    it(index + '. Test 12 pages, 8 buttons, current of 3', function() {

	    	var rangeFilterRes = filter('range')( [1, 12], 3, 8);
	    	
	    	console.log( JSON.stringify(rangeFilterRes) );

	    	var expected = [1, 2, 3, 4, 5, 6, null, 12];
	    	
	    	expect(JSON.stringify(rangeFilterRes)).toBe(JSON.stringify(expected));
	    	
	    });

	    index ++;


	    it(index + '. Test 12 pages, 8 buttons, current of 4', function() {

	    	var rangeFilterRes = filter('range')( [1, 12], 4, 8);
	    	
	    	console.log( JSON.stringify(rangeFilterRes) );

	    	var expected = [1, 2, 3, 4, 5, 6, null, 12];
	    	
	    	expect(JSON.stringify(rangeFilterRes)).toBe(JSON.stringify(expected));
	    	
	    });

	    index ++;

	    it(index + '. Test 12 pages, 8 buttons, current of 5', function() {

	    	var rangeFilterRes = filter('range')( [1, 12], 5, 8);
	    	
	    	console.log( JSON.stringify(rangeFilterRes) );

	    	var expected = [1, null, 3, 4, 5, 6, null, 12];
	    	
	    	expect(JSON.stringify(rangeFilterRes)).toBe(JSON.stringify(expected));
	    	
	    });

	    index ++;

	    it(index + '. Test 12 pages, 8 buttons, current of 6', function() {

	    	var rangeFilterRes = filter('range')( [1, 12], 6, 8);
	    	
	    	console.log( JSON.stringify(rangeFilterRes) );

	    	var expected = [1, null, 4, 5, 6, 7, null, 12];
	    	
	    	expect(JSON.stringify(rangeFilterRes)).toBe(JSON.stringify(expected));
	    	
	    });

	    index ++;

	    it(index + '. Test 12 pages, 8 buttons, current of 7', function() {

	    	var rangeFilterRes = filter('range')( [1, 12], 7, 8);
	    	
	    	console.log( JSON.stringify(rangeFilterRes) );

	    	var expected = [1, null, 5, 6, 7, 8, null, 12];
	    	
	    	expect(JSON.stringify(rangeFilterRes)).toBe(JSON.stringify(expected));
	    	
	    });

	    index ++;

	    it(index + '. Test 12 pages, 8 buttons, current of 8', function() {

	    	var rangeFilterRes = filter('range')( [1, 12], 8, 8);
	    	
	    	console.log( JSON.stringify(rangeFilterRes) );

	    	var expected = [1, null, 7, 8, 9, 10, 11, 12];
	    	
	    	expect(JSON.stringify(rangeFilterRes)).toBe(JSON.stringify(expected));
	    	
	    });

	    index ++;

	    it(index + '. Test 12 pages, 8 buttons, current of 9', function() {

	    	var rangeFilterRes = filter('range')( [1, 12], 9, 8);
	    	
	    	console.log( JSON.stringify(rangeFilterRes) );

	    	var expected = [1, null, 7, 8, 9, 10, 11, 12];
	    	
	    	expect(JSON.stringify(rangeFilterRes)).toBe(JSON.stringify(expected));
	    	
	    });

	    index ++;

	    it(index + '. Test 12 pages, 8 buttons, current of 10', function() {

	    	var rangeFilterRes = filter('range')( [1, 12], 10, 8);
	    	
	    	console.log( JSON.stringify(rangeFilterRes) );

	    	var expected = [1, null, 7, 8, 9, 10, 11, 12];
	    	
	    	expect(JSON.stringify(rangeFilterRes)).toBe(JSON.stringify(expected));
	    	
	    });

	    index ++;

	    it(index + '. Test 12 pages, 8 buttons, current of 11', function() {

	    	var rangeFilterRes = filter('range')( [1, 12], 11, 8);
	    	
	    	console.log( JSON.stringify(rangeFilterRes) );

	    	var expected = [1, null, 7, 8, 9, 10, 11, 12];
	    	
	    	expect(JSON.stringify(rangeFilterRes)).toBe(JSON.stringify(expected));
	    	
	    });

	    index ++;

	    it(index + '. Test 12 pages, 8 buttons, current of 12', function() {

	    	var rangeFilterRes = filter('range')( [1, 12], 12, 8);
	    	
	    	console.log( JSON.stringify(rangeFilterRes) );

	    	var expected = [1, null, 7, 8, 9, 10, 11, 12];
	    	
	    	expect(JSON.stringify(rangeFilterRes)).toBe(JSON.stringify(expected));
	    	
	    });

	    index ++;

	    // specific results testing - 100+ pages, centred

	    it(index + '. Test 100 pages, 9 buttons, current of 50', function() {

	    	var rangeFilterRes = filter('range')( [1, 100], 50, 9);
	    	
	    	console.log( JSON.stringify(rangeFilterRes) );

	    	var expected = [1, null, 48, 49, 50, 51, 52, null, 100];
	    	
	    	expect(JSON.stringify(rangeFilterRes)).toBe(JSON.stringify(expected));
	    	
	    });

	    index ++;

	    
	    // specific results testing - 9 pages vailable, data for only 3

	    it(index + '. Test 3 pages out of possible 9 buttons, current of 2', function() {

	    	var rangeFilterRes = filter('range')( [1, 3], 2, 9);
	    	
	    	console.log( JSON.stringify(rangeFilterRes) );

	    	var expected = [1, 2, 3];
	    	
	    	expect(JSON.stringify(rangeFilterRes)).toBe(JSON.stringify(expected));
	    	
	    });

	    index ++;

	    
	    
	  }
	);
	
});
