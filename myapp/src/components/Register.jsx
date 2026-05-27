import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API = 'https://smart-attendance-system-b4s4.vercel.app/';

function Register() {
  const [form, setForm] = useState({ name: '', rollNo: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.rollNo || !form.password) {
      setError('All fields are required.');
      return;
    }

    try {
      await axios.post(`${API}/api/auth/register`, form);
      alert('Registration successful! Please login.');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="auth-card">
      <h2>Create Account</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" name="name" placeholder="e.g., Harsitha S" value={form.name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Roll Number</label>
          <input type="text" name="rollNo" placeholder="e.g., 23Z326" value={form.rollNo} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Select Role</label>
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} />
        </div>
        <button type="submit" className="cta-button">Register</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '16px' }}>
        Already have an account? <Link to="/">Login here</Link>
      </p>
    </div>
  );
}

export default Register;