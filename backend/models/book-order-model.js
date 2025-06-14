// models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  tokensUsed: {
    type: Number,
    required: true
  },
  bookRecieved: {
    type: Boolean,
    default: false
  },
  bookDevivered: {
    type: Boolean,
    default: false
  },
});

const BookOrder = mongoose.model("Order", orderSchema)

module.exports = BookOrder;
