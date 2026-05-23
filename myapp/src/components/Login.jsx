import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [credentials, setCredentials] = useState({ id: '', password: '', role: 'student' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.id || !credentials.password) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      // Live API Call to Backend
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        id: credentials.id,
        password: credentials.password
      });

      const { user } = response.data;

      // Verify that the chosen form role matches their database designation
      if (user.role !== credentials.role) {
        alert(`Access Denied: Specified ID is registered as a ${user.role}.`);
        return;
      }

      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userName', user.name);

      if (user.role === 'teacher') {
        navigate('/teacher');
      } else {
        navigate('/student');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Authentication failed. Connection refused.');
    }
  };

  return (
    <div className="auth-card">
      <h2>Sign In to Portal</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select User Role</label>
          <select name="role" value={credentials.role} onChange={handleChange}>
            <option value="student">Student</option>
            <option value="teacher">Teacher / Professor</option>
          </select>
        </div>

        <div className="form-group">
          <label>Identification Number</label>
          <input type="text" name="id" placeholder="e.g., 23Z326" value={credentials.id} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" placeholder="••••••••" value={credentials.password} onChange={handleChange} />
        </div>

        <button type="submit" className="cta-button">Access Dashboard</button>
      </form>
    </div>
  );
}

export default Login;