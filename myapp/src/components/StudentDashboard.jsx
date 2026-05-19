import React, { useState, useEffect } from 'react';

function StudentDashboard() {
  const [coords, setCoords] = useState({ latitude: null, longitude: null });
  const [geoStatus, setGeoStatus] = useState('Fetching current position...');
  const [attendanceStatus, setAttendanceStatus] = useState('Absent');
  const userId = localStorage.getItem('userId') || 'Student';

  // useEffect triggers geolocation coordinates discovery on mount
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

  const handleMarkAttendance = () => {
    if (!coords.latitude || !coords.longitude) {
      alert('Cannot mark attendance without exact location lock.');
      return;
    }
    // Geofencing verification simulation logic
    setAttendanceStatus('Verified & Logged Present');
  };

  return (
    <div className="dashboard-container">
      <div className="profile-banner">
        <h1>Welcome back, ID: {userId}</h1>
        <p>Status: <span className={`badge ${attendanceStatus.toLowerCase().replace(/ /g, '-')}`}>{attendanceStatus}</span></p>
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
          disabled={attendanceStatus.includes('Logged')}
        >
          {attendanceStatus.includes('Logged') ? 'Attendance Confirmed' : 'Verify Location & Check-in'}
        </button>
      </div>
    </div>
  );
}

export default StudentDashboard;