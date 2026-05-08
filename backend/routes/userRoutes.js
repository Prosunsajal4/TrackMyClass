const express = require('express');
const router = express.Router();
const { getDashboardStats, getAnalytics } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/dashboard', protect, getDashboardStats);
router.get('/analytics', protect, getAnalytics);

module.exports = router;
