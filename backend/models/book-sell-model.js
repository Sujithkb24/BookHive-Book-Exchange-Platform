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
    },
    images: [{
        type: String, // Store Cloudinary URLs
        trim: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

// Update the updatedAt field before saving
bookSellSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const BookSell = mongoose.model('BookSell', bookSellSchema);

module.exports = BookSell;