const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');
const userController = require('../controllers/userController');

router.get('/users', userController.getAllUsers);


router.post('/users', userController.addUser);


router.get('/users/:id', userController.getUserById);

router.delete('/users/:id', userController.deletById);

router.patch('/users/:id',userController.updateById);

module.exports = router;