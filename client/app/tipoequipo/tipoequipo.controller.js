'use strict';

angular.module('PCMAdministradorApp').controller('TipoEquipoCtrl', function($scope, apiServices, messageCenterService, config) {

  //modelo vista
  $scope.model = {
    tipos: [],
    nuevo: {
      trabajo_temp: '',
      nombre: '',
      trabajos: []
    },
    ver_agregar: false
  };

  //obtiene datos
  $scope.cargar = function() {
    apiServices.tiposEquipos.query(function(data) {
      $scope.model.tipos = data;
    }, function(err) {
      console.error(err);
      messageCenterService.add('danger', '<strong>Ops!</strong><br /><span>Error al cargar tipos de equipos.</span>', { html: true, timeout: config.time_danger });
    });
  };
  $scope.cargar();

  //metodo para agregar trabajo a nuevo tipo equipo
  $scope.agregar_trabajo_nuevo = function() {
    if ($scope.model.nuevo.trabajo_temp) {
      if (!$scope.model.nuevo.trabajos) { $scope.model.nuevo.trabajos = []; }
      $scope.model.nuevo.trabajos.unshift($scope.model.nuevo.trabajo_temp);
      $scope.model.nuevo.trabajo_temp = '';
    }
  };

  //metodo para cancelar agregar nuevo tipo
  $scope.cancelar_agregar = function() {
    $scope.model.ver_agregar = false;
    $scope.model.nuevo = {
      trabajo_temp: '',
      nombre: '',
      trabajos: []
    };
  };

  //metodo para agregar nuevo tipo de equipo
  $scope.agregar = function() {
    apiServices.tiposEquipos.save($scope.model.nuevo, function(data) {
      $scope.cancelar_agregar();
      $scope.model.tipos.unshift(data);
      messageCenterService.add('success', '<strong>Ok!</strong><br /><span>Operación exitosa.</span>', { html: true, timeout: config.time_success });
      console.dir(data);
    }, function(err) {
      console.error(err);
      messageCenterService.add('danger', '<strong>Ops!</strong><br /><span>Error al crear tipo de equipo.</span>', { html: true, timeout: config.time_danger });
    });
  };

  //metodo para cancalar editar
  $scope.cancelar_editar = function(tipo) {
    tipo.ver_editar = false;
    tipo.editar = {};
  };

  //metodo para cargar form editar
  $scope.ver_form_editar = function(tipo) {
    $scope.cancelar_agregar();
    _.each($scope.model.tipos, function(x) { $scope.cancelar_editar(x); });
    tipo.ver_editar = true;
    tipo.editar = _.clone(tipo);
  };

  //metodo para agregar trabajo en form editar tipo
  $scope.agregar_trabajo_editar = function(tipo) {
    if (tipo.editar.trabajo_temp) {
      if (!tipo.editar.trabajos) { tipo.editar.trabajos = []; }
      tipo.editar.trabajos.unshift({ nombre: tipo.editar.trabajo_temp });
      tipo.editar.trabajo_temp = '';
    }
  };

  //metodo para guardar tipo de trabajo editar en form editar tipo equipo
  $scope.guardar_trabajo_editada = function(trabajo) {
    if (trabajo.nombre_temp) {
      trabajo.ver_editar = false;
      trabajo.nombre = trabajo.nombre_temp;
      trabajo.nombre_temp = '';
    }
  };

  //metodo para editar datos de tipo de equipo
  $scope.editar = function(tipo) {
    apiServices.tiposEquipos.update({ id: tipo._id }, tipo.editar, function(data) {
      tipo.nombre = data.nombre;
      tipo.trabajos = data.trabajos;
      tipo.fecha_modificacion = data.fecha_modificacion;
      $scope.cancelar_editar(tipo);
      messageCenterService.add('success', '<strong>Ok!</strong><br /><span>Operación exitosa.</span>', { html: true, timeout: config.time_success });
    }, function(err) {
      console.error(err);
      messageCenterService.add('danger', '<strong>Ops!</strong><br /><span>Error al editar tipo de equipo.</span>', { html: true, timeout: config.time_danger });
    });
  };
});
