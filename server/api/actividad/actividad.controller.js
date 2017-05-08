/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/actividad              ->  index
 * POST    /api/actividad              ->  create
 * GET     /api/actividad/:id          ->  show
 * PUT     /api/actividad/:id          ->  update
 * DELETE  /api/actividad/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Actividad = require('./actividad.model');
var path = require('path');
var fs = require('bluebird').promisifyAll(require('fs'));

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    console.error(err);
    res.status(statusCode).send(err);
  };
}

function responseWithResult(res, statusCode) {
  console.log('responseWithResult .. entrar')
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
    return updated.saveAsync().spread(function(updated) {
      return updated;
    });
  };
}

function saveUpdatesEstadoTerminada(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    updated.es_pendiente = false;
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

//metodo que busca actividades pendientes
exports.pendientes = function(req, res) {
  var opciones = {
    proyecto: req.body.id_proyecto,
    es_pendiente: true,
    creador: req.user._id
  };
  if (req.user.role === 'admin') {
    delete opciones.creador;
  }
  Actividad.find(opciones)
    .sort('-fecha_creacion')
    .deepPopulate('creador ubicacion equipo.tipo trabajos_realizados.trabajos')
    .execAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Gets a list of Actividads
//filtro segun id proyecto
exports.index = function(req, res) {
  Actividad.find({ proyecto: req.params.id_proyecto })
    .sort('-fecha_creacion')
    .deepPopulate('creador ubicacion equipo.tipo.trabajos trabajos_realizados.trabajos') //deep equipo.tipo (2lvl)
    .execAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Gets a single Actividad from the DB
exports.show = function(req, res) {
  Actividad.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Creates a new Actividad in the DB
exports.create = function(req, res) {
  //agraga datos creador de actividad
  req.body.creador = req.user._id;
  Actividad.createAsync(req.body)
    //graba foto etapa estado inicial
    .then(function(entity) {
      if (req.body.estado_inicial && req.body.estado_inicial.foto) {
        return fs.writeFileAsync(path.join(process.env.CLOUD_DIR, 'estado_inicial_' + entity._id + '.jpg'), req.body.estado_inicial.foto, 'base64').then(function(err) {
          if (err) { console.error(err); }
          return entity;
        });
      }
      return entity;
    })
    //graba foto etapa trabajos realizados
    .then(function(entity) {
      if (req.body.trabajos_realizados && req.body.trabajos_realizados.foto) {
        return fs.writeFileAsync(path.join(process.env.CLOUD_DIR, 'trabajos_realizados_' + entity._id + '.jpg'), req.body.trabajos_realizados.foto, 'base64').then(function(err) {
          if (err) { console.error(err); }
          return entity;
        });
      }
      return entity;
    })
    //pobla datos referenciales
    .then(function(entity) {
      return Actividad.findOne(entity)
        .deepPopulate('creador ubicacion equipo.tipo.trabajos trabajos_realizados.trabajos')
        .exec();
    })
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};

// Updates an existing Actividad in the DB
exports.update = function(req, res) {
  //setea fecha modificacion
  req.body.fecha_modificacion = new Date();
  if (req.body._id) {
    delete req.body._id;
  }
  Actividad.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    //graba foto etapa estado inicial
    .then(function(entity) {
      if (req.body.estado_inicial && req.body.estado_inicial.foto) {        
        return fs.writeFileAsync(path.join(process.env.CLOUD_DIR, 'estado_inicial_' + entity._id + '.jpg'), req.body.estado_inicial.foto, 'base64').then(function(err) {
          if (err) { console.error(err); }
          return entity;
        });
      }
      return entity;
    })
    //graba foto etapa trabajos realizados
    .then(function(entity) {
      if (req.body.trabajos_realizados && req.body.trabajos_realizados.foto) {
        return fs.writeFileAsync(path.join(process.env.CLOUD_DIR, 'trabajos_realizados_' + entity._id + '.jpg'), req.body.trabajos_realizados.foto, 'base64').then(function(err) {
          if (err) { console.error(err); }
          return entity;
        });
      }
      return entity;
    })
    //pobla datos referenciales
    .then(function(entity) {
      return Actividad.findById(req.params.id)
        .deepPopulate('creador ubicacion equipo.tipo.trabajos trabajos_realizados.trabajos')
        .exec();
    })
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a Actividad from the DB
exports.destroy = function(req, res) {
  Actividad.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
};

//metodo para obtener valores del enumerado motivo visita
exports.motivo_enum = function(req, res) {
  return res.status(200).json(Actividad.schema.path('motivo_visita').enumValues);
};

//metodo para obtener imagen estado inicial desde app storage
exports.imagenEstadoInicial = function(req, res) {
  res.sendFile(path.join(process.env.CLOUD_DIR, 'estado_inicial_' + req.params.id + '.jpg'));
};

//metodo para obtener imagen trabajos realizados desde app storage
exports.imagenTrabajosRealizados = function(req, res) {
  res.sendFile(path.join(process.env.CLOUD_DIR, 'trabajos_realizados_' + req.params.id + '.jpg'));
};
