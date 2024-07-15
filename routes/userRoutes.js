const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.registerAlumni);
router.post('/admin', userController.registerAdmin);
router.post('/login', userController.login);
router.post('/forgotPassword', userController.forgotPassword);
router.post('/resetPassword/', userController.resetPassword);

module.exports = router;
