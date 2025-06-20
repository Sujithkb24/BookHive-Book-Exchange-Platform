const express = require('express');
const router = express.Router();    
const {register, login,  additionalInfo, reportUser, addToCart, getallCartItems,getUserDetails, updateUserDetails } = require('../controller/auth-controller');
const authMiddleware = require('../middleware/auth-middleware');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/additional-info').post(authMiddleware, additionalInfo);
router.route("/reportuser").post(authMiddleware, reportUser)
router.route('/addtocart').post(authMiddleware, addToCart);
router.route('/getallcartitems').get(authMiddleware, getallCartItems);
router.route('/profile').get(authMiddleware, getUserDetails);
router.route('/updateprofile').post(authMiddleware, updateUserDetails);
module.exports = router;