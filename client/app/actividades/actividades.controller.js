'use strict';

angular.module('PCMAdministradorApp').controller('ActividadesCtrl', function($scope, $stateParams, apiServices, _, messageCenterService, config) {

  //modelo de vista
  $scope.model = {
    proyecto: {},
    actividades: [],
    motivo_enum: [],
    nuevo: {
      proyecto: $stateParams.id_proyecto,
      equipo: '',
      motivo_visita: '',
      parametros: {}, //ver modelo actividad
      estado_inicial: {},
      trabajos_realizados: {},
      recomendaciones: {},
      solicitante: '',
      indicador: {
        es_verde: true
      }
    },
    ver_agregar: false,
    ver_envio: false,
    ver_actividades_enviar: false,
    envio: {
      correos: [],
      cco: [],
      asunto: '',
      cuerpo: '',
      actividades: []
    },
    ver_resumenes: false,
    envios: []
  };

  //metodo para cargar datos vista
  $scope.cargar = function() {
    apiServices.proyectos.get({ id: $stateParams.id_proyecto }).$promise.then(function(data) {
        if (data) {
          $scope.model.proyecto = data;
          $scope.model.envio.correos = $scope.model.proyecto.cliente.correos || '';
          return apiServices.actividades.getMotivoEnum().$promise;
        }
      })
      .then(function(data) {
        if (data) {
          $scope.model.motivo_enum = data;
          return apiServices.actividades.byProyecto({ id_proyecto: $stateParams.id_proyecto }).$promise;
        }
      })
      .then(function(data) {
        if (data) {
          $scope.model.actividades = data;
          return apiServices.parametros.obtener().$promise;
        }
      })
      .then(function(data) {
        if (data) {
          $scope.model.envio.cco = data.resumen.cco;
          $scope.model.envio.asunto = data.resumen.asunto;
          $scope.model.envio.cuerpo = data.resumen.cuerpo;
          return apiServices.resumenes.byProyecto({ id: $stateParams.id_proyecto }).$promise;
        }
      })
      .then(function(data) {
        if (data) {
          $scope.model.envios = data;
          return data;
        }
      })
      .catch(function(err) {
        console.error(err);
        messageCenterService.add('danger', '<strong>Ops!</strong><br /><span>Error al cargar datos iniciales.</span>', { html: true, timeout: config.time_danger });
      });
  };
  $scope.cargar();

  //metodo para agregar actividad
  $scope.agregar_actividad = function() {
    //validaciones
    if (!$scope.model.nuevo.equipo || ($scope.model.nuevo.equipo && !$scope.model.nuevo.equipo._id)) {
      messageCenterService.add('warning', '<strong>Ops!</strong><br /><span>Debe seleccionar un equipo asociado.</span>', { html: true, timeout: config.time_warning });
      return;
    }
    if (!$scope.model.nuevo.motivo_visita) {
      messageCenterService.add('warning', '<strong>Ops!</strong><br /><span>Debe seleccionar un motivo para la visita.</span>', { html: true, timeout: config.time_warning });
      return;
    }
    //TODO preguntar por validaciones para parametros
    if (!$scope.model.nuevo.estado_inicial || ($scope.model.nuevo.estado_inicial && !$scope.model.nuevo.estado_inicial.texto)) {
      messageCenterService.add('warning', '<strong>Ops!</strong><br /><span>Debe agregar texto para etapa 1.</span>', { html: true, timeout: config.time_warning });
      return;
    }
    if (!$scope.model.nuevo.trabajos_realizados || ($scope.model.nuevo.trabajos_realizados && !$scope.model.nuevo.trabajos_realizados.texto)) {
      messageCenterService.add('warning', '<strong>Ops!</strong><br /><span>Debe agregar texto para etapa 2.</span>', { html: true, timeout: config.time_warning });
      return;
    }
    if (!$scope.model.nuevo.recomendaciones || ($scope.model.nuevo.recomendaciones && !$scope.model.nuevo.recomendaciones.texto)) {
      messageCenterService.add('warning', '<strong>Ops!</strong><br /><span>Debe agregar texto para etapa 3.</span>', { html: true, timeout: config.time_warning });
      return;
    }

    //obtiene ids de trabajos realizados seleccionados
    if ($scope.model.nuevo.equipo.tipo && $scope.model.nuevo.equipo.tipo.trabajos && $scope.model.nuevo.equipo.tipo.trabajos.length > 0) {
      $scope.model.nuevo.trabajos_realizados.trabajos = _.map(_.filter($scope.model.nuevo.equipo.tipo.trabajos, function(x) {
        return x.checked;
      }), function(x) {
        return x._id;
      });
    }

    var datos = _.clone($scope.model.nuevo);
    datos.es_pendiente = false;
    apiServices.actividades.save(datos, function(data) {
      $scope.model.ver_agregar = false;
      $scope.cancelar_agregar();
      $scope.model.actividades.unshift(data);
      messageCenterService.add('success', '<strong>Ok!</strong><br /><span>Operación exitosa.</span>', { html: true, timeout: config.time_success });
    }, function(err) {
      console.error(err);
      messageCenterService.add('danger', '<strong>Ops!</strong><br /><span>Error al guardar trabajo.</span>', { html: true, timeout: config.time_danger });
    });
  };

  $scope.cancelar_agregar = function() {
    $scope.model.ver_agregar = false;
    $scope.model.nuevo = {
      proyecto: $stateParams.id_proyecto,
      texto_equipo_buscar: '',
      equipos_buscar: [],
      equipo_seleccionado: {},
      equipo: '',
      motivo_visita: '',
      parametros: {},
      estado_inicial: {},
      trabajos_realizados: {},
      recomendaciones: {},
      solicitante: '',
      indicador: {
        es_verde: true
      }
    };
  };

  //metodo para activar / desactivar actividad
  $scope.desactivar = function(actividad) {
    apiServices.actividades.update({ id: actividad._id }, { es_activo: !actividad.es_activo }, function(data) {
      actividad.es_activo = data.es_activo;
      actividad.fecha_modificacion = data.fecha_modificacion;
      messageCenterService.add('success', '<strong>Ok!</strong><br /><span>Operación exitosa.</span>', { html: true, timeout: config.time_success });
    }, function(err) {
      console.error(err);
      messageCenterService.add('danger', '<strong>Ops!</strong><br /><span>Error editar datos de actividad.</span>', { html: true, timeout: config.time_danger });
    });
  };

  //metodo para marcar actividad como pendiente
  $scope.revisar = function(actividad) {
    apiServices.actividades.update({ id: actividad._id }, { es_pendiente: !actividad.es_pendiente }, function(data) {
      actividad.es_pendiente = data.es_pendiente;
      actividad.fecha_modificacion = data.fecha_modificacion;
      messageCenterService.add('success', '<strong>Ok!</strong><br /><span>Operación exitosa.</span>', { html: true, timeout: config.time_success });
    }, function(err) {
      console.error(err);
      messageCenterService.add('danger', '<strong>Ops!</strong><br /><span>Error editar datos de actividad.</span>', { html: true, timeout: config.time_danger });
    });
  };

  //metodo para mostrar form editar actividad
  $scope.ver_form_editar = function(actividad) {
    $scope.cancelar_editar();
    actividad.ver_editar = true;
    actividad.editar = _.clone(actividad);
    if (actividad.editar.equipo.tipo && actividad.editar.equipo.tipo.trabajos && actividad.editar.equipo.tipo.trabajos.length > 0) {
      _.each(actividad.editar.equipo.tipo.trabajos, function(x) {
        x.checked = _.some(actividad.trabajos_realizados.trabajos, function(a) {
          return a._id === x._id;
        });
      });
    }
  };

  //metodo para cancelar form editar actividades
  $scope.cancelar_editar = function() {
    _.each($scope.model.actividades, function(x) {
      x.ver_editar = false;
      delete x.editar;
    });
  };

  //metodo para editar actividad
  $scope.editar_actividad = function(actividad) {
    //validaciones
    if (!actividad.editar.equipo || (actividad.editar.equipo && !actividad.editar.equipo._id)) {
      messageCenterService.add('warning', '<strong>Ops!</strong><br /><span>Debe seleccionar un equipo asociado.</span>', { html: true, timeout: config.time_warning });
      return;
    }
    if (!actividad.editar.motivo_visita) {
      messageCenterService.add('warning', '<strong>Ops!</strong><br /><span>Debe seleccionar un motivo para la visita.</span>', { html: true, timeout: config.time_warning });
      return;
    }
    //TODO preguntar por validaciones para parametros
    if (!actividad.editar.estado_inicial || (actividad.editar.estado_inicial && !actividad.editar.estado_inicial.texto)) {
      messageCenterService.add('warning', '<strong>Ops!</strong><br /><span>Debe agregar texto para etapa 1.</span>', { html: true, timeout: config.time_warning });
      return;
    }
    if (!actividad.editar.trabajos_realizados || (actividad.editar.trabajos_realizados && !actividad.editar.trabajos_realizados.texto)) {
      messageCenterService.add('warning', '<strong>Ops!</strong><br /><span>Debe agregar texto para etapa 2.</span>', { html: true, timeout: config.time_warning });
      return;
    }
    if (!actividad.editar.recomendaciones || (actividad.editar.recomendaciones && !actividad.editar.recomendaciones.texto)) {
      messageCenterService.add('warning', '<strong>Ops!</strong><br /><span>Debe agregar texto para etapa 3.</span>', { html: true, timeout: config.time_warning });
      return;
    }

    //obtiene ids de trabajos realizados seleccionados
    if (actividad.editar.equipo.tipo && actividad.editar.equipo.tipo.trabajos && actividad.editar.equipo.tipo.trabajos.length > 0) {
      actividad.editar.trabajos_realizados.trabajos = _.map(_.filter(actividad.editar.equipo.tipo.trabajos, function(x) {
        return x.checked;
      }), function(x) {
        return x._id;
      });
    }

    var datos = _.clone(actividad.editar);
    datos.es_pendiente = false;
    apiServices.actividades.update({ id: datos._id }, datos, function(data) {
      $scope.cancelar_editar();
      //edicion manual de datos actividad para efectos inmediatos en vista
      actividad.motivo_visita = data.motivo_visita;
      actividad.parametros = data.parametros;
      actividad.estado_inicial = data.estado_inicial;
      actividad.trabajos_realizados = data.trabajos_realizados;
      actividad.recomendaciones = data.recomendaciones;
      actividad.observacion = data.observacion;
      actividad.equipo = data.equipo;
      actividad.ubicacion = data.ubicacion;
      actividad.solicitante = data.solicitante;
      actividad.es_verde = data.es_verde;
      actividad.es_amarillo = data.es_amarillo;
      actividad.es_rojo = data.es_rojo;
      actividad.fecha_modificacion = data.fecha_modificacion;
      messageCenterService.add('success', '<strong>Ok!</strong><br /><span>Operación exitosa.</span>', { html: true, timeout: config.time_success });
    }, function(err) {
      console.error(err);
      messageCenterService.add('danger', '<strong>Ops!</strong><br /><span>Error al editar trabajo.</span>', { html: true, timeout: config.time_danger });
    });
  };

  $scope.cancelar_resumen = function() {
    $scope.model.ver_envio = false;
    $scope.model.envio = {
      correos: $scope.model.proyecto.cliente.correos,
      cco: [],
      asunto: '',
      cuerpo: '',
      actividades: []
    };
    _.each($scope.model.actividades, function(x) {
      x.check_enviar = false;
    });
  };

  //metodo para crear resumen
  $scope.agregar_resumen = function() {
    //busca actividades marcadas para enviar
    $scope.model.envio.actividades = _.map(_.filter($scope.model.actividades, function(x) {
      return x.es_activo && x.check_enviar;
    }), function(x) {
      return x._id;
    });
    //setea identificador de proyecto
    $scope.model.envio.proyecto = $stateParams.id_proyecto;
    //validaciones
    if (!$scope.model.envio.correos) {
      messageCenterService.add('warning', '<strong>Ops!</strong><br /><span>Debe indicar por lo menos un correo para enviar el resumen.</span>', { html: true, timeout: config.time_warning });
      return;
    }
    if (!$scope.model.envio.asunto) {
      messageCenterService.add('warning', '<strong>Ops!</strong><br /><span>El texto asunto del correo es obligatorio para enviar el resumen.</span>', { html: true, timeout: config.time_warning });
      return;
    }
    if (!$scope.model.envio.cuerpo) {
      messageCenterService.add('warning', '<strong>Ops!</strong><br /><span>El texto cuerpo del correo es obligatorio para enviar el resumen.</span>', { html: true, timeout: config.time_warning });
      return;
    }
    if (!$scope.model.envio.observacion) {
      messageCenterService.add('warning', '<strong>Ops!</strong><br /><span>La observación general es obligatoria para enviar el resumen.</span>', { html: true, timeout: config.time_warning });
      return;
    }
    if (!$scope.model.envio.actividades || ($scope.model.envio.actividades && $scope.model.envio.actividades.length === 0)) {
      messageCenterService.add('warning', '<strong>Ops!</strong><br /><span>Debe seleccionar por lo menos un trabajo para informar en este resumen.</span>', { html: true, timeout: config.time_warning });
      return;
    }
    apiServices.resumenes.save($scope.model.envio, function(data) {
      $scope.cancelar_resumen();
      messageCenterService.add('success', '<strong>Ok!</strong><br /><span>Operación exitosa.</span>', { html: true, timeout: config.time_success });
      if (!$scope.model.envios) { $scope.model.envios = []; }
      $scope.model.envios.unshift(data);
    }, function(err) {
      console.error(err);
      messageCenterService.add('danger', '<strong>Ops!</strong><br /><span>Error guardar datos de resumen.</span>', { html: true, timeout: config.time_danger });
    });
  };
});
