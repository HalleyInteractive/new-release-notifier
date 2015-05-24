(function() {
    'use strict';
    angular.module('newReleaseNotifier').factory('Profile', function($resource)
    {
		    return $resource('/api/profile', {id:'@_id'});
    })
    .factory('authHttpResponseInterceptor',['$q','$location',function($q,$location)
    {
      return {
        response: function(response)
        {
            if (response.status === 401)
            {
                console.log("Response 401");
            }
            return response || $q.when(response);
        },
        responseError: function(rejection)
        {
            if (rejection.status === 401)
            {
                $location.path('/login');
            }
            return $q.reject(rejection);
        }
      };
    }])
    .config(['$httpProvider',function($httpProvider)
    {
        // Http Intercpetor to check auth failures for xhr requests
        $httpProvider.interceptors.push('authHttpResponseInterceptor');
    }]);
}());
