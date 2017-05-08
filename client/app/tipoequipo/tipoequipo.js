'use strict';

angular.module('PCMAdministradorApp').config(function($stateProvider) {
  $stateProvider.state('tiposequipos', {
    url: '/tiposequipos',
    templateUrl: 'app/tipoequipo/tipoequipo.html',
    controller: 'TipoEquipoCtrl'
  });
});
