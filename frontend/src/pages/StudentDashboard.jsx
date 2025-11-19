import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout, Card, Button, LoadingSpinner, EmptyState, Badge, Skeleton } from '../components';
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
      <DashboardLayout title="Student Dashboard">
        <div className="student-dashboard">
          <Skeleton variant="title" width="40%" height={32} className="mb-lg" />
          <Skeleton variant="text" lines={2} className="mb-xl" />
          <div className="stats-grid">
            {[1, 2, 3].map(i => (
              <Card key={i} padding="large">
                <Skeleton variant="text" width="60%" className="mb-md" />
                <Skeleton variant="title" width="40%" height={40} />
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Student Dashboard">
      <div className="student-dashboard">
        <div className="welcome-section">
          <h1 className="welcome-title">Welcome back, {profile?.name}! 👋</h1>
          <p className="welcome-subtitle">College: {profile?.college?.name}</p>
        </div>

        <div className="stats-grid">
          <Card hover padding="large" className="stat-card">
            <div className="stat-icon">📝</div>
            <h3 className="stat-label">Assessments Completed</h3>
            <p className="stat-value">{stats.assessmentsCompleted}</p>
          </Card>
          <Card hover padding="large" className="stat-card">
            <div className="stat-icon">✅</div>
            <h3 className="stat-label">DSA Topics Completed</h3>
            <p className="stat-value">{stats.dsaTopicsCompleted}</p>
          </Card>
          <Card hover padding="large" className="stat-card">
            <div className="stat-icon">📊</div>
            <h3 className="stat-label">Average Score</h3>
            <p className="stat-value">{stats.averageScore}%</p>
          </Card>
        </div>

        <div className="quick-actions">
          <Card hover padding="large" className="action-card" onClick={() => window.location.href = '/student/assessments'}>
            <div className="action-icon">📝</div>
            <h3>Take Assessment</h3>
            <p>Start a new assessment</p>
          </Card>
          <Card hover padding="large" className="action-card" onClick={() => window.location.href = '/student/dsa-roadmap'}>
            <div className="action-icon">🗺️</div>
            <h3>DSA Roadmap</h3>
            <p>Continue your learning journey</p>
          </Card>
          <Card hover padding="large" className="action-card" onClick={() => window.location.href = '/student/progress'}>
            <div className="action-icon">📊</div>
            <h3>View Progress</h3>
            <p>Check your detailed progress</p>
          </Card>
        </div>

        <div className="recent-assessments">
          <h2 className="section-title">Available Assessments</h2>
          {recentAssessments.length === 0 ? (
            <EmptyState
              icon="📋"
              title="No assessments available"
              description="There are no assessments available at the moment. Check back later!"
            />
          ) : (
            <div className="assessments-list">
              {recentAssessments.map((assessment) => (
                <Card key={assessment.id} hover padding="large" className="assessment-item">
                  <div className="assessment-content">
                    <div className="assessment-header">
                      <h4 className="assessment-title">{assessment.title}</h4>
                      <Badge variant="primary">{assessment._count.questions} questions</Badge>
                    </div>
                    <p className="assessment-description">{assessment.description || 'No description available'}</p>
                  </div>
                  <Button
                    as={Link}
                    to={`/student/assessments/${assessment.id}/attempt`}
                    variant="primary"
                  >
                    Take Assessment
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default StudentDashboard;

