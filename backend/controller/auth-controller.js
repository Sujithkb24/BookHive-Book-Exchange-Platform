const User = require('../models/user-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const reportModel = require("../models/reportModel")
const Cart = require('../models/cart-model');
const bookModel = require('../models/book-sell-model');

const register = async (req, res) => {
  const { username, password, email} = req.body;
    try {
        // Check if user already exists
        const isUserReported = await reportModel.findOne({ reportedEmails: email });
        if (isUserReported) {
            return res.status(400).json({ message: 'User is reported and cannot register', success: false });
        }
        const existingUser = await User.find({ email });
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists', success: false });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create a new user
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            reportCount: 0,
        });
        // Save the user to the database
        await newUser.save();
        // Respond with success
        res.status(201).json({ message: 'User registered successfully', success: true });
    }
    catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};  

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found', success: false });
    }
    // Compare the password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);  
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password', success: false });
    } 
    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
    // Respond with success
    res.status(200).json({ message: 'Login successful', token, success: true });
  }
  catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const additionalInfo = async (req, res) => {
  const userId = req.id;
  const {nickname, age, gender } = req.body;
  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }
    // Update the user's additional information
    user.nickname = nickname || user.nickname;
    user.age = age || user.age;
    user.gender = gender || user.gender;

    // Save the updated user
    await user.save();
    // Respond with success
    res.status(200).json({ message: 'User information updated successfully', success: true });
    }
    catch (error) {
        console.error('Error updating user information:', error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }   
}

const getUserDetails = async (req, res) => {
  const userId = req.id;
  try {
    // Find the user by ID
    const user = await User.findById(userId).select('-password'); // Exclude password from response
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }
    // Respond with user details
    const userDetails = {
      username: user.username,
      nickname: user.nickname || 'Anonymous',
      email: user.email,
      phone:  user.phone || 0,
      age: user.age || 0,
      gender: user.gender || 'Not specified',
      token: user.token || 0,
  }
    return res.status(200).json({ profile: userDetails, success: true });
  } catch (error) {
    console.error('Error fetching user details:', error);
    return res.status(500).json({ message: 'Internal server error', success: false });
  }
}

const updateUserDetails = async (req, res) => {
  const userId = req.id;  
  const { nickname, phone, age, username, email, token, gender } = req.body;
  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {  
      return res.status(404).json({ message: 'User not found', success: false });
    }
    // Update the user's details
    user.nickname = nickname || user.nickname;
    user.phone = phone || user.phone;
    user.age = age || user.age;

    user.username = username || user.username;
    user.email = email || user.email;
    user.token = token || user.token;
    
    user.gender = gender || user.gender

    // Save the updated user
    await user.save();

    // Respond with success
    res.status(200).json({ message: 'User details updated successfully', success: true });
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ message: 'Internal server error', success: false });
  } 
}


const reportUser = async (req, res) => {
  const { userId } = req.body;
  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }
    // Increment the report count
    user.reportCount += 1;
    // Save the updated user
    await user.save();

    if (user.reportCount >= 3) {
      // If the report count reaches 3, delete the user
      await User.deleteOne({ _id: userId });
      const report = new reportModel({
        reportedEmails: user.email
      });
      // Save the report
      await report.save();
      return res.status(200).json({ message: 'User reported and deleted successfully', success: true });
    }
    // Respond with success
    res.status(200).json({ message: 'User reported successfully', success: true });
  }
  catch (error) {
    console.error('Error reporting user:', error);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
}

const addToCart = async (req, res) => {
  const userId = req.id;
  const { bookId } = req.body;
  try {
    // Find the user by ID
    const cart = await Cart.findOne({ userId });
    if (cart == null) {
      // If the cart does not exist, create a new one
      const newCart = new Cart({
        userId,
        items: [bookId],
      });

      await newCart.save();
    }

    
    else if(cart.items.length >= 0) {
      // If the cart already exists, add the book to the existing cart
      if(cart.items.includes(bookId)) {
      // If the book is already in the cart, return a message
      return res.status(400).json({ message: 'Book already exists in the cart', success: false });
    }
      cart.items.push(bookId);
      await cart.save();
      
    }
    console.log(cart);
    return res.status(201).json({ message: 'Book added to cart successfully', success: true });
  
}catch (error) {
    console.error('Error adding book to cart:', error);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
}

const getallCartItems = async (req, res) => {
  const userId = req.id;
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found', success: false });
    }

    const bookDetails = await Promise.all(
      cart.items.map(async (itemId) => {
        const book = await bookModel.findById(itemId);
        if (book) {
          return {
            isbn: book.isbn,
            id: book._id,
            bookName: book.bookName,
            author: book.authorName,
            tokens: book.token,
            seller: book.sellerUserId,
          };
        }
        return null; // or filter it out later
      })
    );

    // Remove null values if any books were not found
    const filteredBooks = bookDetails.filter(book => book !== null);
    console.log(filteredBooks);

    res.status(200).json({ books: filteredBooks, success: true });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
};


module.exports = {updateUserDetails, getUserDetails,register, login, additionalInfo, reportUser, addToCart, getallCartItems};