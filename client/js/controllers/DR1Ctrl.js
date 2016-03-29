angular.module('labControlApp').controller('DR1Ctrl', [
    '$scope', '$http', '$timeout', 'fridgeService',

    function($scope, $http, $timeout, fridgeService) {
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
                x: function(d) {
                    return d.x;
                },
                y: function(d) {
                    return d.y;
                },
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
                x: function(d) {
                    return d.x;
                },
                y: function(d) {
                    return d.y;
                },
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
                key: 'MC',
                values: [],
                temp: null,
                delta: null
            }],
            [{
                key: 'Still',
                values: [],
                temp: null,
                delta: null
            }],
            [{
                key: '1K',
                values: [],
                temp: null,
                delta: null
            }],
            [{
                key: 'LHe In',
                values: [],
                temp: null,
                delta: null
            }],
            [{
                key: 'LHe Out',
                values: [],
                temp: null,
                delta: null
            }],
            [{
                key: 'LN2',
                values: [],
                temp: null,
                delta: null
            }],
            [{
                key: 'Sinter',
                values: [],
                temp: null,
                delta: null
            }],
            [{
                key: 'MC Resistance',
                values: [],
                temp: null,
                delta: null
            }]
        ];

        $scope.logData = [{
            key: 'MC',
            values: []
        }, {
            key: 'Still',
            values: []
        }, {
            key: '1K',
            values: []
        }, {
            key: 'LHe In',
            values: []
        }, {
            key: 'LHe Out',
            values: []
        }, {
            key: 'LN2',
            values: []
        }, {
            key: 'Sinter',
            values: []
        }, {
            key: 'MC Resistance',
            values: []
        }];

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
                    $scope.logData[7].values = [];
                    data.forEach(function(datapoint, index) {
                        $scope.logData[0].values.push({
                            x: datapoint.timeStamp,
                            y: datapoint.t1
                        });
                        $scope.logData[1].values.push({
                            x: datapoint.timeStamp,
                            y: datapoint.t3
                        });
                        $scope.logData[2].values.push({
                            x: datapoint.timeStamp,
                            y: datapoint.t4
                        });
                        $scope.logData[3].values.push({
                            x: datapoint.timeStamp,
                            y: datapoint.t5
                        });
                        $scope.logData[4].values.push({
                            x: datapoint.timeStamp,
                            y: datapoint.t6
                        });
                        $scope.logData[5].values.push({
                            x: datapoint.timeStamp,
                            y: datapoint.t7
                        });
                        $scope.logData[6].values.push({
                            x: datapoint.timeStamp,
                            y: datapoint.t8
                        });
                        $scope.logData[7].values.push({
                            x: datapoint.timeStamp,
                            y: datapoint.baseTemp
                        });
                    });
                });
        };

        $scope.calculateTempDelta = function(array) {
            //Return mK / second
            return ((array[array.length - 1]['y'] - array[0]['y']) /
                (array[array.length - 1]['x'] - array[0]['x']) * 1000 * 60).toFixed(3);
        };

        var timeoutChart = $timeout(function() {
            $scope.getChartData
        }, 5050);

        $scope.getChartData = function(num) {
            fridgeService.getData($scope.name, num)
                .then(function(response) {
                    $scope.updateChartData(response.data)
                });
            $scope.chartTimeout = $timeout($scope.getChartData, 5050);
        };

        $scope.updateChartData = function(datas) {
            datas.reverse().forEach(function(data, index, array) {
                $scope.timeStamp = data.timeStamp;
                $scope.tempData[0][0].temp = data.t1.toFixed(3);
                $scope.tempData[1][0].temp = data.t3.toFixed(3);
                $scope.tempData[2][0].temp = data.t4.toFixed(3);
                $scope.tempData[3][0].temp = data.t5.toFixed(3);
                $scope.tempData[4][0].temp = data.t6.toFixed(3); //.toFixed(4);
                $scope.tempData[5][0].temp = data.t7.toFixed(3);
                $scope.tempData[6][0].temp = data.t8.toFixed(3);
                $scope.tempData[7][0].temp = data.baseTemp.toFixed(3);

                if ($scope.tempData[6][0].temp < 289.9) {
                    $scope.fridgeData.currentState = 'Cold';
                    $scope.tempData.forEach(function(element, index) {
                        element[0].values
                            .push({
                                x: $scope.timeStamp,
                                y: element[0].temp
                            });
                        element[0].delta = $scope.calculateTempDelta(element[0].values);
                    });

                    // $scope.$apply();
                    if ($scope.tempData[0][0].values.length > 120) {
                        $scope.tempData[0][0].values.shift();
                        $scope.tempData[1][0].values.shift();
                        $scope.tempData[2][0].values.shift();
                        $scope.tempData[3][0].values.shift();
                        $scope.tempData[4][0].values.shift();
                        $scope.tempData[5][0].values.shift();
                        $scope.tempData[6][0].values.shift();
                        $scope.tempData[7][0].values.shift();
                    }
                } else {
                    $scope.fridgeData.currentState = 'Warm';
                    console.log($scope.fridgeData.currentState);
                }
            });
        };

        $scope.getState = function() {
            fridgeService.state($scope.name)
                .then(function(response) {
                    $scope.fridgeData.currentState = response.data.fridgeStatus
                        // $scope.fridgeData.currentJob = response.data.currentJob
                })
        };

        $scope.init = function() {
            $scope.name = 'DR1'
            $scope.getState()
            $scope.temp = [{}, {}, {}, {}, {}, {}, {}, {}];
            $scope.getChartData(120);
            // $scope.getHistoryData();
        };

        $scope.init();

        $scope.$on('$destory', function(event) {
            console.log('destroying')
            $timeout.cancel($scope.chartTimeout);
        });
    }
]);
