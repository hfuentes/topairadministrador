'use strict';

var _ = require('lodash');
var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    res.status(statusCode).json(err);
  }
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function respondWith(res, statusCode) {
  statusCode = statusCode || 200;
  return function() {
    res.status(statusCode).end();
  };
}

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

//metodo que retorna los roles posibles
exports.getRoles = function(req, res) {
  return res.status(200).json([
    { nombre: 'Administrador', valor: 'admin' },
    { nombre: 'Operador', valor: 'user' }
  ]);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword -password -token')
    .sort('-fecha_modificacion')
    .exec()
    .then(function(users) {
      res.status(200).json(users);
    }).catch(handleError(res));
};

//metodo para obtener usuarios con perfiles activos (solo carga perfiles)
exports.getPerfilesActivos = function(req, res) {
  User.find({ es_activo: true }, '-salt -hashedPassword -password -token')
    .sort('-fecha_modificacion')
    .exec()
    .then(function(users) {
      res.status(200).json(users);
    }).catch(handleError(res));
};

/**
 * Creates a new user
 */
exports.create = function(req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = newUser.role || 'user';
  newUser.saveAsync().spread(function(user) {
    //auto login desactivado
    //var token = jwt.sign({ _id: user._id }, config.secrets.session, { expiresInMinutes: 60 * 5 });
    res.status(200).json(user);
  }).catch(validationError(res));
};

/**
 * Get a single user
 */
exports.show = function(req, res, next) {
  var userId = req.params.id;
  User.findByIdAsync(userId).then(function(user) {
    if (!user) {
      return res.status(404).end();
    }
    res.json(user.profile);
  }).catch(function(err) {
    return next(err);
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemoveAsync(req.params.id)
    .then(function() {
      res.status(204).end();
    })
    .catch(handleError(res));
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findByIdAsync(userId)
    .then(function(user) {
      if (user.authenticate(oldPass)) {
        user.password = newPass;
        return user.saveAsync()
          .then(function() {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;

  User.findOneAsync({ _id: userId }, '-salt -hashedPassword')
    .then(function(user) { // don't ever give out the password or salt
      if (!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(function(err) {
      return next(err);
    });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync().spread(function(updated) {
      return updated;
    });
  };
}

//metodo para actualizar datos de usuario
exports.update = function(req, res) {
  //elimina datos que no deben ser modificados por esta api
  if (req.body._id) { delete req.body._id; }
  if (req.body.password && req.body.password === '') { delete req.body.password; } //admin puede editar password
  if (req.body.provider) { delete req.body.provider; }
  if (req.body.salt) { delete req.body.salt; }
  if (req.body.google) { delete req.body.google; }
  if (req.body.github) { delete req.body.github; }
  //acciones para editar
  User.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
};
