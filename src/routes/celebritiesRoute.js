const express = require('express');
const router = express.Router();
const celebritiesController = require('../controllers/CelebritiesController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const upload = require("../middleware/upload");
const validate = require('../middleware/validate');
const { celebritiesValidation } = require('../utils/validators');
/**
 * @route   GET /api/Celebrities/:id
 * @desc    Get Celebrities by id
 * @access  Public
*/
router.get('/:id', celebritiesController.getCelebrity);

/**
 * @route   POST /api/Celebrities/:id
 * @desc    Add a new celebrity to a historical period
 * @access  Admin only routes
*/
router.post('/:id',
    authenticate, 
    authorize('ADMIN'), 
    upload.single('file'),
    celebritiesValidation,
    validate,
    celebritiesController.createCelebrity
)

/**
 * @route   PUT /api/celebrities/:id
 * @desc    Update a celebrity information
 * @access  Admin only routes
*/
router.put('/:id',
    authenticate, 
    authorize('ADMIN'),
    upload.single('file'), 
    celebritiesController.updateCelebrity
)

/**
 * @route   DELETE /api/celebrities/:id
 * @desc    Delete a celebrity
 * @access  Admin only routes
*/
router.delete('/:id',
    authenticate, 
    authorize('ADMIN'), 
    
    celebritiesController.deleteCelebrity
)

module.exports = router;
