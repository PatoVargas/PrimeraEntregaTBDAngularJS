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
    var fotosGeolocalizadas =[];

//###################################FOTOSGEOLOCALIZADAS###############################3

    app.controller('MapaCtrl', function($scope, $http) {
        var store = this;
        store.fotos = [];
        $http.get('http://localhost:3000/Fotos').success(function(data){
            store.fotos = data;
            for( i = 0 ; i < store.fotos.length ; i++){
                    fotosGeolocalizadas.push(store.fotos[i]);
            }
            for (i = 0; i < fotosGeolocalizadas.length; i++){
                crearMarcadores(fotosGeolocalizadas[i]);
            } 
        });

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
                title: info.titulo
            });
            marcador.content = '<div class="infoWindowContent">' + info.descripcion + '</div>';
            marcador.content2 = '<div class="infoWindowContent">' + '<img src="'+info.url+'" Width=200 Height=200/>' + '</div>';
            google.maps.event.addListener(marcador, 'click', function(){
                infoWindow.setContent('<h2>' + marcador.title + '</h2>' + marcador.content + marcador.content2);
                infoWindow.open($scope.map, marcador);
            });
            
            $scope.marcadores.push(marcador);
        }  
        
        

        $scope.openInfoWindow = function(e, selectedMarker){
            e.preventDefault();
            google.maps.event.trigger(selectedMarker, 'click');
        }
    });


//#################################POPUPFOTOS##################################################

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

//###################################REGISTRO#############################

    app.controller('RegistroCtrl', function($scope, registroService,$cookies, $cookieStore){    
        $cookieStore.remove('usuario');
        $cookieStore.remove('idUsuario');
        $scope.registrar=function(usuario){
            registroService.registrar(usuario,$scope);
        }
    });    

    app.factory('registroService',function($http,$cookies, $cookieStore){
        return{
            registrar:function(usuario,scope){
                $http.post('http://localhost:3000/usuarios',usuario).success(function(data, status, headers, config) {
                    $cookieStore.put('usuario', usuario.nombre_usuario); 
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
        $cookieStore.remove('idUsuario');
        $scope.login=function(user){
            loginService.login(user,$scope);
        }
        
    });

    app.factory('loginService',function($http, sessionService,$cookies, $cookieStore){
        return{
            login:function(user,scope){
                $http.post('http://localhost:3000/Inicio',user).success(function(data, status, headers, config) {
                    $cookieStore.put('usuario', user.nombre); 
                    window.location.href="vistausuario.html"; 
                    }).error(function(data, status, headers, config) {
                    alert("Ha fallado la petición");
                });
            }
        }

    });

    app.controller('getidUsuario',function($scope,$cookieStore,$cookies,$http){
        var store = this;
        store.usuarios = [];
        
        $http.get('http://localhost:3000/usuarios').success(function(data){
            store.usuarios = data;
            for (i = 0; i < store.usuarios.length; i++){
                if(String(store.usuarios[i].nombre_usuario) == $cookieStore.get('usuario')){
                    $cookieStore.put('idUsuario',store.usuarios[i].id);
                }
            }
        });
        
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

//##########################LOGOUT##########################################

    app.controller('logoutCtrl', function($scope, $cookies, $cookieStore){
        $scope.logout=function(){
            $cookieStore.remove('usuario');
            $cookieStore.remove('idUsuario');
            $cookieStore.remove('urlFoto');
            $cookieStore.remove('idFoto');
            window.location.href="index.html";
            }    
    });

//#####################################CAMARAS##################################
	app.controller('camarasCtrl', [ '$http', function($http) {
		var store = this;
		store.camaras = [];
		
		$http.get('JSON/camaras.json').success(function(data){
			store.camaras = data;
		});	
	}]);

//##################################FOTOS############################################
    app.controller('getFotoCookie',function($scope,$cookieStore,$cookies,$http){
        $scope.URLFOTO = $cookieStore.get('urlFoto');
        var store = this;
        store.fotos = [];
        store.foto;
        
        $http.get('http://localhost:3000/Fotos').success(function(data){
            store.fotos = data;
            for (i = 0; i < store.fotos.length; i++){
                if(String(store.fotos[i].url) == $scope.URLFOTO){
                    $cookieStore.put('idFoto',store.fotos[i].id);
                    store.foto = store.fotos[i];
                }
            }
        });
    });

    app.controller('FotosCtrl', [ '$http', function($http) {
        var store = this;
        store.fotos = [];
        
        $http.get('http://localhost:3000/Fotos').success(function(data){
            store.fotos = data;
        }); 
    }]);

    app.controller('fotosCameraRollCtrl', function($http,$cookieStore,$cookies) {
        var store = this;
        store.fotos = [];
        store.fotosPropias = [];
        
        $http.get('http://localhost:3000/Fotos').success(function(data){
            store.fotos = data;
            for( i = 0 ; i < store.fotos.length ; i++){
                if(store.fotos[i].idUsuario == $cookieStore.get('idUsuario')){
                    store.fotosPropias.push(store.fotos[i]);
                }
            } 
        });

        
    });


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