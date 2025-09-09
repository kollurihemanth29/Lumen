import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/ManagerDashboard.css';

const ManagerDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="manager-dashboard">
      {/* Shared Animated Background System */}
      <div className="bg-system">
        <div className="neon-waves"></div>
        <div className="network-mesh">
          {Array.from({length: 10}, (_, i) => (
            <div 
              key={`node-${i}`}
              className="network-node" 
              style={{
                top: `${15 + (i * 7)}%`,
                left: `${8 + (i * 8)}%`,
                animationDelay: `${i * 0.4}s`
              }}
            ></div>
          ))}
          {Array.from({length: 6}, (_, i) => (
            <div 
              key={`line-${i}`}
              className="network-line" 
              style={{
                top: `${20 + (i * 12)}%`,
                left: `${12 + (i * 10)}%`,
                width: `${70 + Math.random() * 50}px`,
                transform: `rotate(${i * 20}deg)`,
                animationDelay: `${i * 0.6}s`
              }}
            ></div>
          ))}
        </div>
        <div className="data-particles">
          {Array.from({length: 20}, (_, i) => (
            <div 
              key={`particle-${i}`}
              className="particle" 
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 18}s`
              }}
            ></div>
          ))}
        </div>
        <div className="fiber-streaks">
          <div className="fiber-streak" style={{top: '25%'}}></div>
          <div className="fiber-streak" style={{top: '55%'}}></div>
          <div className="fiber-streak" style={{top: '75%'}}></div>
        </div>
        <div className="grid-overlay"></div>
      </div>
      
      <div className="container-fluid py-4">
        <div className="row justify-content-center">
          <div className="col-lg-11">
            {/* Manager Header */}
            <div className="manager-header">
              <div className="manager-shield-icon">
                <i className="bi bi-shield-check"></i>
              </div>
              <h1 className="manager-title">
                LUMEN QUEST MANAGER
              </h1>
              <h2 className="manager-subtitle">
                Department Leader {user?.name}
              </h2>
              <div className="manager-badge">
                MANAGEMENT ACCESS • {user?.department}
              </div>
            </div>

            <p style={{ color: '#ffffff', fontSize: '1.2rem', marginTop: '2rem', opacity: '0.8', textAlign: 'center' }}>
              Lead your team through the digital transformation. Your management portal is active and ready.
            </p>

          </div>
        </div>
      </div>

    </div>
  );
};

export default ManagerDashboard;
