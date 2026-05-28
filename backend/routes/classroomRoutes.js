const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
  createClassroom,
  getTeacherClassrooms,
  toggleClassroomSession,
  getClassroomAttendance,
  joinClassroom,
  getStudentClassrooms,
  submitClassroomAttendance
} = require('../controllers/classroomController');

// ✅ All routes protected
router.post('/create', verifyToken, createClassroom);
router.get('/teacher/:teacherId', verifyToken, getTeacherClassrooms);
router.post('/toggle/:classroomId', verifyToken, toggleClassroomSession);
router.get('/attendance/:classroomId', verifyToken, getClassroomAttendance);
router.post('/join', verifyToken, joinClassroom);
router.get('/student/:studentId', verifyToken, getStudentClassrooms);
router.post('/submit-attendance', verifyToken, submitClassroomAttendance);

module.exports = router;