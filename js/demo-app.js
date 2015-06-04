(function(){
	var app = angular.module('ui.bootstrap.demo', ['ngRoute', 'appServices', "ui.bootstrap", 'ngCookies']);

//####################################RUTAS##################################

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
                when('/mapa', {templateUrl: 'mapa.html',   controller: 'MapaCtrl'}).
                when('/mapa-mundial', {templateUrl: 'mapa-mundial.html',   controller: 'MapaCtrl'}).
                when('/photostream', {templateUrl: 'photostream.html',   controller: 'HomeCtrl'}).
                when('/subir-foto', {templateUrl: 'subir-foto.html',   controller: 'HomeCtrl'}).
                when('/buscador',{templeUrl:'buscador.html', controller:'HomeCtrl'}).
                // Otras rutas
                when('/list', {templateUrl: 'list.html',   controller: 'ListCtrl'}).
                when('/detail/:itemId', {templateUrl: 'detail.html',   controller: 'DetailCtrl'}).
                when('/settings', {templateUrl: 'settings.html',   controller: 'SettingsCtrl'}).
                otherwise({redirectTo: '/cameraroll'});
	}]);

//#######################CONTROLADORESBASE##################################################

    app.controller('MainCtrl', function($scope, Page) {
        $scope.page = Page; 
    });

    app.controller('HomeCtrl', function($scope, Page) {
        Page.setTitle("Bienvenido");
    });

    var lugares = [
        {
            lugar : 'Aquí',
            desc : 'JAjajajajaanc',
            url : 'img/foto7.jpg',
            lat : -33.4499596331,
            long : -70.686739789
        },
        {
            lugar : 'You',
            desc :'Cuanto te extraño',
            url : 'img/foto9.jpg',
            lat : -23.4489122671,
            long : -40.6827862129
        },
        {
            lugar : ':D',
            desc : 'feliz',
            url : 'img/foto17.jpg',
            lat : -40.450725008,
            long : -70.6799484358
        },
        {
            lugar : 'lalalal',
            desc : '',
            url : 'img/foto15.jpg',
            lat : -25.449686603,
            long : -30.6872333155
        },
        {
            lugar :'',
            desc : '',
            url : 'img/foto20.jpg',
            lat : -33.4496731753,
            long : -70.6850768194
        },
        {
            lugar : '<3',
            desc : 'Mi mundo',
            url : 'img/foto13.jpg',
            lat : -40.4503087523,
            long : -50.6832368241
        },
        {
            lugar : 'JAJAJA',
            desc : '(Y)',
            url : 'img/foto12.jpg',
            lat : -45.4503311317,
            long : -70.681375371
        },
        {
            lugar : ':)',
            desc : 'Happy',
            url : 'img/foto5.jpg',
            lat : -13.4464101747,
            long : -60.6832529173
        }
    ];

//###################################FOTOSGEOLOCALIZADAS###############################3

    app.controller('MapaCtrl', function($scope, $http) {

        var mapOptions = {
            zoom: 3,
            center: new google.maps.LatLng(-33.449147, -70.682269),
            mapTypeId: google.maps.MapTypeId.HYBRID
        }

        $scope.map = new google.maps.Map(document.getElementById('mapa'), mapOptions);

        $scope.marcadores = [];
        
        var infoWindow = new google.maps.InfoWindow();
       
        var crearMarcadores = function (info){
            var marcador = new google.maps.Marker({
                map: $scope.map,
                position: new google.maps.LatLng(info.lat, info.long),
                title: info.lugar
            });
            marcador.content = '<div class="infoWindowContent">' + info.desc + '</div>';
            marcador.content2 = '<div class="infoWindowContent">' + '<img src="'+info.url+'" Width=200 Height=200/>' + '</div>';
            google.maps.event.addListener(marcador, 'click', function(){
                infoWindow.setContent('<h2>' + marcador.title + '</h2>' + marcador.content + marcador.content2);
                infoWindow.open($scope.map, marcador);
            });
            
            $scope.marcadores.push(marcador);
        }  
        
        for (i = 0; i < lugares.length; i++){
            crearMarcadores(lugares[i]);
        }

        $scope.openInfoWindow = function(e, selectedMarker){
            e.preventDefault();
            google.maps.event.trigger(selectedMarker, 'click');
        }
    });

//#################################POPUPFOTOS####################################

app.controller('ModalDemoCtrl', function($scope, $modal, $log, $cookies, $cookieStore) {
  $scope.animationsEnabled = true;
  $scope.open = function (size,url) {
    $cookieStore.put('urlFoto',url);
    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'popup-fotos.html',
      controller: 'ModalInstanceCtrl',
      size: size
    });
  };
  $scope.toggleAnimation = function () {
    $scope.animationsEnabled = !$scope.animationsEnabled;
  };

});

app.controller('ModalInstanceCtrl', function ($scope, $modalInstance) {
  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

app.controller('getFotoCookie',function($scope,$cookieStore,$cookies){
    $scope.URLFOTO = $cookieStore.get('urlFoto');
});

//###################################REGISTRO#############################

    app.controller('RegistroCtrl', function($scope, registroService,$cookies, $cookieStore){    
        $cookieStore.remove('usuario');
        $cookieStore.remove('pass');
        $scope.registrar=function(usuario){
            registroService.registrar(usuario,$scope);
        }
    });    

    app.factory('registroService',function($http,$cookies, $cookieStore){
        return{
            registrar:function(usuario,scope){
                $http.post('http://localhost:3000/usuarios',usuario).success(function(data, status, headers, config) {
                    $cookieStore.put('usuario', usuario.nombre_usuario); 
                    $cookieStore.put('pass', usuario.pass);
                    window.location.href="vistausuario.html"; 
                    }).error(function(data, status, headers, config) {
                    alert("Ha fallado la petición");
                    window.location.href="registro.html";
                });
            }
        }

    });

//########################COMENTARIOS#####################################
    app.controller('ComentariosCtrl', [ '$http', function($http) {
        var store = this;
        store.comentarios = [];
        
        $http.get('http://localhost:3000/comments').success(function(data){
            store.comentarios = data;
            });
        }]);

        app.controller('comentarCtrl', function($scope, comentarService){    
        $scope.comentar=function(comentario){
            comentarService.comentar(comentario,$scope);
        }
    });    

    app.factory('comentarService',function($http){
        return{
            comentar:function(comentario,scope){
                $http.post('http://localhost:3000/comments',comentario).success(function(data, status, headers, config) {
                    alert("Comentario guardado");
                    }).error(function(data, status, headers, config) {
                    alert("Ha fallado la petición");
                });
            }
        }

    });     

//########################LOGINUSUARIO#####################################
    app.controller('loginCtrl', function($scope,loginService, $cookies, $cookieStore){
        $cookieStore.remove('usuario');
        $cookieStore.remove('pass');
        $scope.login=function(user){
            loginService.login(user,$scope);
        }
        
    });

    app.factory('loginService',function($http, sessionService,$cookies, $cookieStore){
        return{
            login:function(user,scope){
                $http.post('http://localhost:3000/Inicio',user).success(function(data, status, headers, config) {
                    $cookieStore.put('usuario', user.nombre); 
                    $cookieStore.put('pass', user.pass);
                    window.location.href="vistausuario.html"; 
                    }).error(function(data, status, headers, config) {
                    alert("Ha fallado la petición");
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

//#####################################CAMARAS##################################
	app.controller('camarasCtrl', [ '$http', function($http) {
		var store = this;
		store.camaras = [];
		
		$http.get('JSON/camaras.json').success(function(data){
			store.camaras = data;
		});	
	}]);

//##################################FOTOS############################################

    app.controller('FotosCtrl', [ '$http', function($http) {
        var store = this;
        store.fotos = [];
        
        $http.get('JSON/fotos.json').success(function(data){
            store.fotos = data;
        }); 
    }]);

//####################################################################################

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