'use strict';

// Declare app level module which depends on views, and components
angular.module('mteach', [
  'ngRoute',
  'mteach.home',
  'mteach.profile',
  'mteachapp',
  'firebase',
  'mteach.collection',
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/home'});
}]);
