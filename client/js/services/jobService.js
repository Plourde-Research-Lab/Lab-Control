angular.module('labControlApp')
    .service('jobService', ['$http',
        function($http) {
            this.getJobs = function(adrs) {
                angular.forEach(adrs, function(adr) {

                    $http.get('/getJobs', {
                        params: {
                            fridge: adr.name
                        }
                    })
                        .success(function(data, status, headers, config) {
                            if (status != 304) {
                                adr.jobs = data;
                                console.log(data.length + ' jobs loaded for ' + adr.name);

                            }
                        });
                });
            };

            this.saveJob = function(selectedADR, newJobs) {
                console.log('Saving ' + newJobs.length + ' jobs');
                $http.post('/addJobs', {
                    fridge: selectedADR.name,
                    data: JSON.stringify(newJobs)
                })
                    .success(function(data, status, headers, config) {
                        if (status != 304) {
                            console.log(data)
                            newJobs = [];
                            this.getJobs();
                        }
                    });
            };

            this.removeJob = function(selectedADR, job) {
                $http.post('/removeJob', {
                    fridge: selectedADR.name,
                    data: JSON.stringify(job)
                })
                    .success(function(data, status, headers, config) {
                        if (status != 304) {
                            console.log(data)
                        }
                    })
            };
        }
    ]);