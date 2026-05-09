const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// super admin login
router.post('/superadmin/login', authController.superAdminLogin);

// organization admin login and register
router.post('/orgadmin/login', authController.orgAdminLogin);
router.post('/orgadmin/register', authController.orgAdminRegister);

// user login and register
router.post('/user/login', authController.userLogin);
router.post('/user/register', authController.userRegister);

module.exports = router;
