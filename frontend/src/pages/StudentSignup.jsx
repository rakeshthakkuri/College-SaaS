import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI, collegeAPI } from '../services/api';
import { Input, Button, Alert, LoadingSpinner } from '../components';
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
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join your college's learning platform</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
          />

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            placeholder="Create a password (min. 6 characters)"
            helperText="Password must be at least 6 characters long"
          />

          <div className="form-group">
            <label className="input-label">
              College <span className="input-required">*</span>
            </label>
            {loadingColleges ? (
              <div className="input" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LoadingSpinner size="small" />
                <span>Loading colleges...</span>
              </div>
            ) : error ? (
              <div>
                <select className="input input-error" disabled>
                  <option>Error loading colleges</option>
                </select>
                <Alert variant="error" className="mt-sm">
                  {error}
                </Alert>
                <Button 
                  type="button"
                  onClick={fetchColleges}
                  variant="secondary"
                  size="small"
                  className="mt-sm"
                >
                  Retry
                </Button>
              </div>
            ) : colleges.length === 0 ? (
              <div>
                <select className="input" disabled>
                  <option>No colleges available</option>
                </select>
                <Alert variant="warning" className="mt-sm">
                  Please contact your administrator to register your college.
                </Alert>
              </div>
            ) : (
              <select
                className="input"
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

          {error && !error.includes('colleges') && (
            <Alert variant="error">{error}</Alert>
          )}

          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            loading={loading}
            size="large"
            className="mt-lg"
          >
            Create Account
          </Button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/student/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default StudentSignup;

