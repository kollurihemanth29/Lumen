import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const mockData = {
        overview: {
          totalRevenue: 2450000,
          totalSubscribers: 8456,
          activeSubscriptions: 7892,
          churnRate: 6.7,
          avgRevenuePerUser: 310.5,
          newSubscriptionsThisMonth: 234,
          cancellationsThisMonth: 89,
          netGrowth: 145
        },
        revenueData: [
          { month: 'Jan', revenue: 180000, subscribers: 7200 },
          { month: 'Feb', revenue: 195000, subscribers: 7350 },
          { month: 'Mar', revenue: 210000, subscribers: 7500 },
          { month: 'Apr', revenue: 225000, subscribers: 7680 },
          { month: 'May', revenue: 240000, subscribers: 7850 },
          { month: 'Jun', revenue: 245000, subscribers: 7892 }
        ],
        planPerformance: [
          { 
            planName: 'Fibernet Premium', 
            subscribers: 3200, 
            revenue: 3200000, 
            growth: 12.5,
            churn: 4.2,
            avgUsage: 85.4
          },
          { 
            planName: 'Fibernet Basic', 
            subscribers: 2800, 
            revenue: 1680000, 
            growth: 8.3,
            churn: 6.1,
            avgUsage: 72.1
          },
          { 
            planName: 'Fibernet Ultra', 
            subscribers: 1500, 
            revenue: 2250000, 
            growth: 15.7,
            churn: 3.8,
            avgUsage: 92.3
          },
          { 
            planName: 'Broadband Copper Basic', 
            subscribers: 1392, 
            revenue: 556800, 
            growth: -2.1,
            churn: 12.4,
            avgUsage: 45.6
          }
        ],
        usageAnalytics: {
          averageUsage: 76.8,
          peakUsageHours: ['8-10 PM', '2-4 PM', '10-12 PM'],
          topUsageRegions: [
            { region: 'Mumbai', usage: 89.2, subscribers: 2100 },
            { region: 'Delhi', usage: 85.7, subscribers: 1890 },
            { region: 'Bangalore', usage: 82.4, subscribers: 1750 },
            { region: 'Chennai', usage: 78.9, subscribers: 1420 },
            { region: 'Pune', usage: 75.3, subscribers: 1296 }
          ]
        },
        aiInsights: [
          {
            type: 'revenue_opportunity',
            title: 'Upgrade Opportunity Detected',
            description: 'Based on usage patterns, 340 Fibernet Basic users could benefit from Premium plans',
            impact: '₹1,36,000 potential monthly revenue increase',
            confidence: 87,
            action: 'Launch targeted upgrade campaign'
          },
          {
            type: 'churn_risk',
            title: 'High Churn Risk in Copper Plans',
            description: 'Broadband Copper Basic showing 12.4% churn rate, significantly above average',
            impact: '89 subscribers at risk this month',
            confidence: 92,
            action: 'Implement retention strategy or plan migration'
          },
          {
            type: 'market_trend',
            title: 'Peak Usage Shift Detected',
            description: 'Evening peak hours shifting later, indicating changing user behavior',
            impact: 'Network optimization opportunity',
            confidence: 78,
            action: 'Adjust network capacity allocation'
          }
        ],
        customerSegments: [
          { segment: 'Heavy Users (>80GB)', count: 2340, revenue: 2808000, satisfaction: 4.6 },
          { segment: 'Regular Users (40-80GB)', count: 3890, revenue: 2723000, satisfaction: 4.3 },
          { segment: 'Light Users (<40GB)', count: 2662, revenue: 1329000, satisfaction: 4.1 }
        ]
      };
      
      setAnalyticsData(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const getGrowthIcon = (growth) => {
    if (growth > 0) return 'bi-arrow-up-circle-fill text-success';
    if (growth < 0) return 'bi-arrow-down-circle-fill text-danger';
    return 'bi-dash-circle-fill text-warning';
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'revenue_opportunity': return 'bi-currency-dollar text-success';
      case 'churn_risk': return 'bi-exclamation-triangle text-warning';
      case 'market_trend': return 'bi-graph-up text-info';
      default: return 'bi-lightbulb text-primary';
    }
  };

  if (loading) {
    return (
      <div className="analytics-dashboard">
        <div className="container-fluid">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      <div className="container-fluid">
        {/* Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="page-title">
                <i className="bi bi-graph-up me-2"></i>
                Analytics Dashboard
              </h1>
              <p className="page-subtitle">Business intelligence and performance insights</p>
            </div>
            <div className="col-md-4 text-end">
              <select 
                className="form-select time-range-selector"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 3 months</option>
                <option value="1y">Last year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="row mb-4">
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="metric-card revenue">
              <div className="metric-icon">
                <i className="bi bi-currency-rupee"></i>
              </div>
              <div className="metric-content">
                <h3>{formatCurrency(analyticsData.overview.totalRevenue)}</h3>
                <p>Total Revenue</p>
                <div className="metric-change positive">
                  <i className="bi bi-arrow-up"></i> +12.5%
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="metric-card subscribers">
              <div className="metric-icon">
                <i className="bi bi-people"></i>
              </div>
              <div className="metric-content">
                <h3>{formatNumber(analyticsData.overview.totalSubscribers)}</h3>
                <p>Total Subscribers</p>
                <div className="metric-change positive">
                  <i className="bi bi-arrow-up"></i> +8.3%
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="metric-card active">
              <div className="metric-icon">
                <i className="bi bi-check-circle"></i>
              </div>
              <div className="metric-content">
                <h3>{formatNumber(analyticsData.overview.activeSubscriptions)}</h3>
                <p>Active Subscriptions</p>
                <div className="metric-change positive">
                  <i className="bi bi-arrow-up"></i> +6.7%
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="metric-card churn">
              <div className="metric-icon">
                <i className="bi bi-arrow-down-circle"></i>
              </div>
              <div className="metric-content">
                <h3>{analyticsData.overview.churnRate}%</h3>
                <p>Churn Rate</p>
                <div className="metric-change negative">
                  <i className="bi bi-arrow-up"></i> +1.2%
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
                <h4>Revenue & Subscriber Growth</h4>
                <div className="chart-controls">
                  <button 
                    className={`btn btn-sm ${selectedMetric === 'revenue' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setSelectedMetric('revenue')}
                  >
                    Revenue
                  </button>
                  <button 
                    className={`btn btn-sm ${selectedMetric === 'subscribers' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setSelectedMetric('subscribers')}
                  >
                    Subscribers
                  </button>
                </div>
              </div>
              <div className="chart-body">
                <div className="chart-placeholder">
                  <div className="chart-bars">
                    {analyticsData.revenueData.map((data, index) => (
                      <div key={index} className="chart-bar">
                        <div 
                          className="bar"
                          style={{ 
                            height: selectedMetric === 'revenue' 
                              ? `${(data.revenue / 250000) * 100}%`
                              : `${(data.subscribers / 8000) * 100}%`
                          }}
                        ></div>
                        <span className="bar-label">{data.month}</span>
                      </div>
                    ))}
                  </div>
                  <div className="chart-values">
                    {analyticsData.revenueData.map((data, index) => (
                      <div key={index} className="value">
                        {selectedMetric === 'revenue' 
                          ? formatCurrency(data.revenue)
                          : formatNumber(data.subscribers)
                        }
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 mb-4">
            <div className="chart-card">
              <div className="chart-header">
                <h4>Customer Segments</h4>
              </div>
              <div className="chart-body">
                <div className="segment-chart">
                  {analyticsData.customerSegments.map((segment, index) => (
                    <div key={index} className="segment-item">
                      <div className="segment-info">
                        <span className="segment-name">{segment.segment}</span>
                        <span className="segment-count">{formatNumber(segment.count)} users</span>
                      </div>
                      <div className="segment-revenue">
                        {formatCurrency(segment.revenue)}
                      </div>
                      <div className="segment-satisfaction">
                        <i className="bi bi-star-fill"></i> {segment.satisfaction}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Plan Performance */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="performance-card">
              <div className="performance-header">
                <h4>Plan Performance Analysis</h4>
              </div>
              <div className="performance-table">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Plan Name</th>
                        <th>Subscribers</th>
                        <th>Revenue</th>
                        <th>Growth Rate</th>
                        <th>Churn Rate</th>
                        <th>Avg Usage</th>
                        <th>Performance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData.planPerformance.map((plan, index) => (
                        <tr key={index}>
                          <td>
                            <div className="plan-name">
                              <strong>{plan.planName}</strong>
                            </div>
                          </td>
                          <td>{formatNumber(plan.subscribers)}</td>
                          <td>{formatCurrency(plan.revenue)}</td>
                          <td>
                            <span className={`growth-indicator ${plan.growth >= 0 ? 'positive' : 'negative'}`}>
                              <i className={getGrowthIcon(plan.growth)}></i>
                              {plan.growth > 0 ? '+' : ''}{plan.growth}%
                            </span>
                          </td>
                          <td>
                            <span className={`churn-rate ${plan.churn > 8 ? 'high' : plan.churn > 5 ? 'medium' : 'low'}`}>
                              {plan.churn}%
                            </span>
                          </td>
                          <td>
                            <div className="usage-indicator">
                              <div className="usage-bar">
                                <div 
                                  className="usage-fill"
                                  style={{ width: `${plan.avgUsage}%` }}
                                ></div>
                              </div>
                              <span>{plan.avgUsage}%</span>
                            </div>
                          </td>
                          <td>
                            <span className={`performance-badge ${
                              plan.growth > 10 && plan.churn < 5 ? 'excellent' :
                              plan.growth > 5 && plan.churn < 8 ? 'good' :
                              plan.growth > 0 ? 'average' : 'poor'
                            }`}>
                              {plan.growth > 10 && plan.churn < 5 ? 'Excellent' :
                               plan.growth > 5 && plan.churn < 8 ? 'Good' :
                               plan.growth > 0 ? 'Average' : 'Needs Attention'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="insights-section">
              <h4 className="section-title">
                <i className="bi bi-robot me-2"></i>
                AI-Powered Business Insights
              </h4>
              <div className="row">
                {analyticsData.aiInsights.map((insight, index) => (
                  <div key={index} className="col-lg-4 col-md-6 mb-3">
                    <div className="insight-card">
                      <div className="insight-header">
                        <div className="insight-icon">
                          <i className={getInsightIcon(insight.type)}></i>
                        </div>
                        <div className="insight-confidence">
                          {insight.confidence}% confidence
                        </div>
                      </div>
                      <h6 className="insight-title">{insight.title}</h6>
                      <p className="insight-description">{insight.description}</p>
                      <div className="insight-impact">
                        <strong>Impact:</strong> {insight.impact}
                      </div>
                      <div className="insight-action">
                        <button className="btn btn-primary btn-sm">
                          {insight.action}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Usage Analytics */}
        <div className="row">
          <div className="col-lg-8 mb-4">
            <div className="usage-card">
              <div className="usage-header">
                <h4>Regional Usage Analysis</h4>
              </div>
              <div className="usage-body">
                <div className="usage-regions">
                  {analyticsData.usageAnalytics.topUsageRegions.map((region, index) => (
                    <div key={index} className="region-item">
                      <div className="region-info">
                        <span className="region-name">{region.region}</span>
                        <span className="region-subscribers">{formatNumber(region.subscribers)} subscribers</span>
                      </div>
                      <div className="region-usage">
                        <div className="usage-bar">
                          <div 
                            className="usage-fill"
                            style={{ width: `${region.usage}%` }}
                          ></div>
                        </div>
                        <span className="usage-value">{region.usage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 mb-4">
            <div className="peak-hours-card">
              <div className="peak-header">
                <h4>Peak Usage Hours</h4>
              </div>
              <div className="peak-body">
                <div className="average-usage">
                  <div className="usage-circle">
                    <span className="usage-percentage">{analyticsData.usageAnalytics.averageUsage}%</span>
                    <span className="usage-label">Average Usage</span>
                  </div>
                </div>
                <div className="peak-times">
                  <h6>Peak Hours:</h6>
                  <ul>
                    {analyticsData.usageAnalytics.peakUsageHours.map((hour, index) => (
                      <li key={index}>
                        <i className="bi bi-clock me-2"></i>
                        {hour}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
