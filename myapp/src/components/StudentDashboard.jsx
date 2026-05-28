import React, { useState, useEffect } from 'react';
import api from '../utils/api';

function TeacherDashboard() {
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [form, setForm] = useState({ name: '', roomNumber: '', lat: '', lng: '' });
  const [activeTab, setActiveTab] = useState('classrooms');
  const [error, setError] = useState('');

  const teacherId = localStorage.getItem('userId');
  const teacherName = localStorage.getItem('userName');

  const fetchClassrooms = async () => {
    try {
      const res = await api.get(`/api/classrooms/teacher/${teacherId}`);
      setClassrooms(res.data);
    } catch (err) {
      console.error('Error fetching classrooms:', err);
    }
  };

  const fetchAttendance = async (classroomId) => {
    try {
      const res = await api.get(`/api/classrooms/attendance/${classroomId}`);
      setAttendanceLogs(res.data.logs);
    } catch (err) {
      console.error('Error fetching attendance:', err);
    }
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  useEffect(() => {
    if (selectedClassroom) {
      fetchAttendance(selectedClassroom._id);
      const interval = setInterval(() => fetchAttendance(selectedClassroom._id), 4000);
      return () => clearInterval(interval);
    }
  }, [selectedClassroom]);

  const handleCreateClassroom = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post(`/api/classrooms/create`, {
        ...form,
        lat: parseFloat(form.lat),
        lng: parseFloat(form.lng),
        teacherId,
        teacherName
      });
      setForm({ name: '', roomNumber: '', lat: '', lng: '' });
      setShowCreateForm(false);
      fetchClassrooms();
      alert('Classroom created successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating classroom.');
    }
  };

  const handleToggleSession = async (classroomId) => {
    try {
      const res = await api.post(`/api/classrooms/toggle/${classroomId}`);
      fetchClassrooms();
      if (selectedClassroom?._id === classroomId) {
        setSelectedClassroom(prev => ({ ...prev, isSessionActive: res.data.isSessionActive }));
      }
    } catch (err) {
      alert('Error toggling session.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="dashboard-container">
      <div className="instructor-header">
        <div>
          <h1>Teacher Dashboard</h1>
          <p>Welcome, <strong>{teacherName}</strong></p>
        </div>
        <button onClick={handleLogout} style={logoutStyle}>Logout</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', margin: '20px 0' }}>
        <button className="cta-button" onClick={() => setActiveTab('classrooms')}
          style={{ width: 'auto', padding: '8px 20px', opacity: activeTab === 'classrooms' ? 1 : 0.5 }}>
          My Classrooms
        </button>
        {selectedClassroom && (
          <button className="cta-button" onClick={() => setActiveTab('attendance')}
            style={{ width: 'auto', padding: '8px 20px', opacity: activeTab === 'attendance' ? 1 : 0.5 }}>
            Attendance — {selectedClassroom.name}
          </button>
        )}
      </div>

      {/* Classrooms Tab */}
      {activeTab === 'classrooms' && (
        <div>
          <button className="cta-button" onClick={() => setShowCreateForm(!showCreateForm)}
            style={{ width: 'auto', padding: '10px 24px', marginBottom: '20px' }}>
            {showCreateForm ? 'Cancel' : '+ Create Classroom'}
          </button>

          {/* Create Form */}
          {showCreateForm && (
            <div className="geo-card" style={{ marginBottom: '20px' }}>
              <h3>Create New Classroom</h3>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <form onSubmit={handleCreateClassroom}>
                <div className="form-group">
                  <label>Class Name</label>
                  <input type="text" placeholder="e.g., Data Structures" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Room Number</label>
                  <input type="text" placeholder="e.g., LH-301" value={form.roomNumber}
                    onChange={e => setForm({ ...form, roomNumber: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Classroom Latitude</label>
                  <input type="number" step="any" placeholder="e.g., 13.0827" value={form.lat}
                    onChange={e => setForm({ ...form, lat: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Classroom Longitude</label>
                  <input type="number" step="any" placeholder="e.g., 80.2707" value={form.lng}
                    onChange={e => setForm({ ...form, lng: e.target.value })} />
                </div>
                <button type="submit" className="cta-button">Create Classroom</button>
              </form>
            </div>
          )}

          {/* Classroom Cards */}
          {classrooms.length === 0 ? (
            <p>No classrooms yet. Create one above.</p>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {classrooms.map(cls => (
                <div key={cls._id} className="geo-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ margin: 0 }}>{cls.name}</h3>
                      <p style={{ margin: '4px 0', color: '#888' }}>Room: {cls.roomNumber}</p>
                      <p style={{ margin: '4px 0' }}>
                        Join Code: <strong style={{ fontSize: '20px', letterSpacing: '3px', color: '#4CAF50' }}>{cls.code}</strong>
                      </p>
                      <p style={{ margin: '4px 0', fontSize: '13px', color: '#888' }}>
                        {cls.students.length} student(s) enrolled
                      </p>
                      <p style={{ margin: '4px 0', fontSize: '13px', color: '#888' }}>
                        Location: {cls.lat}, {cls.lng}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span style={{
                        padding: '4px 12px', borderRadius: '12px', fontSize: '13px',
                        background: cls.isSessionActive ? '#d4edda' : '#f8d7da',
                        color: cls.isSessionActive ? '#155724' : '#721c24'
                      }}>
                        {cls.isSessionActive ? 'Session Open' : 'Session Closed'}
                      </span>
                      <button className="cta-button"
                        onClick={() => handleToggleSession(cls._id)}
                        style={{ padding: '6px 12px', fontSize: '13px' }}>
                        {cls.isSessionActive ? 'Close Session' : 'Open Session'}
                      </button>
                      <button className="cta-button"
                        onClick={() => { setSelectedClassroom(cls); setActiveTab('attendance'); }}
                        style={{ padding: '6px 12px', fontSize: '13px', background: '#555' }}>
                        View Attendance
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Attendance Tab */}
      {activeTab === 'attendance' && selectedClassroom && (
        <div>
          <h3>Attendance — {selectedClassroom.name} ({selectedClassroom.roomNumber})</h3>
          {attendanceLogs.length === 0 ? (
            <p>No attendance records yet.</p>
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
                {attendanceLogs.map(log => (
                  <tr key={log._id}>
                    <td style={td}>{log.studentId}</td>
                    <td style={td}>{log.name}</td>
                    <td style={td}><span style={{ color: 'green' }}>{log.status}</span></td>
                    <td style={td}>{log.distanceAtCheckIn}</td>
                    <td style={td}>{new Date(log.createdAt).toLocaleTimeString()}</td>
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
const logoutStyle = { background: 'transparent', border: '1px solid #ccc', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer',
  color: 'white',     
  fontSize: '14px' };

export default TeacherDashboard;