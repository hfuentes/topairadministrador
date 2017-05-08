'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

var ClienteSchema = new Schema({
  nombre: String,
  correos: [{ type: String, lowercase: true }],
  es_activo: { type: Boolean, default: true },
  contacto: String,
  telefono: String,
  direccion: String
}, {
  timestamps: {
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_modificacion'
  }
});

module.exports = mongoose.model('Cliente', ClienteSchema);
