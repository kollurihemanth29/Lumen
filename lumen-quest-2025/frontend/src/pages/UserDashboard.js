import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/UserDashboard.css';

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeSubscriptions: 0,
    monthlyUsage: 0,
    availableOffers: 0,
    nextBilling: null
  });

  useEffect(() => {
    // TODO: Fetch user subscription data from API
    // For now, using mock data
    setStats({
      activeSubscriptions: 1,
      monthlyUsage: 85.4,
      availableOffers: 3,
      nextBilling: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    });
  }, []);

  const quickActions = [
    {
      title: 'View Plans',
      description: 'Browse available broadband plans',
      icon: 'bi-wifi',
      color: 'primary',
      path: '/plans'
    },
    {
      title: 'Usage Analytics',
      description: 'Monitor your data usage',
      icon: 'bi-graph-up',
      color: 'success',
      path: '/usage'
    },
    {
      title: 'Billing History',
      description: 'View payment history',
      icon: 'bi-receipt',
      color: 'info',
      path: '/billing'
    },
    {
      title: 'Support',
      description: 'Get help and support',
      icon: 'bi-headset',
      color: 'warning',
      path: '/support'
    }
  ];

  return (
    <div className="user-dashboard">
      <div className="container-fluid">
        {/* Header */}
        <div className="dashboard-header">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="dashboard-title">
                Welcome back, {user?.name}!
              </h1>
              <p className="dashboard-subtitle">
                Manage your broadband subscriptions and monitor usage
              </p>
            </div>
            <div className="col-md-4 text-end">
              <div className="user-info-card">
                <div className="user-avatar">
                  <i className="bi bi-person-circle"></i>
                </div>
                <div className="user-details">
                  <h6>{user?.name}</h6>
                  <small className="text-muted">{user?.email}</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-3 col-sm-6 mb-3">
            <div className="stat-card">
              <div className="stat-icon bg-primary">
                <i className="bi bi-router"></i>
              </div>
              <div className="stat-content">
                <h3>{stats.activeSubscriptions}</h3>
                <p>Active Subscriptions</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-3">
            <div className="stat-card">
              <div className="stat-icon bg-success">
                <i className="bi bi-speedometer2"></i>
              </div>
              <div className="stat-content">
                <h3>{stats.monthlyUsage} GB</h3>
                <p>This Month's Usage</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-3">
            <div className="stat-card">
              <div className="stat-icon bg-warning">
                <i className="bi bi-percent"></i>
              </div>
              <div className="stat-content">
                <h3>{stats.availableOffers}</h3>
                <p>Available Offers</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-3">
            <div className="stat-card">
              <div className="stat-icon bg-info">
                <i className="bi bi-calendar-event"></i>
              </div>
              <div className="stat-content">
                <h3>{stats.nextBilling ? new Date(stats.nextBilling).getDate() : '--'}</h3>
                <p>Next Billing (Days)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="row">
          {/* Quick Actions */}
          <div className="col-md-8">
            <div className="dashboard-card">
              <div className="card-header">
                <h5 className="card-title">
                  <i className="bi bi-lightning-charge me-2"></i>
                  Quick Actions
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {quickActions.map((action, index) => (
                    <div key={index} className="col-md-6 mb-3">
                      <div className={`quick-action-card border-${action.color}`}>
                        <div className={`action-icon text-${action.color}`}>
                          <i className={action.icon}></i>
                        </div>
                        <div className="action-content">
                          <h6>{action.title}</h6>
                          <p className="text-muted">{action.description}</p>
                        </div>
                        <div className="action-arrow">
                          <i className="bi bi-arrow-right"></i>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="col-md-4">
            <div className="dashboard-card">
              <div className="card-header">
                <h5 className="card-title">
                  <i className="bi bi-clock-history me-2"></i>
                  Recent Activity
                </h5>
              </div>
              <div className="card-body">
                <div className="activity-list">
                  <div className="activity-item">
                    <div className="activity-icon bg-success">
                      <i className="bi bi-check-circle"></i>
                    </div>
                    <div className="activity-content">
                      <p className="activity-title">Payment Successful</p>
                      <small className="text-muted">2 days ago</small>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon bg-info">
                      <i className="bi bi-speedometer2"></i>
                    </div>
                    <div className="activity-content">
                      <p className="activity-title">Usage Alert: 80% reached</p>
                      <small className="text-muted">5 days ago</small>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon bg-warning">
                      <i className="bi bi-percent"></i>
                    </div>
                    <div className="activity-content">
                      <p className="activity-title">New offer available</p>
                      <small className="text-muted">1 week ago</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Plan */}
            <div className="dashboard-card mt-3">
              <div className="card-header">
                <h5 className="card-title">
                  <i className="bi bi-router me-2"></i>
                  Current Plan
                </h5>
              </div>
              <div className="card-body">
                <div className="current-plan">
                  <h6 className="plan-name">Fibernet Premium</h6>
                  <p className="plan-speed">100 Mbps</p>
                  <div className="plan-details">
                    <div className="detail-item">
                      <span className="label">Monthly Cost:</span>
                      <span className="value">₹999</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Data Limit:</span>
                      <span className="value">Unlimited</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Status:</span>
                      <span className="value text-success">Active</span>
                    </div>
                  </div>
                  <button className="btn btn-outline-primary btn-sm mt-2">
                    <i className="bi bi-arrow-up-circle me-1"></i>
                    Upgrade Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Chart Placeholder */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="dashboard-card">
              <div className="card-header">
                <h5 className="card-title">
                  <i className="bi bi-bar-chart me-2"></i>
                  Usage Analytics
                </h5>
              </div>
              <div className="card-body">
                <div className="usage-chart-placeholder">
                  <div className="text-center py-5">
                    <i className="bi bi-graph-up display-1 text-muted"></i>
                    <h6 className="mt-3 text-muted">Usage analytics chart will be displayed here</h6>
                    <p className="text-muted">Connect your subscription to view detailed usage patterns</p>
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

export default UserDashboard;
