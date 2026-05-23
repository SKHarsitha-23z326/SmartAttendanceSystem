const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: [true, 'Student ID is required.'],
    trim: true,
    uppercase: true
  },
  name: {
    type: String,
    required: [true, 'Student name is required.'],
    trim: true
  },
  status: {
    type: String,
    enum: ['Absent', 'Verified Lock', 'Exempted'],
    default: 'Verified Lock'
  },
  // ✅ Useful to store the distance for audit/review purposes
  distanceAtCheckIn: {
    type: String,
    default: 'N/A'
  }
}, {
  timestamps: true  // Stores createdAt automatically — useful for time-of-check-in
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;