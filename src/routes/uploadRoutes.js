const express = require('express');
const router = express.Router();
const { upload, uploadAvatar, deleteImage } = require('../controllers/uploadController');
const authenticate = require('../middleware/authenticate');

router.post('/avatar', authenticate, upload.single('avatar'), uploadAvatar);

router.delete('/image', authenticate, deleteImage);

module.exports = router;
