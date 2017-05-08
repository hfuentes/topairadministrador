'use strict';

angular.module('PCMAdministradorApp').controller('ResumenCtrl', function($scope, apiServices, $stateParams) {
  $scope.model = {
  	resumen: {},
    cargando: true,
    error: false,
    ver_rojos: false,
    ver_amarillos: false,
    ver_verdes: false
  };
  $scope.cargar = function() {
  	apiServices.resumenes.vistaCliente({id: $stateParams.id}, function(data) {
  		$scope.model.resumen = data;
      $scope.model.cargando = false;
  	}, function(err) {
  		console.error(err);
      $scope.model.cargando = false;
      $scope.model.error = true;
  	});
  };
  $scope.cargar();
});
