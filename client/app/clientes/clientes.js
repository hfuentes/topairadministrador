'use strict';

angular.module('PCMAdministradorApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('clientes', {
        url: '/clientes',
        templateUrl: 'app/clientes/clientes.html',
        controller: 'ClientesCtrl'
      });
  });
