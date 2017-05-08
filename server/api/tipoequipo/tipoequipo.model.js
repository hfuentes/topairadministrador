'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

var TipoEquipoSchema = new Schema({
  nombre: { type: String, default: 'Otro' },
  es_activo: { type: Boolean, default: true },
  trabajos: [{ type: Schema.Types.ObjectId, ref: 'TipoTrabajo' }]
}, {
  timestamps: {
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_modificacion'
  }
});

module.exports = mongoose.model('TipoEquipo', TipoEquipoSchema);