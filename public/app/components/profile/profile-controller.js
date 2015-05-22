(function() {
    'use strict';
    angular.module('newReleaseNotifier').controller('ProfileCtrl', function($scope, Profile, ngNotify)
    {
        $scope.user = Profile.get();

        $scope.profileSaveHandler = function()
        {
            ngNotify.set('Your settings have been saved!', 'success');
        };
    });
}());
