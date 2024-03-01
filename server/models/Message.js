const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const User = require("../models/User");

const { Schema } = mongoose;

const MessageSchema = new Schema({
  text: { type: String },
  time: { type: Date, default: Date.now },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model("Message", MessageSchema);