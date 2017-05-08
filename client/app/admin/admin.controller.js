'use strict';

angular.module('PCMAdministradorApp').controller('AdminCtrl', function($scope, $http, User, _, messageCenterService, config) {

  //modelo vista
  $scope.model = {
    users: [],
    ver_agregar: false,
    roles: [],
    nuevo: {}
  };

  //metodo para cargar datos iniciales vista
  $scope.cargar = function() {
    //carga usuarios
    User.query(function(data) {
      $scope.model.users = data;
    }, function(err) {
      console.error(err);
      messageCenterService.add('danger', '<strong>Ops!</strong><br /><span>Error al cargar usuarios.</span>', { html: true, timeout: config.time_danger });
    });
    //carga roles del sistema
    User.roles(function(data) {
      if (data && data.length > 0) {
        $scope.model.roles = data;
      } else {
        messageCenterService.add('danger', '<strong>Ops!</strong><br /><span>Sin roles para mostrar.</span>', { html: true, timeout: config.time_danger });
      }
    }, function(err) {
      console.error(err);
      messageCenterService.add('danger', '<strong>Ops!</strong><br /><span>Error al cargar roles.</span>', { html: true, timeout: config.time_danger });
    });
  };
  $scope.cargar();

  //metodo para agregar usuario
  $scope.agregar = function() {
    if ($scope.model.nuevo && $scope.model.nuevo.role) {
      User.save($scope.model.nuevo, function(data) {
        $scope.model.users.unshift(data);
        $scope.model.nuevo = {};
        $scope.model.ver_agregar = false;
        messageCenterService.add('success', '<strong>Ok!</strong><br /><span>Usuario creado exitosamente.</span>', { html: true, timeout: config.time_success });
      }, function(err) {
        console.error(err);
        messageCenterService.add('danger', '<strong>Ops!</strong><br /><span>Error al crear usuario.</span>', { html: true, timeout: config.time_danger });
      });
    } else {
      messageCenterService.add('warning', '<strong>Ops!</strong><br /><span>Debe seleccionar un rol para continuar.</span>', { html: true, timeout: config.time_warning });
    }
  };

  //metodo para deshabilitar usuario
  $scope.desactivar = function(user) {
    User.update({ id: user._id }, { es_activo: false }, function() {
      user.es_activo = false;
      messageCenterService.add('success', '<strong>Ok!</strong><br /><span>Operación exitosa.</span>', { html: true, timeout: config.time_success });
    }, function(err) {
      console.error(err);
      messageCenterService.add('danger', '<strong>Ops!</strong><br /><span>Error al desactivar usuario.</span>', { html: true, timeout: config.time_danger });
    });
  };

  //metodo para deshabilitar usuario
  $scope.activar = function(user) {
    User.update({ id: user._id }, { es_activo: true }, function() {
      user.es_activo = true;
      messageCenterService.add('success', '<strong>Ok!</strong><br /><span>Operación exitosa.</span>', { html: true, timeout: config.time_success });
    }, function(err) {
      console.error(err);
      messageCenterService.add('danger', '<strong>Ops!</strong><br /><span>Error al activar usuario.</span>', { html: true, timeout: config.time_danger });
    });
  };

  //metodo para mostrar form editar usuario
  $scope.ver_form_editar = function(user) {
    _.each($scope.model.users, function(x) { x.ver_editar = false; });
    user.user_editar = _.clone(user);
    if (user.user_editar.password) { delete user.user_editar.password; }
    user.ver_editar = true;
  };

  //metodo para ocultar form editar usuario
  $scope.ocultar_form_editar = function(user) {
    _.each($scope.model.users, function(x) { x.ver_editar = false; });
    user.user_editar = _.clone(user);
    if (user.user_editar.password) { delete user.user_editar.password; }
  };

  //metodo para editar datos de usuario
  $scope.editar = function(user) {
    User.update({ id: user._id }, {
      name: user.user_editar.name,
      email: user.user_editar.email,
      password: user.user_editar.password,
      role: user.user_editar.role,
      correo: user.user_editar.correo
    }, function(data) {
      _.each($scope.model.users, function(x) { x.ver_editar = false; });
      user.name = data.name;
      user.email = data.email;
      user.role = data.role;
      user.user_editar = _.clone(user);
      if (user.user_editar.password) { delete user.user_editar.password; }
      messageCenterService.add('success', '<strong>Ok!</strong><br /><span>Operación exitosa.</span>', { html: true, timeout: config.time_success });
    }, function(err) {
      console.error(err);
      messageCenterService.add('danger', '<strong>Ops!</strong><br /><span>Error al editar usuario.</span>', { html: true, timeout: config.time_danger });
    });
  };
});
