const express = require('express');
const router = express.Router();    
const authMiddleware = require('../middleware/auth-middleware');
const { getBookDetails, getDescription, addSell, getAllSells, deleteSell, getSellById } = require('../controller/sell-controller');

router.route("/getbookdetails").post(authMiddleware, getBookDetails)
router.route("/getdescription").post(authMiddleware, getDescription);
router.route("/addsell").post(authMiddleware, addSell);
router.route("/getallsells").get(authMiddleware, getAllSells)
router.route("/deletesell").post(authMiddleware, deleteSell);
router.route("/getsellbyid/:sellId").get(authMiddleware, getSellById);

module.exports = router;