import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'https://smart-attendance-system-b4s4.vercel.app';

function StudentDashboard() {
  const [classrooms, setClassrooms] = useState([]);
  const [joinCode, setJoinCode] = useState('');
  const [coords, setCoords] = useState({ latitude: null, longitude: null });
  const [geoStatus, setGeoStatus] = useState('Fetching location...');
  const [markedClasses, setMarkedClasses] = useState({});
  const [error, setError] = useState('');
  const [joinError, setJoinError] = useState('');

  const userId = localStorage.getItem('userId');
  const studentName = localStorage.getItem('userName');

  useEffect(() => {
    fetchClassrooms();
    navigator.geolocation?.getCurrentPosition(
      pos => {
        setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setGeoStatus('Location captured.');
      },
      () => setGeoStatus('Location access denied.')
    );
  }, []);

  const fetchClassrooms = async () => {
    try {
      const res = await axios.get(`${API}/api/classrooms/student/${userId}`);
      setClassrooms(res.data);
    } catch (err) {
      console.error('Error fetching classrooms:', err);
    }
  };

  const handleJoin = async () => {
    setJoinError('');
    if (!joinCode.trim()) return;
    try {
      await axios.post(`${API}/api/classrooms/join`, {
        code: joinCode.toUpperCase(),
        studentId: userId,
        studentName
      });
      setJoinCode('');
      fetchClassrooms();
      alert('Joined classroom successfully!');
    } catch (err) {
      setJoinError(err.response?.data?.message || 'Failed to join classroom.');
    }
  };

  const handleMarkAttendance = async (classroom) => {
    setError('');
    if (!coords.latitude) {
      setError('Location not available. Please allow location access.');
      return;
    }

    try {
      const res = await axios.post(`${API}/api/classrooms/submit-attendance`, {
        classroomId: classroom._id,
        studentId: userId,
        studentName,
        latitude: coords.latitude,
        longitude: coords.longitude
      });

      setMarkedClasses(prev => ({ ...prev, [classroom._id]: res.data.log }));
      alert(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark attendance.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="dashboard-container">
      <div className="profile-banner">
        <div>
          <h1>Welcome, {studentName}</h1>
          <p>Roll No: <strong>{userId}</strong></p>
          <p style={{ fontSize: '13px', color: '#888' }}>{geoStatus}</p>
          {coords.latitude && (
            <p style={{ fontSize: '13px', color: '#888' }}>
              📍 {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)}
            </p>
          )}
        </div>
        <button onClick={handleLogout} style={logoutStyle}>Logout</button>
      </div>

      {/* Join Classroom */}
      <div className="geo-card" style={{ marginBottom: '20px' }}>
        <h3>Join a Classroom</h3>
        {joinError && <p style={{ color: 'red' }}>{joinError}</p>}
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Enter classroom code e.g. AB12CD"
            value={joinCode}
            onChange={e => setJoinCode(e.target.value)}
            style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <button className="cta-button" onClick={handleJoin}
            style={{ width: 'auto', padding: '10px 20px' }}>
            Join
          </button>
        </div>
      </div>

      {error && <p style={{ color: 'red', marginBottom: '12px' }}>{error}</p>}

      {/* Enrolled Classrooms */}
      <h3>My Classrooms</h3>
      {classrooms.length === 0 ? (
        <p>You haven't joined any classrooms yet. Use a code above to join.</p>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {classrooms.map(cls => {
            const isMarked = !!markedClasses[cls._id];
            return (
              <div key={cls._id} className="geo-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>{cls.name}</h3>
                    <p style={{ margin: '4px 0', color: '#888' }}>Room: {cls.roomNumber}</p>
                    <p style={{ margin: '4px 0', color: '#888' }}>Teacher: {cls.teacherName}</p>
                    <span style={{
                      padding: '3px 10px', borderRadius: '12px', fontSize: '12px',
                      background: cls.isSessionActive ? '#d4edda' : '#f8d7da',
                      color: cls.isSessionActive ? '#155724' : '#721c24'
                    }}>
                      {cls.isSessionActive ? 'Attendance Open' : 'Attendance Closed'}
                    </span>
                  </div>
                  <button
                    className="cta-button"
                    onClick={() => handleMarkAttendance(cls)}
                    disabled={isMarked || !cls.isSessionActive}
                    style={{
                      width: 'auto', padding: '10px 16px',
                      opacity: (isMarked || !cls.isSessionActive) ? 0.5 : 1
                    }}>
                    {isMarked ? '✓ Marked' : 'Mark Attendance'}
                  </button>
                </div>

                {/* Show log after marking */}
                {isMarked && (
                  <div style={{ marginTop: '12px', padding: '10px', background: '#f0fff4', borderRadius: '6px', fontSize: '13px' }}>
                    <p>✓ Attendance recorded at {new Date(markedClasses[cls._id].createdAt).toLocaleTimeString()}</p>
                    <p>Distance from classroom: {markedClasses[cls._id].distanceAtCheckIn}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const logoutStyle = { background: 'transparent', border: '1px solid #ccc', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer',
  color: 'white',      
  fontSize: '14px' };

export default StudentDashboard;