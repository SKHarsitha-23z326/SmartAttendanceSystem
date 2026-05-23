const express = require('express');
const router = express.Router();
const { submitAttendance, fetchLiveRoster, toggleSessionState } = require('../controllers/attendanceController');
const { verifyGeofence } = require('../middleware/locationCheck');

// Student path requires geofence verification middleware before completing tracking
router.post('/submit', verifyGeofence, submitAttendance);

// Teacher administrative query channels
router.get('/live-roster', fetchLiveRoster);
router.post('/toggle-session', toggleSessionState);

module.exports = router;