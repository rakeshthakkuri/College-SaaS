import { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { studentAPI } from '../services/api';
import './ProgressOverview.css';

function ProgressOverview() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await studentAPI.getProgress();
      setProgress(response.data);
    } catch (error) {
      console.error('Error fetching progress:', error);
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

  const dsaProgress = progress?.dsaProgress || [];
  const attempts = progress?.assessmentAttempts || [];

  const completedTopics = dsaProgress.filter((p) => p.status === 'completed').length;
  const inProgressTopics = dsaProgress.filter((p) => p.status === 'in_progress').length;
  const totalTopics = dsaProgress.length;

  const averageScore =
    attempts.length > 0
      ? Math.round(
          attempts.reduce((sum, a) => sum + (a.score / a.totalPoints) * 100, 0) /
            attempts.length
        )
      : 0;

  return (
    <DashboardLayout title="Progress Overview">
      <div className="progress-overview">
        <h1>Your Progress</h1>

        <div className="progress-stats">
          <div className="stat-card">
            <h3>DSA Topics</h3>
            <p className="stat-value">
              {completedTopics}/{totalTopics} Completed
            </p>
            <p className="stat-detail">{inProgressTopics} In Progress</p>
          </div>
          <div className="stat-card">
            <h3>Assessments</h3>
            <p className="stat-value">{attempts.length} Completed</p>
            <p className="stat-detail">Average: {averageScore}%</p>
          </div>
        </div>

        <div className="progress-sections">
          <div className="progress-section">
            <h2>DSA Roadmap Progress</h2>
            {dsaProgress.length === 0 ? (
              <p className="empty-message">No progress tracked yet. Start learning!</p>
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

          <div className="progress-section">
            <h2>Assessment History</h2>
            {attempts.length === 0 ? (
              <p className="empty-message">No assessments completed yet.</p>
            ) : (
              <div className="attempts-list">
                {attempts.map((attempt) => {
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
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ProgressOverview;

