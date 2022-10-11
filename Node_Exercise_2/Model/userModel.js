const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = new Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  googleId: { type: String },
});

module.exports = mongoose.model("Register", userSchema);
