const express = require('express');
const router = express.Router();
const { verifyJWT }   = require('../controllers/loginController');
const { usersGet } = require('../controllers/usersController');
const { messageGet, messagePost } = require('../controllers/messageController');

router.get('/', verifyJWT, usersGet);
router.get('/:id', verifyJWT, usersGet);

module.exports = router;