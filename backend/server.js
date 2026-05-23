const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
require('dotenv').config();

//const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// ====== CRITICAL: MIDDLEWARES MUST COME BEFORE THE ROUTES ======
app.use(cors());
app.use(express.json()); // <-- THIS LINE MUST BE HERE

// Routes
const studentDbRoutes = require('./routes/studentRoutes');
app.use('/api/db-students', studentDbRoutes); 

// The rest of your routes...
const authRoutes = require('./routes/authRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = app;