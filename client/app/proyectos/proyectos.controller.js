'use strict';

angular.module('PCMAdministradorApp').controller('ProyectosCtrl', function($scope, apiServices, User, _, messageCenterService, config) {

  $scope.model = {
    proyectos: [],
    usuarios: [],
    clientes: [],
    equipos: [],
    nuevo: {
      nombre: '',
      cliente: '',
      equipos: [],
      usuarios: [],
      ubicaciones: [],
      ubicacion_temp: '',
      numero: '',
      fecha_inicio: Date.now(),
      fecha_fin: Date.now()
    },
    ver_inactivos: false,
    ver_activos: true,
    ver_agregar: false,
    fecha_opciones: {}
  };

  //carga datos vista
  $scope.cargar = function() {

    //carga datos de proyecto activos
    apiServices.proyectos.getAll(function(data) {
      $scope.model.proyectos = data;
    }, function(err) {
      console.error(err);
      messageCenterService.add('danger', '<strong>Ops!</strong><br /><span>Error al cargar contratos.</span>', { html: true, timeout: config.time_danger });
      $scope.model.proyectos = [];
    });

    //carga datos de usuario activos
    User.perfiles_activos(function(data) {
      $scope.model.usuarios = data;
    }, function(err) {
      console.error(err);
      messageCenterService.add('danger', '<strong>Ops!</strong><br /><span>Error al cargar usuarios.</span>', { html: true, timeout: config.time_danger });
    });

    //cargar datos de clientes activos
    apiServices.clientes.activos(function(data) {
      $scope.model.clientes = data;
    }, function(err) {
      console.error(err);
      messageCenterService.add('danger', '<strong>Ops!</strong><br /><span>Error al cargar clientes.</span>', { html: true, timeout: config.time_danger });
    });

    //carga datos de equipos activos
    apiServices.equipos.activos(function(data) {
      $scope.model.equipos = data;
    }, function(err) {
      console.error(err);
      messageCenterService.add('danger', '<strong>Ops!</strong><br /><span>Error al cargar equipos.</span>', { html: true, timeout: config.time_danger });
    });
  };
  $scope.cargar();

  //metodo para agregar ubicaciones nuevas a nuevo proyecto
  $scope.agregar_ubicacion_nuevo = function() {
    if ($scope.model.nuevo.ubicacion_temp) {
      if (!$scope.model.nuevo.ubicaciones) { $scope.model.nuevo.ubicaciones = []; }
      $scope.model.nuevo.ubicaciones.unshift($scope.model.nuevo.ubicacion_temp);
      $scope.model.nuevo.ubicacion_temp = '';
    }
  };

  //metodo para agregar un nuevo proyecto
  $scope.agregar = function() {
    $scope.model.nuevo.usuarios = _.map(_.filter($scope.model.usuarios, function(x) {
      return x.checked && x.checked === true;
    }), function(x) {
      return x._id;
    });
    $scope.model.nuevo.equipos = _.map(_.filter($scope.model.equipos, function(x) {
      return x.checked && x.checked === true;
    }), function(x) {
      return x._id;
    });
    apiServices.proyectos.save($scope.model.nuevo, function(data) {
      _.each($scope.model.usuarios, function(x) { x.checked = false; }); //descheckea usuarios asociados
      $scope.model.nuevo = {};
      $scope.model.ver_agregar = false;
      $scope.model.proyectos.unshift(data);
      messageCenterService.add('success', '<strong>Ok!</strong><br /><span>Operación exitosa.</span>', { html: true, timeout: config.time_success });
    }, function(err) {
      console.error(err);
      messageCenterService.add('danger', '<strong>Ops!</strong><br /><span>Error al crear contrato.</span>', { html: true, timeout: config.time_danger });
    });
  };

  //metodo para desactivar un proyecto
  $scope.desactivar = function(proyecto) {
    apiServices.proyectos.update({ id: proyecto._id }, { es_activo: false }, function(data) {
      proyecto.es_activo = data.es_activo;
      proyecto.fecha_modificacion = data.fecha_modificacion;
      messageCenterService.add('success', '<strong>Ok!</strong><br /><span>Operación exitosa.</span>', { html: true, timeout: config.time_success });
    }, function(err) {
      console.error(err);
      messageCenterService.add('danger', '<strong>Ops!</strong><br /><span>Error al desactivar contrato.</span>', { html: true, timeout: config.time_danger });
    });
  };

  //metodo para activar un proyecto
  $scope.activar = function(proyecto) {
    apiServices.proyectos.update({ id: proyecto._id }, { es_activo: true }, function(data) {
      proyecto.es_activo = data.es_activo;
      proyecto.fecha_modificacion = data.fecha_modificacion;
      messageCenterService.add('success', '<strong>Ok!</strong><br /><span>Operación exitosa.</span>', { html: true, timeout: config.time_success });
    }, function(err) {
      console.error(err);
      messageCenterService.add('danger', '<strong>Ops!</strong><br /><span>Error al activar contrato.</span>', { html: true, timeout: config.time_danger });
    });
  };

  //metodo para mostrar form editar proyecto
  $scope.ver_form_editar = function(proyecto) {
    $scope.model.ver_agregar = false; //esconde form agregar
    $scope.model.nuevo = {}; //quita datos de form editar
    _.each($scope.model.usuarios, function(x) { x.checked = false; }); //deschequea usuario para volver a ocupar
    _.each($scope.model.proyectos, function(x) { x.ver_editar = false; }); //esconde form editar activos
    _.each($scope.model.inactivos, function(x) { x.ver_editar = false; }); //esconde form editar inactivos
    proyecto.ver_editar = true;

    proyecto.editar = {
      nombre: proyecto.nombre,
      cliente: proyecto.cliente ? proyecto.cliente._id : '',
      tipo: proyecto.tipo,
      especialidad: proyecto.especialidad,
      periodo: proyecto.periodo,
      frecuencia: proyecto.frecuencia,
      numero: proyecto.numero,
      usuarios: _.clone($scope.model.usuarios),
      equipos: _.clone($scope.model.equipos),
      ubicaciones: _.clone(proyecto.ubicaciones),
      fecha_inicio: proyecto.fecha_inicio,
      fecha_fin: proyecto.fecha_fin
    };

    //checkea usuarios asociados
    if (proyecto.usuarios) {
      _.each(proyecto.editar.usuarios, function(x) {
        x.checked = _.contains(_.map(proyecto.usuarios, function(x) {
          return x._id;
        }), x._id);
      });
    }

    //checkea equipos asociados
    if (proyecto.equipos) {
      _.each(proyecto.editar.equipos, function(x) {
        x.checked = _.contains(_.map(proyecto.equipos, function(x) {
          return x._id;
        }), x._id);
      });
    }
  };

  //metodo para ocultar form editar proyecto
  $scope.ocultar_form_editar = function(proyecto) {
    $scope.model.ver_agregar = false; //esconde form agregar
    $scope.model.nuevo = {}; //quita datos de form editar
    _.each($scope.model.usuarios, function(x) { x.checked = false; }); //deschequea usuario para volver a ocupar
    _.each($scope.model.equipos, function(x) { x.checked = false; }); //deschequea usuario para volver a ocupar
    _.each($scope.model.proyectos, function(x) { x.ver_editar = false; }); //esconde form editar activos
    _.each($scope.model.inactivos, function(x) { x.ver_editar = false; }); //esconde form editar inactivos
    proyecto.ver_editar = false;
    proyecto.editar = {};
  };

  //metodo para editar datos de un proyecto
  $scope.editar = function(proyecto) {
    apiServices.proyectos.update({ id: proyecto._id }, {
      nombre: proyecto.editar.nombre,
      cliente: proyecto.editar.cliente,
      tipo: proyecto.editar.tipo,
      especialidad: proyecto.editar.especialidad,
      periodo: proyecto.editar.periodo,
      frecuencia: proyecto.editar.frecuencia,
      ubicaciones: proyecto.editar.ubicaciones,
      numero: proyecto.editar.numero,
      fecha_inicio: proyecto.editar.fecha_inicio,
      fecha_fin: proyecto.editar.fecha_fin,
      usuarios: _.map(_.filter(proyecto.editar.usuarios, function(x) {
        return x.checked && x.checked === true;
      }), function(x) {
        return x._id;
      }),
      equipos: _.map(_.filter(proyecto.editar.equipos, function(x) {
        return x.checked && x.checked === true;
      }), function(x) {
        return x._id;
      })
    }, function(data) {
      proyecto.nombre = data.nombre;
      proyecto.usuarios = data.usuarios;
      proyecto.cliente = data.cliente;
      proyecto.equipos = data.equipos;
      proyecto.ubicaciones = data.ubicaciones;
      proyecto.numero = data.numero;
      proyecto.fecha_inicio = data.fecha_inicio;
      proyecto.fecha_fin = data.fecha_fin;
      proyecto.fecha_modificacion = data.fecha_modificacion;
      $scope.ocultar_form_editar(proyecto);
      messageCenterService.add('success', '<strong>Ok!</strong><br /><span>Operación exitosa.</span>', { html: true, timeout: config.time_success });
    }, function(err) {
      console.error(err);
      messageCenterService.add('danger', '<strong>Ops!</strong><br /><span>Error al editar contrato.</span>', { html: true, timeout: config.time_danger });
    });
  };

  //metodo para agregar ubicaciones en form editar
  $scope.agregar_ubicacion_editar = function(proyecto) {
    if (proyecto.editar.ubicacion_temp) {
      if (!proyecto.editar.ubicaciones) { proyecto.editar.ubicaciones = []; }
      proyecto.editar.ubicaciones.unshift({
        nombre: proyecto.editar.ubicacion_temp
      });
      proyecto.editar.ubicacion_temp = '';
    }
  };

  //metodo para guardar datos de ubicacion editada
  $scope.guardar_ubicacion_editada = function(ubicacion) {
    if (ubicacion.nombre_temp) {
      ubicacion.ver_editar = false;
      ubicacion.nombre = ubicacion.nombre_temp;
      ubicacion.nombre_temp = '';
    }
  };

});
