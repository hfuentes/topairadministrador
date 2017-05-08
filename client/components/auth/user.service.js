'use strict';

angular.module('PCMAdministradorApp').factory('User', function($resource) {
  return $resource('/api/users/:id/:controller', {
    id: '@_id'
  }, {
    changePassword: {
      method: 'put',
      params: {
        controller: 'password'
      }
    },
    get: {
      method: 'get',
      params: {
        id: 'me'
      }
    },
    //obtiene posibles roles del sistema
    roles: {
      method: 'post',
      url: '/api/users/roles',
      isArray: true
    },
    //metodo para actualizar datos de usuario
    update: {
      method: 'put',
      params: {
        controller: 'update'
      }
    },
    //metodo para obtener perfiles activos (solo perfiles)
    perfiles_activos: {
      method: 'post',
      url: '/api/users/profiles_activos',
      isArray: true
    }
  });
});
