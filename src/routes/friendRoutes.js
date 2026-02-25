const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendController');
const authenticate = require('../middleware/authenticate');

router.use(authenticate);

router.post('/request', friendController.sendFriendRequest);

router.post('/accept', friendController.acceptFriendRequest);

router.post('/reject', friendController.rejectFriendRequest);

router.get('/', friendController.getFriends);

router.get('/requests', friendController.getPendingRequests);

router.get('/suggestions', friendController.getFriendSuggestions);

router.delete('/:friend_id', friendController.removeFriend);

module.exports = router;
