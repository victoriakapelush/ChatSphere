const Message = require("../models/Message");
const User = require("../models/User");

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
    const currentUser = req.user;
    Message.find({ receiver: req.params.id })
      .populate('sender')
      .then(messages => {
        if (messages.length === 0) {
          return res.status(404).json({ message: 'No messages found' });
        }
        const formattedMessages = messages.map(message => ({
          text: message.text,
          time: getRelativeTime(message.time),
          sender: currentUser,
          receiver: req.params.id
        }));
        res.json(formattedMessages);
      })
      .catch(err => res.status(500).json({ error: 'Error fetching messages' }));
  };

  const messagePost = async (req, res) => {
    try {
      const currentUser = await User.findById(req.user.id);
      const { text } = req.body;
      const receiver = req.params.id;
      const message = new Message({ receiver, text, user: currentUser });
      await message.save();

      currentUser.messagesToOtherUsers.push(message);
      await currentUser.save();

      const receiverUser = await User.findById(receiver);
      if (!receiverUser) {
        return res.status(404).json({ message: "Receiver not found" });
      }

      receiverUser.messagesFromOtherUsers.push(message);
      await receiverUser.save();

      res.status(201).json({ message: "Message created successfully" })
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  module.exports = { messageGet, messagePost };