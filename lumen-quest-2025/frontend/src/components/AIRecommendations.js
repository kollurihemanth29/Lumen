import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/AIRecommendations.css';

const AIRecommendations = ({ context = 'dashboard', userSubscriptions = [], planData = [] }) => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchRecommendations();
  }, [context, userSubscriptions, planData]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual AI API call
      const mockRecommendations = generateMockRecommendations();
      setRecommendations(mockRecommendations);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
      setLoading(false);
    }
  };

  const generateMockRecommendations = () => {
    const baseRecommendations = [];

    if (user?.role === 'admin') {
      // Admin recommendations
      baseRecommendations.push(
        {
          id: '1',
          type: 'revenue_optimization',
          category: 'business',
          title: 'Optimize Pricing Strategy',
          description: 'Based on market analysis, consider adjusting Fibernet Premium pricing to increase competitiveness',
          impact: 'Potential 15% revenue increase',
          confidence: 87,
          priority: 'high',
          action: 'Review pricing model',
          data: {
            currentPrice: 999,
            suggestedPrice: 899,
            expectedIncrease: '15%'
          },
          aiInsight: 'Market analysis shows competitors offering similar speeds at lower prices. A strategic price reduction could capture more market share.',
          implementationSteps: [
            'Analyze competitor pricing',
            'Test with A/B pricing',
            'Monitor conversion rates',
            'Implement gradual rollout'
          ]
        },
        {
          id: '2',
          type: 'churn_prevention',
          category: 'retention',
          title: 'High Churn Risk Alert',
          description: '89 subscribers showing early churn indicators based on usage patterns',
          impact: '₹2,75,000 potential revenue at risk',
          confidence: 92,
          priority: 'urgent',
          action: 'Launch retention campaign',
          data: {
            atRiskUsers: 89,
            avgRevenue: 3090,
            churnProbability: '78%'
          },
          aiInsight: 'Users with declining usage over 3 consecutive months have 78% churn probability. Proactive engagement can reduce this by 45%.',
          implementationSteps: [
            'Identify at-risk users',
            'Create personalized offers',
            'Send targeted communications',
            'Monitor engagement response'
          ]
        },
        {
          id: '3',
          type: 'plan_optimization',
          category: 'product',
          title: 'New Plan Opportunity',
          description: 'Market gap identified for mid-tier plan between Basic and Premium',
          impact: 'Potential 340 new subscribers',
          confidence: 74,
          priority: 'medium',
          action: 'Develop new plan',
          data: {
            targetSpeed: '75 Mbps',
            suggestedPrice: 749,
            marketDemand: '340 users'
          },
          aiInsight: 'Analysis of user upgrade patterns shows 23% of Basic users want more speed but find Premium too expensive.',
          implementationSteps: [
            'Validate market research',
            'Design plan features',
            'Set competitive pricing',
            'Launch pilot program'
          ]
        }
      );
    } else {
      // End-user recommendations
      const currentPlan = userSubscriptions?.[0];
      if (currentPlan) {
        baseRecommendations.push(
          {
            id: '4',
            type: 'plan_upgrade',
            category: 'optimization',
            title: 'Upgrade Recommendation',
            description: 'Your usage patterns suggest you could benefit from a higher speed plan',
            impact: 'Better streaming and faster downloads',
            confidence: 85,
            priority: 'medium',
            action: 'Consider upgrading',
            data: {
              currentPlan: currentPlan.planName,
              suggestedPlan: 'Fibernet Ultra',
              usagePattern: 'High evening usage detected',
              speedImprovement: '2x faster'
            },
            aiInsight: 'Your peak usage hours (8-10 PM) show bandwidth constraints. Upgrading would eliminate buffering during streaming.',
            implementationSteps: [
              'Review current usage',
              'Compare plan benefits',
              'Schedule upgrade',
              'Enjoy improved performance'
            ]
          },
          {
            id: '5',
            type: 'cost_savings',
            category: 'savings',
            title: 'Potential Cost Savings',
            description: 'Based on your usage, you might save money with a different plan',
            impact: 'Save ₹200/month',
            confidence: 72,
            priority: 'low',
            action: 'Review plan options',
            data: {
              currentCost: 999,
              suggestedPlan: 'Fibernet Basic',
              monthlySavings: 200,
              usageEfficiency: '68%'
            },
            aiInsight: 'Your average usage is 45GB/month, well within Basic plan limits. Consider downgrading to save costs.',
            implementationSteps: [
              'Analyze usage history',
              'Compare plan features',
              'Ensure adequate speed',
              'Switch if suitable'
            ]
          }
        );
      }

      baseRecommendations.push(
        {
          id: '6',
          type: 'feature_suggestion',
          category: 'features',
          title: 'Optimize Your Connection',
          description: 'Tips to improve your internet experience based on your usage patterns',
          impact: 'Up to 30% better performance',
          confidence: 90,
          priority: 'low',
          action: 'Apply optimizations',
          data: {
            currentSpeed: '85% efficiency',
            optimizationPotential: '30%',
            recommendations: ['Router placement', 'Peak hour usage']
          },
          aiInsight: 'Your connection efficiency can be improved through better router placement and avoiding peak congestion hours.',
          implementationSteps: [
            'Check router placement',
            'Update firmware',
            'Optimize WiFi channels',
            'Monitor improvements'
          ]
        }
      );
    }

    return baseRecommendations;
  };

  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'revenue_optimization': return 'bi-graph-up text-success';
      case 'churn_prevention': return 'bi-shield-exclamation text-warning';
      case 'plan_optimization': return 'bi-gear text-info';
      case 'plan_upgrade': return 'bi-arrow-up-circle text-primary';
      case 'cost_savings': return 'bi-piggy-bank text-success';
      case 'feature_suggestion': return 'bi-lightbulb text-warning';
      default: return 'bi-robot text-primary';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'urgent': return 'badge bg-danger';
      case 'high': return 'badge bg-warning';
      case 'medium': return 'badge bg-info';
      case 'low': return 'badge bg-secondary';
      default: return 'badge bg-primary';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 85) return 'text-success';
    if (confidence >= 70) return 'text-warning';
    return 'text-danger';
  };

  const filteredRecommendations = selectedCategory === 'all' 
    ? recommendations 
    : recommendations.filter(rec => rec.category === selectedCategory);

  const categories = ['all', ...new Set(recommendations.map(rec => rec.category))];

  const handleActionClick = (recommendation) => {
    // TODO: Implement actual action handling
    console.log('Action clicked for recommendation:', recommendation);
    
    // For demo purposes, show an alert
    alert(`Action: ${recommendation.action}\n\nThis would normally trigger the appropriate workflow for implementing this recommendation.`);
  };

  if (loading) {
    return (
      <div className="ai-recommendations loading">
        <div className="text-center py-3">
          <div className="spinner-border spinner-border-sm text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 mb-0">Generating AI recommendations...</p>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="ai-recommendations empty">
        <div className="text-center py-3">
          <i className="bi bi-robot display-6 text-muted"></i>
          <p className="mt-2 mb-0 text-muted">No recommendations available at this time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-recommendations">
      <div className="recommendations-header">
        <div className="header-content">
          <h5 className="recommendations-title">
            <i className="bi bi-robot me-2"></i>
            AI Recommendations
          </h5>
          <p className="recommendations-subtitle">
            Personalized insights powered by machine learning
          </p>
        </div>
        
        {categories.length > 2 && (
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`btn btn-sm ${selectedCategory === category ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="recommendations-list">
        {filteredRecommendations.map(recommendation => (
          <div key={recommendation.id} className="recommendation-card">
            <div className="recommendation-header">
              <div className="recommendation-icon">
                <i className={getRecommendationIcon(recommendation.type)}></i>
              </div>
              <div className="recommendation-meta">
                <span className={getPriorityBadge(recommendation.priority)}>
                  {recommendation.priority}
                </span>
                <span className={`confidence-score ${getConfidenceColor(recommendation.confidence)}`}>
                  {recommendation.confidence}% confidence
                </span>
              </div>
            </div>

            <div className="recommendation-content">
              <h6 className="recommendation-title">{recommendation.title}</h6>
              <p className="recommendation-description">{recommendation.description}</p>
              
              <div className="recommendation-impact">
                <strong>Expected Impact:</strong> {recommendation.impact}
              </div>

              <div className="ai-insight">
                <div className="insight-header">
                  <i className="bi bi-lightbulb me-1"></i>
                  <strong>AI Insight</strong>
                </div>
                <p className="insight-text">{recommendation.aiInsight}</p>
              </div>

              {recommendation.data && (
                <div className="recommendation-data">
                  <div className="data-grid">
                    {Object.entries(recommendation.data).map(([key, value]) => (
                      <div key={key} className="data-item">
                        <span className="data-label">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                        </span>
                        <span className="data-value">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {recommendation.implementationSteps && (
                <div className="implementation-steps">
                  <strong>Implementation Steps:</strong>
                  <ol className="steps-list">
                    {recommendation.implementationSteps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>

            <div className="recommendation-actions">
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => handleActionClick(recommendation)}
              >
                <i className="bi bi-check-circle me-1"></i>
                {recommendation.action}
              </button>
              <button className="btn btn-outline-secondary btn-sm">
                <i className="bi bi-x-circle me-1"></i>
                Dismiss
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="recommendations-footer">
        <div className="ai-disclaimer">
          <i className="bi bi-info-circle me-1"></i>
          <small className="text-muted">
            Recommendations are generated using AI analysis of usage patterns, market data, and business metrics. 
            Results may vary and should be evaluated in context.
          </small>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendations;
