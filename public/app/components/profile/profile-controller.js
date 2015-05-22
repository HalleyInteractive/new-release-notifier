(function() {
    'use strict';
    angular.module('newReleaseNotifier').controller('ProfileCtrl', function($scope, Profile, ngNotify)
    {
        $scope.pageTitle = "Profile";
        $scope.user = Profile.get();

        $scope.profileSaveHandler = function()
        {
            // TODO: Check status code before saying everything have been saved ;)
            ngNotify.set('Your settings have been saved!', 'success');
        };
    });
}());
