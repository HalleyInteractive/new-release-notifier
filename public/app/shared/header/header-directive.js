(function() {
    'use strict';
    angular.module('newReleaseNotifier').directive('header', function()
    {
        return {
            restrict: "AE",
            controller: function($scope, $http)
            {
              $scope.logout = function()
              {
                  $http.get('/auth/logout');
              };
            },
            controllerAs: 'headerCtrl',
            templateUrl: 'app/shared/header/header-view.html'
        };
    });
}());
