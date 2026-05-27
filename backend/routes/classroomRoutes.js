const express = require('express');
const router = express.Router();
const {
  createClassroom,
  getTeacherClassrooms,
  toggleClassroomSession,
  getClassroomAttendance,
  joinClassroom,
  getStudentClassrooms,
  submitClassroomAttendance
} = require('../controllers/classroomController');

// Teacher routes
router.post('/create', createClassroom);
router.get('/teacher/:teacherId', getTeacherClassrooms);
router.post('/toggle/:classroomId', toggleClassroomSession);
router.get('/attendance/:classroomId', getClassroomAttendance);

// Student routes
router.post('/join', joinClassroom);
router.get('/student/:studentId', getStudentClassrooms);
router.post('/submit-attendance', submitClassroomAttendance);

module.exports = router;