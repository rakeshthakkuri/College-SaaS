import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { assessmentAPI, studentAPI } from '../services/api';
import './Assessments.css';

function Assessments() {
  const [assessments, setAssessments] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assessmentsRes, progressRes] = await Promise.all([
        assessmentAPI.getAll(),
        studentAPI.getProgress(),
      ]);

      setAssessments(assessmentsRes.data);
      setAttempts(progressRes.data.assessmentAttempts || []);
    } catch (error) {
      console.error('Error fetching assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAttemptForAssessment = (assessmentId) => {
    return attempts.find((a) => a.assessmentId === assessmentId);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Assessments">
      <div className="assessments-page">
        <h1>Available Assessments</h1>
        <p className="page-description">
          Take assessments to test your knowledge and track your progress.
        </p>

        {assessments.length === 0 ? (
          <div className="empty-state">
            <p>No assessments available yet. Check back later!</p>
          </div>
        ) : (
          <div className="assessments-list">
            {assessments.map((assessment) => {
              const attempt = getAttemptForAssessment(assessment.id);
              const score = attempt
                ? Math.round((attempt.score / attempt.totalPoints) * 100)
                : null;

              return (
                <div key={assessment.id} className="assessment-card">
                  <div className="assessment-info">
                    <h3>{assessment.title}</h3>
                    <p>{assessment.description || 'No description provided'}</p>
                    <div className="assessment-meta">
                      <span>📝 {assessment._count.questions} questions</span>
                      {attempt && (
                        <span className="score-badge">
                          Score: {score}% ({attempt.score}/{attempt.totalPoints})
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="assessment-actions">
                    {attempt ? (
                      <div className="attempted-info">
                        <p>Completed on {new Date(attempt.completedAt).toLocaleDateString()}</p>
                        <Link
                          to={`/student/assessments/${assessment.id}/attempt`}
                          className="btn btn-secondary"
                        >
                          Retake
                        </Link>
                      </div>
                    ) : (
                      <Link
                        to={`/student/assessments/${assessment.id}/attempt`}
                        className="btn btn-primary"
                      >
                        Take Assessment
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Assessments;

