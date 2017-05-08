'use strict';

angular.module('PCMAdministradorApp').controller('NavbarCtrl', function($scope, Auth) {
  $scope.isCollapsed = true;
  $scope.isLoggedIn = Auth.isLoggedIn;
  $scope.isAdmin = Auth.isAdmin;
  $scope.getCurrentUser = Auth.getCurrentUser;
});
