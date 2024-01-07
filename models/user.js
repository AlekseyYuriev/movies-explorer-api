const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
);

module.exports = mongoose.model('user', userSchema);
