angular.module('labControlApp')
    .controller('mainCtrl', [
        '$scope', '$location', 'fridgeService',
        function($scope, $location, fridgeService) {
    $scope.model = {
        message: 'This is the main page controller',
        fridges: [
            {
                name: 'ADR1',
                type: 'ADR',
                status: ''
            },
            {
                name: 'DR1',
                type: 'DR',
                status: ''
            },
            {
                name: 'ADR2',
                type: 'ADR',
                status: ''
            },
            {
                name: 'DR2',
                type: 'DR',
                status: ''
            }
        ]
    };
    $scope.$location = $location;

    $scope.getStatus = function () {
        $scope.model.fridges.forEach(function (fridge, index, array) {
            fridgeService.state(fridge.name)
                .then(function (response) {
                    if (response.status != 304 && response.data != null) {
                        console.log(response)
                        fridge.status = response.data.fridgeStatus                        
                    } else {
                        fridge.status = "Not Connected"
                    }

                });
            });
    };

    $scope.init = function () {
            $scope.getStatus()
    };

    $scope.init()
}]);
