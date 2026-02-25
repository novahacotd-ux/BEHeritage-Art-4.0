const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const locationInteractionController = require('../controllers/locationInteractionController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.get('/list', locationController.getAllLocations);
router.get('/:id', locationController.getLocationById);
router.get('/:id/interactions', locationInteractionController.getLocationInteractions);

router.use(authenticate);

router.post('/create', authorize('ADMIN'), locationController.createLocation);
router.patch('/:id/update', authorize('ADMIN'), locationController.updateLocation);
router.delete('/:id/delete', authorize('ADMIN'), locationController.deleteLocation);

router.post('/:id/interactions', locationInteractionController.createLocationInteraction);
router.patch('/:id/interactions/:interaction_id', locationInteractionController.updateLocationInteraction);
router.delete('/:id/interactions/:interaction_id', locationInteractionController.deleteLocationInteraction);


module.exports = router;
