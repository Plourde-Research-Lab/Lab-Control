angular.module('labControlApp').controller('DR1Ctrl', [
    '$scope', '$http', '$timeout', 'fridgeService', 'plotService',

    function($scope, $http, $timeout, fridgeService, plotService) {
        $scope.model = {
            message: 'This is the controller for dealing with DR1.'
        };

        $scope.chartconfig = {
            visible: true,
            autorefresh: true,
            refreshDataOnly: true
        };

        $scope.charts = [{
            data: [{
                x: [],
                y: [],
                temp: null,
                delta: null,
                line: {
                    color: '#66D9EF',
                    width: 2
                }
            }],
            layout: plotService.monitorLayout("T1")
        }, {
            data: [{
                x: [],
                y: [],
                temp: null,
                delta: null,
                line: {
                    color: '#66D9EF',
                    width: 2
                }
            }],
            layout: plotService.monitorLayout("T3")
        }, {
            data: [{
                x: [],
                y: [],
                temp: null,
                delta: null,
                line: {
                    color: '#66D9EF',
                    width: 2
                }
            }],
            layout: plotService.monitorLayout("T4")
        }, {
            data: [{
                x: [],
                y: [],
                temp: null,
                delta: null,
                line: {
                    color: '#66D9EF',
                    width: 2
                }
            }],
            layout: plotService.monitorLayout("T5")
        }, {
            data: [{
                x: [],
                y: [],
                temp: null,
                delta: null,
                line: {
                    color: '#66D9EF',
                    width: 2
                }
            }],
            layout: plotService.monitorLayout("T6")
        }, {
            data: [{
                x: [],
                y: [],
                temp: null,
                delta: null,
                line: {
                    // get color() {
                    //     console.log(this.delta)
                    //     return this.delta > 0 ? '#66D9EF': '#F92672'
                    // },
                    width: 2
                }
            }],
            layout: plotService.monitorLayout("T7")
        }, {
            data: [{
                x: [],
                y: [],
                temp: null,
                delta: null,
                line: {
                    color: '#66D9EF',
                    width: 2
                }
            }],
            layout: plotService.monitorLayout("T8")
        }, {
            data: [{
                x: [],
                y: [],
                temp: null,
                delta: null,
                line: {
                    color: '#66D9EF',
                    width: 2
                }
            }],
            layout: plotService.monitorLayout("Base")
        }];
        $scope.options = {
            displayModeBar: false
        }
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
            }],
            [{
                key: 'baseTemp',
                values: [],
                temp: null,
                delta: null
            }]
        ];

        $scope.logData = [{
            key: 'T1',
            values: []
        }, {
            key: 'T3',
            values: []
        }, {
            key: 'T4',
            values: []
        }, {
            key: 'T5',
            values: []
        }, {
            key: 'T6',
            values: []
        }, {
            key: 'T7',
            values: []
        }, {
            key: 'T8',
            values: []
        }, {
            key: 'baseTemp',
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

        $scope.calculateTempDelta = function(chart) {
            //Return mK / second

            chart.delta = ((chart.y[chart.y.length - 1] - chart.y[0]) /
                (chart.x[chart.x.length - 1] - chart.x[0]) * 1000 * 60).toFixed(3);
            chart.line.color = chart.delta > .01 ? '#F92672': '#66D9EF'
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
                $scope.charts[0].data[0].temp = data.t1.toFixed(3);
                $scope.charts[1].data[0].temp = data.t3.toFixed(3);
                $scope.charts[2].data[0].temp = data.t4.toFixed(3);
                $scope.charts[3].data[0].temp = data.t5.toFixed(3);
                $scope.charts[4].data[0].temp = data.t6.toFixed(3); //.toFixed(4);
                $scope.charts[5].data[0].temp = data.t7.toFixed(3);
                $scope.charts[6].data[0].temp = data.t8.toFixed(3);
                $scope.charts[7].data[0].temp = data.baseTemp.toFixed(3);
                $scope.time = moment.unix($scope.timeStamp).local().toDate()

                if ($scope.charts[6].data[0].temp < 289.9) {
                    $scope.fridgeData.currentState = 'Cold';
                    $scope.charts.forEach(function(element, index) {
                        element
                        element.data[0].x.push($scope.time);
                        element.data[0].y.push(element.data[0].temp)
                        $scope.calculateTempDelta(element.data[0]);
                    });

                    // $scope.$apply();
                    if ($scope.charts[0].data[0].x.length > 120) {
                        $scope.charts.forEach(function(element, index) {
                            element.data[0].x.shift();
                            element.data[0].y.shift();
                        });
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
