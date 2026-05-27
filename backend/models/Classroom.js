const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  roomNumber: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  teacherId: {
    type: String,
    required: true
  },
  teacherName: {
    type: String,
    required: true
  },
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  },
  isSessionActive: {
    type: Boolean,
    default: false
  },
  students: [
    {
      studentId: String,
      studentName: String,
      joinedAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

const Classroom = mongoose.model('Classroom', classroomSchema);
module.exports = Classroom;