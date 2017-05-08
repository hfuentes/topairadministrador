'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var Schema = mongoose.Schema;

var ProyectoSchema = new Schema({
  nombre: String,
  es_activo: { type: Boolean, default: true },
  numero: String,
  tipo: String,
  especialidad: String,
  periodo: String,
  frecuencia: String,
  fecha_inicio: { type: Date, default: Date.now },
  fecha_fin: { type: Date, default: Date.now },

  //clinte asociado al proyecto
  cliente: { type: Schema.Types.ObjectId, ref: 'Cliente' },

  //ubicaciones del proyecto
  ubicaciones: [{ type: Schema.Types.ObjectId, ref: 'Ubicacion' }],

  //usuarios asociados al proyecto
  usuarios: [{ type: Schema.Types.ObjectId, ref: 'User' }],

  //equipos asociados al proyecto
  equipos: [{ type: Schema.Types.ObjectId, ref: 'Equipo' }]
}, {
  timestamps: {
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_modificacion'
  }
});

ProyectoSchema.plugin(deepPopulate);
module.exports = mongoose.model('Proyecto', ProyectoSchema);
