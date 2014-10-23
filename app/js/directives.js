'use strict';

/* Directives */

uimApp.directive('homeLink', function(){
	return {
			restrict: 'E',
			template: '<a href="index.html">home</a>'
	};
});

uimApp.directive('pagination', function(){
	return {
			restrict: 'E',
			templateUrl: 'partials/pagination.html',
			scope:{
				pparams :'=pparams'
			}
	};
});


uimApp.directive('euMenuOps', function(){
	return {
			restrict:		'E',
			templateUrl:	'partials/EuMenuOps.html'
	};
});


uimApp.directive('euLoggedIn', function(){
	return {
		restrict:		'E',
		templateUrl:	'partials/EuLoggedIn.html'
	};
});


uimApp.directive('loginDialog', function (uimConstants) {
	return {
		restrict: 'A',
		
		XXXtemplate: 'DIRECTIVE TO BE REMOVED',
		template: '<a href="http://localhost:8000/app/index.html#/users/3/list">http://localhost:8000/app/index.html#/users/3/list</a>'
		
		/*
		
		template: '<div ng-if="visible" ng-include="\'partials/login.html\'">',
		XXtemplateUrl: 'partials/access.sign-in.html',
		
		
		link: function (scope, el, attrs) {
			
			scope.visible = attrs.uimVisible ? true : false;
			scope.nextPage = '';
			
			var showDialog = function(next, nextParams){
				scope.visible = true;
				scope.nextPage = next;
				scope.nextParams = nextParams;
			};
			
			scope.$on(uimConstants.AUTH_EVENTS.notAuthenticated,
				function(e, data){
					showDialog(data.nextPage, data.nextParams);
				}
			);
			scope.$on(uimConstants.AUTH_EVENTS.notAuthorized,
				function(e, data){
					showDialog(data.nextPage, data.nextParams);
				}
			);
			scope.$on(uimConstants.AUTH_EVENTS.sessionTimeout, showDialog);
		}
		*/
	};
});

