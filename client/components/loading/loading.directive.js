'use strict';

angular.module('PCMAdministradorApp').directive('loading', function() {
  return {
    templateUrl: 'components/loading/loading.html',
    restrict: 'E'/*,
    controller: 'LoadingCtrl'*/ //no necesita controlador
  };
});
