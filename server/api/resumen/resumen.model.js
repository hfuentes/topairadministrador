'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var Schema = mongoose.Schema;

var ResumenSchema = new Schema({
  //correos para envio de resumen
  correos: [{
    type: String,
    lowercase: true
  }],
  cco: [{
    type: String,
    lowercase: true
  }],
  asunto: String,
  cuerpo: String,
  observacion: String,
  link: String,

  //informacion de envios - nodemailer
  correo_info: [],

  //indica fecha en que ha sido enviado el correo resumen
  fecha_envio: Date,
  fecha_ultimo_reenvio: Date,
  cantidad_envios: Number,

  //referencia a las actividades asociadas al resumen
  actividades: [{ type: Schema.Types.ObjectId, ref: 'Actividad' }],

  //referencia a proyecto asociado al resumen
  proyecto: { type: Schema.Types.ObjectId, ref: 'Proyecto' },

  //referencia a usuario que crea resumen
  creador: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: {
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_modificacion'
  }
});

ResumenSchema.plugin(deepPopulate);
module.exports = mongoose.model('Resumen', ResumenSchema);
