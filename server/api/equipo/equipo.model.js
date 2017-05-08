'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var Schema = mongoose.Schema;

var EquipoSchema = new Schema({
    nombre: String,
    es_activo: {
        type: Boolean,
        default: true
    },
    serie: String,
    marca: String,
    capacidad: {
        type: String,
        default: ''
    },
    modelo: String,
    antiguedad: String,
    tipo: {
        type: Schema.Types.ObjectId,
        ref: 'TipoEquipo'
    },
    year: {
        type: Number,
        min: 1970,
        max: 2099
    },
    descripcion: {
        type: String,
        default: ''
    }
}, {
    timestamps: {
        createdAt: 'fecha_creacion',
        updatedAt: 'fecha_modificacion'
    }
});

EquipoSchema.plugin(deepPopulate);
module.exports = mongoose.model('Equipo', EquipoSchema);
