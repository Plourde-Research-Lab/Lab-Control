'use strict';

angular.module('labControlApp').controller('MainCtrl', ['$scope', '$location', function ($scope, $location) {
	$scope.model = {
		message: "This is the main page controller",
		fridges: [
			{
				name: "ADR1",
				type: "ADR",
				status: "Warm"
			},
			{
				name: "DR1",
				type: "DR",
				status: "Cold"
			},
			{
				name: "ADR2",
				type: "ADR",
				status: "Warm"
			},
			{
				name: "DR2",
				type: "DR",
				status: "Warm"
			}
		]
	};
	$scope.$location = $location;
}])

angular.module('labControlApp').controller('ADR1Ctrl', ['$scope', '$http', function ($scope, $http) {
	$scope.model = {
		message: "This is the controller for dealing with ADR1."
	}

	$scope.chartconfig = {
		visible: true,
		autorefresh: true,
		refreshDataOnly: true
	}

    $scope.chartoptions = {
	    chart: {
            type: 'lineChart',
            margin : {
                top: 10,
                right: 20,
                bottom: 10,
                left: 20
            },
            x: function(d){ return d.x; },
            y: function(d){ return d.y; },
            useInteractiveGuideline: false,
            showLegend: false,
            transitionDuration: 0,    
            yAxis: {
                tickFormat: function(d){
                   return d3.format('.01f')(d);
                }
            },
            showXAxis: false
        }
	};

	$scope.tempData = [
		[{
			key: "60K Temp",
			values: []
		}],
		[{
			key: "3K Temp",
			values: []
		}],
		[{
			key: "Base Temp",
			values: []
		}]
	]

	$scope.magnetData = [
		[{
			key: "Magnet Voltage",
			values: []
		}],
		[{
			key: "Current",
			values: []
		}]
	]

	$scope.fridgeData = {
		currentState: "Magup",
		switchState: "Closed",
		magupPercentage: "60"
	}

	$scope.getChartData = function () {
		$http.get('/getData').
			success(function (data, status, headers, config) {
				$scope.temp1 = data.x1.toFixed(4);
				$scope.temp2 = data.x2.toFixed(3);
				$scope.temp3 = (data.x3*1000).toFixed(4);
				$scope.v = data.v.toFixed(4);
				$scope.i = data.i.toFixed(4);
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
		setTimeout($scope.getChartData, 1000);	
	}

	$scope.init = function() {

		setTimeout(function() {
			$scope.getChartData()
		}, 200);	

		
	}

	$scope.init()

}]);

angular.module('labControlApp').controller('ADR2Ctrl', ['$scope', '$http', function ($scope, $http) {
	$scope.model = {
		message: "This is the controller for dealing with ADR2."
	};
}]);

angular.module('labControlApp').controller('DR1Ctrl', ['$scope', '$http', function ($scope, $http) {
	$scope.model = {
		message: "This is the controller for dealing with DR1."
	};
}]);

angular.module('labControlApp').controller('DR2Ctrl', ['$scope', '$http', function ($scope, $http) {
	$scope.model = {
		message: "This is the controller for dealing with DR2."
	};
}]);

angular.module('labControlApp').controller('JobCtrl', ['$scope', '$http', function ($scope, $http) {
	$scope.model = {
		message: "This is the controller for dealing with scheduling cooldown cycles for ADRs.",
	};

	$scope.calculateJobs = function () {
		var datePick = $scope.date;
		var timePick = $scope.time;
		var soakTime = parseInt($scope.soakTime);

		var finish_date = new Date(datePick.getFullYear(), datePick.getMonth(),datePick.getDate(),timePick.getHours(),timePick.getMinutes());
		
		var magdownJob = new function() {
			this.type = "Magdown";
			this.finishTime = finish_date;
			this.startTime = new Date(this.finishTime - 60*60000); //Subtract one hour
			this.completed = false;
			this.percentDone = 0;
			this.dateString = this.startTime.toDateString();
			this.timeString = this.startTime.toTimeString();
			this.scheduledOn = Date.now();
		};

		var soakJob = new function() {
			this.type = "Soak",
			this.finishTime = magdownJob.startTime;
			this.startTime = new Date(this.finishTime - soakTime*60000); //Subtract Soak Time
			this.completed = false;
			this.percentDone = 0;
			this.dateString = this.startTime.toDateString();
			this.timeString = this.startTime.toTimeString();
			this.scheduledOn = Date.now();
		};

		var magupJob = new function() {
			this.type = "Magup",
			this.finishTime = soakJob.startTime;
			this.startTime = new Date(this.finishTime - 60*60000); //Subtract magup time
			this.completed = false;
			this.percentDone = 0;
			this.dateString = this.startTime.toDateString();
			this.timeString = this.startTime.toTimeString();
			this.scheduledOn = Date.now();
		};

		$scope.newJobs.push(magdownJob, soakJob, magupJob);
	};

	$scope.removeNewJobs = function() {
		$scope.newJobs = []
	}

	$scope.getJobs = function () {
		$http({
			method: "GET",
			url: "/getJobs1",
			params: $scope.adrs[0]
		}).
		success(function (response){
			$scope.adrs[0].jobs = response
			console.log(response.length + " jobs loaded for ADR1.")
		}).
		error(function (err) {
			console.log(err);
		});

		$http({
			method: "GET",
			url: "/getJobs2",
			params: $scope.adrs[1]
		}).
		success(function (response){
			$scope.adrs[1].jobs = response
			console.log(response.length + " jobs loaded for ADR2.")
		}).
		error(function (err) {
			console.log(err);
		});
	};

	$scope.saveJobs = function () {
		console.log("Saving " + $scope.newJobs.length + " jobs")
		var urlString = "/addJobs" + $scope.selectedADR.name.slice(-1)
		$http({
			method: "POST",
			data: JSON.stringify($scope.newJobs),
			url: urlString
		}).
		success(function (response){
			console.log("Send was a success-client");
			console.log(response);
			scope.newJobs = [];
		}).
		error(function (error) {
			console.log(error);
		})

		$scope.newJobs=[];
		$scope.getJobs();
	};

	$scope.removeJob = function (job) {
		console.log(job);
		var urlString = "/removeJob" + $scope.selectedADR.name.slice(-1)
		$http({
			method: "POST",
			data: JSON.stringify(job),
			url: urlString
		}).
		success(function (response) {
			console.log("Removal request was a success-client");
			console.log(response);
		}).
		error(function (error) {
			console.log(error);
		})

		$scope.getJobs();
	}	

	$scope.init = function () {

		$scope.today = new Date();


		$scope.adrs = [{
			name: "ADR1",
			jobs: []
		},{
			name: "ADR2",
			jobs: []
		}];
		$scope.selectedADR = $scope.adrs[0]
		console.log("Selected ADR-" + $scope.selectedADR.name)
		$scope.getJobs()
		$scope.newJobs = []
	};

	$scope.init();
}]);