import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'https://smart-attendance-system-b4s4.vercel.app/';

function TeacherDashboard() {
  const [roster, setRoster] = useState([]);
  const [students, setStudents] = useState([]);
  const [isActiveSession, setIsActiveSession] = useState(false);
  const [activeTab, setActiveTab] = useState('attendance');

  const fetchAttendanceLogs = async () => {
    try {
      const response = await axios.get(`${API}/api/attendance/live-roster`);
      setRoster(response.data.logs);
      setIsActiveSession(response.data.sessionActive);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API}/api/db-students`);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  useEffect(() => {
    fetchAttendanceLogs();
    fetchStudents();
    const interval = setInterval(fetchAttendanceLogs, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSession = async () => {
    try {
      const response = await axios.post(`${API}/api/attendance/toggle-session`);
      setIsActiveSession(response.data.isSessionActive);
    } catch (error) {
      alert('Could not toggle session.');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="instructor-header">
        <h1>Teacher Dashboard</h1>
        <button
          className={`session-btn ${isActiveSession ? 'active' : 'closed'}`}
          onClick={handleToggleSession}
        >
          {isActiveSession ? 'Close Attendance Window' : 'Open Attendance Window'}
        </button>
      </div>

      <div className="metrics-grid">
        <div className="metric-box">
          <h4>Live Check-ins</h4>
          <h2>{roster.length} Students</h2>
        </div>
        <div className="metric-box">
          <h4>Total Students</h4>
          <h2>{students.length} Enrolled</h2>
        </div>
        <div className="metric-box">
          <h4>Geofence</h4>
          <h2>{isActiveSession ? 'Active (50m)' : 'Inactive'}</h2>
        </div>
      </div>

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: '12px', margin: '20px 0' }}>
        <button
          className={`cta-button ${activeTab === 'attendance' ? '' : 'outline'}`}
          onClick={() => setActiveTab('attendance')}
          style={{ width: 'auto', padding: '8px 20px' }}
        >
          Live Attendance
        </button>
        <button
          className={`cta-button ${activeTab === 'students' ? '' : 'outline'}`}
          onClick={() => setActiveTab('students')}
          style={{ width: 'auto', padding: '8px 20px' }}
        >
          Student Roster
        </button>
      </div>

      {/* Attendance Logs Table */}
      {activeTab === 'attendance' && (
        <div className="table-container">
          <h3>Live Attendance Log</h3>
          {roster.length === 0 ? (
            <p>No attendance records yet for this session.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f0f0f0' }}>
                  <th style={th}>Student ID</th>
                  <th style={th}>Name</th>
                  <th style={th}>Status</th>
                  <th style={th}>Distance</th>
                  <th style={th}>Time</th>
                </tr>
              </thead>
              <tbody>
                {roster.map((log) => (
                  <tr key={log._id}>
                    <td style={td}>{log.studentId}</td>
                    <td style={td}>{log.name}</td>
                    <td style={td}>
                      <span style={{ color: 'green', fontWeight: 'bold' }}>{log.status}</span>
                    </td>
                    <td style={td}>{log.distanceAtCheckIn}</td>
                    <td style={td}>{new Date(log.createdAt).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Student Roster Table */}
      {activeTab === 'students' && (
        <div className="table-container">
          <h3>Enrolled Students</h3>
          {students.length === 0 ? (
            <p>No students found in database.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f0f0f0' }}>
                  <th style={th}>Roll No</th>
                  <th style={th}>Name</th>
                  <th style={th}>Department</th>
                  <th style={th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td style={td}>{student.rollNo}</td>
                    <td style={td}>{student.name}</td>
                    <td style={td}>{student.department}</td>
                    <td style={td}>{student.attendanceStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

const th = { padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd', fontWeight: 'bold' };
const td = { padding: '10px', borderBottom: '1px solid #eee' };

export default TeacherDashboard;