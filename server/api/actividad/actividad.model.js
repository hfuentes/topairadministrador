'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var Schema = mongoose.Schema;

var ActividadSchema = new Schema({
  motivo_visita: {
    type: String,
    enum: ['Trabajo programado', 'Emergencia'],
    default: 'Trabajo programado'
  },

  //parametros de equipo durante actividad
  parametros: {
    compresor_n1_r: { type: Number, default: 0 },
    compresor_n1_s: { type: Number, default: 0 },
    compresor_n1_t: { type: Number, default: 0 },
    compresor_n2_r: { type: Number, default: 0 },
    compresor_n2_s: { type: Number, default: 0 },
    compresor_n2_t: { type: Number, default: 0 },
    p_succion: { type: Number, default: 0 },
    p_descarga: { type: Number, default: 0 },
    t_inyeccion: { type: Number, default: 0 },
    t_retorno: { type: Number, default: 0 },
    t_ambiente: { type: Number, default: 0 },
    t_exterior: { type: Number, default: 0 },
    fecha_ingreso: { type: Date, default: Date.now }
  },

  //observacion estado inicial
  estado_inicial: {
    texto: { type: String, default: '' },
    fecha_ingreso: { type: Date, default: Date.now }
  },

  //observacion trabajos realizados
  trabajos_realizados: {
    texto: { type: String, default: '' },
    fecha_ingreso: { type: Date, default: Date.now },
    trabajos: [{ type: Schema.Types.ObjectId, ref: 'TipoTrabajo' }]
  },

  //recomendaciones realizadas por tecnico
  recomendaciones: {
    texto: { type: String, default: '' },
    fecha_ingreso: { type: Date, default: Date.now }
  },

  //observaciones gerencia
  observacion: {
    texto: { type: String, default: '' },
    creador: { type: Schema.Types.ObjectId, ref: 'User' },
    //indica fecha ingreso //seteado por cada midificacion
    fecha_ingreso: { type: Date, default: Date.now }
  },

  //nombre de contacto cliente que solicita trabajo
  solicitante: { type: String, default: '' },

  //indicador de completitud de actividad
  indicador: {
    es_verde: { type: Boolean, default: true },
    es_amarillo: { type: Boolean, default: false },
    es_rojo: { type: Boolean, default: false }
  },

  es_activo: { type: Boolean, default: true },
  es_pendiente: { type: Boolean, default: true },
  fecha_ingreso: { type: Date, default: Date.now },

  //referencia a equipo asociado a la actividad
  equipo: { type: Schema.Types.ObjectId, ref: 'Equipo' },

  //referencia a ubicacion donde se realiza actividad
  ubicacion: { type: Schema.Types.ObjectId, ref: 'Ubicacion' },

  //referencia a proyecto al que pertene la actividad
  proyecto: { type: Schema.Types.ObjectId, ref: 'Proyecto' },

  //referencia a usuario encargado de la actividad
  creador: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: {
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_modificacion'
  }
});

ActividadSchema.plugin(deepPopulate);
module.exports = mongoose.model('Actividad', ActividadSchema);
