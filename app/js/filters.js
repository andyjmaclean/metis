'use strict';

/* Filters */


/*  Pagination range generator
 *  
 *  @input
 *  @currentPage
 *  @max
 *  
 *  returns [] (int / null)
 *  */

var uimFilters = angular.module('uimFilters', []);


/**
 * Dot Placement
 * 
 * - current page should be at centre of range
 * - range should begin with lowest point
 * - range should end with highest point
 * - dots should never replace a single number, i.e. ["9",  ...  "11"]
 * - bias should be to increase page number if centering with even number. 
 * 
 * 	i.e. if 5 is active show:
 *   	
 *   	[1, ..., 5, 6, ..., 9]
 *   
 * 	rather than:
 * 
 *   	[1, ..., 4, 5, ..., 9]
 *   
 *   	or if 6 is active show:
 *   
 *   	[1, ..., 6, 7, 8, 9]
 *   
 *   rather than:
 *   
 *   	[1, ..., 5, 6, ..., 9]
 *   
 * */



uimFilters.filter('range', function(uimConstants) {
	return function(input, currentPage, max) {
		
		console.log('Enter filter, current = ' + currentPage + ', input.length = ' + input.length + ', input = ' + JSON.stringify(input) + ', max = ' + max );
		
		// vars
		
		var lowest,
			highest,
			current			= currentPage,
			max = max ? max : uimConstants.UI_SETTINGS.maxPageButtons;
		
		switch (input.length) {
			case 1:
				lowest	= 1;	//0;
				highest	= parseInt(input[0], 10) - 1;
				break;
			case 2:
				lowest	= parseInt(input[0], 10);
				highest	= parseInt(input[1], 10);
				break;
			default:
				console.error('Filter:range @input error - expected an array with 1 or 2 entries.');
				return null;
		}
		
		var result       = [];
		var useStartDots = lowest  + (max/2) <= current;
		var useEndDots   = highest - (max/2) > current;
		var freeSpace    = max - ((useStartDots ? 2 : 1) + (useEndDots ? 2 : 0));
		
		//var zoomFrom     = useStartDots ? (current - (freeSpace/2)) : lowest + 1;

		var zoomFrom     = 0;
		
		if(useStartDots){
			var padBack = Math.floor(freeSpace/2);  // 4 / 2 = 2
			
			if(!useEndDots){
				var required = (highest - current) + 1;  // 4
				padBack = freeSpace - required;
				console.log('apply padBack correction ' + padBack);
			}
			console.log('@padBack: ' + padBack);
			zoomFrom = current - padBack;				
		}
		else{
			zoomFrom = lowest + 1;
		}
			
		
		var zoomTo = Math.min(highest+1, zoomFrom + freeSpace);

//		var zoomTo       = zoomFrom + freeSpace;

		
		console.log('@useStartDots: ' + lowest  + ' + (' + ((max/2)) + ') <= current (' + current + ') = ' + useStartDots);
		console.log('@useEndDots: '   + highest + ' - (' + ((max/2)) + ') >  current (' + current + ') = ' + useEndDots);
		console.log('@freeSpace: '   + freeSpace);

		console.log('@zoomFrom: ' + (useStartDots ? '(current - (freeSpace/2)) ' + (useStartDots ? ' (minus padBack) ' : '') + ' ' : 'lowest + 1' )  + ' = ' +  zoomFrom  );
		console.log('@zoomTo: '   + zoomTo);

		

		// OPEN
		
		result.push(lowest);
		
		if(useStartDots){
			result.push(null);
		}

		console.log('post open, res = ' + JSON.stringify(result));

		// ZOOM
		
		for (var i = zoomFrom; i < zoomTo; i++){
			result.push(i);
		}

		if(useEndDots){
			result.push(null);
			result.push(highest);
		}

		console.log('Res: [' + lowest + ' - ' + highest + '] curr=' + current + ', max=' + max + ' => ' + JSON.stringify(result));
		console.log('');
		
		return result;
	};
});





