const { attendanceLogsTable } = require('../config/db');

const Attendance = {
  create: (logEntry) => {
    const newEntry = {
      id: attendanceLogsTable.length + 1,
      ...logEntry,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    attendanceLogsTable.push(newEntry);
    return newEntry;
  },

  getAllLogs: () => {
    return attendanceLogsTable;
  }
};

module.exports = Attendance;