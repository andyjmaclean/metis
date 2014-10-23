'use strict';

/* App Module */

//var uimApp = angular.module('uimApp', ['uimControllers', 'uimServices', 'uimFilters', 'ngRoute', 'ui.router']);
//var uimApp = angular.module('uimApp', ['uimControllers', 'uimServices', 'uimFilters', 'uimConstants', 'ui.router']);

var uimApp = angular.module('uimApp', ['uimControllers', 'uimServices', 'uimFilters', 'ui.router']);



uimApp.constant('uimConstants', {
	'AUTH_EVENTS' : {
		'loginSuccess' : 'auth-login-success',
		'loginFailed' : 'auth-login-failed',
		'logoutSuccess' : 'auth-logout-success',
		'sessionTimeout' : 'auth-session-timeout',
		'notAuthenticated' : 'auth-not-authenticated',
		'notAuthorized' : 'auth-not-authorized'
	},
	'USER_ROLES' : {
	   'all' : '*',
	   'admin' : 'admin',
	   'editor' : 'editor',
	   'guest' : 'guest'
	},
	'UI_SETTINGS' : {
		'maxPageButtons' : 7,
		'maxListEntries' : 3		
	}	
});




uimApp.config(['$stateProvider', '$urlRouterProvider', 'uimConstants', function ($stateProvider, $urlRouterProvider, uimConstants) {
	
		$stateProvider
		
		.state('home', {
			url: '/home',
			templateUrl: 'partials/home.html',
		})
		
		.state('access', {
			url: '/access',
			templateUrl: 'partials/access.html',
			controller: 'AccessCtrl',
			abstract: true
		})

		.state('access.sign-in', {
			url: '/sign-in',
			params:      {'nextPage': 0, 'nextParams': 0},
			controller: 'AccessCtrl',
			templateUrl: 'partials/access.sign-in.html'
		})
		
		.state('access.sign-up', {
			url: '/sign-up',
			templateUrl: 'partials/access.sign-up.html'
		})
		
		.state('access.remind', {
			url: '/remind',
			templateUrl: 'partials/access.remind.html'
		})

		
		/*
	  		Optional parameter captures the '/', (so $routeParms gets '/2', which is Nan when parsed in this example.
	  		
			url: '/organisations{page:(?:/[^/]+)?}'
			
			(see ksperling's comments here:
				https://github.com/angular-ui/ui-router/issues/108)
			
	  		Solution coming from ui-router (optional or default parameters)
	  		
	  		Temp solution is to redirect '/organisations' to '/organisations/1' 
		  		
		 */
		
		.state('organisations', {
			abstract: true,
			url: '/organisations/{page:[0-9]+}',
			templateUrl: 'partials/organisations.html',
			controller: 'OrganisationsCtrl',
			data: {
				authorizedRoles: [uimConstants.USER_ROLES.admin, uimConstants.USER_ROLES.editor]
			}
		})
		.state('organisations.list', {
			parent: 'organisations',
			url: '/list',
			templateUrl: 'partials/organisations.list.html',
			data: {
				authorizedRoles: [uimConstants.USER_ROLES.admin, uimConstants.USER_ROLES.editor]
			}
		})
		.state('organisations.admin', {
			parent: 'organisations',
			url: '/admin',
			templateUrl: 'partials/organisations.admin.html',
			data: {
				authorizedRoles: [uimConstants.USER_ROLES.admin, uimConstants.USER_ROLES.editor]
			}
		})

		.state('organisation', {
			url: '/organisation/:organisationId',
			templateUrl: 'partials/organisation.html',
			controller: 'OrganisationCtrl', data: {
				authorizedRoles: [uimConstants.USER_ROLES.admin, uimConstants.USER_ROLES.editor]
			}
		})
	
		/* portal-style pagination parameters */
		/*
		.state('users', {
			
			url: '/users?start&rows',
			templateUrl: 'partials/users.html',
			
			controller: 'UsersCtrl',
			data: {
				authorizedRoles: [uimConstants.USER_ROLES.admin, uimConstants.USER_ROLES.editor]
			}
		})
		*/
		//.state('users-list', {
		.state('users', {
			abstract: true,
			url: '/users/{page:[0-9]+}',
			templateUrl: 'partials/users.html',
			controller: 'UsersCtrl',
			data: {
				authorizedRoles: [uimConstants.USER_ROLES.admin, uimConstants.USER_ROLES.editor]
			}
		})
		.state('users.list', {
			parent: 'users',
			url: '/list',
			templateUrl: 'partials/users.list.html',
			data: {
				authorizedRoles: [uimConstants.USER_ROLES.admin, uimConstants.USER_ROLES.editor]
			}
		})
		.state('users.admin', {
			url: '/admin',
			parent: 'users',
			//controller: 'UsersCtrl', 
			templateUrl: 'partials/users.admin.html',
			data: {
				authorizedRoles: [uimConstants.USER_ROLES.admin]
			}
		})	
		.state('users.guest', {
			url: '/guest',
			templateUrl: 'partials/users.guest.html',
			parent: 'users',
			name: 'users.guest',
			data: {
				authorizedRoles: [uimConstants.USER_ROLES.guest, uimConstants.USER_ROLES.admin, uimConstants.USER_ROLES.editor]
			}
		})
		.state('users.guest.sub', {
			url: '/sub',
			templateUrl: 'partials/users.guest.sub.html',
			parent: 'users.guest',
			data: {
			//		authorizedRoles: [uimConstants.USER_ROLES.guest, uimConstants.USER_ROLES.admin, uimConstants.USER_ROLES.editor]
			}
		})
		.state('user', {
			url: '/user/:userId',
			templateUrl: 'partials/user.html',
			controller: 'UserCtrl',
			data: {
				authorizedRoles: [uimConstants.USER_ROLES.admin, uimConstants.USER_ROLES.editor]
			}
		});

		
		//	redirects
		
		$urlRouterProvider.when('/access', '/access/sign-in');
		
		$urlRouterProvider.when('/organisations', '/organisations/1');
		$urlRouterProvider.when('/users', '/users/1');

//		$urlRouterProvider.otherwise('/home');
		$urlRouterProvider.otherwise('/access/sign-in');
	}]
);



uimApp.config(function ($httpProvider) {
	
	// enable session
	$httpProvider.defaults.withCredentials = true;
	
	// enable cors
	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];

	$httpProvider.interceptors.push([
		'$injector',
		function ($injector) {
			return $injector.get('AuthInterceptor');
		}
	]);
});


