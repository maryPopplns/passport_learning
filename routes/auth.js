require('dotenv').config();
const express = require('express');
const loginRouter = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const debug = require('debug')('passport-learning:login');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// const User = mongoose.model(
//   'User',
//   new Schema({
//     username: { type: String, required: true },
//     password: { type: String, required: true },
//   })
// );

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/login/success',
    },
    function (accessToken, refreshToken, profile, cb) {
      const { sub, email } = profile._json;
      console.log(profile._json);

      return;
      // TODO see if we have an existing user within our DB
      // TODO

      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //   return cb(err, user);
      // });
    }
  )
);
/* GET users listing. */
loginRouter.get(
  '/',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

loginRouter.get(
  '/success',
  passport.authenticate('google', {
    failureRedirect: '/login',
    failureMessage: true,
  }),
  function (req, res) {
    res.redirect('/');
  }
);

module.exports = loginRouter;
