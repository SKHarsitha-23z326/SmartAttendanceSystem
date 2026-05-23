const Attendance = require('../models/Attendance');
const { globalSystemConfig } = require('../config/db');

const submitAttendance = async (req, res) => {
  try {
    const { studentId, studentName } = req.body;

    if (!studentId || !studentName) {
      return res.status(400).json({ message: 'studentId and studentName are required.' });
    }

    if (!globalSystemConfig.isSessionActive) {
      return res.status(400).json({ message: 'Attendance window has closed for this session.' });
    }

    const log = await Attendance.create({
      studentId,
      name: studentName,
      status: 'Verified Lock',
      distanceAtCheckIn: req.calculatedDistance
    });

    res.status(201).json({ message: 'Attendance recorded successfully.', log });
  } catch (error) {
    res.status(500).json({ message: 'Server error while recording attendance.', error: error.message });
  }
};

const fetchLiveRoster = async (req, res) => {
  try {
    const logs = await Attendance.find({});
    res.status(200).json({
      sessionActive: globalSystemConfig.isSessionActive,
      logs
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching roster.', error: error.message });
  }
};

const toggleSessionState = (req, res) => {
  try {
    globalSystemConfig.isSessionActive = !globalSystemConfig.isSessionActive;
    res.status(200).json({
      message: `Session toggled. Active: ${globalSystemConfig.isSessionActive}`,
      isSessionActive: globalSystemConfig.isSessionActive
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error while toggling session.', error: error.message });
  }
};

module.exports = { submitAttendance, fetchLiveRoster, toggleSessionState };