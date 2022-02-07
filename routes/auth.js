require('dotenv').config();
const express = require('express');
const loginRouter = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const debug = require('debug')('passport-learning:login');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Schema = mongoose.Schema;

const User = mongoose.model(
  'User',
  new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    sub: { type: String, required: true },
  })
);

// [ GOOGLE AUTH SETUP ]
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/login/success',
    },
    function (accessToken, refreshToken, profile, cb) {
      const { sub, email, name } = profile._json;

      const query = { email };
      const update = { sub, email, name };
      const options = { upsert: true, new: true };
      // Find the document
      User.findOneAndUpdate(query, update, options, function (error, result) {
        if (error) {
          cb(error);
        } else {
          cb(null, result);
        }
      });
    }
  )
);

// [ SERIALIZE USERS ]
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

loginRouter.get(
  '/',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

loginRouter.get(
  '/success',
  passport.authenticate('google', {
    failureRedirect: '/login',
    successRedirect: '/login/access',
    failureMessage: true,
  })
);

loginRouter.get('/access', function (req, res) {
  if (req.isAuthenticated()) {
    res.end('the end');
  } else {
    res.end('not the end');
  }
});

module.exports = loginRouter;
