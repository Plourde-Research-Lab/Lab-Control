angular.module('labControlApp').controller('liqCtrl', ['$scope', '$http', function($scope, $http) {

$scope.chartConfig = {
	visible: true,
	//autorefresh: true,
	refreshDataOnly: true
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

$scope.liqData = [
	{
		key: "Pressure (psig)", //#0
		values: []
	},
	{
		key: "Heat (W)", //#1
		values: []
	},
	{
		key: "Temp (K)", //#2
		values: []
	},
	{
		key: "Level (cm)", //#3
		values: []
	},
	{
		key: "Level (L)", //#4
		values: []
	},
	{
		key: "Water In T (units)", //#5
		values: []
	},
	{
		key: "Water Out T (units)", //#6
		values: []
	},
	{
		key: "He Gas T (units)", //#77
		values: []
	},
	{
		key: "Oil T (units)", //#8
		values: []
	},
	{
		key: "Avg. Lo Pres (units)", //#9
		values: []
	},
	{
		key: "Avg. Hi Pres (units)", //#10
		values: []
	},
	{
		key: "LN2 %", //#11
		values: []
	},
	{
		key: "Cyl P (units)", //#12
		values: []
	},
	{
		key: "He Purity", //#13
		values: []
	}
];

$scope.recentData = [ //Level(L), Level(cm), Cyl pressure or something
	{
		key: "Level (cm)", //#3
		values: []
	},
	{
		key: "Level (L)", //#4
		values: []
	},
	{
		key: "Cyl P (units)", //#12
		values: []
	}
];


$scope.getLiqData = function(numPoints) {
	timeNow = Date.now();
	num = timeNow - (numPoints * 1000) - 14400000;
	$http.get('/getLiqData', {params: {num:num} }).success(function(data, status, headers, config) {
		console.log("Res from getLiqData: ", data);
		length = $scope.liqData.length;
		for(i=0; i < length; i++) {
			$scope.liqData[i].values = [];
		};
		for(i=0; i < data.length; i++) {
			$scope.liqData[0].values.push({x: data[i].timeStamp, y: data[i].pres});
			$scope.liqData[1].values.push({x: data[i].timeStamp, y: data[i].heat});
			$scope.liqData[2].values.push({x: data[i].timeStamp, y: data[i].temp});
			$scope.liqData[3].values.push({x: data[i].timeStamp, y: data[i].level_cm});
			$scope.liqData[4].values.push({x: data[i].timeStamp, y: data[i].level_L});
			$scope.liqData[5].values.push({x: data[i].timeStamp, y: data[i].water_in});
			$scope.liqData[6].values.push({x: data[i].timeStamp, y: data[i].water_out});
			$scope.liqData[7].values.push({x: data[i].timeStamp, y: data[i].he_gas_T});
			$scope.liqData[8].values.push({x: data[i].timeStamp, y: data[i].oil_T});
			$scope.liqData[9].values.push({x: data[i].timeStamp, y: data[i].lo_pres});
			$scope.liqData[10].values.push({x: data[i].timeStamp, y: data[i].hi_pres});
			$scope.liqData[11].values.push({x: data[i].timeStamp, y: data[i].ln2});
			$scope.liqData[12].values.push({x: data[i].timeStamp, y: data[i].cyl_p});
			$scope.liqData[13].values.push({x: data[i].timeStamp, y: data[i].he_purity});
			$scope.recentData[0].values.push({x: data[i].timeStamp, y: data[i].level_cm});
			$scope.recentData[1].values.push({x: data[i].timeStamp, y: data[i].level_L});
			$scope.recentData[2].values.push({x: data[i].timeStamp, y: data[i].cyl_p});
		};
	});
	console.log($scope.liqData);
	console.log($scope.recentData);
};

// $scope.buttonClicked = function() {
// 	console.log("Create Note button clicked");
// };


}]);



