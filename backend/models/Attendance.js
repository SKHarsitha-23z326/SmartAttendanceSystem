const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  classroomId: {
    type: String,
    default: null
  },
  classroomName: {
    type: String,
    default: null
  },
  studentId: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Absent', 'Verified Lock', 'Exempted'],
    default: 'Verified Lock'
  },
  distanceAtCheckIn: {
    type: String,
    default: 'N/A'
  }
}, { timestamps: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;