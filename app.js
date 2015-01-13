var app = angular.module("sampleApp", ["firebase","textAngular"]);

app.controller("SampleCtrl", function($scope, $firebase, $firebaseAuth) {

	var ref = new Firebase("//crackling-inferno-3267.firebaseio.com/data");
	var sync = $firebase(ref);

	// download the data into a local object
	var syncObject = sync.$asObject();

	// synchronize the object with a three-way data binding
	// click on `index.html` above to see it used in the DOM!
	syncObject.$bindTo($scope, "firebaseData");

	// at pageload, start the RTE off from whatever data was left before...
	// (but make sure this only happens once)
	$scope.$watch('firebaseData',function(n,o){
		if (n && n.$value !== $scope.editorData) {
			$scope.editorData = n.$value;
		}
	});

	// as the $scope.editorData object changes (while user types...): 
	// sync it with the main firebase syncObject
	// @TODO: This could probably be debounced a little
	$scope.$watch('editorData', function(n,o){
		if (n) {
			$scope.firebaseData.$value = n;
		}
	});
	
    $scope.loggedUser = 'Logging in...';
	
    $scope.signInWith = function(serviceName) {
        var auth = $firebaseAuth(ref);
        auth.$authWithOAuthPopup(serviceName).then(function(authData) {
            console.log("Logged in as:", authData.uid);
            $scope.loggedUser = authData.uid;
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