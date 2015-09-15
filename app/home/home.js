'use strict';

angular.module('mteach.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'home/home.html',
    controller: 'HomeCtrl'
  });
}])

.controller('HomeCtrl', ['$scope','$firebaseAuth','$firebaseObject', function($scope, $firebaseAuth,$firebaseObject) {
    var ref = new Firebase('https://shining-fire-6589.firebaseio.com');

    $scope.showModal = false;
    $scope.authData = null;
	$firebaseObject(ref.child("collections")).$bindTo($scope,"collections");
    $firebaseObject(ref.child("users")).$bindTo($scope,"users");

    // var collections = new Firebase('https://shining-fire-6589.firebaseio.com/collections');
    // $scope.sortedCollections = [];
    // collections.orderByChild("upvoteTotal").on("child_added", function(snapshot) {
    //   $scope.sortedCollections.push(snapshot.val());
    //   console.log(snapshot.val());
    // });

    console.log('ehllo----');

    var auth = $firebaseAuth(ref);
	auth.$onAuth(function(authData){
        console.log("currently",authData);
        $scope.authData = authData;
    });

	$scope.processKeypress = function($event){
		if($event.which==13)
			$scope.addCollection();
	}

    $scope.addCollection = function() {
        var collectionInd = generatePushID();
        if($scope.users[$scope.authData.uid].collectionIDs == null){
            $scope.users[$scope.authData.uid].collectionIDs = {}
        }

		$scope.users[$scope.authData.uid].collectionIDs[generatePushID()]=collectionInd;
		$scope.collections[collectionInd] = {
			title: $scope.newcollection.title,
			type: $scope.newcollection.type,
			desc: $scope.newcollection.description || '',
			tags: $scope.newcollection.tags || [],
			authorId: $scope.authData.uid,
            upvoteTotal: 0,
			date: Date.now()
		};
    };

	$scope.resetCollectionForm = function(){
		$scope.newcollection = {"type":"Reference"};
	};
	$scope.resetCollectionForm();

	//https://gist.github.com/mikelehen/3596a30bd69384624c11
	/**
	 * Fancy ID generator that creates 20-character string identifiers with the following properties:
	 *
	 * 1. They're based on timestamp so that they sort *after* any existing ids.
	 * 2. They contain 72-bits of random data after the timestamp so that IDs won't collide with other clients' IDs.
	 * 3. They sort *lexicographically* (so the timestamp is converted to characters that will sort properly).
	 * 4. They're monotonically increasing.  Even if you generate more than one in the same timestamp, the
	 *    latter ones will sort after the former ones.  We do this by using the previous random bits
	 *    but "incrementing" them by 1 (only in the case of a timestamp collision).
	 */
	var generatePushID = (function() {
	  // Modeled after base64 web-safe chars, but ordered by ASCII.
	  var PUSH_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz'.split("").reverse().join("");

	  // Timestamp of last push, used to prevent local collisions if you push twice in one ms.
	  var lastPushTime = 0;

	  // We generate 72-bits of randomness which get turned into 12 characters and appended to the
	  // timestamp to prevent collisions with other clients.  We store the last characters we
	  // generated because in the event of a collision, we'll use those same characters except
	  // "incremented" by one.
	  var lastRandChars = [];

	  return function() {
		var now = new Date().getTime();
		var duplicateTime = (now === lastPushTime);
		lastPushTime = now;

		var timeStampChars = new Array(8);
		for (var i = 7; i >= 0; i--) {
		  timeStampChars[i] = PUSH_CHARS.charAt(now % 64);
		  // NOTE: Can't use << here because javascript will convert to int and lose the upper bits.
		  now = Math.floor(now / 64);
		}
		if (now !== 0) throw new Error('We should have converted the entire timestamp.');

		var id = timeStampChars.join('');

		if (!duplicateTime) {
		  for (i = 0; i < 12; i++) {
			lastRandChars[i] = Math.floor(Math.random() * 64);
		  }
		} else {
		  // If the timestamp hasn't changed since last push, use the same random number, except incremented by 1.
		  for (i = 11; i >= 0 && lastRandChars[i] === 63; i--) {
			lastRandChars[i] = 0;
		  }
		  lastRandChars[i]++;
		}
		for (i = 0; i < 12; i++) {
		  id += PUSH_CHARS.charAt(lastRandChars[i]);
		}
		if(id.length != 20) throw new Error('Length should be 20.');

		return id;
	  };
	})();
	//end generatePushID()

	$scope.upvote = function(key){
        var collection = $scope.collections[key];
		if($scope.authData==null)alert("Log in to do that");
		else{
            if (collection.upvotes == null) collection.upvotes = {}
			collection.upvotes[$scope.authData.uid] = !collection.upvotes[$scope.authData.uid];
            $scope.collections[key] = collection;
		}
	};
	$scope.countupvotes = function(collection){
        var total = Object.keys(collection.upvotes || {}).reduce(function (previous, key) {
			return previous + collection.upvotes[key];
		}, 0);
        collection.upvoteTotal = total;
		return total //this is brilliant http://stackoverflow.com/a/15748853/1181387
	};
	$scope.upvoted = function(collection){
		return $scope.authData && collection.upvotes && collection.upvotes[$scope.authData.uid];
	};

    $scope.deleteCollection = function(key, collections){
        delete collections[key];
    }
}])
