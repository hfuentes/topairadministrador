'use strict';

var express = require('express');
var controller = require('./resumen.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

//metodo para pruebas
router.post('/prueba', controller.prueba);

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:id', auth.hasRole('admin'), controller.show);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/proyecto/:id', auth.hasRole('admin'), controller.byProyecto);

//metodos anonimos
router.get('/vista_cliente/:id', controller.vistaCliente);

module.exports = router;
