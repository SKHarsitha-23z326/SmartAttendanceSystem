import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StudentDashboard() {
  const [coords, setCoords] = useState({ latitude: null, longitude: null });
  const [geoStatus, setGeoStatus] = useState('Fetching current position...');
  const [attendanceStatus, setAttendanceStatus] = useState('Absent');
  
  const userId = localStorage.getItem('userId') || 'Student';
  const studentName = localStorage.getItem('userName') || 'Harsitha S';

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoStatus('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setGeoStatus('Location coordinates captured successfully.');
      },
      () => {
        setGeoStatus('Unable to retrieve location details. Please grant permission.');
      }
    );
  }, []);

  const handleMarkAttendance = async () => {
    if (!coords.latitude || !coords.longitude) {
      alert('Cannot mark attendance without exact location lock.');
      return;
    }

    try {
      // Live routing through Geofence Middleware Check
      const response = await axios.post('/api/attendance/submit', {
        studentId: userId,
        studentName: studentName,
        latitude: coords.latitude,
        longitude: coords.longitude
      });

      setAttendanceStatus(`Verified & Logged Present (${response.data.log.status})`);
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || 'Geofence Verification Failed.');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="profile-banner">
        <h1>Welcome back, {studentName} ({userId})</h1>
        <p>Status: <span className={`badge ${attendanceStatus.toLowerCase().includes('verified') ? 'verified-logged-present' : 'absent'}`}>{attendanceStatus}</span></p>
      </div>

      <div className="geo-card">
        <h3>Classroom Location Security Lock</h3>
        <p className="status-text">{geoStatus}</p>
        
        {coords.latitude && (
          <div className="coords-box">
            <p><strong>Latitude:</strong> {coords.latitude.toFixed(6)}</p>
            <p><strong>Longitude:</strong> {coords.longitude.toFixed(6)}</p>
          </div>
        )}

        <button 
          className="cta-button secure-btn" 
          onClick={handleMarkAttendance}
          disabled={attendanceStatus.includes('Verified')}
        >
          {attendanceStatus.includes('Verified') ? 'Attendance Confirmed' : 'Verify Location & Check-in'}
        </button>
      </div>
    </div>
  );
}

export default StudentDashboard;