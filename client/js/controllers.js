'use strict';

angular.module('labControlApp')
    .controller('MainCtrl', [
        '$scope', '$location',
        function($scope, $location) {
    $scope.model = {
        message: 'This is the main page controller',
        fridges: [
            {
                name: 'ADR1',
                type: 'ADR',
                status: 'Warm'
            },
            {
                name: 'DR1',
                type: 'DR',
                status: 'Cold'
            },
            {
                name: 'ADR2',
                type: 'ADR',
                status: 'Warm'
            },
            {
                name: 'DR2',
                type: 'DR',
                status: 'Warm'
            }
        ]
    };
    $scope.$location = $location;
}]);

angular.module('labControlApp')
    .controller('ADR1Ctrl', ['$scope', '$http', function($scope, $http) {
    $scope.model = {
        message: 'This is the controller for dealing with ADR1.'
    };

    $scope.chartconfig = {
        visible: true,
        autorefresh: true,
        refreshDataOnly: true
    };

    $scope.chartoptions = {
        chart: {
            type: 'lineChart',
            margin: {
                top: 10,
                right: 20,
                bottom: 10,
                left: 30
            },
            x: function(d) { return d.x; },
            y: function(d) { return d.y; },
            useInteractiveGuideline: false,
            showLegend: false,
            transitionDuration: 0,
            yAxis: {
                tickFormat: function(d) {
                   return d3.format('.3n')(d);
                }
            },
            showXAxis: false
        }
    };

    $scope.tempData = [
        [{
            key: '60K Temp',
            values: []
        }],
        [{
            key: '3K Temp',
            values: []
        }],
        [{
            key: 'Base Temp',
            values: []
        }]
    ];

    $scope.magnetData = [
        [{
            key: 'Magnet Voltage',
            values: []
        }],
        [{
            key: 'Current',
            values: []
        }]
    ];

    $scope.fridgeData = {
        currentState: 'Magup',
        switchState: 'Closed',
        magupPercentage: '60'
    };

    $scope.getChartData = function() {
        $http.get('/getData').
            success(function(data, status, headers, config) {
                var data = data[0];
                // console.log(data.timeStamp)
                $scope.temp1 = data.sixtyKTemp.toFixed(4);
                $scope.temp2 = data.threeKTemp.toFixed(3);
                $scope.temp3 = (data.baseTemp * 1000).toFixed(4);
                $scope.v = data.magnetVoltage.toFixed(4);
                $scope.i = data.psCurrent.toFixed(4);
                $scope.tempData[0][0].values.push({x: data.timeStamp, y: $scope.temp1});
                $scope.tempData[1][0].values.push({x: data.timeStamp, y: $scope.temp2});
                $scope.tempData[2][0].values.push({x: data.timeStamp, y: $scope.temp3});
                $scope.magnetData[0][0].values.push({x: data.timeStamp, y: $scope.v});
                $scope.magnetData[1][0].values.push({x: data.timeStamp, y: $scope.i});
                // $scope.$apply();
                if ($scope.tempData[0][0].values.length > 60) {
                    $scope.tempData[0][0].values.shift();
                    $scope.tempData[1][0].values.shift();
                    $scope.tempData[2][0].values.shift();
                    $scope.magnetData[0][0].values.shift();
                    $scope.magnetData[1][0].values.shift();
                }
            });
        setTimeout($scope.getChartData, 5000);
    };

    $scope.magup = function() {

        var magupJob = new function() {
            this.type = 'Magup',
            this.finishTime = soakJob.startTime;
            this.startTime = new Date(this.finishTime - 60 * 60000);
            this.completed = false;
            this.percentDone = 0;
            this.dateString = this.startTime.toDateString();
            this.timeString = this.startTime.toTimeString();
            this.scheduledOn = Date.now();
        };

        $http.post({}).
        success({}).
        error({});
    };

    $scope.init = function() {

        setTimeout(function() {
            $scope.getChartData();
        }, 200);
    };

    $scope.init();

}]);

angular.module('labControlApp').controller('ADR2Ctrl', [
    '$scope', '$http', '$timeout', function($scope, $http, $timeout) {
    $scope.model = {
        message: 'This is the controller for dealing with ADR2.'
    };

    $scope.chartconfig = {
        visible: true,
        autorefresh: true,
        refreshDataOnly: true
    };

    $scope.chartoptions = {
        chart: {
            type: 'lineChart',
            margin: {
                top: 10,
                right: 20,
                bottom: 10,
                left: 40
            },
            x: function(d) { return d.x; },
            y: function(d) { return d.y; },
            useInteractiveGuideline: false,
            showLegend: true,
            transitionDuration: 0,
            yAxis: {
                tickFormat: function(d) {
                   return d3.format('.4n')(d);
                }
            },
            xAxis: {
                tickFormat: function(d) {
                    return d3.time.format.utc('%X')(new Date(d * 1000));
                }
            }
            // showXAxis: false
        }
    };
    $scope.logChartOptions = {

        chart: {
            type: 'lineWithFocusChart',
            margin: {
                top: 10,
                right: 20,
                bottom: 60,
                left: 40
            },
            x: function(d) { return d.x; },
            y: function(d) { return d.y; },
            useInteractiveGuideline: false,
            showLegend: true,
            transitionDuration: 0,
            yAxis: {
                tickFormat: function(d) {
                   return d3.format('.4n')(d);
                }
            },
            y2Axis: {
                tickFormat: function(d) {
                    return d3.format('.4n')(d);
                }
            },
            y3Axis: {
                axisLabel: 'y3 axis'
            },
            xAxis: {
                tickFormat: function(d) {
                    return d3.time.format.utc('%X')(new Date(d * 1000));
                }
            },
            x2Axis: {
                tickFormat: function(d) {
                    return d3.time.format.utc('%a,%-I%p')(new Date(d * 1000));
                }
            }
        }
    };


    $scope.tempData = [
        [{
            key: '60K Temp',
            values: [],
            temp: null,
            delta: null
        }],
        [{
            key: '3K Temp',
            values: [],
            temp: null,
            delta: null
        }],
        [{
            key: '1K Temp',
            values: [],
            temp: null,
            delta: null
        }],
        [{
            key: 'Base Temp',
            values: [],
            temp: null,
            delta: null
        }]
    ];

    $scope.magnetData = [
        [{
            key: 'Magnet Voltage',
            values: []
        }],
        [{
            key: 'Current',
            values: []
        }]
    ];

    $scope.logData = [
        {
            key: '60K Temperature',
            values: []
        },
        {
            key: '3K Temperature',
            values: []
        },
        {
            key: '1K Temperature',
            values: []
        },
        {
            key: 'Base Temperature',
            values: []
        }
    ];

    $scope.fridgeData = {
        currentState: 'Magup',
        switchState: 'Closed',
        magupPercentage: '60',
        percentComplete: '0'
    };

    $scope.getLogData = function(variable) {
        var timeStep = 5; //Number of seconds between data collection

        $http.get('/getData', {
            params: {num: variable / timeStep}
        })
            .success(function(data, status, headers, config) {
                // Fix this
                $scope.logData[0].values = [];
                $scope.logData[1].values = [];
                $scope.logData[2].values = [];
                $scope.logData[3].values = [];
                data.forEach(function(datapoint, index) {
                    $scope.logData[0].values.push({x: datapoint.timeStamp, y: datapoint.sixtyKTemp});
                    $scope.logData[1].values.push({x: datapoint.timeStamp, y: datapoint.threeKTemp});
                    $scope.logData[2].values.push({x: datapoint.timeStamp, y: datapoint.oneKTemp});
                    $scope.logData[3].values.push({x: datapoint.timeStamp, y: datapoint.baseTemp});
                });
            });
    };

    $scope.calculateTempDelta = function(array) {
        //Return mK / second
        return ((array[array.length - 1]['y'] - array[0]['y']) /
            (array[array.length - 1]['x'] - array[0]['x']) * 1000).toFixed(3);
    };

    $scope.getChartData = function() {
        $http.get('/getData', {
            params: {
                num: 1,
                fridge: 'ADR2'
            }
        })
            .success(function(data, status, headers, config) {
                if (status != 304) {
                    $scope.updateChartData(data[0]);
                }
            });

        $timeout($scope.getChartData, 5050);
    };

    $scope.updateChartData = function(data) {
        $scope.timeStamp = data.timeStamp;
        $scope.tempData[0][0].temp = data.sixtyKTemp.toFixed(4);
        // $scope.temp[0].temp = data.sixtyKTemp.toFixed(4);
        $scope.tempData[1][0].temp = data.threeKTemp.toFixed(3);
        $scope.tempData[2][0].temp = data.oneKTemp.toFixed(3);
        $scope.tempData[3][0].temp = data.baseTemp;//.toFixed(4);
        $scope.v = data.magnetVoltage.toFixed(4);
        $scope.i = data.psCurrent.toFixed(4);
        $scope.fridgeData.currentState = data.currentJob;
        $scope.fridgeData.switchState = data.switchState;
        $scope.percentComplete = data.percentComplete;

        if ($scope.tempData[0][0].temp < 300) {
            $scope.fridgeData.currentState = 'Cold';
            $scope.tempData.forEach(function(element, index) {
                element[0].values.push({x: $scope.timeStamp, y: element[0].temp});
                element[0].delta = $scope.calculateTempDelta(element[0].values);
            });

            $scope.magnetData[0][0].values.push({x: $scope.timeStamp, y: $scope.v});
            $scope.magnetData[1][0].values.push({x: $scope.timeStamp, y: $scope.i});
            // $scope.$apply();
            if ($scope.tempData[0][0].values.length > 60) {
                $scope.tempData[0][0].values.shift();
                $scope.tempData[1][0].values.shift();
                $scope.tempData[2][0].values.shift();
                $scope.tempData[3][0].values.shift();
                $scope.magnetData[0][0].values.shift();
                $scope.magnetData[1][0].values.shift();
            }
        } else {
            $scope.fridgeData.currentState = 'Warm';
            console.log($scope.fridgeData.currentState);
        }
    };


    $scope.magup = function() {

        var magupJob = new function() {
            this.jobType = 'Magup',
            this.finishTime = soakJob.startTime;
            this.startTime = new Date(this.finishTime - 60 * 60000);
            this.completed = false;
            this.percentDone = 0;
            this.dateString = this.startTime.toDateString();
            this.timeString = this.startTime.toTimeString();
            this.scheduledOn = Date.now();
        };

        $http.post({}).
        success({}).
        error({});
    };

    $scope.init = function() {

        $timeout(function() {
            $scope.getChartData();
        }, 200);


        $scope.temp = [{},{},{},{}];
    };

    $scope.init();

}]);


// DR1 controller
angular.module('labControlApp')
    .controller('DR1Ctrl', [
        '$scope', '$http', '$timeout', function($scope, $http, $timeout) {
    $scope.model = {
        message: 'This is the controller for dealing with DR1.'
    };

    $scope.chartconfig = {
        visible: true,
        autorefresh: true,
        refreshDataOnly: true
    };

    $scope.chartoptions = {
        chart: {
            type: 'lineChart',
            margin: {
                top: 10,
                right: 20,
                bottom: 10,
                left: 40
            },
            x: function(d) { return d.x; },
            y: function(d) { return d.y; },
            useInteractiveGuideline: false,
            showLegend: true,
            transitionDuration: 0,
            yAxis: {
                tickFormat: function(d) {
                   return d3.format('.4n')(d);
                }
            },
            showXAxis: false
        }
    };

    $scope.logChartOptions = {

        chart: {
            type: 'lineWithFocusChart',
            margin: {
                top: 10,
                right: 20,
                bottom: 60,
                left: 40
            },
            x: function(d) { return d.x; },
            y: function(d) { return d.y; },
            useInteractiveGuideline: false,
            showLegend: true,
            transitionDuration: 0,
            yAxis: {
                tickFormat: function(d) {
                   return d3.format('.4n')(d);
                }
            },
            y2Axis: {
                tickFormat: function(d) {
                    return d3.format('.4n')(d);
                }
            },
            y3Axis: {
                axisLabel: 'y3 axis'
            },
            xAxis: {
                tickFormat: function(d) {
                    return d3.time.format.utc('%X')(new Date(d * 1000));
                }
            },
            x2Axis: {
                tickFormat: function(d) {
                    return d3.time.format.utc('%a,%-I%p')(new Date(d * 1000));
                }
            }
        }
    };

    $scope.tempData = [
        [{
            key: 'T1',
            values: [],
            temp: null,
            delta: null
        }],
        [{
            key: 'T3',
            values: [],
            temp: null,
            delta: null
        }],
        [{
            key: 'T4',
            values: [],
            temp: null,
            delta: null
        }],
        [{
            key: 'T5',
            values: [],
            temp: null,
            delta: null
        }],
        [{
            key: 'T6',
            values: [],
            temp: null,
            delta: null
        }],
        [{
            key: 'T7',
            values: [],
            temp: null,
            delta: null
        }],
        [{
            key: 'T8',
            values: [],
            temp: null,
            delta: null
        }]
    ];

    $scope.logData = [
        {
            key: 'T1',
            values: []
        },
        {
            key: 'T3',
            values: []
        },
        {
            key: 'T4',
            values: []
        },
        {
            key: 'T5',
            values: []
        },
        {
            key: 'T6',
            values: []
        },
        {
            key: 'T7',
            values: []
        },
        {
            key: 'T8',
            values: []
        }
    ];

    $scope.fridgeData = {
        currentState: 'Magup'
    };

    $scope.getLogData = function(variable) {
        var timeStep = 5; //Number of seconds between data collection

        $http.get('/getData', {
            params: {
                num: variable / timeStep,
                fridge: 'DR1'
            }
        })
            .success(function(data, status, headers, config) {
                // Fix this
                $scope.logData[0].values = [];
                $scope.logData[1].values = [];
                $scope.logData[2].values = [];
                $scope.logData[3].values = [];
                $scope.logData[4].values = [];
                $scope.logData[5].values = [];
                $scope.logData[6].values = [];
                data.forEach(function(datapoint, index) {
                    $scope.logData[0].values.push({x: datapoint.timeStamp, y: datapoint.t1});
                    $scope.logData[1].values.push({x: datapoint.timeStamp, y: datapoint.t3});
                    $scope.logData[2].values.push({x: datapoint.timeStamp, y: datapoint.t4});
                    $scope.logData[3].values.push({x: datapoint.timeStamp, y: datapoint.t5});
                    $scope.logData[4].values.push({x: datapoint.timeStamp, y: datapoint.t6});
                    $scope.logData[5].values.push({x: datapoint.timeStamp, y: datapoint.t7});
                    $scope.logData[6].values.push({x: datapoint.timeStamp, y: datapoint.t8});
                });
            });
    };

    $scope.calculateTempDelta = function(array) {
        //Return mK / second
        return ((array[array.length - 1]['y'] - array[0]['y']) /
            (array[array.length - 1]['x'] - array[0]['x']) * 1000).toFixed(3);
    };

    $scope.getChartData = function() {
        $http.get('/getData', {
            params: {
                num: 1,
                fridge: 'DR1'
            }
        })
            .success(function(data, status, headers, config) {
                if (status != 304) {
                    $scope.updateChartData(data[0]);
                }
            });

        $timeout($scope.getChartData, 5050);
    };

    $scope.updateChartData = function(data) {
        $scope.timeStamp = data.timeStamp;
        $scope.tempData[0][0].temp = data.t1.toFixed(3);
        $scope.tempData[1][0].temp = data.t3.toFixed(3);
        $scope.tempData[2][0].temp = data.t4.toFixed(3);
        $scope.tempData[3][0].temp = data.t5.toFixed(3);
        $scope.tempData[4][0].temp = data.t6.toFixed(3);//.toFixed(4);
        $scope.tempData[5][0].temp = data.t7.toFixed(3);
        $scope.tempData[6][0].temp = data.t8.toFixed(3);

        if ($scope.tempData[0][0].temp < 289.9) {
            $scope.fridgeData.currentState = 'Cold';
            $scope.tempData.forEach(function(element, index) {
                element[0].values
                    .push({x: $scope.timeStamp, y: element[0].temp});
                element[0].delta = $scope.calculateTempDelta(element[0].values);
            });

            // $scope.$apply();
            if ($scope.tempData[0][0].values.length > 60) {
                $scope.tempData[0][0].values.shift();
                $scope.tempData[1][0].values.shift();
                $scope.tempData[2][0].values.shift();
                $scope.tempData[3][0].values.shift();
                $scope.tempData[4][0].values.shift();
                $scope.tempData[5][0].values.shift();
                $scope.tempData[6][0].values.shift();
            }
        } else {
            $scope.fridgeData.currentState = 'Warm';
            console.log($scope.fridgeData.currentState);
        }
    };

    $scope.init = function() {

        $timeout(function() {
            $scope.getChartData();
        }, 200);


        $scope.temp = [{},{},{},{},{},{},{}];
    };

    $scope.init();
}]);

angular.module('labControlApp').controller('DR2Ctrl', [
    '$scope', '$http', function($scope, $http) {
    $scope.model = {
        message: 'This is the controller for dealing with DR2.'
    };
}]);

angular.module('labControlApp').controller('JobCtrl', [
    '$scope', '$http', function($scope, $http) {
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
        };

        $scope.newJobs.push(magdownJob, soakJob, magupJob);
    };

    $scope.removeNewJobs = function() {
        $scope.newJobs = [];
    };

    $scope.getJobs = function() {
        $http({
            method: 'GET',
            url: '/getJobs1',
            params: $scope.adrs[0]
        }).
        success(function(response) {
            $scope.adrs[0].jobs = response;
            console.log(response.length + ' jobs loaded for ADR1.');
        }).
        error(function(err) {
            console.log(err);
        });

        $http({
            method: 'GET',
            url: '/getJobs2',
            params: $scope.adrs[1]
        }).
        success(function(response) {
            $scope.adrs[1].jobs = response;
            console.log(response.length + ' jobs loaded for ADR2.');
        }).
        error(function(err) {
            console.log(err);
        });
    };

    $scope.saveJobs = function() {
        console.log('Saving ' + $scope.newJobs.length + ' jobs');
        var urlString = '/addJobs' + $scope.selectedADR.name.slice(-1);
        $http({
            method: 'POST',
            data: JSON.stringify($scope.newJobs),
            url: urlString
        }).
        success(function(response) {
            console.log('Send was a success-client');
            console.log(response);
            scope.newJobs = [];
        }).
        error(function(error) {
            console.log(error);
        });

        $scope.newJobs = [];
        $scope.getJobs();
    };

    $scope.removeJob = function(job) {
        console.log(job);
        var urlString = '/removeJob' + $scope.selectedADR.name.slice(-1);
        $http({
            method: 'POST',
            data: JSON.stringify(job),
            url: urlString
        }).
        success(function(response) {
            console.log('Removal request was a success-client');
            console.log(response);
        }).
        error(function(error) {
            console.log(error);
        });

        $scope.getJobs();
    };

    $scope.init = function() {

        $scope.today = new Date();


        $scope.adrs = [{
            name: 'ADR1',
            jobs: []
        },{
            name: 'ADR2',
            jobs: []
        }];
        $scope.selectedADR = $scope.adrs[0];
        console.log('Selected ADR-' + $scope.selectedADR.name);
        $scope.getJobs();
        $scope.newJobs = [];
    };

    $scope.init();
}]);
