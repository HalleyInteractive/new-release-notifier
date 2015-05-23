(function() {
    'use strict';
    angular.module('newReleaseNotifier').controller('ProfileCtrl', function($scope, $http, Profile, ngNotify)
    {
        $scope.pageTitle = "Profile";
        $scope.user = Profile.get();

        $scope.profileSaveHandler = function()
        {
            // TODO: Check status code before saying everything have been saved ;)
            ngNotify.set('Your settings have been saved!', 'success');
        };

        $scope.getPushbulletDeviceList = function()
        {
             $http.get('/api/profile/pushbullet/devicelist')
            .success($scope.getPushbulletDeviceListSuccess)
            .error($scope.getPushbulletDeviceListError);
        };

        $scope.getPushbulletDeviceListSuccess = function(response)
        {
            if(response !== '')
            {
                // TODO: Save complete device to users profile. Including the nickname
                $scope.user.notificationproviders.pushbullet.deviceList = response.devices;
            } else {
                console.log("Accesstoken incorrect");
                ngNotify.set('Accesstoken incorrect', 'warn');
            }
        };

        $scope.getPushbulletDeviceListError = function(error)
        {
            ngNotify.set('Error getting your decice list from Pushbullet', 'error');
        };
    });
}());
