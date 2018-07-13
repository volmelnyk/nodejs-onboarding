const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const User = require('../models/user');
const config = require('../config/auth');
const mongoose = require('mongoose');

// make general method for duplicates!

passport.use('googleToken', new GooglePlusTokenStrategy({
    clientID: config.oauth.google.clientID,
    clientSecret: config.oauth.google.clientSecret
  },  (accessToken, refreshToken, profile, done) => {
    try {
       User.findOne({ "google.id": profile.id })     
       .then((existingUser) => {
        if (existingUser) {
          return done(null, existingUser);
        }}
      );
  

      const newUser = new User({

        _id: new mongoose.Types.ObjectId, // remove 

        email: profile.emails[0].value,  // remove
        
        first_name: profile._json.first_name, // as well
    
        secong_name: profile._json.last_name,

        google: {
          id: profile.id,
        }
      });
  
      newUser.save();

      done(null, newUser);

      done(null, newUser); // why twice ?
    } catch(error) {
      done(error, false, error.message);
    }
  }));

passport.use('facebookToken', new FacebookTokenStrategy({
    clientID: config.oauth.facebook.clientID,
    clientSecret: config.oauth.facebook.clientSecret
  }, (accessToken, refreshToken, profile, done) => {
    try {

      User.findOne({ "facebook.id": profile.id })
      .then((existingUser) => {
      if (existingUser) {
        return done(null, existingUser);
      }}
    );

      const newUser = new User({

        _id: new mongoose.Types.ObjectId, 

        email: profile.emails[0].value,
        
        first_name: profile._json.first_name,
    
        secong_name: profile._json.last_name,

        facebook: {
          id: profile.id,
        }
      });
  
      newUser.save();

      done(null, newUser);
    } catch(error) {
      done(error, false, error.message);
    }
  }));