const mongoose = require("mongoose");
const Message = require("../models/Message");
const User = require("../models/User");
const Conversation = require("../models/Conversation");
const { DateTime } = require("luxon");
const { v4: uuidv4 } = require('uuid');

function getRelativeTime(date) {
    const now = Date.now();
    const diff = now - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    if (days > 0) {
      return `sent ${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `sent ${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `sent ${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return `sent just now`;
    }
  }

const messageGet = (req, res) => {
  const currentUser = req.user.id;
  Conversation.find({ participants: currentUser })
      .populate('participants') 
      .populate('messages')
      .then(conversations => {
          if (conversations.length === 0) {
              return res.status(404).json({ message: 'No conversations found' });
          }
          const formattedConversations = conversations.map(conversation => {
            const formattedMessages = conversation.messages.map(message => ({
                text: message.text,
                time: getRelativeTime(new Date(message.time)),
                sender: message.sender,
                receiver: message.receiver
            }));
            return {
                _id: conversation._id,
                participants: conversation.participants,
                messages: formattedMessages
            };
        });
        res.json(formattedConversations);
    })
      .catch(err => res.status(500).json({ error: 'Error fetching conversations' }));
};


const messagePost = async (req, res) => {
  const conversationId = new mongoose.Types.ObjectId();
  try {
      const currentUser = await User.findById(req.user.id);
      const { text } = req.body;
      const senderName = req.user.username;
      let conversation = await Conversation.findById(req.params.id);
      const receiverFromBody = await Conversation.findOne({
        participants: req.user.id
      });
      const receiverID = receiverFromBody.participants.filter(userId => userId.toString() !== req.user.id);
      if (conversation) {
          const message = new Message({ receiver: receiverID, sender: currentUser._id, text, user: senderName, time: new Date() });
          await message.save();
          conversation.messages.push(message);
          await conversation.save();
          const receiverUser = await User.findById(receiverID);
          if (!receiverUser) {
              return res.status(404).json({ message: "Receiver not found" });
          }
          res.status(201).json({ message: "Message created successfully" });
      } else {
          const receiverUserFromBody = await User.findById(req.params.id);
          if (!receiverUserFromBody) {
              return res.status(404).json({ message: "Receiver not found" });
          }
          conversation = new Conversation({
              _id: conversationId,
              participants: [req.user.id, receiverUserFromBody],
              messages: []
          });
          const message = new Message({ receiver: receiverUserFromBody, sender: currentUser._id, text, user: senderName, time: new Date() });
          await message.save();
          conversation.messages.push(message);
          await conversation.save();
          req.user.conversations.push(conversation);
          await req.user.save();
          res.status(201).json({ _id: conversationId, message: "Message created successfully" });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { messageGet, messagePost };