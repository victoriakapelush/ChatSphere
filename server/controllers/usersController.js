const Message = require("../models/Message");
const User = require("../models/User");
const Conversation = require("../models/Conversation");
const { DateTime } = require("luxon");

const usersGet = (req, res) => {
    User.find()
      .then(users => {
        if (users.length === 0) {
          return res.status(404).json({ message: 'No users found' });
        }
        res.json(users);
      })
      .catch(err => res.status(500).json({ error: 'Error fetching users' }));
}

module.exports = { usersGet };