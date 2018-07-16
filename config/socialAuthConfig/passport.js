const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const User = require('./../../app/models/user');
const config = require('./../auth');
const errorMessage = require('./../../app/models/message');


var saveSocialUser = function  (profile, done, nameSosiacl){
    try {
       User.findOne({ "facebook.id": profile.id })
            .then( (existingUser) => 
        {
            if (existingUser) {
                console.log(existingUser);
                done(null, existingUser);
            } 
            else{
                const newUser = new User(profile._json);
  
                switch (nameSosiacl) {
                    case 'google.id':
                        newUser.google.id = profile.id;
                        break;
                    case 'facebook.id':
                        newUser.facebook.id = profile.id;
                        break;
                }
                newUser.save();
        
                done(null, newUser);
            }
        })
    } catch(error) {
        done(error, false, errorMessage.auth.errrInSocialAuth);
    }
}

passport.use('googleToken', new GooglePlusTokenStrategy({
    clientID: config.oauth.google.clientID,
    clientSecret: config.oauth.google.clientSecret
}, (profile, done) => {
        saveSocialUser(profile, done, 'google.id')
    }
));

passport.use('facebookToken', new FacebookTokenStrategy({
    clientID: config.oauth.facebook.clientID,
    clientSecret: config.oauth.facebook.clientSecret
}, (accessToken, refreshToken, profile, done) => {
        saveSocialUser(profile, done, 'facebook.id');
    }
));