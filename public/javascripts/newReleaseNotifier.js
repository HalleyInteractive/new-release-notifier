(function()
{

  var nrn = angular.module('newReleaseNotifier', []);
  nrn.config(function($interpolateProvider)
  {
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
  });

  nrn.controller('provider-lastfm', function()
  {
    this.username = '';
    this.apiKey = '';
  });
  
})();
