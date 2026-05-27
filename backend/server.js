const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// ✅ Connect to MongoDB directly here — not in a separate function
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return; // Already connected
  await mongoose.connect(process.env.MONGO_URI);
};


app.use(cors());
app.use(express.json());

// Connect before handling any request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ message: 'Database connection failed.', error: error.message });
  }
});

const studentDbRoutes = require('./routes/studentRoutes');
const authRoutes = require('./routes/authRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const classroomRoutes = require('./routes/classroomRoutes');
app.use('/api/classrooms', classroomRoutes);
app.use('/api/db-students', studentDbRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

module.exports = app;