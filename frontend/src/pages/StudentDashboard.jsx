import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { studentAPI, assessmentAPI } from '../services/api';
import './StudentDashboard.css';

function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    assessmentsCompleted: 0,
    dsaTopicsCompleted: 0,
    averageScore: 0,
  });
  const [recentAssessments, setRecentAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, progressRes, assessmentsRes] = await Promise.all([
        studentAPI.getProfile(),
        studentAPI.getProgress(),
        assessmentAPI.getAll(),
      ]);

      setProfile(profileRes.data);
      
      const attempts = progressRes.data.assessmentAttempts || [];
      const dsaProgress = progressRes.data.dsaProgress || [];
      
      setStats({
        assessmentsCompleted: attempts.length,
        dsaTopicsCompleted: dsaProgress.filter(p => p.status === 'completed').length,
        averageScore: attempts.length > 0
          ? Math.round(attempts.reduce((sum, a) => sum + (a.score / a.totalPoints * 100), 0) / attempts.length)
          : 0,
      });

      setRecentAssessments(assessmentsRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Student Dashboard">
      <div className="student-dashboard">
        <div className="welcome-section">
          <h1>Welcome back, {profile?.name}!</h1>
          <p>College: {profile?.college?.name}</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Assessments Completed</h3>
            <p className="stat-value">{stats.assessmentsCompleted}</p>
          </div>
          <div className="stat-card">
            <h3>DSA Topics Completed</h3>
            <p className="stat-value">{stats.dsaTopicsCompleted}</p>
          </div>
          <div className="stat-card">
            <h3>Average Score</h3>
            <p className="stat-value">{stats.averageScore}%</p>
          </div>
        </div>

        <div className="quick-actions">
          <Link to="/student/assessments" className="action-card">
            <h3>📝 Take Assessment</h3>
            <p>Start a new assessment</p>
          </Link>
          <Link to="/student/dsa-roadmap" className="action-card">
            <h3>🗺️ DSA Roadmap</h3>
            <p>Continue your learning journey</p>
          </Link>
          <Link to="/student/progress" className="action-card">
            <h3>📊 View Progress</h3>
            <p>Check your detailed progress</p>
          </Link>
        </div>

        <div className="recent-assessments">
          <h2>Available Assessments</h2>
          {recentAssessments.length === 0 ? (
            <p>No assessments available yet.</p>
          ) : (
            <div className="assessments-list">
              {recentAssessments.map((assessment) => (
                <div key={assessment.id} className="assessment-item">
                  <div>
                    <h4>{assessment.title}</h4>
                    <p>{assessment.description || 'No description'}</p>
                    <small>{assessment._count.questions} questions</small>
                  </div>
                  <Link
                    to={`/student/assessments/${assessment.id}/attempt`}
                    className="btn btn-primary"
                  >
                    Take Assessment
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default StudentDashboard;

