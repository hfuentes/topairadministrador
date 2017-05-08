'use strict';

angular.module('PCMAdministradorApp').controller('LoginCtrl', function($scope, Auth, $state, $window) {
  $scope.user = {};
  $scope.errors = {};

  $scope.login = function(form) {
    $scope.submitted = true;

    if (form.$valid) {
      Auth.login({
        email: $scope.user.email,
        password: $scope.user.password
      }).then(function() {        
        $state.go('main');
      }).catch(function(err) {
        $scope.errors.other = err.message;
      });
    }
  };

  $scope.loginOauth = function(provider) {
    $window.location.href = '/auth/' + provider;
  };
});
