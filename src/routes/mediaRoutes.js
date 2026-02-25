const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const upload = require('../middleware/upload');

router.get('/:location_id/list', mediaController.getLocationMedia);

router.use(authenticate);

router.post('/:location_id/upload', authorize('ADMIN'), upload.array('media', 20), mediaController.uploadLocationMedia);
router.delete('/:location_id/delete', authorize('ADMIN'), mediaController.deleteLocationMedia);

module.exports = router;
