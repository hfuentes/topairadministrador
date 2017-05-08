'use strict';

angular.module('PCMAdministradorApp').config(function($stateProvider) {
  $stateProvider.state('actividades', {
    url: '/actividades/:id_proyecto',
    templateUrl: 'app/actividades/actividades.html',
    controller: 'ActividadesCtrl',
    authenticate: true
  });
});
