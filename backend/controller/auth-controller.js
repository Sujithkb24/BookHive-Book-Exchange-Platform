const User = require('../models/user-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { username, password, email} = req.body;
    try {
        // Check if user already exists
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
            email
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
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
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

module.exports = {register, login, additionalInfo};