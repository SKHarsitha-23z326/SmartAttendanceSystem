const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./config/db');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

const studentDbRoutes = require('./routes/studentRoutes');
const authRoutes = require('./routes/authRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

app.use('/api/db-students', studentDbRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

// ✅ For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// ✅ For Vercel serverless — export the app
module.exports = app;