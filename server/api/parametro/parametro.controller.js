/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/parametro              ->  index
 * POST    /api/parametro              ->  create
 * GET     /api/parametro/:id          ->  show
 * PUT     /api/parametro/:id          ->  update
 * DELETE  /api/parametro/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Parametro = require('./parametro.model');
var path = require('path');
var fs = require('bluebird').promisifyAll(require('fs'));

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
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

//retorna json vacio en lugar de error 404
function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(200).send({});
      return null;
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(function(updated) {
        return updated;
      });
  };
}

//obtiene parametros
exports.show = function(req, res) {
  Parametro.findOneAsync({})
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

//graba datos de parametros, reemplaza existentes
exports.editar = function(req, res) {
  //limpia coleccion y luego crea elemento unico
  Parametro.find({}).removeAsync().then(function() {
    Parametro.createAsync(req.body)
      .then(function(entity) {
        if (req.body.correo.footer) {
          return fs.writeFileAsync(path.join(process.env.CLOUD_DIR, 'footer_correo.jpg'), req.body.correo.footer, 'base64').then(function(err) {
            if (err) { console.error(err); }
            return entity;
          });
        }
        return entity;
      })
      .then(responseWithResult(res, 201))
      .catch(handleError(res));
  });
};

//metodo para obtener logo cliente
exports.footer_correo = function(req, res) {
  res.sendFile(path.join(process.env.CLOUD_DIR, 'footer_correo.jpg'));
};
