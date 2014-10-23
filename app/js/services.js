'use strict';

/* Services */

var uimServices = angular.module('uimServices', ['ngResource']);

uimServices.urls = {
	
	"users"					: "data/users.json",
	"user"					: 'data/users/:userId.json',
	"organisations"			: "data/organisations.json",
	"organisation"			: 'data/organisations/:organisationId.json',
	"projects"				: "data/datasets.json",
	"project"				: "data/datasets/:datasetsId.json"
};

uimServices.urls.ingester = {
		
	"users"					: "http://95.85.44.177:8080/ingester/rest/users/all",

	/* TODO - the rest */
	
	"user"					: 'data/users/:userId.json',
	"organisations"			: "data/organisations.json",
	"organisation"			: 'data/organisations/:organisationId.json',
	"projects"				: "data/datasets.json",
	"project"				: "data/datasets/:datasetsId.json"

};


uimServices.factory('AuthService', function ($http, Session, uimConstants) {

	// With this set firefox sends the session cookie with all requests
//	$http.defaults.withCredentials = true;

	// chrome fix?
//	$http.defaults.useXDomain = true;

	
	//	uimServices.factory('AuthService', function ($http, Session) {
	var authService = {};
 
	/*
	authService.login = function (credentials) {
		return $http
			.post('/login', credentials)
			.then(function (res) {
				Session.create(res.id, res.user.id, res.user.role);
				return res.user;
		});
	}
	*/

	authService.login = function (credentials) {
		
		var dummyUserRole = uimConstants.USER_ROLES.admin;
		var dummyUserName = 'Admin';

		switch(parseInt(credentials.username)){
			case 1 : {
				dummyUserRole = uimConstants.USER_ROLES.guest;
				dummyUserName = 'Guest';
				break;
			}
			case 2 : {				
				dummyUserRole = uimConstants.USER_ROLES.editor;
				dummyUserName = 'Editor';
				
				console.log('will use remote api - login to cas in another tab!');
				uimServices.urls = uimServices.urls.ingester;
				
				break;
			}
		}		
				
		var res = {
			'id' : 1,
			'user' : {
				"id" :	 "1",
				"name" : dummyUserName,
				"role" : dummyUserRole
			}
		};
		
		Session.create(res.id, res.user.id, res.user.role);	/* TODO: wrap this in an implementation of promise() for easier decoupling / testing */
		
		var user = res.user;
		return {
			'then' : function(fn){
				fn(user, $('#login-next').val(), $('#next-params').val().length ? eval('(' + $('#next-params').val() + ')') : null );
			}
		};
	};

	authService.isAuthenticated = function () {
		return !!Session.userId;
	};
	 
	authService.isAuthorized = function (authorizedRoles) {
		if (!angular.isArray(authorizedRoles)) {
			authorizedRoles = [authorizedRoles];
		}
		
		/*
		alert('authService.isAuthenticated() ' + authService.isAuthenticated()
				+ '\n\n'
				+ 'Session.userRole: ' + Session.userRole
				+ '\n\n'
				+ 'authorizedRoles = ' + JSON.stringify(authorizedRoles)
		);
		*/
		
		return (
			authService.isAuthenticated()
			&&
			authorizedRoles.indexOf(Session.userRole) !== -1
		);
		
	};
 
	return authService;
});



uimServices.service('Session', function () {
	this.create = function (sessionId, userId, userRole) {
		this.id = sessionId;
		this.userId = userId;
		this.userRole = userRole;
	};
	this.destroy = function () {
		this.id = null;
		this.userId = null;
		this.userRole = null;
	};
	return this;
});


/* Authorisation interceptor - interception set up in app.js  */

uimServices.factory('AuthInterceptor', function ($rootScope, $q, uimConstants) {
	return {
		responseError: function (response) { 
			$rootScope.$broadcast({
				401: uimConstants.AUTH_EVENTS.notAuthenticated,
				403: uimConstants.AUTH_EVENTS.notAuthorized,
				419: uimConstants.AUTH_EVENTS.sessionTimeout,
				440: uimConstants.AUTH_EVENTS.sessionTimeout
			}[response.status], response);
			return $q.reject(response);
		}
	};
});



uimServices.factory('uimOrganisationCache', function($cacheFactory) {
	var cache = $cacheFactory('uimOrganisationCache');
	return cache;
});

/*
uimServices.factory('uimUsersCache', function($cacheFactory) {
	var cache = $cacheFactory('uimUsersCache');
	return cache;
});
*/

uimServices.factory('uimUserCache', function($cacheFactory) {
	var cache = $cacheFactory('uimUserCache');
	return cache;
});


uimServices.factory('OrganisationCount', ['$resource',
	function($resource){
		return $resource(uimServices.urls['organisations'], {}, {
			query: {
				method:'GET',
				isArray:false,
				cache : true
			}
		});
	}
]);


uimServices.factory('Organisations', ['$resource',
	function($resource){
		return $resource(uimServices.urls['organisations'], {}, {
			query: {
				method:'GET',
				isArray:true,
				cache : true
			}
		});
	}
]);


uimServices.factory('Organisation', ['$resource',
	function($resource){
		return $resource(uimServices.urls['organisation'], {},
		{
				params: {organisationId: 'organisationId'}
		}
		);
	}
]);


uimServices.factory('UserCount', ['$resource',
	function($resource){
		return $resource(uimServices.urls['users'], {}, {
			query: {
				method:'GET',
				isArray:false,
				cache : true
			}
		});
	}
]);


uimServices.factory('Users', ['$resource',
	function($resource){
		return $resource(uimServices.urls['users'], {}, {

			

			query: {
		
				method:'GET',
				isArray:true,
				cache : true

				/*
					 the sort params cause an additional request
					 the withCredentials param is ineffective - using $http.defaults.withCredentials = true (app.js) instead
				*/
				,
				params: {
					rows:	'rows',
					start: 'start'
				}
				,
				"withCredentials":true
				/*
				 
				*/
				
			},
			
			headers: {
		         'Content-type': 'application/json'
		    }
			
			
		});
	}
]);


uimServices.factory('User', ['$resource',
	function($resource){
		return $resource(uimServices.urls['user'], {},
		{
				params: {userId: 'userId'}
		}
		);
	}
]);


