import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for OAuth error parameters
    const urlParams = new URLSearchParams(location.search);
    const oauthError = urlParams.get('error');
    
    if (oauthError) {
      switch (oauthError) {
        case 'unauthorized':
          navigate('/not-authorized', { replace: true });
          break;
        case 'oauth_failed':
          setError('Google authentication failed. Please try again.');
          break;
        case 'server_error':
          setError('Server error during authentication. Please try again.');
          break;
        case 'oauth_parse_error':
          setError('Authentication data error. Please try again.');
          break;
        case 'oauth_missing_data':
          setError('Missing authentication data. Please try again.');
          break;
        default:
          setError('Authentication error. Please try again.');
      }
    }
  }, [location.search, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Redirect based on user role
        const role = result.user.role.toLowerCase();
        let redirectPath;
        
        switch (role) {
          case 'admin':
            redirectPath = '/admin/dashboard';
            break;
          case 'manager':
            redirectPath = '/manager/dashboard';
            break;
          case 'staff':
            redirectPath = '/staff/dashboard';
            break;
          default:
            redirectPath = '/dashboard';
        }
        
        navigate(redirectPath, { replace: true });
      } else {
        setError(result.message || 'Login failed');
        setLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Professional Animated Background */}
      <div className="login-bg-system">
        <div className="login-gradient-waves"></div>
        <div className="circuit-board">
          <div className="circuit-node circuit-node-1"></div>
          <div className="circuit-node circuit-node-2"></div>
          <div className="circuit-node circuit-node-3"></div>
          <div className="circuit-node circuit-node-4"></div>
          <div className="circuit-line circuit-line-1"></div>
          <div className="circuit-line circuit-line-2"></div>
          <div className="circuit-line circuit-line-3"></div>
        </div>
        <div className="holographic-grid"></div>
      </div>

      <div className="login-layout">
        {/* Left Side - Branding */}
        <div className="login-brand-section">
          <div className="brand-content">
            <div className="brand-logo">
              <div className="logo-icon">
                <i className="bi bi-lightning-charge-fill"></i>
              </div>
              <h1 className="brand-title">LUMEN QUEST</h1>
              <div className="brand-tagline">Advanced Telecom Operations</div>
            </div>
            
            <div className="brand-features">
              <div className="feature-item">
                <i className="bi bi-shield-check"></i>
                <span>Enterprise Security</span>
              </div>
              <div className="feature-item">
                <i className="bi bi-graph-up"></i>
                <span>Real-time Analytics</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-cloud"></i>
                <span>Cloud-native architecture</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-mobile-alt"></i>
                <span>Mobile-first design</span>
              </div>
            </div>

            <div className="brand-stats">
              <div className="stat">
                <div className="stat-number">99.9%</div>
                <div className="stat-label">Uptime</div>
              </div>
              <div className="stat">
                <div className="stat-number">500K+</div>
                <div className="stat-label">Assets</div>
              </div>
              <div className="stat">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="login-form-section">
          <div className="form-container">
            <div className="form-header">
              <h2 className="form-title">Welcome Back</h2>
              <p className="form-subtitle">Sign in to access your dashboard</p>
            </div>

            {error && (
              <div className="error-message">
                <i className="fas fa-exclamation-triangle"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  id="password"
                  className="form-input"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  placeholder="Enter your password"
                />
              </div>


              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt"></i>
                    Sign In
                  </>
                )}
              </button>

              {/* OAuth Divider */}
              <div className="oauth-divider">
                <span>or</span>
              </div>

              {/* Google OAuth Button */}
              <button 
                type="button" 
                className="google-oauth-btn"
                onClick={() => window.location.href = 'http://localhost:5000/api/auth/google'}
                disabled={loading}
              >
                <svg className="google-icon" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
