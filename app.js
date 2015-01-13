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

	// as the $scope.editorData object changes, sync it with the main firebase data sync object
	// @TODO: This could probably be debounced a little
	$scope.$watch('editorData', function(n,o){
		if (n) {
			$scope.firebaseData.$value = n;
		}
	});
	
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
    // // this demonstrates changing the classes of the icons for the tools for font-awesome v3.x
    // $provide.decorator('taTools', ['$delegate', function(taTools){
    //     taTools.bold.iconclass = 'icon-bold';
    //     taTools.italics.iconclass = 'icon-italic';
    //     taTools.underline.iconclass = 'icon-underline';
    //     taTools.ul.iconclass = 'icon-list-ul';
    //     taTools.ol.iconclass = 'icon-list-ol';
    //     taTools.undo.iconclass = 'icon-undo';
    //     taTools.redo.iconclass = 'icon-repeat';
    //     taTools.justifyLeft.iconclass = 'icon-align-left';
    //     taTools.justifyRight.iconclass = 'icon-align-right';
    //     taTools.justifyCenter.iconclass = 'icon-align-center';
    //     taTools.clear.iconclass = 'icon-ban-circle';
    //     taTools.insertLink.iconclass = 'icon-link';
    //     taTools.unlink.iconclass = 'icon-link red';
    //     taTools.insertImage.iconclass = 'icon-picture';
    //     // there is no quote icon in old font-awesome so we change to text as follows
    //     delete taTools.quote.iconclass;
    //     taTools.quote.buttontext = 'quote';
    //     return taTools;
    // }]);
}])