import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { adminAPI } from '../services/api';
import './AdminStudentProgress.css';

function AdminStudentProgress() {
  const { studentId } = useParams();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, [studentId]);

  const fetchProgress = async () => {
    try {
      const response = await adminAPI.getStudentProgress(studentId);
      setProgress(response.data);
    } catch (error) {
      console.error('Error fetching student progress:', error);
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

  if (!progress) {
    return (
      <DashboardLayout>
        <div className="error">Student not found</div>
      </DashboardLayout>
    );
  }

  const { student, dsaProgress, assessmentAttempts } = progress;

  const averageScore =
    assessmentAttempts.length > 0
      ? Math.round(
          assessmentAttempts.reduce(
            (sum, a) => sum + (a.score / a.totalPoints) * 100,
            0
          ) / assessmentAttempts.length
        )
      : 0;

  return (
    <DashboardLayout title="Student Progress">
      <div className="admin-student-progress">
        <div className="student-header">
          <Link to="/admin/students" className="back-link">
            ← Back to Students
          </Link>
          <h1>{student.name}</h1>
          <p>{student.email}</p>
        </div>

        <div className="progress-stats">
          <div className="stat-card">
            <h3>Assessments Completed</h3>
            <p className="stat-value">{assessmentAttempts.length}</p>
          </div>
          <div className="stat-card">
            <h3>Average Score</h3>
            <p className="stat-value">{averageScore}%</p>
          </div>
          <div className="stat-card">
            <h3>DSA Topics</h3>
            <p className="stat-value">
              {dsaProgress.filter((p) => p.status === 'completed').length}/
              {dsaProgress.length}
            </p>
          </div>
        </div>

        <div className="progress-sections">
          <div className="progress-section">
            <h2>Assessment History</h2>
            {assessmentAttempts.length === 0 ? (
              <p className="empty-message">No assessments completed yet.</p>
            ) : (
              <div className="attempts-list">
                {assessmentAttempts.map((attempt) => {
                  const percentage = Math.round(
                    (attempt.score / attempt.totalPoints) * 100
                  );
                  return (
                    <div key={attempt.id} className="attempt-item">
                      <div className="attempt-info">
                        <h4>{attempt.assessment.title}</h4>
                        <p className="attempt-date">
                          {new Date(attempt.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="attempt-score">
                        <span className="score-value">{percentage}%</span>
                        <span className="score-detail">
                          {attempt.score}/{attempt.totalPoints}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="progress-section">
            <h2>DSA Roadmap Progress</h2>
            {dsaProgress.length === 0 ? (
              <p className="empty-message">No DSA progress tracked yet.</p>
            ) : (
              <div className="topics-list">
                {dsaProgress.map((topic) => (
                  <div key={topic.id} className="topic-progress-item">
                    <div className="topic-info">
                      <h4>{topic.topic}</h4>
                      <span className={`status-badge status-${topic.status}`}>
                        {topic.status === 'completed'
                          ? 'Completed'
                          : topic.status === 'in_progress'
                          ? 'In Progress'
                          : 'Not Started'}
                      </span>
                    </div>
                    <div className="progress-bar-container">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${topic.progress}%` }}
                        />
                      </div>
                      <span className="progress-text">{topic.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminStudentProgress;

