'use strict';

angular.module('PCMAdministradorApp').controller('EquiposCtrl', function($scope, apiServices, messageCenterService, config) {
  //modelo vista
  $scope.model = {
    equipos: [],
    tipos: [],
    nuevo: {
      nombre: '',
      serie: ''
    },
    ver_agregar: false,
    ver_activos: true
  };

  //metodo para cargar datos en la vista
  $scope.cargar = function() {
    //carga datos de equipos (todos)
    apiServices.equipos.query(function(data) {
      $scope.model.equipos = data;
    }, function(err) {
      console.error(err);
      messageCenterService.add('danger', '<strong>Ops!</strong><br /><span>Error al cargar equipos.</span>', { html: true, timeout: config.time_danger });
    });

    apiServices.tiposEquipos.getTipos(function(data){
      $scope.model.tipos = data;
    }, function(err) {
      console.error(err);
      messageCenterService.add('danger', '<strong>Ops!</strong><br /><span>Error al cargar tipos de equipos.</span>', { html: true, timeout: config.time_danger });
    });
  };
  $scope.cargar();

  //metodo para agregar un equipo
  $scope.agregar = function() {
    //validaciones
    if (!$scope.model.nuevo.nombre) {
      messageCenterService.add('warning', '<strong>Ops!</strong><br /><span>El nombre de equipo es requerido.</span>', { html: true, timeout: config.time_warning });
      return;
    }

    //guarda nuevo equipo
    apiServices.equipos.save($scope.model.nuevo, function(data) {
      if (!$scope.model.equipos) { $scope.model.equipos = []; }
      $scope.model.equipos.unshift(data);
      $scope.model.nuevo = {};
      $scope.model.ver_agregar = false;
      messageCenterService.add('success', '<strong>Ok!</strong><br /><span>Operación exitosa.</span>', { html: true, timeout: config.time_success });
    }, function(err) {
      console.error(err);
      messageCenterService.add('danger', '<strong>Ops!</strong><br /><span>Error al guardar equipo.</span>', { html: true, timeout: config.time_danger });
    });
  };

  //metodo para desactivar un equipo
  $scope.desactivar = function(equipo) {
    console.log('desactivar');
    apiServices.equipos.update({ id: equipo._id }, { es_activo: false }, function(data) {
      equipo.es_activo = data.es_activo;
      equipo.fecha_modificacion = data.fecha_modificacion;
      messageCenterService.add('success', '<strong>Ok!</strong><br /><span>Operación exitosa.</span>', { html: true, timeout: config.time_success });
    }, function(err) {
      console.error(err);
      messageCenterService.add('danger', '<strong>Ops!</strong><br /><span>Error al desactivar equipo.</span>', { html: true, timeout: config.time_danger });
    });
  };

  //metodo para desactivar un equipo
  $scope.activar = function(equipo) {
    console.log('activar');
    apiServices.equipos.update({ id: equipo._id }, { es_activo: true }, function(data) {
      equipo.es_activo = data.es_activo;
      equipo.fecha_modificacion = data.fecha_modificacion;
      messageCenterService.add('success', '<strong>Ok!</strong><br /><span>Operación exitosa.</span>', { html: true, timeout: config.time_success });
    }, function(err) {
      console.error(err);
      messageCenterService.add('danger', '<strong>Ops!</strong><br /><span>Error al activar equipo.</span>', { html: true, timeout: config.time_danger });
    });
  };

  //metodo para ver form editar equipo
  $scope.ver_form_editar = function(equipo) {
    $scope.model.ver_agregar = false; //esconde form agregar
    $scope.model.nuevo = {}; //quita datos de form agregar
    _.each($scope.model.equipo, function(x) { x.ver_editar = false; }); //esconde form editar activos
    equipo.ver_editar = true;
    equipo.editar = _.clone(equipo);
  };

  //metodo para ocultar form editar equipo
  $scope.ocultar_form_editar = function(equipo) {
    $scope.model.ver_agregar = false; //esconde form agregar
    $scope.model.nuevo = {}; //quita datos de form agregar
    _.each($scope.model.equipos, function(x) { x.ver_editar = false; }); //esconde form editar activos
    equipo.ver_editar = false;
    equipo.editar = {};
  };

  //metodo para editar datos de un proyecto
  $scope.editar = function(equipo) {
    apiServices.equipos.update({ id: equipo._id }, equipo.editar, function(data) {
      equipo.nombre = data.nombre;
      equipo.serie = data.serie;
      equipo.marca = data.marca;
      equipo.capacidad = data.capacidad;
      equipo.modelo = data.modelo;
      equipo.tipo = data.tipo;
      equipo.antiguedad = data.antiguedad;
      equipo.fecha_modificacion = data.fecha_modificacion;
      $scope.ocultar_form_editar(equipo);
      messageCenterService.add('success', '<strong>Ok!</strong><br /><span>Operación exitosa.</span>', { html: true, timeout: config.time_success });
    }, function(err) {
      console.error(err);
      messageCenterService.add('danger', '<strong>Ops!</strong><br /><span>Error al editar equipo.</span>', { html: true, timeout: config.time_danger });
    });
  };

  //metodo para descargar pdf con código qr
  $scope.imprimir_single = function(equipo) {

    var img_qr = angular.element('#qr_' + equipo._id + ' > img').attr('src');
    var img_logo = 'data:image/jpeg;base64,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';

    var doc = new window.jsPDF();
    doc.setFontSize(40);
    doc.addImage(img_logo, 'JPEG', 15, 15, 180, 50);
    doc.addImage(img_qr, 'JPEG', 15, 75, 180, 180);
    doc.text(15, 285, 'Serie: ' + equipo.serie);

    doc.save('qr_' + equipo._id + '.pdf');
  };
});
