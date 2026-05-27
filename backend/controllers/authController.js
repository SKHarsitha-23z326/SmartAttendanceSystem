const User = require('../models/User');
const bcrypt = require('bcryptjs');

const registerUser = async (req, res) => {
  try {
    const { name, rollNo, password, role } = req.body;

    if (!name || !rollNo || !password || !role) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingUser = await User.findOne({ rollNo });
    if (existingUser) {
      return res.status(400).json({ message: 'A user with this Roll Number already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, rollNo, password: hashedPassword, role });

    res.status(201).json({
      message: 'Registration successful.',
      user: { id: newUser.rollNo, name: newUser.name, role: newUser.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration.', error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { rollNo, password } = req.body;

    if (!rollNo || !password) {
      return res.status(400).json({ message: 'Roll number and password are required.' });
    }

    const user = await User.findOne({ rollNo });
    if (!user) {
      return res.status(404).json({ message: 'No account found with that ID.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password.' });
    }

    res.status(200).json({
      message: 'Authentication successful.',
      user: { id: user.rollNo, name: user.name, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during authentication.', error: error.message });
  }
};

module.exports = { registerUser, loginUser };