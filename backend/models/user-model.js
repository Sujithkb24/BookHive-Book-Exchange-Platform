const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  nickname: {
    type: String,
    default: 'Anonymous',
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  age: {
    type: Number,
    default: 0,
    min: 0
  },
  gender:{
    type: String,
    default: 'Not specified',
  },
  token: {
    type: Number,
    default: 0
  }
});

const User = mongoose.model('User', userSchema);

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Add method to generate tokens
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { userId: this._id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '1h' }
  );
};

module.exports = User;