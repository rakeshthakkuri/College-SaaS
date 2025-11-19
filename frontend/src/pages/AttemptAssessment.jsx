import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { assessmentAPI } from '../services/api';
import './AttemptAssessment.css';

function AttemptAssessment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssessment();
  }, [id]);

  const fetchAssessment = async () => {
    try {
      const response = await assessmentAPI.getById(id);
      setAssessment(response.data);
      
      // Initialize answers object
      const initialAnswers = {};
      response.data.questions.forEach((q) => {
        initialAnswers[q.id] = '';
      });
      setAnswers(initialAnswers);
    } catch (error) {
      console.error('Error fetching assessment:', error);
      alert('Failed to load assessment');
      navigate('/student/assessments');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!window.confirm('Are you sure you want to submit? You cannot change your answers after submission.')) {
      return;
    }

    // Check if all questions are answered
    const unanswered = Object.values(answers).some((a) => !a);
    if (unanswered && !window.confirm('You have unanswered questions. Submit anyway?')) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await assessmentAPI.attempt(id, answers);
      alert(`Assessment submitted! Your score: ${response.data.score}/${response.data.totalPoints} (${response.data.percentage}%)`);
      navigate('/student/assessments');
    } catch (error) {
      console.error('Error submitting assessment:', error);
      alert(error.response?.data?.error || 'Failed to submit assessment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading">Loading assessment...</div>
      </DashboardLayout>
    );
  }

  if (!assessment) {
    return (
      <DashboardLayout>
        <div className="error">Assessment not found</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Take Assessment">
      <div className="attempt-assessment">
        <div className="assessment-header">
          <h1>{assessment.title}</h1>
          <p>{assessment.description || 'No description'}</p>
          <p className="question-count">
            {assessment.questions.length} question{assessment.questions.length !== 1 ? 's' : ''}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="questions-list">
            {assessment.questions.map((question, index) => (
              <div key={question.id} className="question-card">
                <div className="question-header">
                  <span className="question-number">Question {index + 1}</span>
                  <span className="question-points">{question.points} point{question.points !== 1 ? 's' : ''}</span>
                </div>
                <h3 className="question-text">{question.question}</h3>
                <div className="options-list">
                  {['A', 'B', 'C', 'D'].map((option) => (
                    <label key={option} className="option-label">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      />
                      <span className="option-letter">{option}.</span>
                      <span className="option-text">{question[`option${option}`]}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="submit-section">
            <button
              type="submit"
              className="btn btn-primary btn-large"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Assessment'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default AttemptAssessment;

