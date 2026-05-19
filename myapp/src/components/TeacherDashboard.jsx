import React, { useState } from 'react';
import AttendanceList from './AttendanceList';

function TeacherDashboard() {
  // Parent state containing current roster list
  const [roster, setRoster] = useState([
    { id: '23Z301', name: 'Abishek M', time: '09:31 AM', tracking: 'Classroom Radius Lock' },
    { id: '23Z314', name: 'Deepika S', time: '09:34 AM', tracking: 'Classroom Radius Lock' },
    { id: '23Z326', name: 'Harsitha S', time: '09:35 AM', tracking: 'Classroom Radius Lock' }
  ]);

  const [isActiveSession, setIsActiveSession] = useState(true);

  return (
    <div className="dashboard-container">
      <div className="instructor-header">
        <h1>Professor Admin Control Hub</h1>
        <button 
          className={`session-btn ${isActiveSession ? 'active' : 'closed'}`}
          onClick={() => setIsActiveSession(!isActiveSession)}
        >
          {isActiveSession ? 'Close Attendance Window' : 'Open Attendance Window'}
        </button>
      </div>

      <div className="metrics-grid">
        <div className="metric-box">
          <h4>Active Check-ins</h4>
          <h2>{isActiveSession ? roster.length : 0} Students</h2>
        </div>
        <div className="metric-box">
          <h4>Geofence Validation</h4>
          <h2>Active (50m Radius)</h2>
        </div>
      </div>

      {/* Passing list down via PROPS */}
      <AttendanceList activeStudents={isActiveSession ? roster : []} />
    </div>
  );
}

export default TeacherDashboard;