const User = require('../models/User');

const loginUser = (req, res) => {
  const { id, password } = req.body;

  const user = User.findById(id);

  if (!user) {
    return res.status(404).json({ message: 'Identifier not recognized in database system.' });
  }

  if (user.password !== password) {
    return res.status(401).json({ message: 'Authentication failure. Invalid password credentials.' });
  }

  res.status(200).json({
    message: 'Authentication successful.',
    user: { id: user.id, name: user.name, role: user.role }
  });
};

module.exports = { loginUser };