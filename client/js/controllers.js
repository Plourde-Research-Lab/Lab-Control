'use strict';

angular.module('labControlApp').controller('ADRCtrl', ['$scope', '$http', function ($scope, $http) {
	$scope.model = {
		message: "This is an app."
	};
	$scope.jobs=[];
	$scope.addJob = function  () {
		$scope.jobs.push(
			{
				name: $scope.newJob.name,
				date: $scope.newJob.date
			});
		console.log($scope);
	};
	$scope.options = {
		format: 'yyyy-mm-dd' // ISO formatted date
	};
}]);