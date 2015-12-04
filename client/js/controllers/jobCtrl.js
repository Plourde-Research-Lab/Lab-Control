angular.module('labControlApp')
    .controller('jobCtrl', [
        '$scope', 'jobService',
        function($scope, jobService) {
            $scope.model = {
                message: 'This is the controller for dealing with scheduling cooldown cycles for ADRs.',
            };

            $scope.calculateJobs = function() {
                var datePick = $scope.date;
                var timePick = $scope.time;
                var soakTime = parseInt($scope.soakTime);

                var finish_date = new Date(datePick.getFullYear(),
                    datePick.getMonth(), datePick.getDate(),
                    timePick.getHours(), timePick.getMinutes());

                var magdownJob = new function() {
                    this.type = 'Magdown';
                    this.finishTime = finish_date;
                    // Subtract Hour
                    this.startTime = new Date(this.finishTime - 60 * 60000);
                    this.completed = false;
                    this.percentDone = 0;
                    this.dateString = this.startTime.toDateString();
                    this.timeString = this.startTime.toTimeString();
                    this.scheduledOn = Date.now();
                    this.inProgress = false;
                };

                var soakJob = new function() {
                    this.type = 'Soak',
                    this.finishTime = magdownJob.startTime;
                    // Subtract soak time
                    this.startTime = new Date(this.finishTime - soakTime * 60000);
                    this.completed = false;
                    this.percentDone = 0;
                    this.dateString = this.startTime.toDateString();
                    this.timeString = this.startTime.toTimeString();
                    this.scheduledOn = Date.now();
                    this.inProgress = false;
                };

                var magupJob = new function() {
                    this.type = 'Magup',
                    this.finishTime = soakJob.startTime;
                    // Subtract Magup Time
                    this.startTime = new Date(this.finishTime - 60 * 60000);
                    this.percentDone = 0;
                    this.dateString = this.startTime.toDateString();
                    this.timeString = this.startTime.toTimeString();
                    this.scheduledOn = Date.now();
                    this.inProgress = false;
                };

                $scope.newJobs.push(magdownJob, soakJob, magupJob);
            };

            $scope.removeNewJobs = function() {
                $scope.newJobs = [];
            };

            $scope.getJobs = function() {
                jobService.getJobs($scope.adrs);
            };

            $scope.saveJobs = function() {
                jobService.saveJob($scope.selectedADR, $scope.newJobs);
                $scope.getJobs();
            };

            $scope.removeJob = function(job) {
                jobService.removeJob($scope.selectedADR, job);
                $scope.getJobs();
            };

            $scope.init = function() {
                $scope.today = new Date();
                $scope.adrs = [{
                    name: 'ADR1',
                    jobs: []
                }, {
                    name: 'ADR2',
                    jobs: []
                }];
                $scope.selectedADR = $scope.adrs[0];
                console.log('Selected ADR-' + $scope.selectedADR.name);
                $scope.getJobs();
                $scope.newJobs = [];
            };

            $scope.init();
        }
    ]);