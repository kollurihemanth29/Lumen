import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    // Login fields
    email: '',
    password: '',
    // Registration fields
    name: '',
    confirmPassword: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    },
    preferences: {
      notifications: {
        email: true,
        sms: false,
        renewalReminders: true,
        promotionalOffers: true
      },
      autoRenew: false
    },
    primaryUsage: 'general'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { login, register } = useAuth();
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
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child, grandchild] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: grandchild ? {
            ...prev[parent][child],
            [grandchild]: type === 'checkbox' ? checked : value
          } : (type === 'checkbox' ? checked : value)
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (isRegistering) {
      if (!formData.name.trim()) {
        setError('Name is required');
        return false;
      }
      if (!formData.email.trim()) {
        setError('Email is required');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
        setError('Phone number must be 10 digits');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      if (isRegistering) {
        // Registration
        const registrationData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address,
          preferences: formData.preferences,
          usageProfile: {
            primaryUsage: formData.primaryUsage
          }
        };

        const result = await register(registrationData);
        
        if (result.success) {
          setSuccess('Registration successful! You can now sign in.');
          setIsRegistering(false);
          // Reset form to login mode
          setFormData(prev => ({
            ...prev,
            email: '',
            password: '',
            name: '',
            confirmPassword: '',
            phone: ''
          }));
        } else {
          setError(result.message || 'Registration failed');
        }
      } else {
        // Login
        const result = await login(formData.email, formData.password);
        
        if (result.success) {
          // Redirect based on user role
          const role = result.user.role.toLowerCase();
          let redirectPath;
          
          switch (role) {
            case 'admin':
              redirectPath = '/admin';
              break;
            case 'end-user':
              redirectPath = '/dashboard';
              break;
            default:
              redirectPath = '/dashboard';
          }
          
          navigate(redirectPath, { replace: true });
        } else {
          setError(result.message || 'Login failed');
        }
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err.response?.data?.message || (isRegistering ? 'Registration failed' : 'Login failed. Please check your credentials.'));
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setSuccess('');
    setFormData(prev => ({
      ...prev,
      email: '',
      password: '',
      name: '',
      confirmPassword: '',
      phone: ''
    }));
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
              <div className="brand-tagline">Broadband Subscription Management</div>
            </div>
            
            <div className="brand-features">
              <div className="feature-item">
                <i className="bi bi-wifi"></i>
                <span>Fibernet & Broadband Plans</span>
              </div>
              <div className="feature-item">
                <i className="bi bi-graph-up"></i>
                <span>Usage Analytics</span>
              </div>
              <div className="feature-item">
                <i className="bi bi-percent"></i>
                <span>Smart Discounts</span>
              </div>
              <div className="feature-item">
                <i className="bi bi-robot"></i>
                <span>AI Recommendations</span>
              </div>
            </div>

            <div className="brand-stats">
              <div className="stat">
                <div className="stat-number">99.9%</div>
                <div className="stat-label">Uptime</div>
              </div>
              <div className="stat">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Subscribers</div>
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
              <h2 className="form-title">
                {isRegistering ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="form-subtitle">
                {isRegistering ? 'Join Lumen Quest for better broadband experience' : 'Sign in to access your dashboard'}
              </p>
            </div>

            {error && (
              <div className="error-message">
                <i className="fas fa-exclamation-triangle"></i>
                {error}
              </div>
            )}

            {success && (
              <div className="success-message">
                <i className="fas fa-check-circle"></i>
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              {/* Registration Fields */}
              {isRegistering && (
                <>
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-input"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                </>
              )}

              {/* Common Fields */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-input"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder={isRegistering ? "Create a password (min 6 characters)" : "Enter your password"}
                />
              </div>

              {/* Registration Additional Fields */}
              {isRegistering && (
                <>
                  <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className="form-input"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="Confirm your password"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="form-input"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter 10-digit phone number"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="city" className="form-label">City</label>
                      <input
                        type="text"
                        id="city"
                        name="address.city"
                        className="form-input"
                        value={formData.address.city}
                        onChange={handleChange}
                        placeholder="Your city"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="state" className="form-label">State</label>
                      <input
                        type="text"
                        id="state"
                        name="address.state"
                        className="form-input"
                        value={formData.address.state}
                        onChange={handleChange}
                        placeholder="Your state"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="primaryUsage" className="form-label">Primary Internet Usage</label>
                    <select
                      id="primaryUsage"
                      name="primaryUsage"
                      className="form-input"
                      value={formData.primaryUsage}
                      onChange={handleChange}
                    >
                      <option value="general">General Browsing</option>
                      <option value="streaming">Video Streaming</option>
                      <option value="gaming">Gaming</option>
                      <option value="work">Work from Home</option>
                      <option value="business">Business</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="preferences.notifications.email"
                          checked={formData.preferences.notifications.email}
                          onChange={handleChange}
                        />
                        <span className="checkmark"></span>
                        Email notifications for offers and updates
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="preferences.notifications.renewalReminders"
                          checked={formData.preferences.notifications.renewalReminders}
                          onChange={handleChange}
                        />
                        <span className="checkmark"></span>
                        Renewal reminders
                      </label>
                    </div>
                  </div>
                </>
              )}

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    {isRegistering ? 'Creating Account...' : 'Signing In...'}
                  </>
                ) : (
                  <>
                    <i className={isRegistering ? "fas fa-user-plus" : "fas fa-sign-in-alt"}></i>
                    {isRegistering ? 'Create Account' : 'Sign In'}
                  </>
                )}
              </button>

              {/* Mode Toggle */}
              <div className="form-toggle">
                <p>
                  {isRegistering ? 'Already have an account?' : "Don't have an account?"}
                  <button 
                    type="button" 
                    className="toggle-btn"
                    onClick={toggleMode}
                    disabled={loading}
                  >
                    {isRegistering ? 'Sign In' : 'Create Account'}
                  </button>
                </p>
              </div>

              {!isRegistering && (
                <>
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
                </>
              )}
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
