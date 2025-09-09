import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="admin-dashboard">
      {/* Shared Animated Background System */}
      <div className="bg-system">
        <div className="neon-waves"></div>
        <div className="network-mesh">
          {Array.from({length: 12}, (_, i) => (
            <div 
              key={`node-${i}`}
              className="network-node" 
              style={{
                top: `${10 + (i * 8)}%`,
                left: `${5 + (i * 7)}%`,
                animationDelay: `${i * 0.3}s`
              }}
            ></div>
          ))}
          {Array.from({length: 8}, (_, i) => (
            <div 
              key={`line-${i}`}
              className="network-line" 
              style={{
                top: `${15 + (i * 10)}%`,
                left: `${10 + (i * 8)}%`,
                width: `${80 + Math.random() * 40}px`,
                transform: `rotate(${i * 15}deg)`,
                animationDelay: `${i * 0.5}s`
              }}
            ></div>
          ))}
        </div>
        <div className="data-particles">
          {Array.from({length: 25}, (_, i) => (
            <div 
              key={`particle-${i}`}
              className="particle" 
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 15}s`
              }}
            ></div>
          ))}
        </div>
        <div className="fiber-streaks">
          <div className="fiber-streak" style={{top: '20%'}}></div>
          <div className="fiber-streak" style={{top: '50%'}}></div>
          <div className="fiber-streak" style={{top: '80%'}}></div>
        </div>
        <div className="grid-overlay"></div>
      </div>
      
      {/* Main Content */}
      <div className="container-fluid py-4">
        <div className="row justify-content-center">
          <div className="col-lg-10">
                  {/* Header */}
                  <div className="text-center mb-4">
                    <div className="admin-crown-icon mb-3">
                      <i className="bi bi-shield-check"></i>
                    </div>
                    <h1 className="text-white mb-2">Admin Dashboard</h1>
                    <p className="text-light opacity-75">Welcome back, {user?.name}</p>
                  </div>

                  {/* Overview Content */}
                  <div className="row g-4">
                    {/* Quick Actions */}
                    <div className="col-md-6">
                      <div className="card bg-dark border-primary h-100">
                        <div className="card-body text-center">
                          <div className="mb-3">
                            <i className="bi bi-person-plus-fill text-primary" style={{fontSize: '3rem'}}></i>
                          </div>
                          <h5 className="card-title text-white">Create New User</h5>
                          <p className="card-text text-light opacity-75">
                            Add new users to the system with role assignments
                          </p>
                          <a href="/admin/create-user" className="btn btn-primary">
                            <i className="bi bi-plus-circle me-2"></i>
                            Create User
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="card bg-dark border-success h-100">
                        <div className="card-body text-center">
                          <div className="mb-3">
                            <i className="bi bi-people-fill text-success" style={{fontSize: '3rem'}}></i>
                          </div>
                          <h5 className="card-title text-white">Manage Users</h5>
                          <p className="card-text text-light opacity-75">
                            View, edit, and manage existing system users
                          </p>
                          <a href="/admin/manage-users" className="btn btn-success">
                            <i className="bi bi-gear me-2"></i>
                            Manage Users
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* System Stats */}
                  <div className="row g-4 mt-4">
                    <div className="col-12">
                      <div className="card bg-dark border-info">
                        <div className="card-header bg-info bg-opacity-10 border-info">
                          <h6 className="card-title text-info mb-0">
                            <i className="bi bi-graph-up me-2"></i>
                            System Overview
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="row text-center">
                            <div className="col-md-4">
                              <div className="border-end border-secondary pe-3">
                                <h3 className="text-primary mb-1">
                                  <i className="bi bi-people-fill"></i>
                                </h3>
                                <p className="text-light opacity-75 mb-0">Total Users</p>
                                <small className="text-muted">Manage all system users</small>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="border-end border-secondary pe-3">
                                <h3 className="text-success mb-1">
                                  <i className="bi bi-shield-check"></i>
                                </h3>
                                <p className="text-light opacity-75 mb-0">Admin Access</p>
                                <small className="text-muted">Full system control</small>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <h3 className="text-warning mb-1">
                                <i className="bi bi-gear-fill"></i>
                              </h3>
                              <p className="text-light opacity-75 mb-0">User Management</p>
                              <small className="text-muted">Create & manage users</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
