const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const organizationController = require('../controller/organizationController');
const roleMiddleware = require('../middleware/roleMiddleware');

// Public organization list for signup selection
router.get('/public', organizationController.getOrganizationsPublic);

// Create a new organization (super admin only)
router.post('/', authMiddleware, roleMiddleware('SUPER_ADMIN'), organizationController.createOrganization);

// Get all organizations (super admin only)
router.get('/', authMiddleware, roleMiddleware('SUPER_ADMIN'), organizationController.getOrganizations);

// Delete an organization (super admin only)
router.delete('/:id', authMiddleware, roleMiddleware('SUPER_ADMIN'), organizationController.deleteOrganization);

module.exports = router;