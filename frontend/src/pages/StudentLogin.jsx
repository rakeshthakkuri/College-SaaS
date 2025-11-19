import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { Input, Button, Alert } from '../components';
import './AuthPages.css';

function StudentLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.studentLogin(formData);
      login(response.data.token, response.data.user);
      navigate('/student/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: {
          url: err.config?.url,
          baseURL: err.config?.baseURL,
          method: err.config?.method
        }
      });

      if (err.response) {
        // Server responded with error
        setError(err.response.data?.error || `Login failed: ${err.response.status}`);
      } else if (err.request) {
        // Request made but no response
        setError('Cannot connect to server. Please check your internet connection and ensure the backend is running.');
      } else {
        // Error setting up request
        setError(`Login failed: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
            autoComplete="current-password"
          />

          {error && <Alert variant="error">{error}</Alert>}

          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            loading={loading}
            size="large"
            className="mt-lg"
          >
            Sign In
          </Button>
        </form>

        <p className="auth-link">
          Don't have an account? <Link to="/student/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default StudentLogin;

