import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/StaffDashboard.css';

const StaffDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="staff-dashboard">
      {/* Shared Animated Background System */}
      <div className="bg-system">
        <div className="neon-waves"></div>
        <div className="network-mesh">
          {Array.from({length: 8}, (_, i) => (
            <div 
              key={`node-${i}`}
              className="network-node" 
              style={{
                top: `${20 + (i * 9)}%`,
                left: `${10 + (i * 9)}%`,
                animationDelay: `${i * 0.5}s`
              }}
            ></div>
          ))}
          {Array.from({length: 5}, (_, i) => (
            <div 
              key={`line-${i}`}
              className="network-line" 
              style={{
                top: `${25 + (i * 15)}%`,
                left: `${15 + (i * 12)}%`,
                width: `${60 + Math.random() * 60}px`,
                transform: `rotate(${i * 25}deg)`,
                animationDelay: `${i * 0.7}s`
              }}
            ></div>
          ))}
        </div>
        <div className="data-particles">
          {Array.from({length: 15}, (_, i) => (
            <div 
              key={`particle-${i}`}
              className="particle" 
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`
              }}
            ></div>
          ))}
        </div>
        <div className="fiber-streaks">
          <div className="fiber-streak" style={{top: '30%'}}></div>
          <div className="fiber-streak" style={{top: '60%'}}></div>
        </div>
        <div className="grid-overlay"></div>
      </div>
      
      <div className="container-fluid py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Welcome Section */}
            <div className="staff-welcome">
              <div className="staff-welcome-content">
                <div className="staff-welcome-icon">
                  <i className="bi bi-person-workspace"></i>
                </div>
                <h1 className="staff-welcome-title">
                  LUMEN QUEST
                </h1>
                <h2 className="staff-welcome-subtitle">
                  Welcome, {user?.name}!
                </h2>
                <div className="staff-role-badge">
                  {user?.role?.toUpperCase()} • {user?.department}
                </div>
                <p style={{ color: '#ffffff', fontSize: '1.2rem', marginTop: '2rem', opacity: '0.8' }}>
                  Your cyberpunk dashboard is ready. Explore the digital realm of Lumen Quest.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default StaffDashboard;
