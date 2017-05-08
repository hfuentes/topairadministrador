'use strict';

var express = require('express');
var controller = require('./parametro.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();
router.get('/obtener', auth.hasRole('admin'), controller.show);
router.post('/editar', auth.hasRole('admin'), controller.editar);
router.get('/footer_correo', controller.footer_correo);

module.exports = router;
