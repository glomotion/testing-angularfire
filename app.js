var app = angular.module("sampleApp", ["firebase"]);

app.controller("SampleCtrl", function($scope, $firebase, $firebaseAuth) {
  var ref = new Firebase("https://crackling-inferno-3267.firebaseio.com/data");
  var sync = $firebase(ref);

  // download the data into a local object
  var syncObject = sync.$asObject();

  // synchronize the object with a three-way data binding
  // click on `index.html` above to see it used in the DOM!
  syncObject.$bindTo($scope, "data");

  var auth = $firebaseAuth(ref);
  auth.$authWithOAuthPopup("google").then(function(authData) {
    console.log("Logged in as:", authData.uid);
  }).catch(function(error) {
    console.error("Authentication failed: ", error);
  });
});