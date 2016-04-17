angular.module('labControlApp').controller('ADR2Ctrl', [
'$scope', '$timeout', 'fridgeService', 'ADRService', 'plotService',
function($scope, $timeout, fridgeService, ADRService, plotService) {
    $scope.model = {
        message: 'This is the controller for dealing with ADR2.',
        monitorMinutes: 5
    };

    $scope.charts = [{
        data: [{
            x: [],
            y: [],
            temp: null,
            delta: null
        }],
        layout: plotService.monitorLayout("60 K")
    }, {
        data: [{
            x: [],
            y: [],
            temp: null,
            delta: null
        }],
        layout: plotService.monitorLayout("3 K")
    }, {
        data: [{
            x: [],
            y: [],
            temp: null,
            delta: null
        }],
        layout: plotService.monitorLayout("GGG Pill")
    }, {
        data: [{
            x: [],
            y: [],
            temp: null,
            delta: null
        }],
        layout: plotService.monitorLayout("FAA Pill")
    }]

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
        $scope.charts[0].data[0].temp = data.sixtyKTemp.toFixed(4);
        $scope.charts[1].data[0].temp = data.threeKTemp.toFixed(3);
        $scope.charts[2].data[0].temp = data.oneKTemp.toFixed(3);
        $scope.charts[3].data[0].temp = data.baseTemp; //.toFixed(4);
        $scope.v = data.magnetVoltage.toFixed(4);
        $scope.i = data.psCurrent.toFixed(4);
        $scope.percentComplete = data.percentComplete;
        // console.log($scope.timeStamp)
        // console.log(moment.utc($scope.timeStamp))
        // console.log(moment.utc(moment.unix($scope.timeStamp)))
        // console.log(moment.unix($scope.timeStamp).local())
        // console.log(moment.utc(moment.unix($scope.timeStamp)).tz('America/New_York'))
        $scope.time = moment.unix($scope.timeStamp).local().toDate()

        if ($scope.charts[0].data[0].temp < 300) {
            $scope.charts.forEach(function(element, index) {
                element.data[0].x.push($scope.time);
                element.data[0].y.push(element.data[0].temp)
                    // element.delta = $scope.calculateTempDelta(element[0].values);
            });

            $scope.magnetChart.data[0].x.push($scope.time);
            $scope.magnetChart.data[0].y.push($scope.v);
            $scope.magnetChart.data[1].x.push($scope.time);
            $scope.magnetChart.data[1].y.push($scope.i);
            // console.log($scope.time)
            if ($scope.charts[0].data[0].x.length > 120) {
                $scope.charts.forEach(function(element, index) {
                    element.data[0].x.shift();
                    element.data[0].y.shift();
                });
                $scope.magnetChart.data.forEach(function(element, index) {
                    element.x.shift();
                    element.y.shift();
                });
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
}

$scope.init = function() {
    $scope.name = 'ADR2'
    $scope.getState()
    $scope.temp = [{}, {}, {}, {}];
    $scope.getChartData(120);
    // $scope.getHistoryData();
    // Plotly.plot("py", $scope.traces, $scope.layout);
};

$scope.init();

$scope.$on('$destory', function(event) {
    console.log('destroying')
    $timeout.cancel($scope.chartTimeout);
});


}]);
