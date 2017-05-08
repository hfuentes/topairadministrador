'use strict';

angular.module('PCMAdministradorApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('proyectos', {
        url: '/proyectos',
        templateUrl: 'app/proyectos/proyectos.html',
        controller: 'ProyectosCtrl',
        authenticate: true
      });
  });
