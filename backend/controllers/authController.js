const User = require('../models/User');
const bcrypt = require('bcryptjs');

const loginUser = async (req, res) => {
  try {
    const { rollNo, password } = req.body;
    
    console.log('req.body:', req.body);        // ← add this
    console.log('Searching rollNo:', rollNo);  // ← add this

    if (!rollNo || !password) {
      return res.status(400).json({ message: 'Roll number and password are required.' });
    }

    const user = await User.findOne({ rollNo });
    console.log('Found user:', user);          // ← add this

    if (!user) {
      return res.status(404).json({ message: 'No account found with that ID.' });
    }
    // ... rest of code
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

module.exports = { loginUser };