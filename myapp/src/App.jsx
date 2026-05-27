import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-shell">
        <Navbar />
        <main className="content-area">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/teacher" element={<TeacherDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;