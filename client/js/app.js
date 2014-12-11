'use strict';

var labControlApp = angular.module('labControlApp', ['ngRoute', 'angular-datepicker']);
						

labControlApp.config(['$routeProvider', '$locationProvider', 
	function($routeProvider, $locationProvider) {
	$routeProvider.
		when('/', {
			templateUrl: 'partials/index.html',
			controller: 'ADRCtrl'
		}).
		when('/pizza', {
			templateUrl: 'partials/pizza.html',
			controller:  'ADRCtrl'
		}).
		otherwise({ 
			redirectTo: '/' 
		});
	
	$locationProvider.html5Mode(true);
}]);

// labControlApp.factory("Job", function($resource) {
//   return $resource("/api/jobs/:id", { id: "@_id" },
//     {
//       'create':  { method: 'POST' },
//       'index':   { method: 'GET', isArray: true },
//       'show':    { method: 'GET', isArray: false },
//       'update':  { method: 'PUT' },
//       'destroy': { method: 'DELETE' }
//     }
//   );
// });