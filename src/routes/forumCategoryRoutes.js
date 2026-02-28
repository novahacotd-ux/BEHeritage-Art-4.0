const express = require("express");
const router = express.Router();

const ForumCategoryController= require('../controllers/forumCategoryController')


router.get('/', ForumCategoryController.GetForumCategory )

module.exports= router