import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="container">
          <div className="nav-content">
            <h1 className="logo">College SaaS</h1>
            <div className="nav-links">
              <Link to="/student/login" className="btn btn-secondary">Student Login</Link>
              <Link to="/admin/login" className="btn btn-primary">Admin Login</Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Empower Your College Learning Journey</h1>
            <p className="hero-subtitle">
              A comprehensive platform for assessments, DSA roadmaps, and progress tracking
            </p>
            <div className="hero-buttons">
              <Link to="/student/signup" className="btn btn-primary btn-large">
                Get Started as Student
              </Link>
              <Link to="/admin/login" className="btn btn-secondary btn-large">
                Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>📝 Assessments</h3>
              <p>Take MCQ-based assessments and track your performance</p>
            </div>
            <div className="feature-card">
              <h3>🗺️ DSA Roadmap</h3>
              <p>Follow a structured learning path for Data Structures and Algorithms</p>
            </div>
            <div className="feature-card">
              <h3>📊 Progress Tracking</h3>
              <p>Monitor your learning progress with detailed analytics</p>
            </div>
            <div className="feature-card">
              <h3>🏫 College Workspace</h3>
              <p>Each college has its own dedicated workspace</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;

