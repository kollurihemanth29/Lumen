import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUserContext } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');
    const userStr = urlParams.get('user');
    const redirectUrl = urlParams.get('redirect');

    if (token && userStr) {
      try {
        const userData = JSON.parse(decodeURIComponent(userStr));
        
        // Store authentication data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Update auth context
        setUserContext(userData, token);
        
        // Use provided redirect URL or fallback to role-based routing
        setTimeout(() => {
          if (redirectUrl) {
            const decodedRedirectUrl = decodeURIComponent(redirectUrl);
            // Extract path from full URL
            const urlPath = decodedRedirectUrl.replace(window.location.origin, '');
            navigate(urlPath, { replace: true });
          } else {
            // Fallback to role-based routing
            switch (userData.role.toLowerCase()) {
              case 'admin':
                navigate('/admin/dashboard', { replace: true });
                break;
              case 'manager':
                navigate('/manager/dashboard', { replace: true });
                break;
              case 'staff':
                navigate('/staff/dashboard', { replace: true });
                break;
              default:
                navigate('/dashboard', { replace: true });
            }
          }
        }, 2000);
        
      } catch (error) {
        console.error('Error parsing user data:', error);
        // setError('Authentication data error. Please try logging in again.');
        setTimeout(() => navigate('/login', { replace: true }), 3000);
      }
    } else {
      // setError('Missing authentication data. Please try logging in again.');
      setTimeout(() => navigate('/login', { replace: true }), 3000);
    }
  }, [location.search, setUserContext, navigate]);

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{background: 'linear-gradient(135deg, #0a0a0f, #1a1a2e)'}}>
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status" style={{width: '3rem', height: '3rem'}}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <h4 className="text-white mb-2">Completing Sign In...</h4>
        <p className="text-light opacity-75">Please wait while we redirect you to your dashboard.</p>
      </div>
    </div>
  );
};

export default OAuthSuccess;
