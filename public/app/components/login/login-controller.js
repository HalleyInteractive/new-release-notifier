(function() {
    'use strict';
        angular.module('newReleaseNotifier').controller('LoginCtrl', function($scope, $window)
        {
            $scope.googleLogin = function()
            {
                $window.location.href = '/auth/google'
            }
        });
}());
