(function() {
  'use strict';
  angular.module('newReleaseNotifier').filter('escape', function() {
    return window.encodeURIComponent;
  });
}());
