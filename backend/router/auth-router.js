const express = require('express');
const router = express.Router();    
const {register, login,  additionalInfo} = require('../controller/auth-controller');
const authMiddleware = require('../middleware/auth-middleware');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/additional-info').post(authMiddleware, additionalInfo);

module.exports = router;