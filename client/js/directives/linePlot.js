var linePlotter = angular.module('linePlotter', []);

linePlotter.directive('linePlot', [function () {
    function linkFunc(scope, element, attrs) {
        scope.$watch('linePlots', function (plots) {
            Plotly.newPlot(element[0], plots);
        });
    }

    return {
        link: linkFunc
    };
}]);