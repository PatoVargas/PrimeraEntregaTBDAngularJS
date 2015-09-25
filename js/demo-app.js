(function(){
	var app = angular.module('ui.bootstrap.demo', ['ngRoute', 'appServices', "ui.bootstrap", 'ngCookies']);

//####################################RUTAS##################################

    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider.
        		// Rutas de vistas
                when('/cameraroll', {templateUrl: 'cameraroll.html',   controller: 'HomeCtrl'}).
                when('/PerfilUsuario', {templateUrl: 'PerfildeUsuario.html',   controller: 'HomeCtrl'}).
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

//###########################SUBIRFOTOS#####################################################

    app.controller('subirFotosCtrl', ['$scope', 'upload', function ($scope, upload) 
    {
        $scope.uploadFile = function()
        {
            var titulo = $scope.titulo;
            var descripcion = $scope.descripcion;
            var tags = $scope.tags;
            var personas = $scope.personas;
            var album = $scope.album;
            var privacidad = $scope.privacidad;
            var file = $scope.file;
            
            upload.uploadFile(file, titulo, descripcion, tags, personas, album, privacidad).then(function(res)
            {
                console.log(res);
            })
        }
    }])

    app.directive('uploaderModel', ["$parse", function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, iElement, iAttrs) 
            {
                iElement.on("change", function(e)
                {
                    $parse(iAttrs.uploaderModel).assign(scope, iElement[0].files[0]);
                });
            }
        };
    }])

    app.service('upload', ["$http", "$q", function ($http, $q) 
    {
        this.uploadFile = function(file, titulo, descripcion, tags, personas, album, privacidad)
        {
            var deferred = $q.defer();
            var formData = new FormData();
            formData.append("titulo", titulo);
            formData.append("descripcion", descripcion);
            formData.append("tags", tags);
            formData.append("personas", personas);
            formData.append("album", album);
            formData.append("privacidad", privacidad);
            formData.append("file", file);
            return $http.post("server.php", formData, {
                headers: {
                    "Content-type": undefined
                },
                transformRequest: angular.identity
            })
            .success(function(res)
            {
                deferred.resolve(res);
                console.log("Si");
            })
            .error(function(msg, code)
            {
                deferred.reject(msg);
                console.log("No");
            })
            return deferred.promise;
        }   
    }])

//#######################CONTROLADORESBASE##################################################

    app.controller('MainCtrl', function($scope, Page) {
        $scope.page = Page; 
    });

    app.controller('HomeCtrl', function($scope, Page) {
        Page.setTitle("Bienvenido");
    });
    var fotosGeolocalizadas =[];
    var fotosGeolocalizadasPropias =[];

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

    app.controller('MapaPropioCtrl', function($scope, $http, $cookieStore, $cookies) {
        var store = this;
        store.fotos = [];
        $http.get('http://localhost:3000/Fotos').success(function(data){
            store.fotos = data;
            for( i = 0 ; i < store.fotos.length ; i++){
                if(store.fotos[i].idUsuario == $cookieStore.get('idUsuario')){
                    fotosGeolocalizadasPropias.push(store.fotos[i]);
                }
            }
            for (i = 0; i < fotosGeolocalizadas.length; i++){
                crearMarcadores(fotosGeolocalizadasPropias[i]);
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

    app.controller('getUsuarioFoto',function($scope,$cookieStore,$cookies,$http){
        $scope.IDUSUARIO = $cookieStore.get('idUsuarioFoto');
        var store = this;
        store.usuarios = [];
        store.usuario;
        
        $http.get('http://localhost:3000/Usuarios2').success(function(data){
            store.usuarios = data;
            for (i = 0; i < store.usuarios.length; i++){
                if(String(store.usuarios[i].idUsuario) == $scope.IDUSUARIO){
                    store.usuario = store.usuarios[i];
                }
            }
        });
    });

    app.controller('getUsuario',function($scope,$cookieStore,$cookies,$http){
        $scope.IDUSUARIO = $cookieStore.get('idUsuario');
        var store = this;
        store.usuarios = [];
        store.usuario;
        
        $http.get('http://localhost:3000/Usuarios2').success(function(data){
            store.usuarios = data;
            for (i = 0; i < store.usuarios.length; i++){
                if(String(store.usuarios[i].idUsuario) == $scope.IDUSUARIO){
                    store.usuario = store.usuarios[i];
                }
            }
        });
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
    
    app.controller('ComentariosCtrl',function($http,$cookieStore,$cookies) {
        var store = this;
        store.comentarios = [];
        store.comentariosFiltrados = [];
        
        $http.get('http://localhost:3000/Comentarios').success(function(data){
            store.comentarios = data;
            for(i = 0; i < store.comentarios.length; i++){
                if(String(store.comentarios[i].imagenidimagen.idImagen)==$cookieStore.get('idFoto')){
                    store.comentariosFiltrados.push(store.comentarios[i]);
                    }
                }
            });
        });

        app.controller('comentarCtrl', function($scope, comentarService,$cookieStore,$cookies){    
        $scope.comentar=function(comentario){
            comentario.idImagen = $cookieStore.get('idFoto');
            comentario.idUsuario = $cookieStore.get('idUsuario');
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
        
        $http.get('http://localhost:3000/Usuarios2').success(function(data){
            store.usuarios = data;
            for (i = 0; i < store.usuarios.length; i++){
                if(String(store.usuarios[i].username) == $cookieStore.get('usuario')){
                    $cookieStore.put('idUsuario',store.usuarios[i].idUsuario);
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
            $cookieStore.remove('idUsuarioFoto');
            window.location.href="index.html";
            }    
    });

//#####################################CAMARAS##################################
	app.controller('camarasCtrl', [ '$http', function($http) {
		var store = this;
		store.camaras = [];
		
		$http.get('http://localhost:3000/Camaras').success(function(data){
			store.camaras = data;
		});	
	}]);

//##################################FOTOS############################################
    app.controller('getFotoCookie',function($scope,$cookieStore,$cookies,$http){
        $scope.URLFOTO = $cookieStore.get('urlFoto');
        var store = this;
        store.fotos = [];
        store.foto;
        
        $http.get('http://localhost:3000/FOTOS2').success(function(data){
            store.fotos = data;
            for (i = 0; i < store.fotos.length; i++){
                if(String(store.fotos[i].pathImagen) == $scope.URLFOTO){
                    $cookieStore.put('idFoto',store.fotos[i].idImagen);
                    $cookieStore.put('idUsuarioFoto',store.fotos[i].usuarioidusuario.idUsuario);
                    store.foto = store.fotos[i];
                }
            }
        });
    });

    app.controller('FotosCtrl', [ '$http', function($http) {
        var store = this;
        store.fotos = [];
        
        $http.get('http://localhost:3000/FOTOS2').success(function(data){
            store.fotos = data;
        }); 
    }]);

    app.controller('fotosCameraRollCtrl', function($http,$cookieStore,$cookies) {
        var store = this;
        store.fotos = [];
        store.fotosPropias = [];
        
        $http.get('http://localhost:3000/FOTOS2').success(function(data){
            store.fotos = data;
            for( i = 0 ; i < store.fotos.length ; i++){
                if(String(store.fotos[i].usuarioidusuario.idUsuario) == $cookieStore.get('idUsuario')){
                    store.fotosPropias.push(store.fotos[i]);
                }
            } 
        });

        
    });

//#####################################BUSCADOR########################################

    app.controller('busquedaCtrl', function($scope, buscarService){    
        $scope.buscar=function(busqueda){
            buscarService.buscar(busqueda,$scope);
            }
    });    

    app.factory('buscarService',function($http){
        return{
            buscar:function(busqueda,scope){
                $http.post('http://localhost:3000/Busqueda',busqueda).success(function(data, status, headers, config) {
                    alert("Buscando");
                    }).error(function(data, status, headers, config) {
                    alert("Ha fallado la petición");
                });
            }
        }

    }); 

//###################################ALBUM###############################################

    app.controller('AlbumCtrl',function($http,$cookieStore,$cookies) {
        var store = this;
        store.albumes = [];
        store.albumesFiltrados = [];
        
        $http.get('http://localhost:3000/Albums').success(function(data){
            store.albumes = data;
            for(i = 0; i < store.albumes.length; i++){
                if(String(store.albumes[i].usuarioidusuario.idUsuario) == $cookieStore.get('idUsuario')){
                    store.albumesFiltrados.push(store.albumes[i]);
                    }
                }
            });
        });

//######################################################################################
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