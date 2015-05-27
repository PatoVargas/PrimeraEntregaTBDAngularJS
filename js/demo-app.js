(function(){
	var app = angular.module('ui.bootstrap.demo', ['ngRoute', 'appServices', "ui.bootstrap"]);

    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider.
        		// Rutas de vistas
                when('/cameraroll', {templateUrl: 'cameraroll.html',   controller: 'HomeCtrl'}).
                when('/actividad-reciente', {templateUrl: 'actividad-reciente.html',   controller: 'HomeCtrl'}).
                when('/album', {templateUrl: 'album.html',   controller: 'HomeCtrl'}).
                when('/buscador-camaras', {templateUrl: 'buscador-camaras.html',   controller: 'HomeCtrl'}).
                when('/favoritos', {templateUrl: 'favoritos.html',   controller: 'HomeCtrl'}).
                when('/fotos-de', {templateUrl: 'fotos-de.html',   controller: 'HomeCtrl'}).
                when('/fotos-desde', {templateUrl: 'fotos-desde.html',   controller: 'HomeCtrl'}).
                when('/fotos-recientes', {templateUrl: 'fotos-recientes.html',   controller: 'HomeCtrl'}).
                when('/mapa', {templateUrl: 'mapa.html',   controller: 'HomeCtrl'}).
                when('/mapa-mundial', {templateUrl: 'mapa-mundial.html',   controller: 'HomeCtrl'}).
                when('/photostream', {templateUrl: 'photostream.html',   controller: 'HomeCtrl'}).
                when('/subir-foto', {templateUrl: 'subir-foto.html',   controller: 'HomeCtrl'}).
                // Otras rutas
                when('/list', {templateUrl: 'list.html',   controller: 'ListCtrl'}).
                when('/detail/:itemId', {templateUrl: 'detail.html',   controller: 'DetailCtrl'}).
                when('/settings', {templateUrl: 'settings.html',   controller: 'SettingsCtrl'}).
                otherwise({redirectTo: '/cameraroll'});
	}]);

	app.controller('MainCtrl', function($scope, Page) {
	    console.log(Page);
	    $scope.page= Page; 
	});

app.controller('ModalDemoCtrl', function ($scope, $modal, $log) {

  $scope.items = ['item1', 'item2', 'item3'];

  $scope.animationsEnabled = true;

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'popup-fotos.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.toggleAnimation = function () {
    $scope.animationsEnabled = !$scope.animationsEnabled;
  };

});

app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

    app.controller('loginCtrl', function($scope,loginService){
        $scope.msgtxt='';
        $scope.login=function(user){
            loginService.login(user,$scope);
        }
        
    });

    app.controller('RegistroCtrl', function($scope, registroService){    
        $scope.registrar=function(usuario){
            registroService.registrar(usuario,$scope);
        }
    });    

    app.factory('registroService',function($http){
        return{
            registrar:function(usuario,scope){
                $http.post('http://localhost:3000/usuarios',usuario).success(function(data, status, headers, config) {
                    window.location.href="vistausuario.html"; 
                    }).error(function(data, status, headers, config) {
                    alert("Ha fallado la petición");
                    window.location.href="registro.html";
                });
            }
        }

    });    

    app.factory('loginService',function($http, sessionService){
        return{
            login:function(user,scope){
                var $promise=$http.post('JSON/user.php',user);
                $promise.then(function(msg){
                    var uid=msg.data;
                    if(uid=='succes'){ 
                        scope.msgtxt='Bien';
                        sessionService.set('user',uid);
                        window.location.href="vistausuario.html"; 
                    }   
                    else{
                        window.location.href="iniciarsesion.html"; 
                    } 

                });
            }
        }

    });

    app.factory('sessionService', ['$http', function($http){
        return{
            set:function(key,value){
                return sessionStorage.setItem(key,value);
            },
            get:function(){
                return sessionStorage.getItem(key);
            },
            destroy:function(){
                return sessionStorage.removeItem(key);
            }
        };
    }]);

	app.controller('HomeCtrl', function($scope, Page) {
	    Page.setTitle("Bienvenido");
	});

	app.controller('camarasCtrl', [ '$http', function($http) {
		var store = this;
		store.camaras = [];
		
		$http.get('JSON/camaras.json').success(function(data){
			store.camaras = data;
		});	
	}]);

    app.controller('FotosCtrl', [ '$http', function($http) {
        var store = this;
        store.fotos = [];
        
        $http.get('JSON/fotos.json').success(function(data){
            store.fotos = data;
        }); 
    }]);


    app.controller('ComentariosCtrl', [ '$http', function($http) {
        var store = this;
        store.comentarios = [];
        
        $http.get('http://localhost:3000/comments').success(function(data){
            store.comentarios = data;
        });


    }]);

	var app = angular.module('appServices', []);

	app.factory('Page', function($rootScope) {
        var pageTitle = "Untitled";
        return {
            title:function(){
                return pageTitle;
            },
            setTitle:function(newTitle){
                pageTitle = newTitle;
            }
        }
    });
})();