'use strict';

var labControlApp = angular.module('labControlApp', [
    'ngRoute', 'nvd3', 'ui.bootstrap'
    ]);

labControlApp.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'partials/index.html',
            controller: 'mainCtrl'
        }).
        when('/jobs', {
            templateUrl: 'partials/jobs.html',
            controller: 'jobCtrl'
        }).
        when('/dr1', {
            templateUrl: 'partials/dr.html',
            controller: 'DR1Ctrl'
        }).
        when('/dr2', {
            templateUrl: 'partials/dr.html',
            controller: 'DR2Ctrl'
        }).
        when('/adr1', {
            templateUrl: 'partials/adr.html',
            controller: 'ADR1Ctrl'
            // resolve: resolveController('/js/controllers/ADR2Ctrl.js')
        }).
        when('/adr2', {
            templateUrl: 'partials/adr.html',
            controller: 'ADR2Ctrl'
        }).
        otherwise({
            redirectTo: '/'
        });

    $locationProvider.html5Mode(true);
}]);
