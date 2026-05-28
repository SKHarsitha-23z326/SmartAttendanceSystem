const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB Connected');
};

app.use(cors());
app.use(express.json());

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

app.use('/api/db-students', studentDbRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/classrooms', classroomRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

// ✅ This runs the server locally AND exports for Vercel
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;