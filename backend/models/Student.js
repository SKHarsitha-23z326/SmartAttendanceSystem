const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Student name field is strictly mandatory.'],
    trim: true
  },
  rollNo: {
    type: String,
    required: [true, 'Student roll number field is strictly mandatory.'],
    unique: true, // Prevents duplicate student entries
    trim: true,
    uppercase: true
  },
  department: {
    type: String,
    required: [true, 'Department assignment context is mandatory.'],
    default: 'AMCS'
  },
  attendanceStatus: {
    type: String,
    enum: ['Absent', 'Verified Lock', 'Exempted'],
    default: 'Absent'
  },
  lastVerifiedDistance: {
    type: String,
    default: 'N/A'
  }
}, {
  timestamps: true // Automatically tracks createdAt and updatedAt dates
});

// Create and export the model
const Student = mongoose.model('Student', studentSchema);
module.exports = Student;