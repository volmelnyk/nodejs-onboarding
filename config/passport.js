const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const User = require('../app/models/user');
const config = require('../config/auth');


// make general method for duplicates!

passport.use('googleToken', new GooglePlusTokenStrategy({
    clientID: config.oauth.google.clientID,
    clientSecret: config.oauth.google.clientSecret
},  (accessToken, refreshToken, profile, done) => {
    try {
        User.findOne({ 'google.id': profile.id })     
            .then((existingUser) => {
                if (existingUser) {
                    return done(null, existingUser);
                }});
  

        const newUser = new User(profile._json);
  
        newUser.facebook.id = profile.id;

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

        User.findOne({'facebook.id': profile.id })
            .then((existingUser) => {
                if (existingUser) {
                    return done(null, existingUser);
                }});

        const newUser = new User(profile._json);
  
        newUser.facebook.id = profile.id;

        newUser.save();
        done(null, newUser);
    } 
    catch(error) {
        done(error, false, error.message);
    }
}));