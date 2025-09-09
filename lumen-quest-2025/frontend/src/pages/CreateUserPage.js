import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CreateUser from '../components/CreateUser';
import '../styles/AdminDashboard.css';

const CreateUserPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect non-admin users
  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  const handleUserCreated = (newUser) => {
    // Redirect to manage users page after successful creation
    navigate('/admin/manage-users');
  };

  const handleCancel = () => {
    // Go back to admin dashboard
    navigate('/admin');
  };

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
      
      <div className="container-fluid py-4">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* Page Header */}
            <div className="text-center mb-4">
              <div className="admin-crown-icon mb-3">
                <i className="bi bi-person-plus-fill"></i>
              </div>
              <h1 className="text-white mb-2">Create New User</h1>
              <p className="text-light opacity-75">Add a new user to the Lumen Quest system</p>
            </div>

            {/* Create User Component */}
            <CreateUser 
              onUserCreated={handleUserCreated}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUserPage;
