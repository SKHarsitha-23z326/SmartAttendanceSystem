const { usersTable } = require('../config/db');

const User = {
  findById: (id) => {
    return usersTable.find(user => user.id === id);
  },
  
  findAll: () => {
    return usersTable;
  }
};

module.exports = User;