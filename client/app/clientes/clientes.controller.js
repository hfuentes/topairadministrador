'use strict';

angular.module('PCMAdministradorApp').controller('ClientesCtrl', function($scope, apiServices, messageCenterService, config) {

  //modelo vista
  $scope.model = {
    clientes: [],
    nuevo: {
      nombre: '',
      correos: [],
      logo: ''
    },
    ver_agregar: false,
    ver_activos: true
  };

  //metodo para cargar datos en la vista
  $scope.cargar = function() {
    //cargar datos de clientes (todos)
    apiServices.clientes.query(function(data) {
      $scope.model.clientes = data;
    }, function(err) {
      console.error(err);
      messageCenterService.add('danger', '<strong>Ops!</strong><br /><span>Error al cargar clientes.</span>', { html: true, timeout: config.time_danger });
    });
  };
  $scope.cargar();

  //metodo para agregar un cliente
  $scope.agregar = function() {
    //validaciones
    if (!$scope.model.nuevo.nombre) {
      messageCenterService.add('warning', '<strong>Ops!</strong><br /><span>El nombre de cliente es requerido.</span>', { html: true, timeout: config.time_warning });
      return;
    }
    //valida tamaño de imagen logo
    if ($scope.model.nuevo.logo && ($scope.model.nuevo.logo.filesize / 1024 / 1024) > 2) {
      messageCenterService.add('warning', '<strong>Ops!</strong><br /><span>El peso máximo de la imagen es 2MB, seleccione una imagen con menor peso.</span>', { html: true, timeout: config.time_warning });
      return;
    }
    //valida tipo de imagen log
    if ($scope.model.nuevo.logo && $scope.model.nuevo.logo.filetype !== 'image/jpeg') {
      messageCenterService.add('warning', '<strong>Ops!</strong><br /><span>Solo se permiten imágenes de tipo JPG.</span>', { html: true, timeout: config.time_warning });
      return;
    }

    //valida formato de correos
    if ($scope.model.nuevo.correos && $scope.model.nuevo.correos.length > 0) {
      var patron = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i;
      var es_valido = true;
      _.each($scope.model.nuevo.correos, function(x) {
        if (es_valido && !patron.test(x)) {
          messageCenterService.add('warning', '<strong>Ops!</strong><br /><span>Correo "' + x + '" no tiene formato válido.</span>', { html: true, timeout: config.time_warning });
          es_valido = false;
        }
      });
      if (!es_valido) {
        return; }
    }

    //guarda nuevo cliente
    apiServices.clientes.save({
      nombre: $scope.model.nuevo.nombre,
      correos: $scope.model.nuevo.correos,
      logo: $scope.model.nuevo.logo.base64,
      contacto: $scope.model.nuevo.contacto,
      telefono: $scope.model.nuevo.telefono,
      direccion: $scope.model.nuevo.direccion
    }, function(data) {
      if (!$scope.model.clientes) { $scope.model.clientes = []; }
      $scope.model.clientes.unshift(data);
      $scope.model.nuevo = {};
      messageCenterService.add('success', '<strong>Ok!</strong><br /><span>Operación exitosa.</span>', { html: true, timeout: config.time_success });
    }, function(err) {
      console.error(err);
      messageCenterService.add('danger', '<strong>Ops!</strong><br /><span>Error al guardar cliente.</span>', { html: true, timeout: config.time_danger });
    });
  };

  //metodo para desactivar un cliente
  $scope.desactivar = function(cliente) {
    apiServices.clientes.update({ id: cliente._id }, { es_activo: false }, function(data) {
      cliente.es_activo = data.es_activo;
      cliente.fecha_modificacion = data.fecha_modificacion;
      messageCenterService.add('success', '<strong>Ok!</strong><br /><span>Operación exitosa.</span>', { html: true, timeout: config.time_success });
    }, function(err) {
      console.error(err);
      messageCenterService.add('danger', '<strong>Ops!</strong><br /><span>Error al desactivar cliente.</span>', { html: true, timeout: config.time_danger });
    });
  };

  //metodo para desactivar un cliente
  $scope.activar = function(cliente) {
    apiServices.clientes.update({ id: cliente._id }, { es_activo: true }, function(data) {
      cliente.es_activo = data.es_activo;
      cliente.fecha_modificacion = data.fecha_modificacion;
      messageCenterService.add('success', '<strong>Ok!</strong><br /><span>Operación exitosa.</span>', { html: true, timeout: config.time_success });
    }, function(err) {
      console.error(err);
      messageCenterService.add('danger', '<strong>Ops!</strong><br /><span>Error al activar cliente.</span>', { html: true, timeout: config.time_danger });
    });
  };

  //metodo para ver form editar cliente
  $scope.ver_form_editar = function(cliente) {
  	$scope.model.ver_agregar = false; //esconde form agregar
  	$scope.model.nuevo = {}; //quita datos de form agregar
  	_.each($scope.model.cliente, function(x) { x.ver_editar = false; }); //esconde form editar activos
  	cliente.ver_editar = true;
  	cliente.editar = {
  		nombre: cliente.nombre,
  		correos: _.clone(cliente.correos),
      contacto: cliente.contacto,
      telefono: cliente.telefono,
      direccion: cliente.direccion
  	};
  };

  //metodo para ocultar form editar cliente
  $scope.ocultar_form_editar = function(cliente) {
    $scope.model.ver_agregar = false; //esconde form agregar
    $scope.model.nuevo = {}; //quita datos de form agregar
    _.each($scope.model.clientes, function(x) { x.ver_editar = false; }); //esconde form editar activos
    cliente.ver_editar = false;
    cliente.editar = {};
  };

  //metodo para editar datos de un proyecto
  $scope.editar = function(cliente) {
    //valida tamaño de imagen logo
    if (cliente.editar.logo && (cliente.editar.logo.filesize / 1024 / 1024) > 2) {
      messageCenterService.add('warning', '<strong>Ops!</strong><br /><span>El peso máximo de la imagen es 2MB, seleccione una imagen con menor peso.</span>', { html: true, timeout: config.time_warning });
      return;
    }
    //valida tipo de imagen log
    if (cliente.editar.logo && cliente.editar.logo.filetype !== 'image/jpeg') {
      messageCenterService.add('warning', '<strong>Ops!</strong><br /><span>Solo se permiten imágenes de tipo JPG.</span>', { html: true, timeout: config.time_warning });      
      return;
    }
    apiServices.clientes.update({ id: cliente._id }, {
      nombre: cliente.editar.nombre,
      correos: cliente.editar.correos,
      logo: cliente.editar.logo ? cliente.editar.logo.base64 : undefined,
      contacto: cliente.editar.contacto,
      telefono: cliente.editar.telefono,
      direccion: cliente.editar.direccion
    }, function(data) {
      cliente.nombre = data.nombre;
      cliente.correos = data.correos;
      cliente.contacto = data.contacto;
      cliente.telefono = data.telefono;
      cliente.direccion = data.direccion;
      cliente.fecha_modificacion = data.fecha_modificacion;
      $scope.ocultar_form_editar(cliente);
      messageCenterService.add('success', '<strong>Ok!</strong><br /><span>Operación exitosa.</span>', { html: true, timeout: config.time_success });
    }, function(err) {
      console.error(err);
      messageCenterService.add('danger', '<strong>Ops!</strong><br /><span>Error al editar cliente.</span>', { html: true, timeout: config.time_danger });
    });
  };
});
