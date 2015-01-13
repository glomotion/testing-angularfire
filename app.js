var app = angular.module("sampleApp", ["firebase","textAngular"]);

app.controller("SampleCtrl", function($scope, $firebase, $firebaseAuth, $q) {

    var ref = new Firebase("//crackling-inferno-3267.firebaseio.com/data");
    var sync;
    var syncObject;

    function setupSync(userId) {
        var userRef = ref.child('users').child(userId);
        sync = $firebase(userRef);

        // download the data into a local object
        syncObject = sync.$asObject();

        // synchronize the object with a three-way data binding
        // click on `index.html` above to see it used in the DOM!
        syncObject.$bindTo($scope, "firebaseData");
    }

	// at pageload, start the RTE off from whatever data was left before...
	// (but make sure this only happens once)
	$scope.$watch('firebaseData',function(n,o){
		if (n && n.text_data !== $scope.editorData) {
			$scope.editorData = n.text_data;
		}
	});

	// as the $scope.editorData object changes (while user types...): 
	// sync it with the main firebase syncObject
	// @TODO: This could probably be debounced a little
	$scope.$watch('editorData', function(n,o){
		if (n && $scope.firebaseData) {
			$scope.firebaseData.text_data = n;
		}
	});
	
    $scope.loggedUser = 'Logging in...';
	
    // A function to check whether this user has already used the system before
    // returns a resolved promise, if the user is new
    function isNewUser(userId) {
        var deferred = $q.defer();
        ref.child('users').child(userId).once('value', function(snapshot) {
            var exists = (snapshot.val() !== null);
            if (exists) {
                deferred.reject();
            } else {
                deferred.resolve();
            }
        });
        return deferred.promise; 
    }

    // Sign in using Twitter, Google or Facebook
    $scope.signInWith = function(serviceName) {
        var auth = $firebaseAuth(ref);
        auth.$authWithOAuthPopup(serviceName).then(function(authData) {

            // Now that they are logged in, check to see if they need a new 
            // Account to be setup for them or not...
            isNewUser(authData.uid).then(function(){
                console.log('making new user');
                ref.child('users').child(authData.uid).set({
                    user_id: authData.uid,
                    text_data: "some starter text"
                });
            }, function(err) {
                console.log('user already exists, load it');                
            });
            setupSync(authData.uid);
            $scope.loggedUser = authData.uid;
            $scope.authOk = true;            
        }).catch(function(error) {
            console.error("Authentication failed: ", error);
            $scope.loggedUser = 'Auth failed: ' + error;
        });
    }
})


.config(['$provide', function($provide){
    // this demonstrates how to register a new tool and add it to the default toolbar
    $provide.decorator('taOptions', ['$delegate', function(taOptions){
        // $delegate is the taOptions we are decorating
        // here we override the default toolbars and classes specified in taOptions.
        taOptions.toolbar = [
            ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
            ['bold', 'italics', 'underline', 'ul', 'ol', 'redo', 'undo', 'clear'],
            ['justifyLeft','justifyCenter','justifyRight'],
            ['html', 'insertImage', 'insertLink']
        ];
        taOptions.classes = {
            focussed: 'focussed',
            toolbar: 'btn-toolbar',
            toolbarGroup: 'btn-group',
            toolbarButton: 'btn btn-default',
            toolbarButtonActive: 'active',
            disabled: 'disabled',
            textEditor: 'form-control',
            htmlEditor: 'form-control'
        };
        return taOptions; // whatever you return will be the taOptions
    }]);
}])