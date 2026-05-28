import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import api from '../utils/api';

const API = 'https://smart-attendance-system-b4s4.vercel.app';

function Login() {
  const [credentials, setCredentials] = useState({ id: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!credentials.id || !credentials.password) {
      setError('Please fill out all fields.');
      return;
    }

    try {
      const response = await api.post('/api/auth/login', {
  rollNo: credentials.id,
  password: credentials.password
});

      const { user, token } = response.data;

      if (user.role !== credentials.role) {
        setError(`Access Denied: This ID is registered as a ${user.role}.`);
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userName', user.name);

      if (user.role === 'teacher') {
        navigate('/student');
      } else {
        navigate('/teacher');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed.');
    }
  };

  return (
    <div className="auth-card">
      <h2>Sign In to Portal</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select User Role</label>
          <select name="role" value={credentials.role} onChange={handleChange}>
            <option value="student">Student</option>
            <option value="teacher">Teacher / Professor</option>
          </select>
        </div>
        <div className="form-group">
          <label>Roll Number</label>
          <input type="text" name="id" placeholder="e.g., 23Z326" value={credentials.id} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" placeholder="••••••••" value={credentials.password} onChange={handleChange} />
        </div>
        <button type="submit" className="cta-button">Access Dashboard</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '16px' }}>
        No account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;