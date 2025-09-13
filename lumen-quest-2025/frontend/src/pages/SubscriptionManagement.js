import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/SubscriptionManagement.css';

const SubscriptionManagement = () => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    fetchSubscriptions();
    fetchAvailablePlans();
    fetchRecommendations();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      // TODO: Replace with actual API call
      const mockSubscriptions = [
        {
          id: '1',
          planId: '2',
          planName: 'Fibernet Premium',
          planType: 'Fibernet',
          speed: '100 Mbps',
          monthlyPrice: 999,
          dataQuota: 'Unlimited',
          status: 'active',
          startDate: new Date('2024-01-15'),
          nextBilling: new Date('2024-12-15'),
          autoRenew: true,
          usageThisMonth: 85.4,
          features: ['24/7 Support', 'Free Installation', 'Router Included', 'Priority Support']
        }
      ];
      setSubscriptions(mockSubscriptions);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      setLoading(false);
    }
  };

  const fetchAvailablePlans = async () => {
    try {
      // TODO: Replace with actual API call
      const mockPlans = [
        {
          id: '1',
          name: 'Fibernet Basic',
          type: 'Fibernet',
          speed: '50 Mbps',
          monthlyPrice: 599,
          dataQuota: 'Unlimited',
          features: ['24/7 Support', 'Free Installation', 'Router Included'],
          description: 'Perfect for basic browsing and streaming',
          isActive: true
        },
        {
          id: '2',
          name: 'Fibernet Premium',
          type: 'Fibernet',
          speed: '100 Mbps',
          monthlyPrice: 999,
          dataQuota: 'Unlimited',
          features: ['24/7 Support', 'Free Installation', 'Router Included', 'Priority Support'],
          description: 'High-speed internet for heavy users',
          isActive: true
        },
        {
          id: '3',
          name: 'Fibernet Ultra',
          type: 'Fibernet',
          speed: '200 Mbps',
          monthlyPrice: 1499,
          dataQuota: 'Unlimited',
          features: ['24/7 Support', 'Free Installation', 'Router Included', 'Priority Support', 'Static IP'],
          description: 'Ultimate speed for professionals',
          isActive: true
        },
        {
          id: '4',
          name: 'Broadband Copper Basic',
          type: 'Broadband Copper',
          speed: '25 Mbps',
          monthlyPrice: 399,
          dataQuota: '500 GB',
          features: ['24/7 Support', 'Free Installation'],
          description: 'Affordable broadband for light usage',
          isActive: true
        }
      ];
      setAvailablePlans(mockPlans);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      // TODO: Replace with actual AI recommendations API call
      const mockRecommendations = [
        {
          id: '3',
          name: 'Fibernet Ultra',
          reason: 'Based on your high usage (85GB this month), upgrading to Ultra will provide better performance',
          confidence: 85,
          savings: null,
          type: 'upgrade'
        },
        {
          id: '1',
          name: 'Fibernet Basic',
          reason: 'You could save ₹400/month while still meeting your usage needs',
          confidence: 70,
          savings: 400,
          type: 'downgrade'
        }
      ];
      setRecommendations(mockRecommendations);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const handleSubscriptionAction = (action, subscription = null) => {
    setSelectedAction(action);
    setCurrentSubscription(subscription);
    if (action === 'subscribe' || action === 'upgrade' || action === 'downgrade') {
      setShowPlanModal(true);
    } else {
      executeAction(action, subscription);
    }
  };

  const executeAction = async (action, subscription, newPlan = null) => {
    try {
      // TODO: Replace with actual API calls
      switch (action) {
        case 'subscribe':
          const newSubscription = {
            id: Date.now().toString(),
            planId: newPlan.id,
            planName: newPlan.name,
            planType: newPlan.type,
            speed: newPlan.speed,
            monthlyPrice: newPlan.monthlyPrice,
            dataQuota: newPlan.dataQuota,
            status: 'active',
            startDate: new Date(),
            nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            autoRenew: true,
            usageThisMonth: 0,
            features: newPlan.features
          };
          setSubscriptions(prev => [...prev, newSubscription]);
          break;

        case 'upgrade':
        case 'downgrade':
          setSubscriptions(prev => prev.map(sub => 
            sub.id === subscription.id 
              ? {
                  ...sub,
                  planId: newPlan.id,
                  planName: newPlan.name,
                  planType: newPlan.type,
                  speed: newPlan.speed,
                  monthlyPrice: newPlan.monthlyPrice,
                  dataQuota: newPlan.dataQuota,
                  features: newPlan.features
                }
              : sub
          ));
          break;

        case 'cancel':
          if (window.confirm('Are you sure you want to cancel this subscription?')) {
            setSubscriptions(prev => prev.map(sub => 
              sub.id === subscription.id 
                ? { ...sub, status: 'cancelled' }
                : sub
            ));
          }
          break;

        case 'renew':
          setSubscriptions(prev => prev.map(sub => 
            sub.id === subscription.id 
              ? { 
                  ...sub, 
                  nextBilling: new Date(sub.nextBilling.getTime() + 30 * 24 * 60 * 60 * 1000),
                  status: 'active'
                }
              : sub
          ));
          break;

        case 'toggle-auto-renew':
          setSubscriptions(prev => prev.map(sub => 
            sub.id === subscription.id 
              ? { ...sub, autoRenew: !sub.autoRenew }
              : sub
          ));
          break;
      }

      setShowPlanModal(false);
      setSelectedAction(null);
      setCurrentSubscription(null);
    } catch (error) {
      console.error('Error executing action:', error);
    }
  };

  const getFilteredPlans = () => {
    if (!currentSubscription) return availablePlans;
    
    const currentPrice = currentSubscription.monthlyPrice;
    
    if (selectedAction === 'upgrade') {
      return availablePlans.filter(plan => 
        plan.monthlyPrice > currentPrice && plan.id !== currentSubscription.planId
      );
    } else if (selectedAction === 'downgrade') {
      return availablePlans.filter(plan => 
        plan.monthlyPrice < currentPrice && plan.id !== currentSubscription.planId
      );
    }
    
    return availablePlans.filter(plan => plan.id !== currentSubscription?.planId);
  };

  const getActionTitle = () => {
    switch (selectedAction) {
      case 'subscribe': return 'Subscribe to a Plan';
      case 'upgrade': return 'Upgrade Your Plan';
      case 'downgrade': return 'Downgrade Your Plan';
      default: return 'Select a Plan';
    }
  };

  if (loading) {
    return (
      <div className="subscription-management">
        <div className="container-fluid">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading subscriptions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="subscription-management">
      <div className="container-fluid">
        {/* Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="page-title">
                <i className="bi bi-router me-2"></i>
                My Subscriptions
              </h1>
              <p className="page-subtitle">Manage your broadband subscriptions and plans</p>
            </div>
            <div className="col-md-4 text-end">
              {subscriptions.length === 0 && (
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={() => handleSubscriptionAction('subscribe')}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Subscribe to Plan
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Current Subscriptions */}
        {subscriptions.length > 0 ? (
          <div className="row mb-4">
            {subscriptions.map(subscription => (
              <div key={subscription.id} className="col-lg-6 mb-4">
                <div className={`subscription-card ${subscription.status}`}>
                  <div className="subscription-header">
                    <div className="subscription-status">
                      <span className={`status-badge ${subscription.status}`}>
                        {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                      </span>
                      <span className="plan-type-badge">
                        {subscription.planType}
                      </span>
                    </div>
                    <h3 className="subscription-title">{subscription.planName}</h3>
                    <div className="subscription-speed">{subscription.speed}</div>
                    <div className="subscription-price">
                      <span className="currency">₹</span>
                      <span className="amount">{subscription.monthlyPrice}</span>
                      <span className="period">/month</span>
                    </div>
                  </div>

                  <div className="subscription-body">
                    <div className="subscription-details">
                      <div className="detail-row">
                        <span className="label">Data Quota:</span>
                        <span className="value">{subscription.dataQuota}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Usage This Month:</span>
                        <span className="value">{subscription.usageThisMonth} GB</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Next Billing:</span>
                        <span className="value">{subscription.nextBilling.toLocaleDateString()}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Auto Renew:</span>
                        <span className={`value ${subscription.autoRenew ? 'text-success' : 'text-warning'}`}>
                          {subscription.autoRenew ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>

                    <div className="subscription-features">
                      <h6>Features:</h6>
                      <ul>
                        {subscription.features.map((feature, index) => (
                          <li key={index}>
                            <i className="bi bi-check-circle-fill me-2"></i>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="subscription-actions">
                    {subscription.status === 'active' && (
                      <>
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => handleSubscriptionAction('upgrade', subscription)}
                        >
                          <i className="bi bi-arrow-up-circle me-1"></i>
                          Upgrade
                        </button>
                        <button 
                          className="btn btn-warning btn-sm"
                          onClick={() => handleSubscriptionAction('downgrade', subscription)}
                        >
                          <i className="bi bi-arrow-down-circle me-1"></i>
                          Downgrade
                        </button>
                        <button 
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => handleSubscriptionAction('toggle-auto-renew', subscription)}
                        >
                          <i className={`bi ${subscription.autoRenew ? 'bi-pause' : 'bi-play'} me-1`}></i>
                          {subscription.autoRenew ? 'Disable' : 'Enable'} Auto-Renew
                        </button>
                        <button 
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleSubscriptionAction('cancel', subscription)}
                        >
                          <i className="bi bi-x-circle me-1"></i>
                          Cancel
                        </button>
                      </>
                    )}
                    {subscription.status === 'cancelled' && (
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => handleSubscriptionAction('renew', subscription)}
                      >
                        <i className="bi bi-arrow-clockwise me-1"></i>
                        Renew
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-subscriptions">
            <div className="text-center py-5">
              <i className="bi bi-router display-1 text-muted"></i>
              <h3 className="mt-3">No Active Subscriptions</h3>
              <p className="text-muted">Get started by subscribing to a broadband plan</p>
              <button 
                className="btn btn-primary btn-lg"
                onClick={() => handleSubscriptionAction('subscribe')}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Browse Plans
              </button>
            </div>
          </div>
        )}

        {/* AI Recommendations */}
        {recommendations.length > 0 && subscriptions.length > 0 && (
          <div className="recommendations-section">
            <h4 className="section-title">
              <i className="bi bi-robot me-2"></i>
              AI Recommendations
            </h4>
            <div className="row">
              {recommendations.map(rec => (
                <div key={rec.id} className="col-md-6 mb-3">
                  <div className="recommendation-card">
                    <div className="recommendation-header">
                      <span className={`recommendation-type ${rec.type}`}>
                        {rec.type === 'upgrade' ? 'Upgrade Suggestion' : 'Cost Saving'}
                      </span>
                      <span className="confidence-score">{rec.confidence}% match</span>
                    </div>
                    <h6 className="recommendation-plan">{rec.name}</h6>
                    <p className="recommendation-reason">{rec.reason}</p>
                    {rec.savings && (
                      <div className="savings-highlight">
                        <i className="bi bi-piggy-bank me-1"></i>
                        Save ₹{rec.savings}/month
                      </div>
                    )}
                    <button 
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => {
                        const plan = availablePlans.find(p => p.id === rec.id);
                        const currentSub = subscriptions.find(s => s.status === 'active');
                        if (plan && currentSub) {
                          executeAction(rec.type, currentSub, plan);
                        }
                      }}
                    >
                      Apply Recommendation
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Plan Selection Modal */}
        {showPlanModal && (
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-xl">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{getActionTitle()}</h5>
                  <button 
                    type="button" 
                    className="btn-close"
                    onClick={() => setShowPlanModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    {getFilteredPlans().map(plan => (
                      <div key={plan.id} className="col-lg-4 col-md-6 mb-4">
                        <div className="plan-option-card">
                          <div className="plan-option-header">
                            <h5>{plan.name}</h5>
                            <div className="plan-option-speed">{plan.speed}</div>
                            <div className="plan-option-price">
                              <span className="currency">₹</span>
                              <span className="amount">{plan.monthlyPrice}</span>
                              <span className="period">/month</span>
                            </div>
                          </div>
                          <div className="plan-option-body">
                            <div className="plan-option-quota">
                              <i className="bi bi-hdd me-2"></i>
                              Data: {plan.dataQuota}
                            </div>
                            <p className="plan-option-description">{plan.description}</p>
                            <ul className="plan-option-features">
                              {plan.features.map((feature, index) => (
                                <li key={index}>
                                  <i className="bi bi-check me-1"></i>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="plan-option-actions">
                            <button 
                              className="btn btn-primary w-100"
                              onClick={() => executeAction(selectedAction, currentSubscription, plan)}
                            >
                              {selectedAction === 'subscribe' ? 'Subscribe' : 
                               selectedAction === 'upgrade' ? 'Upgrade' : 'Downgrade'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionManagement;
