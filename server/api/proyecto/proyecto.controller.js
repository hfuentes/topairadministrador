/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/proyecto              ->  index
 * POST    /api/proyecto              ->  create
 * GET     /api/proyecto/:id          ->  show
 * PUT     /api/proyecto/:id          ->  update
 * DELETE  /api/proyecto/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Proyecto = require('./proyecto.model');
var Ubicacion = require('../ubicacion/ubicacion.model');
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
    //ojo! merge no hace reemplazo completo en ref array, reemplazo manual
    updated.usuarios = updates.usuarios;
    updated.equipos = updates.equipos;
    updated.ubicaciones = updates.ubicaciones;
    return updated.saveAsync().spread(function(updated) {
      return updated;
    });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync().then(function() {
        res.status(204).end();
      });
    }
  };
}

// Gets a list of Proyectos
exports.index = function(req, res) {
  if (req.user.role === 'admin') {
    //caso usuario adminstrador muestra todos los proyectos
    Proyecto.find({ es_activo: true })
      .sort('-fecha_creacion')
      .populate({ path: 'usuarios', select: 'name' })
      .populate('ubicaciones cliente equipos')
      .exec()
      .then(responseWithResult(res))
      .catch(handleError(res));
  } else {
    //caso usuario no es administrador muetra solo proyectos asociados
    Proyecto.find({ usuarios: { $in: [req.user._id] }, es_activo: true })
      .sort('-fecha_creacion')
      .populate({ path: 'usuarios', select: 'name' })
      .populate({ path: 'ubicaciones', select: 'nombre' })
      .populate({ path: 'cliente', select: 'nombre' })
      .deepPopulate('equipos.tipo.trabajos')
      .exec()
      .then(responseWithResult(res))
      .catch(handleError(res));
  }
};

//metodo que obtiene proyectos inactivos
exports.getAll = function(req, res) {
  Proyecto.find({})
    .populate({ path: 'usuarios', select: 'name' })
    .populate({ path: 'ubicaciones', select: 'nombre' })
    .populate({ path: 'cliente', select: 'nombre' })
    .populate({ path: 'equipos', select: 'nombre' })
    .exec()
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Gets a single Proyecto from the DB
exports.show = function(req, res) {
  if (req.user.role === 'admin') {
    //caso usuario adminstrador busca proyecto por id
    Proyecto.findById(req.params.id)
      .populate({ path: 'usuarios', select: 'name' })
      .populate({ path: 'ubicaciones', select: 'nombre' })
      .populate({ path: 'cliente', select: 'nombre correos' })
      .deepPopulate('equipos.tipo.trabajos')
      .exec()
      .then(handleEntityNotFound(res))
      .then(responseWithResult(res))
      .catch(handleError(res));
  } else {
    //caso usuario no es admin busca proyecto asociado
    Proyecto.findOne({ _id: req.params.id, usuarios: { $in: [req.user._id] } })
      .then(handleEntityNotFound(res))
      .then(responseWithResult(res))
      .catch(handleError(res));
  }
};

// Creates a new Proyecto in the DB
exports.create = function(req, res) {
  //validaciones
  if (req.user && req.body &&
    req.body.cliente &&
    req.body.nombre &&
    req.body.ubicaciones &&
    req.body.ubicaciones.length > 0
  ) {

    //fix: dato cliente ya es object_id, datos usuarios ya son object_id
    //dato ubicaciones es string, las ubicaciones se crearan por separado al proyecto
    var ubicaciones = _.map(req.body.ubicaciones, function(x) {
      return { nombre: x };
    });
    delete req.body.ubicaciones;

    //crea proyecto: nombre y cliente base
    Proyecto.createAsync(req.body).then(function(entity) {
        //agrega ubicaciones
        return Ubicacion.createAsync(ubicaciones).then(function(data) {
          //agrega referencias de ubicaciones ids a proyecto
          entity.ubicaciones = data;
          return entity.saveAsync().spread(function(saved) {
            return saved;
          });
        });
      })
      .then(function(entity) {
        //carga datos de asociados y ubicaciones
        if (entity) {
          return Proyecto.findById(entity._id)
            .populate({ path: 'usuarios', select: 'name' })
            .populate({ path: 'ubicaciones', select: 'nombre' })
            .populate({ path: 'cliente', select: 'nombre' })
            .populate({ path: 'equipos', select: 'nombre' })
            .exec(); //exec retorna una promesa //nueva promesa tiene entidad con cargas realizadas
        }
      }).then(responseWithResult(res, 201)).catch(handleError(res));
  } else {
    return res.status(400).send({});
  }
};

// Updates an existing Proyecto in the DB
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  var ubicaciones = req.body.ubicaciones;
  req.body.ubicaciones = [];
  var ubicaciones_ids = [];

  Proyecto.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body)) //quita todas las ubicaciones
    .then(function(entity) {
      return promise.all(_.map(ubicaciones, function(x) {
        if (x._id) {
          //actualiza ubicaciones asociadas
          var id = x._id;
          delete x._id;
          return Ubicacion.findByIdAsync(id).then(function(data) {
            if (data) {

              data.nombre = x.nombre;
              data.es_activo = x.es_activo;
              return data.saveAsync().spread(function(updated) {
                ubicaciones_ids.push(updated._id);
                return updated;
              });
            }
          });
        } else {
          //agrega ubicaciones nuevas
          return Ubicacion.createAsync(x).then(function(data) {
            ubicaciones_ids.push(data._id);
            return data;
          });
        }
      })).then(function() {
        return entity;
      });
    })
    .then(function(entity) {
      if (entity) {
        entity.ubicaciones = ubicaciones_ids;
        return entity.saveAsync().spread(function(saved) {
          return saved;
        });
      }
    })
    .then(function(entity) {
      if (entity) {
        return Proyecto.findById(req.params.id)
          .populate({ path: 'usuarios', select: 'name' })
          .populate({ path: 'ubicaciones', select: 'nombre' })
          .populate({ path: 'cliente', select: 'nombre' })
          .populate({ path: 'equipos', select: 'nombre' })
          .exec(); //exec retorna una promesa //nueva promesa tiene entidad con cargas realizadas
      }
    })
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a Proyecto from the DB
exports.destroy = function(req, res) {
  Proyecto.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
};
