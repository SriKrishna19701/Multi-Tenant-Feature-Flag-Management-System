const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const organizationController = require('../controllers/organizationController');
const roleMiddleware = require('../middleware/roleMiddleware');

// Create a new organization (super admin only)
router.post('/', authMiddleware, roleMiddleware('SUPER_ADMIN'), organizationController.createOrganization);

// Get all organizations (super admin only)
router.get('/', authMiddleware, roleMiddleware('SUPER_ADMIN'), organizationController.getOrganizations);

module.exports = router;