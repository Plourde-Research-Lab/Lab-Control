angular.module('labControlApp')
    .service('fridgeService', ['$http',
        function($http) {
            // HTTP services
            this.getData = function(fridge, num) {
                if (num == null) {
                    num = 1;
                }
                return $http.get('/getData', {
                    params: {
                        num: num,
                        fridge: fridge
                    }
                });
            };

            this.downloadData = function(fridge, num) {
                if (num == null) {
                    num = 1;
                }
                return $http.get('/downloadData', {
                        params: {
                            num: num,
                            fridge: fridge
                        }
                    })
                    .success(function(data, status, headers, config) {
                        var anchor = angular.element('<a/>');
                        var currentdate = new Date();
                        var filename = fridge + "-" + currentdate.toDateString() + ".csv"
                        anchor.attr({
                            href: 'data:attachment/csv;charset=utf-8,' + encodeURI(data),
                            target: '_blank',
                            download: filename
                        })[0].click();
                    });
            };

            this.getHistory = function(fridge) {
                return $http.get('/history', {
                    params: {
                        fridge: fridge
                    }
                });
            };

            this.addHistory = function(fridge, historyNote) {
                return $http.post('/history', {
                    fridge: fridge,
                    note: historyNote
                });
            };

            this.state = function(fridge) {
                return $http.get('/status', {
                    params: {
                        fridge: fridge
                    }
                });
            };
        }
    ]);
