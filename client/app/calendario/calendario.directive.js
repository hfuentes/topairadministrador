'use strict';

angular.module('PCMAdministradorApp').directive('calendario', function() {
  return {
    templateUrl: 'app/calendario/calendario.html',
    restrict: 'E',
    scope: {
      dateOptions: '=',
      opened: '=',
      dateModel: '='
    },
    link: function(scope) {
      scope.open = function(event) {
        console.log('abre datepicker ....');
        event.preventDefault();
        event.stopPropagation();
        scope.opened = true;
      };
      scope.clear = function() {
        scope.ngModel = null;
      };
    }
  };
});