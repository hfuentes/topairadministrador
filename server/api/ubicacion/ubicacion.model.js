'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

var UbicacionSchema = new Schema({
  nombre: String,
  es_activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: {
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_modificacion'
  }
});

module.exports = mongoose.model('Ubicacion', UbicacionSchema);
