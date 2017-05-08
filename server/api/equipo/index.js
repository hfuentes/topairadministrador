'use strict';

var express = require('express');
var controller = require('./equipo.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:id', auth.hasRole('admin'), controller.show);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.post('/activos', auth.hasRole('admin'), controller.activos);
router.post('/proyecto_buscar', auth.hasRole('admin'), controller.proyecto_buscar);

module.exports = router;
