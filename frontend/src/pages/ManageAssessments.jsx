import { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { assessmentAPI } from '../services/api';
import './ManageAssessments.css';

function ManageAssessments() {
  const [assessments, setAssessments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    questions: [{ question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A', points: 1 }],
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const response = await assessmentAPI.getAll();
      setAssessments(response.data);
    } catch (error) {
      console.error('Error fetching assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[index][field] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        { question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A', points: 1 },
      ],
    });
  };

  const removeQuestion = (index) => {
    if (formData.questions.length > 1) {
      const newQuestions = formData.questions.filter((_, i) => i !== index);
      setFormData({ ...formData, questions: newQuestions });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingAssessment) {
        await assessmentAPI.update(editingAssessment.id, {
          title: formData.title,
          description: formData.description,
        });
      } else {
        await assessmentAPI.create(formData);
      }
      resetForm();
      fetchAssessments();
      alert(editingAssessment ? 'Assessment updated!' : 'Assessment created!');
    } catch (error) {
      console.error('Error saving assessment:', error);
      alert(error.response?.data?.error || 'Failed to save assessment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assessment?')) {
      return;
    }

    try {
      await assessmentAPI.delete(id);
      fetchAssessments();
      alert('Assessment deleted!');
    } catch (error) {
      console.error('Error deleting assessment:', error);
      alert('Failed to delete assessment');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      questions: [{ question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A', points: 1 }],
    });
    setShowForm(false);
    setEditingAssessment(null);
  };

  const startEdit = (assessment) => {
    setEditingAssessment(assessment);
    setFormData({
      title: assessment.title,
      description: assessment.description || '',
      questions: [{ question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A', points: 1 }],
    });
    setShowForm(true);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Manage Assessments">
      <div className="manage-assessments">
        <div className="page-header">
          <h1>Manage Assessments</h1>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="btn btn-primary"
          >
            + Create Assessment
          </button>
        </div>

        {showForm && (
          <div className="assessment-form-container">
            <div className="card">
              <h2>{editingAssessment ? 'Edit Assessment' : 'Create New Assessment'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                {!editingAssessment && (
                  <div className="questions-section">
                    <div className="section-header">
                      <h3>Questions *</h3>
                      <button type="button" onClick={addQuestion} className="btn btn-secondary btn-sm">
                        + Add Question
                      </button>
                    </div>

                    {formData.questions.map((q, index) => (
                      <div key={index} className="question-form">
                        <div className="question-header">
                          <h4>Question {index + 1}</h4>
                          {formData.questions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeQuestion(index)}
                              className="btn btn-danger btn-sm"
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        <div className="form-group">
                          <label>Question *</label>
                          <textarea
                            value={q.question}
                            onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                            required
                          />
                        </div>

                        <div className="options-grid">
                          <div className="form-group">
                            <label>Option A *</label>
                            <input
                              type="text"
                              value={q.optionA}
                              onChange={(e) => handleQuestionChange(index, 'optionA', e.target.value)}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label>Option B *</label>
                            <input
                              type="text"
                              value={q.optionB}
                              onChange={(e) => handleQuestionChange(index, 'optionB', e.target.value)}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label>Option C *</label>
                            <input
                              type="text"
                              value={q.optionC}
                              onChange={(e) => handleQuestionChange(index, 'optionC', e.target.value)}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label>Option D *</label>
                            <input
                              type="text"
                              value={q.optionD}
                              onChange={(e) => handleQuestionChange(index, 'optionD', e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="question-meta">
                          <div className="form-group">
                            <label>Correct Answer *</label>
                            <select
                              value={q.correctAnswer}
                              onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
                              required
                            >
                              <option value="A">A</option>
                              <option value="B">B</option>
                              <option value="C">C</option>
                              <option value="D">D</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label>Points</label>
                            <input
                              type="number"
                              min="1"
                              value={q.points}
                              onChange={(e) => handleQuestionChange(index, 'points', parseInt(e.target.value))}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Saving...' : editingAssessment ? 'Update' : 'Create'}
                  </button>
                  <button type="button" onClick={resetForm} className="btn btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="assessments-list">
          {assessments.length === 0 ? (
            <div className="empty-state">
              <p>No assessments created yet. Create your first assessment!</p>
            </div>
          ) : (
            assessments.map((assessment) => (
              <div key={assessment.id} className="assessment-card">
                <div className="assessment-info">
                  <h3>{assessment.title}</h3>
                  <p>{assessment.description || 'No description'}</p>
                  <div className="assessment-meta">
                    <span>📝 {assessment._count.questions} questions</span>
                    <span>👥 {assessment._count.attempts} attempts</span>
                  </div>
                </div>
                <div className="assessment-actions">
                  <button
                    onClick={() => startEdit(assessment)}
                    className="btn btn-secondary btn-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(assessment.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ManageAssessments;

