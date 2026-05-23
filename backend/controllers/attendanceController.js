const Attendance = require('../models/Attendance');
const { globalSystemConfig } = require('../config/db');

const submitAttendance = (req, res) => {
  const { studentId, studentName } = req.body;

  if (!globalSystemConfig.isSessionActive) {
    return res.status(400).json({ message: 'Attendance window has closed for this session.' });
  }

  const log = Attendance.create({
    studentId,
    name: studentName,
    status: req.calculatedDistance || 'Verified Lock'
  });

  res.status(201).json({ message: 'Attendance processed and recorded.', log });
};

const fetchLiveRoster = (req, res) => {
  const logs = Attendance.getAllLogs();
  res.status(200).json({
    sessionActive: globalSystemConfig.isSessionActive,
    logs
  });
};

const toggleSessionState = (req, res) => {
  globalSystemConfig.isSessionActive = !globalSystemConfig.isSessionActive;
  res.status(200).json({ 
    message: `Attendance window toggled. Currently active: ${globalSystemConfig.isSessionActive}`,
    isSessionActive: globalSystemConfig.isSessionActive
  });
};

module.exports = {
  submitAttendance,
  fetchLiveRoster,
  toggleSessionState
};