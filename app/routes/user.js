const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController');

router.get('/users', userController.getAllUsers);


router.post('/users', userController.addUser);


router.get('/users/:id', userController.getUserById);

router.delete('/users/:id', userController.deletById);

router.patch('/users/:id', userController.updateById);

router.post('/forgotPassword', userController.forgotPassword);
router.post('/changePassword', userController.changePassword);

module.exports = router;