const BookOrder = require("../models/book-order-model");
const Cart = require("../models/cart-model");
const User = require("../models/user-model");
const bookModel = require("../models/book-sell-model");

const orderBook = async (req, res) => {
    const buyer = req.id; // Assuming the user is authenticated and their ID is stored in req.user
    const { seller, bookId, tokensUsed } = req.body;

    try {

        const user = await User.findById(buyer);

        if(user.token < tokensUsed)
            return res.status(201).json({ message: "Insufficient tokens", success: false });
       
        const newOrder = new BookOrder({
            buyer: buyer,
            seller: seller,
            bookId: bookId,
            tokensUsed,
            orderDate: new Date()
        });

        await newOrder.save();

        user.token -= tokensUsed;
        await user.save();

        const cart = await Cart.findOne({ userId: buyer });
        if (cart) {
            cart.items = cart.items.filter(item => item.toString() !== bookId.toString());
            await cart.save();
        }

        res.status(201).json({ message: "Order placed successfully", order: newOrder });
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getOrdersToMe = async (req, res) => { 
    const userId = req.id; // Assuming the user ID is stored in req.user after authentication

    try {
        const orders = await BookOrder.find({ seller: userId })
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found" });
        }

        const allOrders = await Promise.all(
            orders.map(async (element) => {
                const buyerId = element.buyer;
                const buyerInformation = await User.findById(buyerId);
                const bookInformation = await bookModel.findById(element.bookId);
                return {
                    isDelivered : element.bookDevivered,
                    orderId: element._id,
                    buyerId: buyerId,
                    buyerName: buyerInformation.username,
                    buyerEmail: buyerInformation.email,
                    buyerPhone: buyerInformation.phone,
                    bookName: bookInformation.bookName,
                    bookAuthor: bookInformation.authorName,
                    bookPublisher: bookInformation.publisher,
                    bookCondition: bookInformation.condition,
                    bookPageCount: bookInformation.pageCount,
                    isbn: bookInformation.isbn,
                    orderDate: element.orderDate,
                    tokensUsed: element.tokensUsed,
                };
            })
        );
        
        return res.status(200).json({ orders: allOrders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const myOrders = async (req, res) => {
    const userId = req.id; // Assuming the user ID is stored in req.user after authentication
    try {
        const orders = await BookOrder.find({ buyer: userId })
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found" });
        }

        const allOrders = await Promise.all(
            orders.map(async (element) => {
                const sellerId = element.seller;
                const sellerInformation = await User.findById(sellerId);
                const bookInformation = await bookModel.findById(element.bookId);
                return {
                    isRecieved : element.bookRecieved,
                    orderId: element._id,
                    sellerId: sellerId,
                    sellerName: sellerInformation.username,
                    sellerEmail: sellerInformation.email,
                    sellerPhone: sellerInformation.phone,
                    bookName: bookInformation.bookName,
                    bookAuthor: bookInformation.authorName,
                    bookPublisher: bookInformation.publisher,
                    bookCondition: bookInformation.condition,
                    bookPageCount: bookInformation.pageCount,
                    isbn: bookInformation.isbn,
                    orderDate: element.orderDate,
                    tokensUsed: element.tokensUsed,
                };
            })
        );
        
        return res.status(200).json({ orders: allOrders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const updateRecieved = async (req, res) => {
 
    const orderId = req.body.orderId;
    
    try {
        console.log("HOOOOOOOOOOOOOO")
        const order = await BookOrder.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }   
        
        if (!order.bookDevivered) {
            return res.status(200).json({ message: "Order cannot be marked as received before delivery", success: false });
        }

        order.bookRecieved = true;
        await order.save();

        const seller = await User.findById(order.seller);
        if (!seller) {
            return res.status(404).json({ message: "Seller not found" });
        }
        seller.token += order.tokensUsed; // Refund tokens to the seller
        await seller.save();

        res.status(200).json({ message: "Order marked as received", order });   
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const updateDelivered = async (req, res) => {
 
    const orderId = req.body.orderId;
    
    try {
        const order = await BookOrder.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }   
        order.bookDevivered = true;
        await order.save(); 
        res.status(200).json({ message: "Order marked as delivered", order });
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const orderCancelBySeller = async (req, res) => {
    const orderId = req.body.orderId;
    
    try {
        const order = await BookOrder.findById(orderId);
        console.log(order);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (order.bookRecieved || order.bookDevivered) {
            return res.status(400).json({ message: "Order cannot be cancelled after delivery or receipt" });
        }
        const buyer = await User.findById(order.buyer);
        if (!buyer) {
            return res.status(404).json({ message: "Buyer not found" });
        }
        buyer.token += order.tokensUsed; // Refund tokens to the buyer
        await buyer.save();

        await BookOrder.deleteOne({ _id: order._id });
        return res.status(200).json({ message: "Order cancelled successfully" });
    }
    catch (error) {
        console.error("Error cancelling order:", error);
        res.status(500).json({ message: "Internal server error" });
    }  
}

const orderCancelByBuyer = async (req, res) => {
    const orderId = req.body.orderId;
    
    try {
        const order = await BookOrder.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }   
        if (order.bookRecieved || order.bookDevivered) {
            return res.status(400).json({ message: "Order cannot be cancelled after delivery or receipt" });
        }

        const seller = await User.findById(order.seller);
        if (!seller) {
            return res.status(404).json({ message: "Seller not found" });
        }
        seller.token += order.tokensUsed; // Refund tokens to the seller
        await seller.save();
        await BookOrder.deleteOne({ _id: orderId });
        res.status(200).json({ message: "Order cancelled successfully" });
    }
    catch (error) {
        console.error("Error cancelling order:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    orderBook,
    getOrdersToMe,
    updateRecieved,
    updateDelivered,
    orderCancelBySeller,
    orderCancelByBuyer,
    myOrders
};
