const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String },
  email: { type: String },
  password: { type: String },
  messagesFromOtherUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  messagesToOtherUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
});

module.exports = mongoose.model("User", UserSchema);