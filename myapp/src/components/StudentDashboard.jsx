import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'https://smart-attendance-system-b4s4.vercel.app/'; // 🔁 Replace with your actual backend URL

function StudentDashboard() {
  const [coords, setCoords] = useState({ latitude: null, longitude: null });
  const [geoStatus, setGeoStatus] = useState('Fetching current position...');
  const [attendanceStatus, setAttendanceStatus] = useState('Absent');
  const [attendanceLog, setAttendanceLog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const userId = localStorage.getItem('userId') || 'N/A';
  const studentName = localStorage.getItem('userName') || 'Student';

  // Get location on mount
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
        setGeoStatus('Location captured successfully.');
      },
      () => {
        setGeoStatus('Unable to retrieve location. Please grant permission.');
      }
    );
  }, []);

  const handleMarkAttendance = async () => {
    if (!coords.latitude || !coords.longitude) {
      setError('Cannot mark attendance without location access.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API}/api/attendance/submit`, {
        studentId: userId,
        studentName: studentName,
        latitude: coords.latitude,
        longitude: coords.longitude
      });

      setAttendanceStatus('Verified Lock');
      setAttendanceLog(response.data.log);
      alert(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Attendance submission failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const isVerified = attendanceStatus === 'Verified Lock';

  return (
    <div className="dashboard-container">

      {/* Header */}
      <div className="profile-banner">
        <div>
          <h1>Welcome, {studentName}</h1>
          <p>Roll No: <strong>{userId}</strong></p>
        </div>
        <button onClick={handleLogout} style={logoutStyle}>Logout</button>
      </div>

      {/* Status Badge */}
      <div style={{ margin: '16px 0' }}>
        <span style={{
          padding: '6px 16px',
          borderRadius: '20px',
          background: isVerified ? '#d4edda' : '#f8d7da',
          color: isVerified ? '#155724' : '#721c24',
          fontWeight: 'bold',
          fontSize: '14px'
        }}>
          {isVerified ? '✓ Attendance Marked' : '✗ Not Yet Marked'}
        </span>
      </div>

      {/* Error message */}
      {error && (
        <p style={{ color: 'red', marginBottom: '12px' }}>{error}</p>
      )}

      {/* Location Card */}
      <div className="geo-card">
        <h3>Location Verification</h3>
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
          disabled={isVerified || loading || !coords.latitude}
          style={{ marginTop: '16px', opacity: (isVerified || !coords.latitude) ? 0.6 : 1 }}
        >
          {loading ? 'Submitting...' : isVerified ? '✓ Attendance Confirmed' : 'Verify Location & Mark Attendance'}
        </button>
      </div>

      {/* Attendance Log Card — shown after marking */}
      {attendanceLog && (
        <div className="geo-card" style={{ marginTop: '20px', background: '#f0fff4' }}>
          <h3>Your Attendance Record</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={tdStyle}><strong>Student ID</strong></td>
                <td style={tdStyle}>{attendanceLog.studentId}</td>
              </tr>
              <tr>
                <td style={tdStyle}><strong>Name</strong></td>
                <td style={tdStyle}>{attendanceLog.name}</td>
              </tr>
              <tr>
                <td style={tdStyle}><strong>Status</strong></td>
                <td style={tdStyle} ><span style={{ color: 'green' }}>{attendanceLog.status}</span></td>
              </tr>
              <tr>
                <td style={tdStyle}><strong>Distance</strong></td>
                <td style={tdStyle}>{attendanceLog.distanceAtCheckIn}</td>
              </tr>
              <tr>
                <td style={tdStyle}><strong>Time</strong></td>
                <td style={tdStyle}>{new Date(attendanceLog.createdAt).toLocaleTimeString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}

const tdStyle = { padding: '8px 12px', borderBottom: '1px solid #ddd' };
const logoutStyle = {
  background: 'transparent',
  border: '1px solid #ccc',
  padding: '8px 16px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px'
};

export default StudentDashboard;