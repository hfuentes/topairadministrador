'use strict';

angular.module('PCMAdministradorApp').config(function($stateProvider) {
  $stateProvider.state('equipos', {
    url: '/equipos',
    templateUrl: 'app/equipos/equipos.html',
    controller: 'EquiposCtrl'
  });
});
