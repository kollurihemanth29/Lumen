import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import '../styles/Profile.css';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    employeeId: '',
    role: ''
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        department: user.department || '',
        employeeId: user.employeeId || '',
        role: user.role || ''
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
    setMessage('');
    setError('');
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
    setMessage('');
    setError('');
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const result = await updateProfile(profileData);
      if (result.success) {
        setMessage('Profile updated successfully!');
      } else {
        setError(result.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);
      if (result.success) {
        setMessage('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setError(result.message || 'Failed to change password');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'badge bg-danger';
      case 'manager': return 'badge bg-warning text-dark';
      case 'staff': return 'badge bg-primary';
      default: return 'badge bg-secondary';
    }
  };

  const getDepartmentIcon = (department) => {
    switch (department?.toLowerCase()) {
      case 'inventory': return '📦';
      case 'sales': return '💼';
      case 'procurement': return '🛒';
      case 'technical': return '🔧';
      case 'finance': return '💰';
      default: return '🏢';
    }
  };

  if (!user) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Navbar />
      
      <div className="container-fluid py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-8">
            
            {/* Profile Header */}
            <div className="profile-header mb-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <div className="d-flex align-items-center">
                    <div className="profile-avatar me-3">
                      <div className="avatar-circle">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    </div>
                    <div>
                      <h2 className="mb-1">{user.name}</h2>
                      <p className="text-muted mb-1">{user.email}</p>
                      <div className="d-flex align-items-center gap-2">
                        <span className={getRoleBadgeClass(user.role)}>{user.role}</span>
                        <span className="text-muted">
                          {getDepartmentIcon(user.department)} {user.department}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 text-md-end">
                  <div className="profile-stats">
                    <div className="stat-item">
                      <small className="text-muted">Employee ID</small>
                      <div className="fw-bold">{user.employeeId}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="profile-tabs mb-4">
              <ul className="nav nav-pills nav-fill">
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                  >
                    <i className="fas fa-user me-2"></i>
                    Profile Information
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'security' ? 'active' : ''}`}
                    onClick={() => setActiveTab('security')}
                  >
                    <i className="fas fa-lock me-2"></i>
                    Security Settings
                  </button>
                </li>
              </ul>
            </div>

            {/* Alert Messages */}
            {message && (
              <div className="alert alert-success alert-dismissible fade show" role="alert">
                <i className="fas fa-check-circle me-2"></i>
                {message}
                <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
              </div>
            )}

            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <i className="fas fa-exclamation-circle me-2"></i>
                {error}
                <button type="button" className="btn-close" onClick={() => setError('')}></button>
              </div>
            )}

            {/* Tab Content */}
            <div className="profile-content">
              
              {/* Profile Information Tab */}
              {activeTab === 'profile' && (
                <div className="card profile-card">
                  <div className="card-header">
                    <h5 className="mb-0">
                      <i className="fas fa-user me-2"></i>
                      Profile Information
                    </h5>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleProfileSubmit}>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="name" className="form-label">Full Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={profileData.name}
                            onChange={handleProfileChange}
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="email" className="form-label">Email Address</label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                            required
                            disabled
                          />
                          <small className="text-muted">Email cannot be changed</small>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="phone" className="form-label">Phone Number</label>
                          <input
                            type="tel"
                            className="form-control"
                            id="phone"
                            name="phone"
                            value={profileData.phone}
                            onChange={handleProfileChange}
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="employeeId" className="form-label">Employee ID</label>
                          <input
                            type="text"
                            className="form-control"
                            id="employeeId"
                            name="employeeId"
                            value={profileData.employeeId}
                            disabled
                          />
                          <small className="text-muted">Employee ID cannot be changed</small>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="department" className="form-label">Department</label>
                          <select
                            className="form-select"
                            id="department"
                            name="department"
                            value={profileData.department}
                            onChange={handleProfileChange}
                            disabled
                          >
                            <option value="inventory">Inventory</option>
                            <option value="sales">Sales</option>
                            <option value="procurement">Procurement</option>
                            <option value="technical">Technical</option>
                            <option value="finance">Finance</option>
                          </select>
                          <small className="text-muted">Department changes require admin approval</small>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="role" className="form-label">Role</label>
                          <input
                            type="text"
                            className="form-control"
                            id="role"
                            name="role"
                            value={profileData.role}
                            disabled
                          />
                          <small className="text-muted">Role changes require admin approval</small>
                        </div>
                      </div>

                      <div className="d-flex justify-content-end">
                        <button 
                          type="submit" 
                          className="btn btn-primary"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Updating...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-save me-2"></i>
                              Update Profile
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Security Settings Tab */}
              {activeTab === 'security' && (
                <div className="card profile-card">
                  <div className="card-header">
                    <h5 className="mb-0">
                      <i className="fas fa-lock me-2"></i>
                      Change Password
                    </h5>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handlePasswordSubmit}>
                      <div className="mb-3">
                        <label htmlFor="currentPassword" className="form-label">Current Password</label>
                        <input
                          type="password"
                          className="form-control"
                          id="currentPassword"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="newPassword" className="form-label">New Password</label>
                        <input
                          type="password"
                          className="form-control"
                          id="newPassword"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          required
                          minLength="6"
                        />
                        <small className="text-muted">Password must be at least 6 characters long</small>
                      </div>

                      <div className="mb-4">
                        <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                        <input
                          type="password"
                          className="form-control"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>

                      <div className="d-flex justify-content-end">
                        <button 
                          type="submit" 
                          className="btn btn-warning"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Changing...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-key me-2"></i>
                              Change Password
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
