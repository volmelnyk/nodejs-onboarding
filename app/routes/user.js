const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.get('/users', userController.getAllUsers);


router.post('/users', userController.addUser);


router.get('/users/:id', userController.getUserById);

router.delete('/users/:id', userController.deletById);

router.patch('/users/:id', userController.updateById);

router.post('/login', authController.login);
module.exports = router;