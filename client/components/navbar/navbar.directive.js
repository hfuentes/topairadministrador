'use strict';

angular.module('PCMAdministradorApp').directive('navbar', function() {
  return {
    templateUrl: 'components/navbar/navbar.html',
    restrict: 'E',
    controller: 'NavbarCtrl'
  };
});
