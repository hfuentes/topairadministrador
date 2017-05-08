'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

var TipoTrabajoSchema = new Schema({
  nombre: {
    type: String,
    default: 'Otro'
  }
}, {
  timestamps: {
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_modificacion'
  }
});

module.exports = mongoose.model('TipoTrabajo', TipoTrabajoSchema);
