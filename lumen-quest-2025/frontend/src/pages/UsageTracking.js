import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AIRecommendations from '../components/AIRecommendations';
import '../styles/UsageTracking.css';

const UsageTracking = () => {
  const { user } = useAuth();
  const [usageData, setUsageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [selectedMetric, setSelectedMetric] = useState('data');

  useEffect(() => {
    fetchUsageData();
  }, [selectedPeriod]);

  const fetchUsageData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const mockData = {
        currentUsage: {
          dataUsed: 85.4,
          dataLimit: 'Unlimited',
          speedAverage: 92.3,
          speedPeak: 98.7,
          uptimePercentage: 99.2,
          billingCycle: {
            start: new Date('2024-11-15'),
            end: new Date('2024-12-15'),
            daysRemaining: 12
          }
        },
        dailyUsage: [
          { date: '2024-12-01', data: 2.8, speed: 89.2, uptime: 100 },
          { date: '2024-12-02', data: 3.2, speed: 91.5, uptime: 99.8 },
          { date: '2024-12-03', data: 4.1, speed: 88.7, uptime: 99.5 },
          { date: '2024-12-04', data: 2.9, speed: 93.2, uptime: 100 },
          { date: '2024-12-05', data: 5.2, speed: 87.9, uptime: 98.9 },
          { date: '2024-12-06', data: 3.7, speed: 94.1, uptime: 99.7 },
          { date: '2024-12-07', data: 4.8, speed: 90.3, uptime: 99.9 },
          { date: '2024-12-08', data: 6.1, speed: 85.6, uptime: 99.2 },
          { date: '2024-12-09', data: 3.4, speed: 92.8, uptime: 100 },
          { date: '2024-12-10', data: 4.9, speed: 89.7, uptime: 99.6 },
          { date: '2024-12-11', data: 5.3, speed: 91.2, uptime: 99.8 },
          { date: '2024-12-12', data: 4.2, speed: 93.5, uptime: 100 },
          { date: '2024-12-13', data: 3.8, speed: 88.9, uptime: 99.4 }
        ],
        hourlyPattern: [
          { hour: '00:00', usage: 12 }, { hour: '01:00', usage: 8 },
          { hour: '02:00', usage: 5 }, { hour: '03:00', usage: 3 },
          { hour: '04:00', usage: 2 }, { hour: '05:00', usage: 4 },
          { hour: '06:00', usage: 15 }, { hour: '07:00', usage: 28 },
          { hour: '08:00', usage: 45 }, { hour: '09:00', usage: 52 },
          { hour: '10:00', usage: 48 }, { hour: '11:00', usage: 42 },
          { hour: '12:00', usage: 38 }, { hour: '13:00', usage: 35 },
          { hour: '14:00', usage: 41 }, { hour: '15:00', usage: 47 },
          { hour: '16:00', usage: 53 }, { hour: '17:00', usage: 62 },
          { hour: '18:00', usage: 75 }, { hour: '19:00', usage: 88 },
          { hour: '20:00', usage: 95 }, { hour: '21:00', usage: 92 },
          { hour: '22:00', usage: 78 }, { hour: '23:00', usage: 45 }
        ],
        deviceBreakdown: [
          { device: 'Mobile Devices', usage: 32.5, percentage: 38 },
          { device: 'Laptop/Desktop', usage: 28.7, percentage: 34 },
          { device: 'Smart TV', usage: 15.2, percentage: 18 },
          { device: 'Gaming Console', usage: 6.8, percentage: 8 },
          { device: 'Other', usage: 2.2, percentage: 2 }
        ],
        applicationUsage: [
          { app: 'Video Streaming', usage: 45.2, percentage: 53 },
          { app: 'Web Browsing', usage: 18.3, percentage: 21 },
          { app: 'Gaming', usage: 12.7, percentage: 15 },
          { app: 'Social Media', usage: 6.1, percentage: 7 },
          { app: 'File Downloads', usage: 3.1, percentage: 4 }
        ],
        alerts: [
          {
            id: '1',
            type: 'warning',
            title: 'High Usage Detected',
            message: 'Your data usage is 15% higher than usual this week',
            timestamp: new Date('2024-12-12T14:30:00'),
            isRead: false
          },
          {
            id: '2',
            type: 'info',
            title: 'Speed Optimization',
            message: 'Your connection speed improved by 8% after recent network upgrades',
            timestamp: new Date('2024-12-10T09:15:00'),
            isRead: true
          }
        ],
        recommendations: [
          {
            title: 'Optimize Peak Hours',
            description: 'Consider scheduling large downloads during off-peak hours (2-6 AM) for better speeds',
            impact: 'Up to 25% faster downloads'
          },
          {
            title: 'Device Management',
            description: 'Your mobile devices are using 38% of bandwidth. Consider WiFi optimization',
            impact: 'Improved overall performance'
          }
        ]
      };
      
      setUsageData(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching usage data:', error);
      setLoading(false);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 GB';
    const k = 1024;
    const sizes = ['GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getUsageColor = (percentage) => {
    if (percentage >= 90) return 'danger';
    if (percentage >= 75) return 'warning';
    if (percentage >= 50) return 'info';
    return 'success';
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning': return 'bi-exclamation-triangle text-warning';
      case 'error': return 'bi-x-circle text-danger';
      case 'info': return 'bi-info-circle text-info';
      default: return 'bi-bell text-primary';
    }
  };

  if (loading) {
    return (
      <div className="usage-tracking">
        <div className="container-fluid">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading usage data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="usage-tracking">
      <div className="container-fluid">
        {/* Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="page-title">
                <i className="bi bi-graph-up-arrow me-2"></i>
                Usage Tracking
              </h1>
              <p className="page-subtitle">Monitor your internet usage and performance</p>
            </div>
            <div className="col-md-4 text-end">
              <select 
                className="form-select period-selector"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option value="current">Current Billing Cycle</option>
                <option value="last">Last Billing Cycle</option>
                <option value="last3">Last 3 Months</option>
              </select>
            </div>
          </div>
        </div>

        {/* Current Usage Overview */}
        <div className="row mb-4">
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="usage-card data-usage">
              <div className="usage-icon">
                <i className="bi bi-hdd"></i>
              </div>
              <div className="usage-content">
                <h3>{usageData.currentUsage.dataUsed} GB</h3>
                <p>Data Used</p>
                <div className="usage-limit">
                  Limit: {usageData.currentUsage.dataLimit}
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="usage-card speed-avg">
              <div className="usage-icon">
                <i className="bi bi-speedometer2"></i>
              </div>
              <div className="usage-content">
                <h3>{usageData.currentUsage.speedAverage} Mbps</h3>
                <p>Average Speed</p>
                <div className="speed-peak">
                  Peak: {usageData.currentUsage.speedPeak} Mbps
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="usage-card uptime">
              <div className="usage-icon">
                <i className="bi bi-check-circle"></i>
              </div>
              <div className="usage-content">
                <h3>{usageData.currentUsage.uptimePercentage}%</h3>
                <p>Uptime</p>
                <div className="uptime-status">
                  Excellent
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="usage-card billing-cycle">
              <div className="usage-icon">
                <i className="bi bi-calendar"></i>
              </div>
              <div className="usage-content">
                <h3>{usageData.currentUsage.billingCycle.daysRemaining}</h3>
                <p>Days Remaining</p>
                <div className="cycle-end">
                  Ends: {usageData.currentUsage.billingCycle.end.toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="row mb-4">
          <div className="col-lg-8 mb-4">
            <div className="chart-card">
              <div className="chart-header">
                <h4>Daily Usage Trend</h4>
                <div className="chart-controls">
                  <button 
                    className={`btn btn-sm ${selectedMetric === 'data' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setSelectedMetric('data')}
                  >
                    Data Usage
                  </button>
                  <button 
                    className={`btn btn-sm ${selectedMetric === 'speed' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setSelectedMetric('speed')}
                  >
                    Speed
                  </button>
                  <button 
                    className={`btn btn-sm ${selectedMetric === 'uptime' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setSelectedMetric('uptime')}
                  >
                    Uptime
                  </button>
                </div>
              </div>
              <div className="chart-body">
                <div className="usage-chart">
                  <div className="chart-bars">
                    {usageData.dailyUsage.slice(-7).map((day, index) => (
                      <div key={index} className="chart-bar">
                        <div 
                          className="bar"
                          style={{ 
                            height: selectedMetric === 'data' 
                              ? `${(day.data / 7) * 100}%`
                              : selectedMetric === 'speed'
                              ? `${(day.speed / 100) * 100}%`
                              : `${day.uptime}%`
                          }}
                        ></div>
                        <span className="bar-label">
                          {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="chart-values">
                    {usageData.dailyUsage.slice(-7).map((day, index) => (
                      <div key={index} className="value">
                        {selectedMetric === 'data' 
                          ? `${day.data} GB`
                          : selectedMetric === 'speed'
                          ? `${day.speed} Mbps`
                          : `${day.uptime}%`
                        }
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 mb-4">
            <div className="hourly-pattern-card">
              <div className="pattern-header">
                <h4>Hourly Usage Pattern</h4>
              </div>
              <div className="pattern-body">
                <div className="pattern-chart">
                  {usageData.hourlyPattern.map((hour, index) => (
                    <div key={index} className="pattern-bar">
                      <div 
                        className="pattern-fill"
                        style={{ height: `${hour.usage}%` }}
                      ></div>
                      <span className="pattern-label">
                        {hour.hour.split(':')[0]}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pattern-legend">
                  <div className="legend-item">
                    <span className="legend-color peak"></span>
                    <span>Peak Hours (8-10 PM)</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color low"></span>
                    <span>Low Usage (2-6 AM)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Device and Application Breakdown */}
        <div className="row mb-4">
          <div className="col-lg-6 mb-4">
            <div className="breakdown-card">
              <div className="breakdown-header">
                <h4>Usage by Device</h4>
              </div>
              <div className="breakdown-body">
                {usageData.deviceBreakdown.map((device, index) => (
                  <div key={index} className="breakdown-item">
                    <div className="breakdown-info">
                      <span className="breakdown-name">{device.device}</span>
                      <span className="breakdown-value">{device.usage} GB</span>
                    </div>
                    <div className="breakdown-bar">
                      <div 
                        className="breakdown-fill"
                        style={{ width: `${device.percentage}%` }}
                      ></div>
                    </div>
                    <span className="breakdown-percentage">{device.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-lg-6 mb-4">
            <div className="breakdown-card">
              <div className="breakdown-header">
                <h4>Usage by Application</h4>
              </div>
              <div className="breakdown-body">
                {usageData.applicationUsage.map((app, index) => (
                  <div key={index} className="breakdown-item">
                    <div className="breakdown-info">
                      <span className="breakdown-name">{app.app}</span>
                      <span className="breakdown-value">{app.usage} GB</span>
                    </div>
                    <div className="breakdown-bar">
                      <div 
                        className="breakdown-fill"
                        style={{ width: `${app.percentage}%` }}
                      ></div>
                    </div>
                    <span className="breakdown-percentage">{app.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Alerts and Recommendations */}
        <div className="row mb-4">
          <div className="col-lg-6 mb-4">
            <div className="alerts-card">
              <div className="alerts-header">
                <h4>Usage Alerts</h4>
              </div>
              <div className="alerts-body">
                {usageData.alerts.length > 0 ? (
                  usageData.alerts.map(alert => (
                    <div key={alert.id} className={`alert-item ${alert.isRead ? 'read' : 'unread'}`}>
                      <div className="alert-icon">
                        <i className={getAlertIcon(alert.type)}></i>
                      </div>
                      <div className="alert-content">
                        <h6 className="alert-title">{alert.title}</h6>
                        <p className="alert-message">{alert.message}</p>
                        <span className="alert-time">
                          {alert.timestamp.toLocaleDateString()} at {alert.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-alerts">
                    <i className="bi bi-check-circle text-success"></i>
                    <p>No alerts at this time</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-6 mb-4">
            <AIRecommendations 
              context="usage" 
              userSubscriptions={[]} 
              planData={[]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageTracking;
