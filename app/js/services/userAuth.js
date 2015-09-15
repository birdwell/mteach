var app = angular.module("userAuth", ["firebase"]);

app.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    var ref = new Firebase("https://shining-fire-6589.firebaseio.com");
    return $firebaseAuth(ref);
  }
]);

app.factory("User", ["$scope", "Auth",
  function($scope, Auth) {
    $scope.auth = Auth;

    // any time auth status updates, add the user data to scope
    $scope.auth.$onAuth(function(authData) {
      $scope.authData = authData;
      activeUser = $scope.auth;
      return activeUser;
    });
  }
]);
