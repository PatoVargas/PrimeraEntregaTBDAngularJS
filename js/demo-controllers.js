var app = angular.module('demoapp.controllers', []);

app.controller('ControladorPrincipal', ['$state', function($state) {
	angular.element(document).ready(function () {
		$state.go('inicio');
    });
}]);



