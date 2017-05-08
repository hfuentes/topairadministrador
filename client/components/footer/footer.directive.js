'use strict';

angular.module('PCMAdministradorApp').directive('footer', function(config) {
  return {
    templateUrl: 'components/footer/footer.html',
    restrict: 'E',
    link: function(scope, element) {
      element.addClass('footer');
      scope.config = config;
    }
  };
});
