const bookModel = require('../models/book-sell-model');
const User = require('../models/user-model');

const getBookDetails = async (req, res, isbn) => {
    try {

        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
        const data = await response.json();

        const bookName = data.items[0].volumeInfo.title;
        const authorName = data.items[0].volumeInfo.authors ? data.items[0].volumeInfo.authors.join(', ') : 'Unknown Author';
        const pageCount = data.items[0].volumeInfo.pageCount || 'N/A';

        return res.status(200).json({
            success: true,
            data: {
                isbn: isbn,
                bookName: bookName,
                authorName: authorName,
                pageCount: pageCount,
            }
        });
    } catch (error) {
        console.error('Error fetching book details:', error);
        throw error;
    }
}


const getDescription = async (req, res) => {

    const { AI21 } = await import("ai21");

    const { title, author } = req.body;

    const prompt = `Write a short 1-2 line description of the book titled "${title}" written by ${author}. Do not ask any follow-up questions. Only provide the description.`;

    const client = new AI21({
    apiKey: process.env.AI21_API_KEY, // or pass it in directly
    });

    const response = await client.chat.completions.create({
    model: 'jamba-large',
    messages: [{ role: 'user', content: prompt }],
    });

    const description = response.choices[0].message.content;
    return res.status(200).json({
        success: true,
        description: description
    });
};

const addSell = async (req, res) => {
    const sellerUserId = req.id; // Assuming the user ID is stored in req.user after authentication
    const {isbn, authorName, bookName, pageCount, token, description, condition } = req.body;

    // Here you would typically add the book to your database
    // For this example, we'll just return a success message
    const book = new bookModel({
        isbn,
        authorName,
        bookName,
        pageCount,
        sellerUserId,
        token,
        description,
        condition
    });

    try {
        await book.save();
        return res.status(201).json({
            success: true,
            message: 'Book added successfully',
            book: book
        });
    } catch (error) {
        console.error('Error adding book:', error);
        return res.status(500).json({
            success: false,
            message: 'Error adding book',
            error: error.message
        });
    }
    
}

const getAllSells = async(req, res) => {
    const userId = req.id
    try{
        const allSells = await bookModel.find({sellerUserId: { $ne: userId }});
        console.log(allSells);
        return res.status(200).json({allSells});
    }
    catch(err) {
        console.log(err);
        return res.json(err);
    }
}

const deleteSell = async (req, res) => {
    const { sellId } = req.body;

    try {
        const deletedSell = await bookModel.findByIdAndDelete(sellId);
        if (!deletedSell) {
            return res.status(404).json({ message: 'Sell not found' });
        }
        return res.status(200).json({ message: 'Sell deleted successfully', sell: deletedSell });
    }
    catch (error) {
        console.error('Error deleting sell:', error);
        return res.status(500).json({ message: 'Error deleting sell', error: error.message });
    }
}

const getSellById = async (req, res) => {
    const { sellId } = req.params;

    try {
        const sell = await bookModel.findById(sellId);
        if (!sell) {
            return res.status(404).json({ message: 'Sell not found' });
        }
        const sellerUserId = sell.sellerUserId;
        console.log(sellerUserId);
        const sellerDetails = await User.findById(sellerUserId);

        console.log(sellerDetails.username);
        const sellerName = sellerDetails.username;
        return res.status(200).json({ sell, sellerName });
    } catch (error) {
        console.error('Error fetching sell:', error);
        return res.status(500).json({ message: 'Error fetching sell', error: error.message });
    }
}

module.exports = {
    getSellById,
    getBookDetails,
    getDescription,
    addSell,
    getAllSells,
    deleteSell
};