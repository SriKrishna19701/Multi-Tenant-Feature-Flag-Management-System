const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const featureController = require('../controllers/featureController');

// Create a new feature 
router.post('/', authMiddleware, roleMiddleware('ORG_ADMIN'), featureController.createFeature);

// Get all features for an organization 
router.get('/', authMiddleware, featureController.getFeatures);

// updatea feature 
router.put('/:id', authMiddleware, roleMiddleware('ORG_ADMIN'), featureController.updateFeature);

// delete a feature 
router.delete('/:id', authMiddleware, roleMiddleware('ORG_ADMIN'), featureController.deleteFeature);

// check features only for users
router.post('/check', authMiddleware, roleMiddleware('USER'), featureController.checkFeatures);

module.exports = router;