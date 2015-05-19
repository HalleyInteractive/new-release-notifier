(function() {
    'use strict';
    angular.module('newReleaseNotifier').config(['$routeProvider', function($routeProvider) {
        $routeProvider.
        when('/', {
            templateUrl: 'app/components/home/home-view.html',
            controller: 'HomeCtrl'
        }).
        when('/login', {
            templateUrl: 'app/components/login/login-view.html',
            controller: 'LoginCtrl'
        }).
        when('/profile', {
            templateUrl: 'app/components/profile/profile-view.html',
            controller: 'ProfileCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
    }]);
}());
