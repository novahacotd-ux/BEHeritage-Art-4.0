const express= require('express')
const router= express.Router()

const TagController= require('../controllers/forumTagController')


router.get('/',
    TagController.getTagpoppular
);

module.exports = router;