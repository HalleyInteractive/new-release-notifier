(function() {
    'use strict';
    angular.module('newReleaseNotifier').directive('header', function()
    {
        return {
            restrict: "AE",
            controller: function($scope, $http, $location)
            {
              $scope.logout = function()
              {
                  $http.get('/auth/logout')
                  .success(function()
                  {
                    $location.path('/login');
                  });
              };
            },
            controllerAs: 'headerCtrl',
            templateUrl: 'app/shared/header/header-view.html'
        };
    });
}());
