'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');

var router = express.Router();

router.post('/', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    var error = err || info;
    if (error) {
      return res.status(401).json(error);
    }
    if (!user) {
      return res.status(404).json({message: 'Algo salió mal. Por favor, vuelva a intentarlo.'});
    }
    if (!user.es_activo) {
      return res.status(401).json({message: 'Cuenta desactivada. Contáctese con un administrador para activar la cuenta.'});
    }

    var token = auth.signToken(user._id, user.role);
    res.json({ token: token });
  })(req, res, next)
});

module.exports = router;
