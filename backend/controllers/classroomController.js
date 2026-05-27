const Classroom = require('../models/Classroom');
const Attendance = require('../models/Attendance');

// Generate random 6-char code
const generateCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Teacher: Create classroom
const createClassroom = async (req, res) => {
  try {
    const { name, roomNumber, lat, lng } = req.body;
    const teacherId = req.body.teacherId;
    const teacherName = req.body.teacherName;

    if (!name || !roomNumber || !lat || !lng || !teacherId || !teacherName) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    let code;
    let exists = true;
    while (exists) {
      code = generateCode();
      exists = await Classroom.findOne({ code });
    }

    const classroom = await Classroom.create({
      name, roomNumber, lat, lng, teacherId, teacherName, code
    });

    res.status(201).json({ message: 'Classroom created.', classroom });
  } catch (error) {
    res.status(500).json({ message: 'Error creating classroom.', error: error.message });
  }
};

// Teacher: Get their classrooms
const getTeacherClassrooms = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const classrooms = await Classroom.find({ teacherId });
    res.status(200).json(classrooms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching classrooms.', error: error.message });
  }
};

// Teacher: Toggle session for a classroom
const toggleClassroomSession = async (req, res) => {
  try {
    const { classroomId } = req.params;
    const classroom = await Classroom.findById(classroomId);

    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found.' });
    }

    classroom.isSessionActive = !classroom.isSessionActive;
    await classroom.save();

    res.status(200).json({
      message: `Session ${classroom.isSessionActive ? 'opened' : 'closed'}.`,
      isSessionActive: classroom.isSessionActive,
      classroom
    });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling session.', error: error.message });
  }
};

// Teacher: Get attendance logs for a classroom
const getClassroomAttendance = async (req, res) => {
  try {
    const { classroomId } = req.params;
    const logs = await Attendance.find({ classroomId });
    res.status(200).json({ logs });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance.', error: error.message });
  }
};

// Student: Join classroom using code
const joinClassroom = async (req, res) => {
  try {
    const { code, studentId, studentName } = req.body;

    if (!code || !studentId || !studentName) {
      return res.status(400).json({ message: 'Code, studentId, and studentName are required.' });
    }

    const classroom = await Classroom.findOne({ code });
    if (!classroom) {
      return res.status(404).json({ message: 'Invalid classroom code.' });
    }

    const alreadyJoined = classroom.students.find(s => s.studentId === studentId);
    if (alreadyJoined) {
      return res.status(400).json({ message: 'You have already joined this classroom.' });
    }

    classroom.students.push({ studentId, studentName });
    await classroom.save();

    res.status(200).json({ message: 'Joined classroom successfully.', classroom });
  } catch (error) {
    res.status(500).json({ message: 'Error joining classroom.', error: error.message });
  }
};

// Student: Get their joined classrooms
const getStudentClassrooms = async (req, res) => {
  try {
    const { studentId } = req.params;
    const classrooms = await Classroom.find({ 'students.studentId': studentId });
    res.status(200).json(classrooms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching classrooms.', error: error.message });
  }
};

// Student: Submit attendance for a classroom
const submitClassroomAttendance = async (req, res) => {
  try {
    const { classroomId, studentId, studentName, latitude, longitude } = req.body;

    if (!classroomId || !studentId || !studentName || !latitude || !longitude) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found.' });
    }

    if (!classroom.isSessionActive) {
      return res.status(400).json({ message: 'Attendance window is closed for this classroom.' });
    }

    const isMember = classroom.students.find(s => s.studentId === studentId);
    if (!isMember) {
      return res.status(403).json({ message: 'You are not enrolled in this classroom.' });
    }

    // Already marked today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const existing = await Attendance.findOne({
      classroomId,
      studentId,
      createdAt: { $gte: today }
    });
    if (existing) {
      return res.status(400).json({ message: 'Attendance already marked for this class today.' });
    }

    // Geofence check
    const distance = calculateDistance(latitude, longitude, classroom.lat, classroom.lng);
    if (distance > 50) {
      return res.status(403).json({
        message: `Geofence violation. You are ${Math.round(distance)}m from the classroom.`
      });
    }

    const log = await Attendance.create({
      classroomId,
      classroomName: classroom.name,
      studentId,
      name: studentName,
      status: 'Verified Lock',
      distanceAtCheckIn: `${Math.round(distance)}m`
    });

    res.status(201).json({ message: 'Attendance marked successfully.', log });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting attendance.', error: error.message });
  }
};

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const phi1 = lat1 * Math.PI / 180;
  const phi2 = lat2 * Math.PI / 180;
  const deltaPhi = (lat2 - lat1) * Math.PI / 180;
  const deltaLambda = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(deltaPhi / 2) ** 2 +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

module.exports = {
  createClassroom,
  getTeacherClassrooms,
  toggleClassroomSession,
  getClassroomAttendance,
  joinClassroom,
  getStudentClassrooms,
  submitClassroomAttendance
};