/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/resumen              ->  index
 * POST    /api/resumen              ->  create
 * GET     /api/resumen/:id          ->  show
 * PUT     /api/resumen/:id          ->  update
 * DELETE  /api/resumen/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Resumen = require('./resumen.model');
var Parametro = require('../parametro/parametro.model');
var nodemailer = require('nodemailer');

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    console.dir(err);
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
    return updated.saveAsync().spread(function(updated) {
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

// Gets a list of Resumens
exports.index = function(req, res) {
  Resumen.findAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Gets a single Resumen from the DB
exports.show = function(req, res) {
  Resumen.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Creates a new Resumen in the DB
exports.create = function(req, res) {
  //agrega referencia a usuario creador
  req.body.creador = req.user._id;
  var parametros = {};
  //crea resumen (obtener _id)
  Resumen.createAsync(req.body)
    //busca parametros desde base de datos
    .then(function(entity) {
      return Parametro.findOneAsync({}).then(function(data){
        parametros = data;
        return entity;
      });
    })
    //correo cliente
    .then(function(entity) {
      // topair: smtps://servicios@topair.cl:Ser123++@just27.justhost.com
      // frazoger: smtps://servicio-pcm@frazoger.cl:0u)r5f}p;!m+@premium10543.hosting.cl
      var transporter = require('bluebird').promisifyAll(nodemailer.createTransport(parametros.correo.smtps));
      return transporter.sendMailAsync({
        from: parametros.correo.from,
        to: entity.correos.join(','),
        bcc: entity.cco.join(','),
        subject: entity.asunto,
        text: entity.cuerpo,
        html: '<h2>' + entity.asunto + '</h2>' +
          '<p>' + entity.cuerpo.replace(/(?:\r\n|\r|\n)/g, '<br />') + '</p>' +
          '<p><a href=\"' + req.get('host').toString() + '/resumen/' + entity._id.toString() + '\">' + parametros.correo.link_text + '</a></p><br>' +
          '<img style="max-height: 200px;" src=\"' + req.get('host').toString() + '/api/parametro/footer_correo\">'
      }).then(function(info) {
        req.body.info = info;
        return entity;
      }).catch(function(err) {
        console.error(err);
        req.body.info = undefined;
        return entity;
      });
    })
    .then(function(entity) {
      if (req.body.info) {
        if (!entity.correo_info) { entity.correo_info = []; }
        var ahora = Date.now();
        req.body.info.fecha_envio = ahora;
        entity.fecha_envio = ahora;
        entity.correo_info.unshift(req.body.info);
        return entity.saveAsync().spread(function(updated) {
          return updated;
        });
      } else {
        return entity;
      }
    })
    .then(function(entity) {
      return Resumen.findById(entity._id)
        .populate('creador')
        .exec();
    })
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};

// Updates an existing Resumen in the DB
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Resumen.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a Resumen from the DB
exports.destroy = function(req, res) {
  Resumen.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
};

//busca resumenes de envio segun id proyecto
exports.byProyecto = function(req, res) {
  Resumen.find({ proyecto: req.params.id })
    .populate('creador')
    .exec()
    .then(responseWithResult(res))
    .catch(handleError(res));
};

//busca datos de resumen para vista cliente
exports.vistaCliente = function(req, res) {
  Resumen.findById(req.params.id)
    .populate('creador')
    .deepPopulate('actividades.equipo.tipo actividades.ubicacion actividades.creador proyecto.cliente')
    .exec()
    .then(responseWithResult(res))
    .catch(handleError(res));
};

//metodo get sin autorizacion usuario para hacer pruebas
exports.prueba = function(req, res) {
  console.log('----------------------------------------');
  console.log('prueba ... INICIO');
  console.log('----------------------------------------');
  console.dir(req.body);
  console.log('----------------------------------------');
  res.status(200).json({mensaje: 'OK'});
}
