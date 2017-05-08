/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/tipoequipo              ->  index
 * POST    /api/tipoequipo              ->  create
 * GET     /api/tipoequipo/:id          ->  show
 * PUT     /api/tipoequipo/:id          ->  update
 * DELETE  /api/tipoequipo/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var TipoEquipo = require('./tipoequipo.model');
var TipoTrabajo = require('../tipotrabajo/tipotrabajo.model');
var promise = require('bluebird');

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
    return updated.saveAsync()
      .spread(function(updated) {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(function() {
          res.status(204).end();
        });
    }
  };
}

// Gets a list of TipoEquipos
exports.index = function(req, res) {
  TipoEquipo.find()
    .populate('trabajos')
    .exec()
    .then(responseWithResult(res))
    .catch(handleError(res));
};

//metodo para obtener solo datos de uso en app movil
exports.getCarga = function(req, res) {
  TipoEquipo.find({}, '_id nombre trabajos')
    .populate('trabajos', '_id nombre')
    .exec()
    .then(responseWithResult(res))
    .catch(handleError(res));
};

//metodo para obtener lista de tipos sin cargar trabajos asociados (mas rapido)
exports.getSimple = function(req, res) {
  TipoEquipo.findAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Gets a single TipoEquipo from the DB
exports.show = function(req, res) {
  TipoEquipo.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Creates a new TipoEquipo in the DB
exports.create = function(req, res) {
  //validaciones
  if (req.user && req.body && req.body.nombre) {
    var trabajos = _.map(req.body.trabajos, function(x) {
      return { nombre: x };
    });
    delete req.body.trabajos;
    TipoEquipo.createAsync(req.body)
      .then(function(entity) {
        return TipoTrabajo.createAsync(trabajos).then(function(data) {
          entity.trabajos = data;
          return entity.saveAsync().spread(function(saved) {
            return saved;
          });
        });
      })
      .then(function(entity) {
        if (entity) {
          return TipoEquipo.findById(entity._id)
            .populate('trabajos')
            .exec();
        }
      })
      .then(responseWithResult(res, 201))
      .catch(handleError(res));
  } else {
    return res.status(400).send({});
  }
};

// Updates an existing TipoEquipo in the DB
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }

  var trabajos = req.body.trabajos;
  req.body.trabajos = [];
  var trabajos_ids = [];

  TipoEquipo.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(function(entity) {
      return promise.all(_.map(trabajos, function(x) {
        if (x._id) {
          var id = x._id;
          delete x._id;
          return TipoTrabajo.findByIdAsync(id).then(function(data) {
            if (data) {
              data.nombre = x.nombre;
              data.es_activo = x.es_activo;
              return data.saveAsync().spread(function(updated) {
                trabajos_ids.push(updated._id);
                return updated;
              });
            }
          });
        } else {
          return TipoTrabajo.createAsync(x).then(function(data) {
            trabajos_ids.push(data._id);
            return data;
          });
        }
      })).then(function() {
        return entity;
      });
    })
    .then(function(entity) {
      if (entity) {
        entity.trabajos = trabajos_ids;
        return entity.saveAsync().spread(function(saved) {
          return saved;
        });
      }
    })
    .then(function(entity) {
      if (entity) {
        return TipoEquipo.findById(entity._id)
          .populate('trabajos')
          .exec();
      }
    })
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a TipoEquipo from the DB
exports.destroy = function(req, res) {
  TipoEquipo.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
};
