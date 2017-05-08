'use strict';

angular.module('PCMAdministradorApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'underscore',
  'naif.base64',
  'MessageCenterModule',
  'ja.qr'
])

.config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
  $urlRouterProvider.otherwise('/');
  $locationProvider.html5Mode(true);
  $httpProvider.interceptors.push('authInterceptor');
})

.factory('authInterceptor', function($rootScope, $q, $cookies, $injector) {
  var state;
  return {
    // Add authorization token to headers
    request: function(config) {
      config.headers = config.headers || {};
      if ($cookies.get('token')) {
        config.headers.Authorization = 'Bearer ' + $cookies.get('token');
      }
      return config;
    },

    // Intercept 401s and redirect you to login
    responseError: function(response) {
      if (response.status === 401) {
        (state || (state = $injector.get('$state'))).go('login');
        // remove any stale tokens
        $cookies.remove('token');
        return $q.reject(response);
      } else {
        return $q.reject(response);
      }
    }
  };
})

//directiva para controlar loading global
.directive('isLoading', ['$http', function($http) {
  return {
    restrict: 'A',
    link: function(scope, elm) {
      scope.isLoading = function() {
        return $http.pendingRequests.length > 0;
      };
      scope.$watch(scope.isLoading, function(v) {
        if (v) { elm.show(); } else { elm.hide(); }
      });
    }
  };
}])

//directiva que identifica error en carga src de imagen y carga una por defecto
.directive('onErrorSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src !== attrs.onErrorSrc) {
          attrs.$set('src', attrs.onErrorSrc);
        }
      });
    }
  };
})

//directiva que elimina elemeto en caso de error carga imagen
.directive('deleteOnErrorSrc', function() {
  return {
    link: function(scope, element) {
      element.bind('error', function() {
        element.remove();
      });
    }
  };
})

//filtro para convertir string con saltos de linea en html con <br>
/*.filter('lineJump', function() {
  return function(input) {
    if (input) {
      return input.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  };
})*/

.run(function($rootScope, $state, Auth) {
  // Redirect to login if route requires auth and the user is not logged in
  $rootScope.$on('$stateChangeStart', function(event, next) {
    if (next.authenticate) {
      Auth.isLoggedIn(function(loggedIn) {
        if (!loggedIn) {
          event.preventDefault();
          $state.go('login');
        }
      });
    }
  });
})

//constantes de cinfiguracion
.constant('config', {
  time_danger: 10000,
  time_warning: 5000,
  time_success: 3000,
  //configuracion de textos fijos

  //texto topair
  glosa_empresa: 'Topair',
  url_empresa: 'http://www.topair.cl/',
  correo_empresa: 'contacto@topair.cl',
  direccion_empresa: 'Av. Presidente Frei Montalva 6001,  edificio  63. Complejo Industrial El Cortijo. Santiago.',
  telefono_empresa: '+562-2624 3371',
  glosa_aplicacion: 'PCM v1.0.0',
  url_aplicacion: '#'

  //texto frazoger
  // glosa_empresa: 'Frazoger',
  // url_empresa: 'http://www.frazoger.cl/',
  // correo_empresa: 'contacto@topair.cl',
  // direccion_empresa: 'Av. Presidente Frei Montalva 6001,  edificio  63. Complejo Industrial El Cortijo. Santiago.',
  // telefono_empresa: '+56 2 2623 7339',
  // glosa_aplicacion: 'PCM v1.0.2',
  // url_aplicacion: '#'
});
