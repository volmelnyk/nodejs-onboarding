const express = require('express');
const router = express.Router();
const userController = require('../app/controllers/userController');
const authController = require('../app/controllers/authController');

const passport = require('passport');
const passportConf  = require('../app/config/passport')

router.get('/users', userController.getAllUsers);

router.post('/users', userController.addUser);

router.get('/users/:id', userController.getUserById);

router.delete('/users/:id', userController.deletById);

router.patch('/users/:id', userController.updateById);

router.post('/forgotPassword', userController.forgotPassword);

router.post('/changePassword', userController.changePassword);

router.post('/login', authController.login);

router.post('/oauth/facebook', passport.authenticate('facebookToken', { session: false }) ,authController.facebookOAuth);



module.exports = router;