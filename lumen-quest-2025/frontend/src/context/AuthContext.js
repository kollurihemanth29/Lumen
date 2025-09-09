import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const verifyToken = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/profile');
      const userData = response.data.data.user;
      setUser(userData);
      setLoading(false);
      return { success: true, user: userData };
    } catch (error) {
      console.error('Token verification error:', error);
      // Clear invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      setLoading(false);
      throw error;
    }
  }, []);

  // Set up axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Only verify token if we don't already have user data
      if (!user) {
        verifyToken();
      } else {
        setLoading(false);
      }
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setLoading(false);
    }
  }, [token, user, verifyToken]);

  const login = async (email, password) => {
    try {
      console.log('Login attempt:', { email, password: password ? '***' : 'missing' });
      
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      console.log('Login response:', response.data);
      
      const { user: userData, token: userToken } = response.data.data;
      
      // Save token and user info in localStorage
      setUser(userData);
      setToken(userToken);
      localStorage.setItem('token', userToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, message };
    }
  };

  // Public registration removed - only admins can create users
  const register = async (userData) => {
    return { 
      success: false, 
      message: 'Public registration is disabled. Contact your administrator to create an account.' 
    };
  };

  // Function to set user context directly (for OAuth)
  const setUserContext = useCallback((userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
  }, []);

  const logout = () => {
    setUser(null);
    setToken(null);
    // Clear all localStorage data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put('http://localhost:5000/api/auth/profile', profileData);
      setUser(response.data.data.user);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      return { success: false, message };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await axios.put('http://localhost:5000/api/auth/change-password', {
        currentPassword,
        newPassword
      });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Password change failed';
      return { success: false, message };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    verifyToken,
    updateProfile,
    setUserContext,
    changePassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isManager: user?.role === 'manager',
    isStaff: user?.role === 'staff'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
