const express = require('express');
const router = express.Router();
const { verifyJWT }   = require('../controllers/loginController');
const { usersGet } = require('../controllers/usersController');
const { messageGet, messagePost } = require('../controllers/messageController');

router.get('/', usersGet, messagePost, messageGet);
router.get('/:id', usersGet, messagePost, messageGet);

module.exports = router;