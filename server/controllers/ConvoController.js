const mongoose = require("mongoose");
const Message = require("../models/Message");
const User = require("../models/User");
const Conversation = require("../models/Conversation");

const convoGet = (req, res) => {
    const currentUser = req.user.id;
    Conversation.find({ participants: currentUser })
        .populate('participants') 
        .populate('messages')
        .then(conversations => {
            if (conversations.length === 0) {
                return res.status(404).json({ message: 'No conversations found' });
            }
            const formattedConversations = conversations.map(conversation => {
                // Find the receiver of the conversation (the user who is not the current user)
                const receiver = conversation.participants.find(participant => participant._id.toString() !== currentUser);
                const formattedMessages = conversation.messages.map(message => ({
                    text: message.text,
                    time: getRelativeTime(new Date(message.time)),
                    sender: message.sender,
                    receiver: message.receiver
                }));
                return {
                    _id: conversation._id,
                    participants: conversation.participants,
                    receiver: receiver, // Add the receiver to the formatted conversation
                    messages: formattedMessages
                };
            });
            res.json(formattedConversations);
        })
        .catch(err => res.status(500).json({ error: 'Error fetching conversations' }));
};

module.exports = { convoGet };
