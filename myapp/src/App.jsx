import React from 'react';
import './App.css';

function App() {
  return (
    <div className="landing-container">
      {/* 1. Header Element */}
      <header className="navbar">
        {/* 2. Heading 2 Element */}
        <h2>TrackIn</h2>
        {/* 3. Navigation Element */}
        <nav>
          {/* 4. Anchor/Link Elements */}
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      {/* 5. Main Element */}
      <main className="hero-section">
        {/* 6. Heading 1 Element */}
        <h1>Smart Attendance System with Geofencing</h1>
        
        {/* 7. Paragraph Element */}
        <p>
          Mark your attendance securely and instantly. Our system uses advanced 
          location tracking to verify your presence right from your classroom.
        </p>

        {/* 8. Button Element */}
        <button className="cta-button" onClick={() => alert('Redirecting to login...')}>
          Get Started
        </button>

        {/* 9. Section Element for Features */}
        <section id="features" className="features-grid">
          <div className="feature-card">
            <h3>Geofence Verification</h3>
            <p>Ensures students are physically present within the designated classroom radius.</p>
          </div>
          <div className="feature-card">
            <h3>Real-Time Analytics</h3>
            <p>Instant attendance logging and automated report sheets for professors.</p>
          </div>
        </section>

        {/* 10. Unordered List & List Item Elements */}
        <section className="info-list">
          <h3>Why Choose TrackIn?</h3>
          <ul>
            <li>Eliminates proxy attendance completely.</li>
            <li>Seamless integration with student portals.</li>
            <li>Fast, secure, and encrypted with JWT token protocols.</li>
          </ul>
        </section>
      </main>

      {/* Footer Area */}
      <footer className="footer">
        <p>&copy; 2026 TrackIn Attendance Portal. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;