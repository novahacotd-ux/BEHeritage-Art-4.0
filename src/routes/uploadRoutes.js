const express = require('express');
const router = express.Router();
const { 
  upload, 
  uploadMedia, 
  deleteMedia
} = require('../controllers/uploadController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

const normalizeUploadType = (value) => {
  const raw = (value || '').toString().trim().toLowerCase();
  if (raw === 'avata') return 'avatar';
  if (raw === 'experience-post' || raw === 'post-media') return 'post';
  if (raw === 'experience-comment' || raw === 'comment-media') return 'comment';
  return raw;
};

const ensureLocationAdmin = (req, res, next) => {
  const uploadType = normalizeUploadType(req.body.type || req.query.type);
  if (uploadType === 'location') {
    return authorize('ADMIN')(req, res, next);
  }
  return next();
};

// Unified upload (avatar, location, post, comment)
router.post('/', authenticate, ensureLocationAdmin, upload.any(), uploadMedia);

// Unified delete
router.delete('/delete', authenticate, deleteMedia);

module.exports = router;
