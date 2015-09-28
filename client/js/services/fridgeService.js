angular.module('labControlApp')
	.service('fridgeService', ['$http', function  ($http) {
		this.getData = function (fridge, num) {
			if (num == null) {
				num=1;
			}
			return $http.get('/getData', {
				params: {
					num: num,
					fridge: fridge
				}
			});
		};

		this.getHistory = function  (fridge) {
	        return $http.get('/history', {
	            params: {
	                fridge: fridge
	            }
	        });
		};

		this.addHistory = function (fridge, historyNote) {
			return $http.post('/history', {
			            fridge: fridge,
			            note: historyNote
			        });
		};

		this.state = function (fridge) {
			return $http.get('/status', {
				params: {
					fridge: fridge
				}
			});
		};
	}]);