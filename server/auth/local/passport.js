var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

function localAuthenticate(User, email, password, done) {
  User.findOneAsync({
    email: email.toLowerCase()
  }).then(function(user) {
      if (!user) {
        return done(null, false, {
          message: 'El nombre de usuario no esta registrado.'
        });
      }
      if (!user.es_activo) {
        return done(null, false, {
          message: 'Cuenta desactivada. Contáctese con un administrador para activar la cuenta.'
        });
      }
      user.authenticate(password, function(authError, authenticated) {
        if (authError) {
          return done(authError);
        }
        if (!authenticated) {
          return done(null, false, {
            message: 'El password ingresado no es correcto.'
          });
        } else {
          return done(null, user);
        }
      });
    }).catch(function(err) {
      return done(err);
    });
}

exports.setup = function(User, config) {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password' // this is the virtual field on the model
  }, function(email, password, done) {
    return localAuthenticate(User, email, password, done);
  }));
};
