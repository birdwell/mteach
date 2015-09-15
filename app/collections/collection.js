'use strict';

angular.module('mteach.collection', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/collections/:collectionId', {
        templateUrl: 'collections/collection.html',
        controller: 'CollectionCtrl'
    });
}])

.controller('CollectionCtrl', ['$scope', '$routeParams', '$firebaseObject', '$firebaseAuth',
    function($scope, $routeParams, $firebaseObject, $firebaseAuth) {
        //Get ID out of current URL
        var ref = new Firebase('https://shining-fire-6589.firebaseio.com/collections/' + $routeParams.collectionId);
		$firebaseObject(ref).$bindTo($scope,"collection");

		var auth = $firebaseAuth(ref);
		auth.$onAuth(function(authData){
			$scope.authData = authData;
		});

		$scope.newresource = function(){
			if($scope.collection.resources==null)
				$scope.collection.resources=[];
			$scope.collection.resources.push({});
		}

        $scope.deleteResource = function(resource,collection){
            for (var i = 0; i < collection.resources.length; i++) {
                if(collection.resources[i].$$hashKey == resource.$$hashKey){
                    collection.resources.splice(i,1);
                    if(collection.resources == null){
                        $scope.collection.resources=[];
                    }
                }
            }

        }
    }
]);
