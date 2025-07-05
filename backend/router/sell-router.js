const express = require('express');
const router = express.Router();    
const authMiddleware = require('../middleware/auth-middleware');
const { upload } = require('../config/cloudinary');
const { 
    getBookDetails, 
    getDescription, 
    addSell, 
    getAllSells, 
    deleteSell, 
    getSellById,
    uploadImages ,
    getMySells
} = require('../controller/sell-controller');

router.route("/getbookdetails").post(authMiddleware, getBookDetails);
router.route("/getdescription").post(authMiddleware, getDescription);
router.route("/addsell").post(authMiddleware, addSell);
router.route("/getallsells").get(authMiddleware, getAllSells);
router.route("/deletesell").post(authMiddleware, deleteSell);
router.route("/getsellbyid/:sellId").get(authMiddleware, getSellById);
router.route("/getmysells").get(authMiddleware, getMySells);

// New route for image upload (if you want to handle server-side upload)
router.route("/uploadimages").post(authMiddleware, upload.array('images', 3), uploadImages);

module.exports = router;