const mongoose = require('mongoose');

const bookSellSchema = new mongoose.Schema({
    isbn: {
        type: Number,    
    },
    bookName: {
        type: String,
        required: true,
        trim: true
    },
    authorName: {
        type: String,
        required: true,
        trim: true
    },
    pageCount: {
        type: Number,
        required: true,
        trim: true
    },
    sellerUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: Number,
        required: true,
        trim: true
    },
    description:{
        type: String,
        required: true,
        trim: true
    },
    condition: {
        type: String,
        required: true,
        default: 'Average'
    }
})

const BookSell = mongoose.model('BookSell', bookSellSchema);

module.exports = BookSell;
