const express = require('express');
const router = express.Router();
const { submitAttendance, fetchLiveRoster, toggleSessionState } = require('../controllers/attendanceController');
const { verifyGeofence } = require('../middleware/locationCheck');
const { verifyToken } = require('../middleware/authMiddleware');

// ✅ Protected routes — require valid JWT token
router.post('/submit', verifyToken, verifyGeofence, submitAttendance);
router.get('/live-roster', verifyToken, fetchLiveRoster);
router.post('/toggle-session', verifyToken, toggleSessionState);

module.exports = router;