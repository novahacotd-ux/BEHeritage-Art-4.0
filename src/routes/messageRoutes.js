const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authenticate = require('../middleware/authenticate');

router.use(authenticate);

router.post('/', messageController.sendMessage);

router.get('/conversations', messageController.getConversations);

router.get('/:friend_id', messageController.getConversation);

router.delete('/:message_id', messageController.deleteMessage);

module.exports = router;
