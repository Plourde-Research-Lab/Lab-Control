angular.module('labControlApp').controller('DR1Ctrl', [
    '$scope', '$http', '$timeout', 'fridgeService', 'plotService',

    function($scope, $http, $timeout, fridgeService, plotService) {
        $scope.model = {
            message: 'This is the controller for dealing with DR1.'
        };

        $scope.fridgeData = {};

        $scope.options = {
            displayModeBar: false
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

        $scope.getLogData = function(variable) {
            var timeStep = 5; //Number of seconds between data collection
            $scope.log = plotService.logPlot($scope.charts);

            fridgeService.getData($scope.name, variable / timeStep)
                .then(function(response) {
                    console.log(response.data)
                    response.data.forEach(function(datapoint, index) {
                        $scope.chartMap.forEach(function(element, index2) {
                            $scope.log.data[index2].x.push(moment.unix(datapoint.timeStamp).toDate())
                            $scope.log.data[index2].y.push(datapoint[element])
                        })
                    })
                });
        }

        /**
         * Calculates temperature slope from first and last data points
         * @param {Object} chart
         */
        $scope.calculateTempDelta = function(chart) {
            // Return K / Minute
            // chart.delta = ((chart.y[chart.y.length - 1] - chart.y[0]) /
            //     (chart.x[chart.x.length - 1] - chart.x[0]) * 1000 * 60).toFixed(3);
            if (chart.y.length > 1) {
                chart.delta = (math.mean(diff(chart.y)) / 5 * 60).toFixed(3)
            }
            // Update color to reflect warming or cooling
            chart.line.color = chart.delta > .01 ? '#F92672' : '#66D9EF'
        };

        /**
         * Service request to retrieve 'num' data points
         * @param {Number} num
         */
        $scope.getChartData = function(num) {
            fridgeService.getData($scope.name, num)
                .then(function(response) {
                    $scope.updateChartData(response.data)
                });
            $scope.chartTimeout = $timeout($scope.getChartData, 5050);
        };

        /**
         * Updates Chart Objects with data point(s)
         * @param {Array} datas
         */
        $scope.updateChartData = function(datas) {
            datas.reverse().forEach(function(data, index, array) {
                $scope.timeStamp = data.timeStamp;
                $scope.chartMap.forEach(function(element, index) {
                    // Make sure property exists
                    if (typeof(data[element] !== 'undefined')) {
                        $scope.charts[index].temp = data[element].toFixed(3)
                    }
                });
                $scope.time = moment.unix($scope.timeStamp).toDate()
                if ($scope.charts[1].temp < 289.9) {
                    $scope.charts.forEach(function(element, index) {
                        element.x.push($scope.time);
                        element.y.push(element.temp)
                        $scope.calculateTempDelta(element);
                    });
                    if ($scope.charts[0].x.length > 120) {
                        $scope.charts.forEach(function(element, index) {
                            element.x.shift();
                            element.y.shift();
                        });
                    }
                } else {
                    $scope.fridgeData.currentState = 'Warm';
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

        /**
         * Initializes $scope
         */
        $scope.init = function() {
            $scope.name = 'DR1'
            $scope.getState()
            switch ($scope.fridgeData.currentState) {
                case "Cold":
                    $scope.chartList = ['Helium Vessel In', 'Helium Vessel Out', 'Nitrogen Vessel', 'Sinter',
                        'Mixing Chamber RuOx', '1K Pot Pressure', 'Still Pressure'
                    ];
                    $scope.chartMap = ['HeIn', 'HeOut', 'LN2Out', 'sinter', 'MXCR', '1KPotPressure', 'stillPressure']
                    // $scope.chartMap = ['t5', 't6', 't7', 't8', 'baseTemp']
                    break;
                default:
                    $scope.chartList = ['Mixing Chamber Diode', 'Still', '1K Pot',
                        'Helium Vessel In', 'Helium Vessel Out', 'Nitrogen Vessel', 'Sinter',
                        'Mixing Chamber RuOx'
                    ];
                    $scope.chartMap = ['MXCD', 'still', '1KPot', 'HeIn', 'HeOut', 'LN2Out', 'sinter', 'MXCR'];
                    // $scope.chartMap = ['MXCD', 't3', 't4', 't5', 't6', 't7', 't8', 'baseTemp']
                    break;
            }

            // Initialize chart objects
            $scope.charts = [];
            $scope.chartList.forEach(function(item, index) {
                $scope.charts.push(plotService.monitorTrace(item));
            });
            $scope.log = plotService.logPlot($scope.charts);

            // Load initial 10 minutes of data
            $scope.getChartData(120);
        };

        $scope.init();

        $scope.$on('$destory', function(event) {
            console.log('destroying')
            $timeout.cancel($scope.chartTimeout);
        });
    }
]);
