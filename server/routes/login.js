const express = require("express");
const router = express.Router();
const { login, verifyJWT } = require('../controllers/loginController');

router.get('/', (req, res) => {
    res.json({ isLoggedIn: true, username: req.user.username})
})

router.post('/', login);

module.exports = router;