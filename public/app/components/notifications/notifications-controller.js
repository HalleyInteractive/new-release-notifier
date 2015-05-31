(function() {
    'use strict';
        angular.module('newReleaseNotifier').controller('NotificationsCtrl', function($scope, $http)
        {
            $scope.notifications = [];
            $http.get('api/profile/notifications')
            .success(function(notifications)
            {
              $scope.notifications = notifications;
            })
            .error(function(error)
            {
              console.log(error);
            });
        });
}());
