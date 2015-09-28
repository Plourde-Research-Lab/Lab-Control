angular.module('labControlApp')
	.service('ADRService', ['$http', function  ($http) {
		this.magup = function  (adrName) {
	        return $http.get('/control', {
	            params: {
	                fridge: adrName,
	                command: 'Magup'
	            }
	        });
		};

		this.magdown = function  (adrName) {
	        return $http.get('/control', {
	            params: {
	                fridge: adrName,
	                command: 'Magdown'
	            }
	        });
		};
	}]);