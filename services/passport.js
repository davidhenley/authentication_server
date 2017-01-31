const passport = require('passport'),
      LocalStrategy = require('passport-local'),
      bcrypt = require('bcrypt-nodejs'),
      User = require('../models/user'),
      config = require('../config'),
      JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt;

const localOptions = { usernameField: 'email' };

const locallogin = new LocalStrategy(localOptions, function(email, password, done) {
  // Verify email and password correct
  User.findOne({ email: email }, function(err, user) {
    if (err) return done(err);
    if (!user) return done(null, false);

    // compare passwords -- is password = user.password
    bcrypt.compare(password, user.password, function(err, isMatch) {
      if (err) return done(err);
      if (!isMatch) return done(null, false);
      return done(null, user);
    });
  });
});

// Setup Options -- where to look for token
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// Create JWT Strategy -- payload is decoded jwt token
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // See if userID exists
  // If yes, call done with user
  // Otherwise, call done without user
  User.findById(payload.sub, function(err, user) {
    if (err) return done(err, false);
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(locallogin);
