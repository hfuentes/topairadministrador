'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

var ParametroSchema = new Schema({
  //datos default resumen
  resumen: {
    cco: [String],
    asunto: String,
    cuerpo: String
  },
  correo: {
  	smtps: { type: String, default: 'smtps://servicios@topair.cl:Ser123++@just27.justhost.com' },
  	from: { type: String, default: '"Topair Chile" <servicios@topair.cl>' },
  	link_text: { type: String, default: 'Ir a resumen de mantenimiento.' }
  }
});

module.exports = mongoose.model('Parametro', ParametroSchema);
