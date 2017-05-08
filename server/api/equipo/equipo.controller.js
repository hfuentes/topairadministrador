/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/equipo              ->  index
 * POST    /api/equipo              ->  create
 * GET     /api/equipo/:id          ->  show
 * PUT     /api/equipo/:id          ->  update
 * DELETE  /api/equipo/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Equipo = require('./equipo.model');
var Proyecto = require('../proyecto/proyecto.model');

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

// Gets a list of Equipos
exports.index = function(req, res) {
  Equipo.find()
    .sort('-es_activo nombre')
    .populate('tipo')
    .exec()
    .then(responseWithResult(res))
    .catch(handleError(res));
};

//obtiene equipos activos
exports.activos = function(req, res) {
  Equipo.find({ es_activo: true })
    .sort('nombre')
    .populate('tipo')
    .exec()
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Gets a single Equipo from the DB
exports.show = function(req, res) {
  Equipo.findById(req.params.id)
    .populate('tipo')
    .exec()
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Creates a new Equipo in the DB
exports.create = function(req, res) {
  Equipo.createAsync(req.body)
    .then(function(entity) {
      return Equipo.findOne(entity)
        .populate('tipo')
        .exec();
    })
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};

// Updates an existing Equipo in the DB
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Equipo.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(function(entity) {
      return Equipo.findOne(entity)
        .populate('tipo')
        .exec();
    })
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a Equipo from the DB
exports.destroy = function(req, res) {
  Equipo.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
};

exports.proyecto_buscar = function(req, res) {
  Proyecto.findByIdAsync(req.body.id_proyecto)
    .then(handleEntityNotFound(res))
    .then(function(data) {
      if (data) {
        return Equipo.find({
            es_activo: true,
            _id: {
              $in: data.equipos
            },
            nombre: {
              $regex: req.body.texto,
              $options: 'i'
            }
          })
          .deepPopulate('tipo tipo.trabajos')
          .sort('nombre')
          .exec();
      }
    })
    .then(responseWithResult(res))
    .catch(handleError(res));
};
