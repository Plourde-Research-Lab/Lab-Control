angular.module('labControlApp').controller('ADR2Ctrl', [
    '$scope', '$timeout', 'fridgeService', 'ADRService', 'plotService',
    function($scope, $timeout, fridgeService, ADRService, plotService) {
        $scope.model = {
            message: 'This is the controller for dealing with ADR2.',
            monitorMinutes: 5
        };

        $scope.magnetChart = {
            data: [{
                x: [],
                y: [],
            }, {
                x: [],
                y: [],
                yaxis: 'y2'
            }],
            layout: plotService.magnetLayout()
        };

        $scope.options = {
            displayModeBar: false
        }

        $scope.fridgeData = {
            currentState: 'Magup',
            switchState: 'Closed',
            magupPercentage: '60',
            percentComplete: '0',
            jobStart: ''
        };

        $scope.calculateTempDelta = function(chart) {
            //Return mK / second
            chart.delta = ((chart.y[chart.y.length - 1] - chart.y[0]) /
                (chart.x[chart.x.length - 1] - chart.x[0]) * 1000 * 60).toFixed(3);
            chart.line.color = chart.delta > .01 ? '#F92672' : '#66D9EF'
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

        $scope.getLogData = function(variable) {
            var timeStep = 5; //Number of seconds between data collection

            fridgeService.getData($scope.name, variable / timeStep)
                .then(function(response) {
                    response.data.forEach(function(datapoint, index) {
                        $scope.chartMap.forEach(function(element, index2) {
                            $scope.log.data[index2].x.push(datapoint.timeStamp)
                            $scope.log.data[index2].y.push(datapoint[element])
                        })
                    })
                });
        }

        $scope.updateChartData = function(datas) {
            datas.reverse().forEach(function(data, index, array) {
                $scope.timeStamp = data.timeStamp;
                $scope.chartMap.forEach(function(element, index) {
                    $scope.charts[index].temp = data[element].toFixed(3)
                });
                $scope.v = data.magnetVoltage.toFixed(4);
                $scope.i = data.psCurrent.toFixed(4);
                $scope.percentComplete = data.percentComplete;
                // console.log($scope.timeStamp)
                // console.log(moment.utc($scope.timeStamp))
                // console.log(moment.utc(moment.unix($scope.timeStamp)))
                // console.log(moment.unix($scope.timeStamp).local())
                // console.log(moment.utc(moment.unix($scope.timeStamp)).tz('America/New_York'))
                $scope.time = moment.unix($scope.timeStamp).local().toDate()

                if ($scope.charts[0].temp < 300) {
                    $scope.charts.forEach(function(element, index) {
                        element.x.push($scope.time);
                        element.y.push(element.temp)
                        $scope.calculateTempDelta(element);
                    });

                    $scope.magnetChart.data[0].x.push($scope.time);
                    $scope.magnetChart.data[0].y.push($scope.v);
                    $scope.magnetChart.data[1].x.push($scope.time);
                    $scope.magnetChart.data[1].y.push($scope.i);
                    // console.log($scope.time)
                    // if ($scope.charts[0].x.length > 120) {
                    //     $scope.charts.forEach(function(element, index) {
                    //         element.x.shift();
                    //         element.y.shift();
                    //     });
                    //     $scope.magnetChart.data.forEach(function(element, index) {
                    //         element.x.shift();
                    //         element.y.shift();
                    //     });
                    // }
                } else {
                    console.log($scope.fridgeData.currentState);
                }
                // $scope.charts.forEach(function(element, index) {
                //             element.x.shift();
                //             element.y.shift();
                //         });
                // console.log($scope.charts)
            });
        };

        $scope.getHistoryData = function() {
            fridgeService.getHistory($scope.name)
                .then(function(response) {
                    $scope.historyData[0].values = [];
                    $scope.historyData[1].values = [];
                    $scope.historyData[2].values = [];
                    $scope.historyData[3].values = [];
                    response.data.forEach(function(datapoint, index) {
                        $scope.historyData[0].values.push({
                            x: datapoint.timeStamp,
                            y: datapoint.sixtyKTemp
                        });
                        $scope.historyData[1].values.push({
                            x: datapoint.timeStamp,
                            y: datapoint.threeKTemp
                        });
                        $scope.historyData[2].values.push({
                            x: datapoint.timeStamp,
                            y: datapoint.oneKTemp
                        });
                        $scope.historyData[3].values.push({
                            x: datapoint.timeStamp,
                            y: datapoint.baseTemp
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
        };

        $scope.init = function() {
            $scope.name = 'ADR2'
            $scope.getState()
                // List of charts, and mapping from charts to variable names
            $scope.chartList = ['60 K', '3 K', 'GGG Pill', 'FAA Pill'];
            $scope.chartMap = ['sixtyKTemp', 'threeKTemp', 'oneKTemp', 'baseTemp'];
            $scope.charts = []
            $scope.chartList.forEach(function(item, index) {
                $scope.charts.push(plotService.monitorTrace(item))
            });
            $scope.log = plotService.logPlot($scope.charts);
            $scope.getChartData(120);
        };

        $scope.init();

        $scope.$on('$destory', function(event) {
            console.log('destroying')
            $timeout.cancel($scope.chartTimeout);
        });
    }
]);
