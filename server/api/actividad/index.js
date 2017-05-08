'use strict';

var express = require('express');
var controller = require('./actividad.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);
router.get('/proyecto/:id_proyecto', auth.isAuthenticated(), controller.index);
router.post('/pendientes', auth.isAuthenticated(), controller.pendientes);
router.post('/motivo_enum', auth.isAuthenticated(), controller.motivo_enum);

router.get('/estado_inicial/imagen/:id', controller.imagenEstadoInicial);
router.get('/trabajos_realizados/imagen/:id', controller.imagenTrabajosRealizados);

module.exports = router;
