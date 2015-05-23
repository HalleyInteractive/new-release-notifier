(function() {
    'use strict';
    angular.module('newReleaseNotifier').directive('header', function()
    {
        return {
            restrict: "AE",
            controller: function($scope, $window)
            {
              $scope.googleLogin = function()
              {
                  $window.location.href = '/auth/logout';
              };
            },
            controllerAs: 'headerCtrl',
            templateUrl: 'app/shared/header/header-view.html'
        };
    });
}());
