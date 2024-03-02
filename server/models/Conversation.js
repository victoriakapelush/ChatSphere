const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const { Schema } = mongoose;

const ConversationSchema = new Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
  });
  
const Conversation = mongoose.model('Conversation', ConversationSchema);

module.exports = mongoose.model("Conversation", ConversationSchema);