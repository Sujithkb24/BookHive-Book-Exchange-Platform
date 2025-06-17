const express = require('express');
const router = express.Router();    
const authMiddleware = require('../middleware/auth-middleware');
const {orderBook, getOrdersToMe, updateDelivered, updateRecieved, orderCancelByBuyer, orderCancelBySeller, myOrders} = require('../controller/order-controller');

router.route('/orderbook').post(authMiddleware, orderBook);
router.route('/getorderstome').get(authMiddleware, getOrdersToMe);
router.route('/myorders').get(authMiddleware, myOrders);

router.route('/updaterecieved').post(authMiddleware, updateRecieved);
router.route('/updatedelivered').post(authMiddleware, updateDelivered);

router.route('/ordercancelbyseller').post(authMiddleware, orderCancelBySeller);
router.route('/ordercancelbybuyer').post(authMiddleware, orderCancelByBuyer);

module.exports = router;