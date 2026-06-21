const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  username: {
    type: String,
    minLength: 3,
    unique: true,
    required: true,
  },
  favoriteGenre: {
    type: String,
    minLength: 3,
    required: true,
  },
});

module.exports = mongoose.model("User", schema);
