const mongoose = require("mongoose");

const registerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    
  },
  number: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 4,
  },
  cPassword: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: 0,
  },
  token: {
    type: String,
    default: '',
  }
  
});

const registerModel = mongoose.model("Register", registerSchema);
module.exports = registerModel;
