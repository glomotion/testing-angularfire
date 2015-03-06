var app = angular.module("sampleApp", ["firebase"]);

app.controller("SampleCtrl", function($scope, $firebase, $firebaseAuth) {

	// 3 WAY DATA SYNC STUFF:
	var ref = new Firebase("//crackling-inferno-3267.firebaseio.com/data");
	var sync = $firebase(ref);

	// download the data into a local object
	var syncObject = sync.$asObject();

	// synchronize the object with a three-way data binding
	// click on `index.html` above to see it used in the DOM!
	syncObject.$bindTo($scope, "data");


	$scope.$watch('data',function(n,o){
		console.log(n);
	})

	// AUTH RELATED STUFF:
	$scope.loggedUser = '(Not logged in)';

	// SIMPLE O-AUTH FLOW TO CALL UPON CLICK:
	$scope.signInWith = function(serviceName) {
		var auth = $firebaseAuth(ref);
		auth.$authWithOAuthPopup(serviceName).then(function(authData) {
			console.log("Logged in as:", authData.uid);
			$scope.loggedUser = authData.uid;
			$scope.fullUserData = authData;
		}).catch(function(error) {
			console.error("Authentication failed: ", error);
			$scope.loggedUser = 'Auth failed: ' + error;
		});
	}

});