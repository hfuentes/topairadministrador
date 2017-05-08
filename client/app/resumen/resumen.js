'use strict';

angular.module('PCMAdministradorApp').config(function($stateProvider) {
  $stateProvider.state('resumen', {
    url: '/resumen/:id',
    templateUrl: 'app/resumen/resumen.html',
    controller: 'ResumenCtrl'
  });
});
