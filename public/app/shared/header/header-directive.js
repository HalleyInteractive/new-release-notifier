(function() {
    'use strict';
    angular.module('newReleaseNotifier').directive('header', function()
    {
        return {
            restrict: "AE",
            controller: function()
            {
                console.log("Control the header");
            },
            controllerAs: 'headerCtrl',
            templateUrl: 'app/shared/header/header-view.html'
        };
    });
}());
