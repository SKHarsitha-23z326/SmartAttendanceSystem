import React, { useState, useEffect } from 'react';
import AttendanceList from './AttendanceList';
import axios from 'axios';

function TeacherDashboard() {
  const [roster, setRoster] = useState([]);
  const [isActiveSession, setIsActiveSession] = useState(true);

  // Fetch verified entries from our local API tables
  const fetchLogs = async () => {
    try {
      const response = await axios.get('/api/attendance/live-roster');
      setRoster(response.data.logs);
      setIsActiveSession(response.data.sessionActive);
    } catch (error) {
      console.error('Error fetching live data streams:', error);
    }
  };

  useEffect(() => {
    fetchLogs();
    // Set up a short poll interval to update live logs every 4 seconds
    const trackingInterval = setInterval(fetchLogs, 4000);
    return () => clearInterval(trackingInterval);
  }, []);

  const handleToggleSession = async () => {
    try {
      const response = await axios.post('/api/attendance/toggle-session');
      setIsActiveSession(response.data.isSessionActive);
    } catch (error) {
      alert('Could not update session control status.');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="instructor-header">
        <h1>Professor Admin Control Hub</h1>
        <button 
          className={`session-btn ${isActiveSession ? 'active' : 'closed'}`}
          onClick={handleToggleSession}
        >
          {isActiveSession ? 'Close Attendance Window' : 'Open Attendance Window'}
        </button>
      </div>

      <div className="metrics-grid">
        <div className="metric-box">
          <h4>Active Check-ins</h4>
          <h2>{roster.length} Students</h2>
        </div>
        <div className="metric-box">
          <h4>Geofence Validation</h4>
          <h2>{isActiveSession ? 'Active (50m Radius)' : 'Inactive'}</h2>
        </div>
      </div>

      <AttendanceList activeStudents={roster} />
    </div>
  );
}

export default TeacherDashboard;