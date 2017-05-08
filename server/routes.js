/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');
var cors = require('cors');

module.exports = function(app) {

    //origenes desconocidos
    app.use(cors());
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    });

    // Insert routes below
    app.use('/api/tipotrabajo', require('./api/tipotrabajo'));
    app.use('/api/tipoequipo', require('./api/tipoequipo'));
    app.use('/api/parametro', require('./api/parametro'));
    app.use('/api/resumen', require('./api/resumen'));
    app.use('/api/equipo', require('./api/equipo'));
    app.use('/api/cliente', require('./api/cliente'));
    app.use('/api/ubicacion', require('./api/ubicacion'));
    app.use('/api/actividad', require('./api/actividad'));
    app.use('/api/proyecto', require('./api/proyecto'));
    app.use('/api/users', require('./api/user'));

    app.use('/auth', require('./auth'));

    // All undefined asset or api routes should return a 404
    app.route('/:url(api|auth|components|app|bower_components|assets)/*').get(errors[404]);

    // All other routes should redirect to the index.html
    app.route('/*').get(function(req, res) {
        res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
