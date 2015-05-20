(function() {
    'use strict';
    angular.module('newReleaseNotifier').factory('Profile', function($resource)
	{
		return $resource('/api/profile', {id:'@_id'});
	});
}());
