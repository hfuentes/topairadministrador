'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;
var crypto = require('crypto');
var authTypes = ['github', 'twitter', 'facebook', 'google'];

var UserSchema = new Schema({
  name: String,
  /*este campo esta siendo utilizado como nombre de usuario*/
  email: {
    type: String,
    lowercase: true
  },
  role: {
    type: String,
    default: 'user'
  },
  correo: {
    type: String,
    lowercase: true
  },
  es_activo: {
    type: Boolean,
    default: true
  },
  password: String,
  provider: String,
  salt: String,
  google: {},
  github: {},

  //referencia a proyectos asociados al usuario
  proyectos: [{ type: Schema.Types.ObjectId, ref: 'Proyecto' }],

  //referencia a actividades creadas por el usuario
  actividades: [{ type: Schema.Types.ObjectId, ref: 'Actividad' }]
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  },
  timestamps: {
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_modificacion'
  }
});

/**
 * Virtuals
 */

// Public profile information
UserSchema.virtual('profile').get(function() {
  return {
    'name': this.name,
    'role': this.role
  };
});

// Non-sensitive info we'll be putting in the token
UserSchema.virtual('token').get(function() {
  return {
    '_id': this._id,
    'role': this.role
  };
});

//glosa rol usuario para mostrar en vistas
UserSchema.virtual('glosa_rol').get(function() {
  var glosa_rol = '';
  if (this.role === 'admin') glosa_rol = 'Administrador';
  if (this.role === 'user') glosa_rol = 'Operador';
  return glosa_rol;
});

//glosa rol usuario para mostrar en vistas
UserSchema.virtual('es_admin').get(function() {
  return this.role === 'admin';
});

/**
 * Validations
 */

// Validate empty email
UserSchema.path('email').validate(function(email) {
  if (authTypes.indexOf(this.provider) !== -1) {
    return true;
  }
  return email.length;
}, 'Nombre de usuario no puede ser vacio');

// Validate empty password
UserSchema.path('password').validate(function(password) {
  if (authTypes.indexOf(this.provider) !== -1) {
    return true;
  }
  return password.length;
}, 'Contraseña no puede ser vacia');

// Validate email is not taken
UserSchema.path('email').validate(function(value, respond) {
  var self = this;
  return this.constructor.findOneAsync({ email: value })
    .then(function(user) {
      if (user) {
        if (self.id === user.id) {
          return respond(true);
        }
        return respond(false);
      }
      return respond(true);
    })
    .catch(function(err) {
      throw err;
    });
}, 'El nombre de usuario ya está ocupado');

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema.pre('save', function(next) {
  // Handle new/update passwords
  if (this.isModified('password')) {
    if (!validatePresenceOf(this.password) && authTypes.indexOf(this.provider) === -1) {
      next(new Error('Contraseña incorrecta'));
    }

    // Make salt with a callback
    var _this = this;
    this.makeSalt(function(saltErr, salt) {
      if (saltErr) {
        next(saltErr);
      }
      _this.salt = salt;
      _this.encryptPassword(_this.password, function(encryptErr, hashedPassword) {
        if (encryptErr) {
          next(encryptErr);
        }
        _this.password = hashedPassword;
        next();
      });
    });
  } else {
    next();
  }
});

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} password
   * @param {Function} callback
   * @return {Boolean}
   * @api public
   */
  authenticate: function(password, callback) {
    if (!callback) {
      return this.password === this.encryptPassword(password);
    }

    var _this = this;
    this.encryptPassword(password, function(err, pwdGen) {
      if (err) {
        callback(err);
      }

      if (_this.password === pwdGen) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    });
  },

  /**
   * Make salt
   *
   * @param {Number} byteSize Optional salt byte size, default to 16
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  makeSalt: function(byteSize, callback) {
    var defaultByteSize = 16;

    if (typeof arguments[0] === 'function') {
      callback = arguments[0];
      byteSize = defaultByteSize;
    } else if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }

    if (!byteSize) {
      byteSize = defaultByteSize;
    }

    if (!callback) {
      return crypto.randomBytes(byteSize).toString('base64');
    }

    return crypto.randomBytes(byteSize, function(err, salt) {
      if (err) {
        callback(err);
      }
      return callback(null, salt.toString('base64'));
    });
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  encryptPassword: function(password, callback) {
    if (!password || !this.salt) {
      return null;
    }

    var defaultIterations = 10000;
    var defaultKeyLength = 64;
    var salt = new Buffer(this.salt, 'base64');

    if (!callback) {
      return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength).toString('base64');
    }

    return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength, function(err, key) {
      if (err) {
        callback(err);
      }
      return callback(null, key.toString('base64'));
    });
  }
};

module.exports = mongoose.model('User', UserSchema);
