import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationSystem from './NotificationSystem';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleCreateUser = () => {
    navigate('/admin/create-user');
  };

  const handleManageUsers = () => {
    navigate('/admin/manage-users');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Show different navbar for authenticated vs non-authenticated users
  if (!user) {
    // Public navbar for non-authenticated users
    return (
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid px-4">
          {/* Brand */}
          <div className="navbar-brand fw-bold">
            <span className="text-primary fs-4">LUMEN QUEST</span>
          </div>

          {/* Toggle button for mobile */}
          <button 
            className="navbar-toggler border-0" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
            style={{ boxShadow: 'none' }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navigation */}
          <div className="collapse navbar-collapse" id="navbarNav">
            {/* Center navigation */}
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <button className="nav-link text-white px-4 py-2 btn btn-link border-0 fw-medium">
                  Home
                </button>
              </li>
              <li className="nav-item">
                <button className="nav-link text-white px-4 py-2 btn btn-link border-0 fw-medium">
                  About
                </button>
              </li>
              <li className="nav-item">
                <button className="nav-link text-white px-4 py-2 btn btn-link border-0 fw-medium">
                  Features
                </button>
              </li>
              <li className="nav-item">
                <button className="nav-link text-white px-4 py-2 btn btn-link border-0 fw-medium">
                  Timeline
                </button>
              </li>
              <li className="nav-item">
                <button className="nav-link text-white px-4 py-2 btn btn-link border-0 fw-medium">
                  Sponsors
                </button>
              </li>
            </ul>

            {/* Right side - Sign In button */}
            <div className="d-flex">
              <Link to="/login" className="btn btn-primary px-4 py-2 fw-semibold rounded-pill text-decoration-none">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Authenticated user navbar
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid px-4">
        {/* Brand */}
        <div className="navbar-brand fw-bold">
          <span className="text-primary fs-4">LUMEN QUEST</span>
        </div>

        {/* Toggle button for mobile */}
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          style={{ boxShadow: 'none' }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Navigation Links */}
          <ul className="navbar-nav mx-auto">
            {user.role === 'admin' ? (
              <>
                <li className="nav-item">
                  <Link to="/admin" className="nav-link text-white px-3 py-2 fw-medium">
                    <i className="bi bi-speedometer2 me-1"></i>
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/admin/plans" className="nav-link text-white px-3 py-2 fw-medium">
                    <i className="bi bi-router me-1"></i>
                    Plans
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/admin/analytics" className="nav-link text-white px-3 py-2 fw-medium">
                    <i className="bi bi-graph-up me-1"></i>
                    Analytics
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/admin/discounts" className="nav-link text-white px-3 py-2 fw-medium">
                    <i className="bi bi-percent me-1"></i>
                    Discounts
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <button 
                    className="nav-link text-white px-3 py-2 btn btn-link border-0 fw-medium dropdown-toggle"
                    id="adminDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="bi bi-people me-1"></i>
                    Users
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <button 
                        className="dropdown-item"
                        onClick={handleCreateUser}
                      >
                        <i className="bi bi-person-plus me-2"></i>
                        Create User
                      </button>
                    </li>
                    <li>
                      <button 
                        className="dropdown-item"
                        onClick={handleManageUsers}
                      >
                        <i className="bi bi-people-fill me-2"></i>
                        Manage Users
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/dashboard" className="nav-link text-white px-3 py-2 fw-medium">
                    <i className="bi bi-house me-1"></i>
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/subscriptions" className="nav-link text-white px-3 py-2 fw-medium">
                    <i className="bi bi-router me-1"></i>
                    Subscriptions
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/usage" className="nav-link text-white px-3 py-2 fw-medium">
                    <i className="bi bi-graph-up-arrow me-1"></i>
                    Usage
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Right side navigation and profile */}
          <div className="d-flex align-items-center gap-2">
            {/* Notifications */}
            <NotificationSystem />
            
            <ul className="navbar-nav d-flex flex-row">
            </ul>

            {/* Profile */}
            <div className="dropdown">
              <button 
                className="btn btn-link text-white border-0 d-flex align-items-center p-2" 
                id="profileDropdown" 
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <div className="rounded-circle profile-avatar d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                  <i className="bi bi-person-fill text-white fs-5"></i>
                </div>
              </button>
              
              <ul className="dropdown-menu dropdown-menu-end shadow border-0" style={{ minWidth: '180px' }}>
                <li>
                  <Link to="/profile" className="dropdown-item py-2 border-0 bg-transparent w-100 text-start text-decoration-none">
                    <i className="bi bi-person me-3"></i>
                    Profile
                  </Link>
                </li>
                <li><hr className="dropdown-divider my-1" /></li>
                <li>
                  <button className="dropdown-item text-danger py-2 fw-semibold border-0 bg-transparent w-100 text-start" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-3"></i>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
