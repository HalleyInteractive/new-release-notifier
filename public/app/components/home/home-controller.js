(function() {
    'use strict';
    angular.module('newReleaseNotifier').controller('HomeCtrl', function($scope, $window)
    {
      $scope.googleLogin = function()
      {
          $window.location.href = '/auth/google';
      }
    });
}());
