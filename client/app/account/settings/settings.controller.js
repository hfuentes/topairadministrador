'use strict';

angular.module('PCMAdministradorApp').controller('SettingsCtrl', function($scope, User, Auth, apiServices, messageCenterService, config) {
  $scope.errors = {};

  //modelo vista
  $scope.model = {
    editando: false,
    parametros: {
      resumen: {
        cco: [],
        asunto: '',
        cuerpo: ''
      },
      correo: {
        smtps: '',
        from: '',
        link_text: '',
        footer: ''
      }
    }
  };

  //obtiene datos iniciales
  $scope.cargar = function() {
    apiServices.parametros.obtener(function(data) {
      $scope.model.parametros = data;
    }, function(err) {
      console.error(err);
      messageCenterService.add('danger', '<strong>Ops!</strong><br /><span>Error obtener parámetros de configuración.</span>', { html: true, timeout: config.time_danger });
    });
  };
  $scope.cargar();

  //metodo para cambiar password (se ocupa metodo por defecto del framework)
  $scope.changePassword = function(form) {
    $scope.submitted = true;
    if (form.$valid) {
      Auth.changePassword($scope.user.oldPassword, $scope.user.newPassword).then(function() {
        $scope.message = 'Contraseña modificada exitosamente.';
      }).catch(function() {
        form.password.$setValidity('mongoose', false);
        $scope.errors.other = 'Contraseña incorrecta';
        $scope.message = '';
      });
    }
  };

  //metodo para editar parametros
  $scope.editar_parametros = function() {
    $scope.model.editando = true;
    //validaciones imagen correo footer
    if ($scope.model.parametros.correo.footer && ($scope.model.parametros.correo.footer.filesize / 1024 / 1024) > 2) {
      messageCenterService.add('warning', '<strong>Ops!</strong><br /><span>El peso máximo de la imagen es 2MB, seleccione una imagen con menor peso.</span>', { html: true, timeout: config.time_warning });
      return;
    }
    //valida tipo de imagen log
    if ($scope.model.parametros.correo.footer && $scope.model.parametros.correo.footer.filetype !== 'image/jpeg') {
      messageCenterService.add('warning', '<strong>Ops!</strong><br /><span>Solo se permiten imágenes de tipo JPG.</span>', { html: true, timeout: config.time_warning });      
      return;
    }
    //obtiene codificacion base64 para enviar a servidor
    if ($scope.model.parametros.correo.footer) {
      $scope.model.parametros.correo.footer = $scope.model.parametros.correo.footer.base64;
    }
    apiServices.parametros.editar($scope.model.parametros, function(data) {
      $scope.model.parametros = data;
      $scope.model.editando = false;
      messageCenterService.add('success', '<strong>Ok!</strong><br /><span>Operación exitosa.</span>', { html: true, timeout: config.time_success });
    }, function(err) {
      console.error(err);
      $scope.model.editando = false;
      messageCenterService.add('danger', '<strong>Ops!</strong><br /><span>Error editar parámetros de configuración.</span>', { html: true, timeout: config.time_danger });
    });
  };
});
