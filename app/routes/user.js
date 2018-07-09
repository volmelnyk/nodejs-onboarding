const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');
const userController = require('../controllers/userController');

router.get('/users', userController.getAllUsers);


router.post('/users',userController.addUser);


router.get('/users/:id', userController.getUserById);

router.put('/users/:id', function (req, res) {

    const id = req.params.id;
    res.status(200);
    res.send({message: 'id'});

});

router.delete('/users/:id', userController.deletById);


module.exports = router;