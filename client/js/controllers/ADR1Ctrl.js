angular.module('labControlApp').controller('ADR1Ctrl', [
    '$scope', '$timeout', 'fridgeService', 'ADRService',
    function($scope, $timeout, fridgeService, ADRService) {
        $scope.model = {
            message: 'This is the controller for dealing with ADR1.',
            monitorMinutes: 5
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
                        return d3.format('.5n')(d);
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

        $scope.historyChartOptions = {
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
                tooltips: true,
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

        $scope.logData = [{
            key: '60K Temperature',
            values: []
        }, {
            key: '3K Temperature',
            values: []
        }];

        $scope.fridgeData = {
            currentState: 'Magup',
            switchState: 'Closed',
            magupPercentage: '60',
            percentComplete: '0',
            jobStart: ''
        };

        $scope.historyData = [{
            key: '60K Temperature',
            values: []
        }, {
            key: '3K Temperature',
            values: []
        }];

        $scope.getLogData = function(variable) {
            var timeStep = 5; //Number of seconds between data collection

            fridgeService.getData($scope.name, variable / timeStep)
                .then(function(response) {
                    $scope.logData[0].values = [];
                    $scope.logData[1].values = [];
                    response.data.forEach(function(datapoint, index) {
                        $scope.logData[0].values.push({
                            x: datapoint.timeStamp,
                            y: datapoint.sixtyKTemp
                        });
                        $scope.logData[1].values.push({
                            x: datapoint.timeStamp,
                            y: datapoint.threeKTemp
                        });
                    })
                });
        };

        $scope.downloadData = function (variable) {
            var timeStep = 5;
            fridgeService.downloadData($scope.name, variable / timeStep);
        };

        $scope.calculateTempDelta = function(array) {
            //Return mK / second
            return ((array[array.length - 1]['y'] - array[0]['y']) /
                (array[array.length - 1]['x'] - array[0]['x']) * 1000).toFixed(3);
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
                $scope.tempData[0][0].temp = data.sixtyKTemp.toFixed(4);
                $scope.tempData[1][0].temp = data.threeKTemp.toFixed(3);
                $scope.v = data.magnetVoltage.toFixed(4);
                $scope.i = data.psCurrent.toFixed(4);
                $scope.percentComplete = data.percentComplete;
                if ($scope.tempData[0][0].temp < 300) {
                    $scope.tempData.forEach(function(element, index) {
                        element[0].values.push({
                            x: $scope.timeStamp,
                            y: element[0].temp
                        });
                        element[0].delta = $scope.calculateTempDelta(element[0].values);
                    });

                    $scope.magnetData[0][0].values.push({
                        x: $scope.timeStamp,
                        y: $scope.v
                    });
                    $scope.magnetData[1][0].values.push({
                        x: $scope.timeStamp,
                        y: $scope.i
                    });
                    // $scope.$apply();
                    if ($scope.tempData[0][0].values.length > 120) {
                        $scope.tempData[0][0].values.shift();
                        $scope.tempData[1][0].values.shift();
                        $scope.magnetData[0][0].values.shift();
                        $scope.magnetData[1][0].values.shift();
                    }
                } else {
                    console.log($scope.fridgeData.currentState);
                }
            });
        };

        $scope.getHistoryData = function() {
            fridgeService.getHistory($scope.name)
                .then(function(response) {
                    $scope.historyData[0].values = [];
                    $scope.historyData[1].values = [];
                    response.data.forEach(function(datapoint, index) {
                        $scope.historyData[0].values.push({
                            x: datapoint.timeStamp,
                            y: datapoint.sixtyKTemp
                        });
                        $scope.historyData[1].values.push({
                            x: datapoint.timeStamp,
                            y: datapoint.threeKTemp
                        });
                    });
                })
        };

        $scope.addHistoryPoint = function(historyNote) {
            fridgeService.addHistory($scope.name, historyNote)
                .then(function(response) {
                    $scope.getHistoryData()
                });
        };

        $scope.magup = function() {
            ADRService.magup($scope.name)
                .then(function(response) {
                    console.log('Magging up')
                    $setTimeout($scope.getState(), 6000);
                });
        };

        $scope.magdown = function() {
            ADRService.magdown($scope.name)
                .then(function(response) {
                    console.log('Magging up')
                    $setTimeout($scope.getState(), 10000);
                })
        };

        $scope.magupFlag = function() {
            var magupFlag = $scope.fridgeData.currentState.indexOf("Cold") > -1
            magupFlag = magupFlag || ($scope.fridgeData.currentState.indexOf("Magdown") > -1)
            magupFlag = magupFlag || ($scope.fridgeData.currentState.indexOf("Soak") > -1)
            if (magupFlag) {
                return false
            } else {
                return true
            }
            // console.log('blah')
            $scope.getState()
        };

        $scope.soakFlag = function() {
            if ($scope.fridgeData.currentJob == "Soak") {
                return true
            } else {
                return false
            }

            $scope.getState()
        };

        $scope.magdownFlag = function() {
            if ($scope.fridgeData.currentJob == "Magup" || $scope.fridgeData.currentJob == "Soak") {
                return false
            } else {
                return true
            }

            $scope.getState()
        };

        $scope.getState = function() {
            fridgeService.state($scope.name)
                .then(function(response) {
                    $scope.fridgeData.currentState = response.data.fridgeStatus;
                    $scope.fridgeData.currentJob = response.data.currentJob;
                    $scope.fridgeData.jobStart = moment.unix(response.data.jobStart).add(5, 'hours');
                })
        }

        $scope.init = function() {
            $scope.name = 'ADR1'
            $scope.getState()
            $scope.temp = [{}, {}];
            $scope.getChartData(120);
            $scope.getHistoryData();
        };

        $scope.init();

        $scope.$on('$destory', function(event) {
            console.log('destroying')
            $timeout.cancel($scope.chartTimeout);
        });


    }
]);
