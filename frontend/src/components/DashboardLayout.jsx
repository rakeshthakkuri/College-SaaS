import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './DashboardLayout.css';

function DashboardLayout({ children, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isStudent = user?.role === 'STUDENT';
  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="dashboard-layout">
      <nav className="dashboard-nav">
        <div className="container">
          <div className="nav-content">
            <h2 className="nav-title">{title || 'Dashboard'}</h2>
            <div className="nav-items">
              {isStudent && (
                <>
                  <Link to="/student/dashboard">Dashboard</Link>
                  <Link to="/student/dsa-roadmap">DSA Roadmap</Link>
                  <Link to="/student/assessments">Assessments</Link>
                  <Link to="/student/progress">Progress</Link>
                </>
              )}
              {isAdmin && (
                <>
                  <Link to="/admin/dashboard">Dashboard</Link>
                  <Link to="/admin/students">Students</Link>
                  <Link to="/admin/assessments">Assessments</Link>
                  <Link to="/admin/admins">Admins</Link>
                </>
              )}
              <div className="user-info">
                <span>{user?.name}</span>
                <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="dashboard-main">
        <div className="container">
          {children}
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;

