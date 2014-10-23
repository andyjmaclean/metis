'use strict';


var uimControllers	= angular.module('uimControllers', []);



/**
 * Adds pagination parameters to the current scope
 * 
 *  @$scope			- scope that paginationParams are appended to

 *  @$routeParams	- 
 *  @countService	- 
 * 
 * 	total - count of objects being paginated
 *  [
 *     start -  portal-style pagination paramter,
 *     rows - portal-style pagination paramter
 *  ]
 *  or
 *  [
 *     page - semantic pagination parameter
 *  ],
 *  currentPage - the current page,
 *  noPages - the total number of pages available,
 *  url - ??????
 *  
 * */

var addPagination = function($scope, $routeParams){
	
	var defaultRows = $scope.defaultRows;
	var max         = $scope.maxButtons;
	var total       = $scope.total;

	if(! $routeParams.page){
		$routeParams.page = 1;
	}

	total.$promise.then(function (data) {
		
		$scope.paginationParams = {
			"total" : data.total,
			"currentPage" : parseInt($routeParams.page),
			"noPages" : Math.ceil(data.total / defaultRows),
			"max" : max
		};
		
		console.log('promise resolved....updated pagination data');

	});
		
	return {"start" : defaultRows *  ($routeParams.page-1), "rows" : defaultRows};
};


/* Access */

uimControllers.controller('AccessCtrl',  
	function($scope, $stateParams) {
	
		$scope.nextPage		= $stateParams.nextPage;
		$scope.nextParams	= $stateParams.nextParams;
	
		console.log('AccessCtrl: \n' 
				+ '\n\n'
				+ JSON.stringify($stateParams)
				+ '\n\n'
		);
	}
);


/* Login */

uimControllers.controller('LoginController', function ($scope, $rootScope, uimConstants, AuthService, $state) {
		$scope.credentials = {
			username: '',
			password: '',
			next:''
		};
		
		$scope.login = function (credentials) {
			
			AuthService.login(credentials).then(function (user, next, nextParams) {
				
				console.log('successful log in for ' + JSON.stringify(user) + ', next is ' + next + ', nextParams are ' + nextParams);
				
				$scope.setCurrentUser(user);
				$rootScope.$broadcast(uimConstants.AUTH_EVENTS.loginSuccess);
				
				if(next){
					$state.go(next, nextParams, { reload: true });					
				}
				else{
					console.log('no next specified: go home');
					$state.go('home');
				}
			},
			function (){
				$rootScope.$broadcast(uimConstants.AUTH_EVENTS.loginFailed);
			});
		};
});


/* Application */
	
uimControllers.controller('ApplicationController', ['$scope', '$state', 'uimConstants', 'AuthService', function
                                                    ($scope, $state, uimConstants, AuthService) {


	// set up login broadcasts
	$scope.$on('$stateChangeStart', function (event, next, nextParams) {
		
		console.log('\n');
		
		if(next.data){
			var authorizedRoles = next.data.authorizedRoles;
			if (!AuthService.isAuthorized(authorizedRoles)) {
				event.preventDefault();
								
				var nextUrl = next.url.split('?')[0].split('/')[1];
				
				if(next.parent){
					/***
					 * 
					 * Landing (no log-in) on a nested state, i.e.
					 * 		http://localhost:8000/app/index.html#/users/guest
					 * 
					 * leads to a routing error:
					 * 		"could not resolve [url] from state [empty/home]
					 * 
					 * Concatenation with the parent is needed to avoid this
					 * 
					 ***/
					nextUrl = next.parent + '.' + nextUrl;
				}
				if(nextParams && nextParams['page']){
				//	nextUrl += '/' + nextParams['page'];
				}					
				
				
				console.log('PRE-broadcast 0: converted next url from [' + next.url + '] to [' + nextUrl + ']');
				
				if (AuthService.isAuthenticated()) {
					// user is not allowed
					console.log('PRE-broadcast 1: stateChangeStart - app ctl bc AUTHORISED (nextParams ' + nextParams.length + ')');
					$scope.$broadcast(uimConstants.AUTH_EVENTS.notAuthorized, {'nextPage' : nextUrl, 'nextParams' : nextParams });
				}
				else {
					// user is not logged in
					console.log('PRE-broadcast 2: stateChangeStart - app ctl bc NOT AUTHENTICATED (nextParams ' + nextParams.length + ')');
					$scope.$broadcast(uimConstants.AUTH_EVENTS.notAuthenticated, {'nextPage' : nextUrl, 'nextParams' : nextParams});
				}
			}
		}
	});
	
	

	
	
	// broadcast reception
	$scope.$on(uimConstants.AUTH_EVENTS.notAuthenticated,
		function(e, data){
			console.log('post broadcast notAuthenticated - redirect (' + data.nextPage + ', ' + data.nextParams + ')');
			$state.go('access.sign-in', {"nextPage" : data.nextPage, "nextParams" : data.nextParams});
		}
	);
	$scope.$on(uimConstants.AUTH_EVENTS.notAuthorized,
		function(e, data){
			console.log('post broadcast 2')
			$state.go('access.sign-in', {"nextPage" : data.nextPage, "nextParams" : data.nextParams});

			//showDialog(data.nextPage, data.nextParams);
		}
	);
	$scope.$on(uimConstants.AUTH_EVENTS.sessionTimeout, 
		function(e, data){
			console.log('post broadcast 3');
			$state.go('access.sign-in', {"nextPage" : data.nextPage, "nextParams" : data.nextParams});
			
			//showDialog(data.nextPage, data.nextParams);
		}
	);


	
	// globally available vars & fns
	
	$scope.currentUser = null;
	$scope.isAuthorized = AuthService.isAuthorized;
	$scope.setCurrentUser = function(user){
		$scope.currentUser = user;

		// make constants available to view (partials/index.html)
		$scope.userRoles = uimConstants.USER_ROLES;
	};

}]);



/* Organisations */

uimControllers.controller('OrganisationsCtrl', ['$scope', '$stateParams', 'Organisations', 'OrganisationCount', 'uimConstants',
	function($scope, $stateParams, Organisations, OrganisationCount, uimConstants) {

		$scope.maxButtons  = uimConstants.UI_SETTINGS.maxPageButtons;
		$scope.defaultRows = uimConstants.UI_SETTINGS.maxListEntries;
		$scope.total       = OrganisationCount.query();
		
		var stats = addPagination($scope, $stateParams);
		$scope.organisations = Organisations.query({rows: stats['rows'], start: stats['start'] });
		$scope.sortOptions = [
			{ label: 'Id',		value: "id" },
			{ label: 'Name',	value: "name" }
		];
		$scope.selected = $scope.sortOptions[0];		
	}]
);


/* Single Organisation */

uimControllers.controller('OrganisationCtrl', ['$scope', '$stateParams', 'Organisation', 'uimOrganisationCache',
	function($scope, $stateParams, Organisation, uimOrganisationCache) {
	
		var cached = uimOrganisationCache.get($stateParams.organisationId);
		if(cached){
				$scope.organisation = cached;
		}
		else{
			Organisation.get({organisationId: $stateParams.organisationId}, function(organisation) {
				uimOrganisationCache.put($stateParams.organisationId, organisation);
				$scope.organisation = organisation;		
				});
		}
	}]
);


/* Users */

uimControllers.controller('UsersCtrl', ['$scope', '$stateParams', 'Users', 'UserCount', 'uimConstants', 
	function($scope, $stateParams, Users, UserCount, uimConstants) {

		$scope.maxButtons  = uimConstants.UI_SETTINGS.maxPageButtons;
		$scope.defaultRows = uimConstants.UI_SETTINGS.maxListEntries;
		$scope.total       = UserCount.query();

		var stats = addPagination($scope, $stateParams);
		
		$scope.users = Users.query({rows: stats['rows'], start: stats['start'] });
		
		$scope.sortOptions = [
			{ label: 'Last name',	value: "surname" },
			{ label: 'Username',	value: "username" }
		];
		$scope.selected = $scope.sortOptions[0];
		
		
		$scope.formatRow = function(user){
			return user.fullname ? (user.fullname + ' ' + user.email) : (user.forenames + ' ' + user.surname );
		};
		/*
		*/

	}]
);


/* User */

uimControllers.controller('UserCtrl', ['$scope', '$stateParams', 'User', 'uimUserCache',
	function($scope, $stateParams, User, uimUserCache) {
	
	var cached = uimUserCache.get($stateParams.userId);
	if(cached){
			$scope.user = cached;
	}
	else{
		User.get({userId: $stateParams.userId}, function(user) {
			uimUserCache.put($stateParams.userId, user);
			$scope.user = user;
			});
	}
	}]
);



