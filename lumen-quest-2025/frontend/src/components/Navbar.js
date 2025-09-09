import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
          {/* Spacer to push content to the right */}
          <div className="flex-grow-1"></div>
          
          {/* Right side navigation and profile */}
          <div className="d-flex align-items-center gap-2">
            <ul className="navbar-nav d-flex flex-row">
              {user.role === 'admin' && (
                <>
                  <li className="nav-item">
                    <button 
                      className="nav-link text-white px-3 py-2 btn btn-link border-0 fw-medium"
                      onClick={handleCreateUser}
                    >
                      Create User
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className="nav-link text-white px-3 py-2 btn btn-link border-0 fw-medium"
                      onClick={handleManageUsers}
                    >
                      Manage Users
                    </button>
                  </li>
                </>
              )}
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
