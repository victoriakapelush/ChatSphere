const express = require('express');
const router = express.Router();
const { verifyJWT }   = require('../controllers/loginController');
const { messageGet, messagePost } = require('../controllers/messageController');

router.get('/', verifyJWT, messageGet);
router.post('/', verifyJWT, messagePost);

module.exports = router;