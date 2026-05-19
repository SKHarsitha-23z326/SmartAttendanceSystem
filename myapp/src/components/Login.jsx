import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  // useState tracking inputs
  const [credentials, setCredentials] = useState({ id: '', password: '', role: 'student' });
  const navigate = useNavigate();

  // Getting Input handler dynamically for all fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!credentials.id || !credentials.password) {
      alert('Please fill out all fields.');
      return;
    }

    // Store fake login state in browser storage
    localStorage.setItem('userRole', credentials.role);
    localStorage.setItem('userId', credentials.id);

    // React Router routing based on user choices
    if (credentials.role === 'teacher') {
      navigate('/teacher');
    } else {
      navigate('/student');
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
          <input 
            type="text" 
            name="id" 
            placeholder="e.g., 23Z326" 
            value={credentials.id} 
            onChange={handleChange} 
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            name="password" 
            placeholder="••••••••" 
            value={credentials.password} 
            onChange={handleChange} 
          />
        </div>

        <button type="submit" className="cta-button">Access Dashboard</button>
      </form>
    </div>
  );
}

export default Login;