angular.module('labControlApp').controller('ADR1Ctrl', ['$scope', '$http', function($scope, $http) {
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