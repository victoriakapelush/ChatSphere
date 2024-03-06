const User = require("../models/User");

const usersGet = async (req, res) => {
  try {
    const { id } = req.user;
    console.log('Logged-in user ID:', id);
    const users = await User.find({ _id: { $ne: id } });
    console.log('Users:', users);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { usersGet };