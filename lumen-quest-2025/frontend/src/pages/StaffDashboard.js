import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/StaffDashboard.css';

const StaffDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeTasks: 5,
    assignedItems: 15,
    completedTasks: 12,
    pendingReturns: 3
  });
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, action: 'Completed task: Cable Installation', time: '2 hours ago' },
    { id: 2, action: 'Updated inventory: Returned 2 modems', time: '4 hours ago' },
    { id: 3, action: 'Started task: Equipment Inspection', time: '1 day ago' }
  ]);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New task assigned: Equipment Inspection - Site A', urgent: true },
    { id: 2, message: 'Equipment return reminder: Router XYZ-123', urgent: false },
    { id: 3, message: 'System maintenance scheduled for tonight', urgent: false }
  ]);

  useEffect(() => {
    // Initialize any data fetching here
  }, []);

  return (
    <div className="staff-dashboard">
      {/* Floating Orbs for Background Animation */}
      <div className="floating-orb"></div>
      <div className="floating-orb"></div>
      <div className="floating-orb"></div>

      {/* Welcome Section */}
      <div className="staff-welcome">
        <div className="staff-welcome-content">
          <div className="staff-welcome-icon">
            <i className="fas fa-user-tie"></i>
          </div>
          <h1 className="staff-welcome-title">Welcome, {user?.name || 'Staff Member'}!</h1>
          <p className="staff-welcome-subtitle">Your personalized dashboard for efficient task management</p>
          <div className="staff-role-badge">Staff Dashboard</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="staff-stats-grid">
        <div className="staff-stat-card">
          <div className="staff-stat-icon">
            <i className="fas fa-tasks"></i>
          </div>
          <div className="staff-stat-number">{stats.activeTasks}</div>
          <div className="staff-stat-label">Active Tasks</div>
        </div>
        
        <div className="staff-stat-card">
          <div className="staff-stat-icon">
            <i className="fas fa-boxes"></i>
          </div>
          <div className="staff-stat-number">{stats.assignedItems}</div>
          <div className="staff-stat-label">Assigned Items</div>
        </div>
        
        <div className="staff-stat-card">
          <div className="staff-stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="staff-stat-number">{stats.completedTasks}</div>
          <div className="staff-stat-label">Completed Tasks</div>
        </div>
        
        <div className="staff-stat-card">
          <div className="staff-stat-icon">
            <i className="fas fa-undo"></i>
          </div>
          <div className="staff-stat-number">{stats.pendingReturns}</div>
          <div className="staff-stat-label">Pending Returns</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="staff-quick-actions">
        <h2 className="staff-actions-title">Quick Actions</h2>
        <div className="staff-actions-grid">
          <button className="staff-action-btn">
            <i className="fas fa-plus"></i>
            New Task
          </button>
          <button className="staff-action-btn">
            <i className="fas fa-search"></i>
            Search Inventory
          </button>
          <button className="staff-action-btn">
            <i className="fas fa-clipboard-list"></i>
            View Reports
          </button>
          <button className="staff-action-btn">
            <i className="fas fa-cog"></i>
            Settings
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="staff-recent-activity">
        <h2 className="staff-activity-title">Recent Activity</h2>
        {recentActivity.map(activity => (
          <div key={activity.id} className="staff-activity-item">
            <div className="staff-activity-time">{activity.time}</div>
            <div className="staff-activity-text">{activity.action}</div>
          </div>
        ))}
      </div>

      {/* Notifications */}
      <div className="staff-notifications">
        <h3 className="staff-notification-title">
          <i className="fas fa-bell"></i> Notifications
        </h3>
        {notifications.map(notification => (
          <div key={notification.id} className="staff-notification-item">
            <strong>{notification.urgent ? '🔴 URGENT: ' : '📢 '}</strong>
            {notification.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffDashboard;
