(function() {
    'use strict';
    angular.module('newReleaseNotifier').controller('ProfileCtrl', function($scope, Profile)
    {
        $scope.user = Profile.get();
    });
}());
