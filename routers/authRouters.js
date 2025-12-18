const express = require('express');
const authController = require('../controllers/authControllers')
const code = require('../controllers/verificationCode')
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/signout', authController.signout)
router.patch('/sendveficationCode', code.sendveficationCode)

module.exports = router;
