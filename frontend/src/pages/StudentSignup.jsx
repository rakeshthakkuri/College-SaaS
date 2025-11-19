import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI, collegeAPI } from '../services/api';
import './AuthPages.css';

function StudentSignup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    collegeName: '',
  });
  const [colleges, setColleges] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingColleges, setLoadingColleges] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const response = await collegeAPI.getAll();
      setColleges(response.data || []);
      setError(''); // Clear any previous errors
    } catch (err) {
      console.error('Error fetching colleges:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Unknown error';
      console.error('Full error details:', {
        message: errorMessage,
        status: err.response?.status,
        data: err.response?.data,
        url: err.config?.url
      });
      
      // More helpful error message
      if (err.response?.status === 0 || err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please check if the backend is running.');
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else {
        setError(`Failed to load colleges: ${errorMessage}. Please refresh the page.`);
      }
    } finally {
      setLoadingColleges(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.studentSignup(formData);
      login(response.data.token, response.data.user);
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Student Signup</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label>College</label>
            {loadingColleges ? (
              <select disabled>
                <option>Loading colleges...</option>
              </select>
            ) : error ? (
              <div>
                <select disabled>
                  <option>Error loading colleges</option>
                </select>
                <small style={{ color: '#ef4444', display: 'block', marginTop: '5px' }}>
                  {error}
                </small>
                <button 
                  type="button"
                  onClick={fetchColleges}
                  style={{ 
                    marginTop: '10px', 
                    padding: '8px 16px', 
                    background: '#0066FF', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Retry
                </button>
              </div>
            ) : colleges.length === 0 ? (
              <div>
                <select disabled>
                  <option>No colleges available</option>
                </select>
                <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
                  Please contact your administrator to register your college.
                </small>
              </div>
            ) : (
              <select
                name="collegeName"
                value={formData.collegeName}
                onChange={handleChange}
                required
              >
                <option value="">Select your college</option>
                {colleges.map((college) => (
                  <option key={college.id} value={college.name}>
                    {college.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {error && <div className="error">{error}</div>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/student/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default StudentSignup;

