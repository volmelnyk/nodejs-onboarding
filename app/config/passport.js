const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const User = require('../models/user');
const config = require('../config/auth');

passport.use('googleToken', new GooglePlusTokenStrategy({
    clientID: config.oauth.google.clientID,
    clientSecret: config.oauth.google.clientSecret
  },  (accessToken, refreshToken, profile, done) => {
    try {
      console.log('profile', profile);
      console.log('accessToken', accessToken);
      console.log('refreshToken', refreshToken);
  
       User.findOne({ "google.id": profile.id })     
       .then((existingUser) => {
        if (existingUser) {
          return done(null, existingUser);
        }}
      );
  
      const newUser = new User({
        method: 'google',
        google: {
          id: profile.id,
          email: profile.emails[0].value
        }
      });
  
      newUser.save();
      done(null, newUser);
    } catch(error) {
      done(error, false, error.message);
    }
  }));

passport.use('facebookToken', new FacebookTokenStrategy({
    clientID: config.oauth.facebook.clientID,
    clientSecret: config.oauth.facebook.clientSecret
  }, (accessToken, refreshToken, profile, done) => {
    try {
      console.log('profile', profile);
      console.log('accessToken', accessToken);
      console.log('refreshToken', refreshToken);
      

      User.findOne({ "facebook.id": profile.id })
      .then((existingUser) => {
      if (existingUser) {
        return done(null, existingUser);
      }}
    );
      const newUser = new User({
        method: 'facebook',
        facebook: {
          id: profile.id,
          email: profile.emails[0].value,
        },
        
        first_name: profile.first_name,
    
        secong_name: profile.last_name
      });
  
     newUser.save();

      //done(null, newUser);
    } catch(error) {
      done(error, false, error.message);
    }
  }));