import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/PlansManagement.css';

const PlansManagement = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Fibernet',
    speed: '',
    monthlyPrice: '',
    dataQuota: '',
    features: [''],
    description: '',
    isActive: true
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
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
          isActive: true,
          subscribers: 1250,
          createdAt: new Date('2024-01-15')
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
          isActive: true,
          subscribers: 850,
          createdAt: new Date('2024-01-20')
        },
        {
          id: '3',
          name: 'Broadband Copper Basic',
          type: 'Broadband Copper',
          speed: '25 Mbps',
          monthlyPrice: 399,
          dataQuota: '500 GB',
          features: ['24/7 Support', 'Free Installation'],
          description: 'Affordable broadband for light usage',
          isActive: true,
          subscribers: 650,
          createdAt: new Date('2024-02-01')
        }
      ];
      setPlans(mockPlans);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching plans:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Replace with actual API call
      const planData = {
        ...formData,
        features: formData.features.filter(f => f.trim() !== ''),
        monthlyPrice: parseFloat(formData.monthlyPrice),
        id: editingPlan ? editingPlan.id : Date.now().toString(),
        subscribers: editingPlan ? editingPlan.subscribers : 0,
        createdAt: editingPlan ? editingPlan.createdAt : new Date()
      };

      if (editingPlan) {
        setPlans(prev => prev.map(p => p.id === editingPlan.id ? planData : p));
      } else {
        setPlans(prev => [...prev, planData]);
      }

      resetForm();
      setShowCreateModal(false);
      setEditingPlan(null);
    } catch (error) {
      console.error('Error saving plan:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'Fibernet',
      speed: '',
      monthlyPrice: '',
      dataQuota: '',
      features: [''],
      description: '',
      isActive: true
    });
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      type: plan.type,
      speed: plan.speed,
      monthlyPrice: plan.monthlyPrice.toString(),
      dataQuota: plan.dataQuota,
      features: [...plan.features],
      description: plan.description,
      isActive: plan.isActive
    });
    setShowCreateModal(true);
  };

  const handleDelete = async (planId) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        // TODO: Replace with actual API call
        setPlans(prev => prev.filter(p => p.id !== planId));
      } catch (error) {
        console.error('Error deleting plan:', error);
      }
    }
  };

  const togglePlanStatus = async (planId) => {
    try {
      // TODO: Replace with actual API call
      setPlans(prev => prev.map(p => 
        p.id === planId ? { ...p, isActive: !p.isActive } : p
      ));
    } catch (error) {
      console.error('Error updating plan status:', error);
    }
  };

  if (loading) {
    return (
      <div className="plans-management">
        <div className="container-fluid">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading plans...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="plans-management">
      <div className="container-fluid">
        {/* Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="page-title">
                <i className="bi bi-layers me-2"></i>
                Plans Management
              </h1>
              <p className="page-subtitle">Create and manage broadband subscription plans</p>
            </div>
            <div className="col-md-6 text-end">
              <button 
                className="btn btn-primary btn-lg"
                onClick={() => {
                  resetForm();
                  setEditingPlan(null);
                  setShowCreateModal(true);
                }}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Create New Plan
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="stat-card">
              <div className="stat-icon bg-primary">
                <i className="bi bi-layers"></i>
              </div>
              <div className="stat-content">
                <h3>{plans.length}</h3>
                <p>Total Plans</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card">
              <div className="stat-icon bg-success">
                <i className="bi bi-check-circle"></i>
              </div>
              <div className="stat-content">
                <h3>{plans.filter(p => p.isActive).length}</h3>
                <p>Active Plans</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card">
              <div className="stat-icon bg-info">
                <i className="bi bi-people"></i>
              </div>
              <div className="stat-content">
                <h3>{plans.reduce((sum, p) => sum + p.subscribers, 0)}</h3>
                <p>Total Subscribers</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card">
              <div className="stat-icon bg-warning">
                <i className="bi bi-currency-rupee"></i>
              </div>
              <div className="stat-content">
                <h3>₹{Math.round(plans.reduce((sum, p) => sum + (p.monthlyPrice * p.subscribers), 0) / 1000)}K</h3>
                <p>Monthly Revenue</p>
              </div>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="plans-grid">
          <div className="row">
            {plans.map(plan => (
              <div key={plan.id} className="col-lg-4 col-md-6 mb-4">
                <div className={`plan-card ${!plan.isActive ? 'inactive' : ''}`}>
                  <div className="plan-header">
                    <div className="plan-type-badge">
                      <span className={`badge ${plan.type === 'Fibernet' ? 'bg-primary' : 'bg-secondary'}`}>
                        {plan.type}
                      </span>
                      <span className={`status-badge ${plan.isActive ? 'active' : 'inactive'}`}>
                        {plan.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <h4 className="plan-name">{plan.name}</h4>
                    <div className="plan-speed">{plan.speed}</div>
                    <div className="plan-price">
                      <span className="currency">₹</span>
                      <span className="amount">{plan.monthlyPrice}</span>
                      <span className="period">/month</span>
                    </div>
                  </div>

                  <div className="plan-body">
                    <div className="plan-quota">
                      <i className="bi bi-hdd me-2"></i>
                      Data: {plan.dataQuota}
                    </div>
                    <div className="plan-description">
                      {plan.description}
                    </div>
                    <div className="plan-features">
                      <h6>Features:</h6>
                      <ul>
                        {plan.features.map((feature, index) => (
                          <li key={index}>
                            <i className="bi bi-check-circle-fill me-2"></i>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="plan-stats">
                      <div className="stat-item">
                        <i className="bi bi-people me-1"></i>
                        {plan.subscribers} subscribers
                      </div>
                      <div className="stat-item">
                        <i className="bi bi-calendar me-1"></i>
                        Created {plan.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="plan-actions">
                    <button 
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleEdit(plan)}
                    >
                      <i className="bi bi-pencil me-1"></i>
                      Edit
                    </button>
                    <button 
                      className={`btn btn-sm ${plan.isActive ? 'btn-outline-warning' : 'btn-outline-success'}`}
                      onClick={() => togglePlanStatus(plan.id)}
                    >
                      <i className={`bi ${plan.isActive ? 'bi-pause' : 'bi-play'} me-1`}></i>
                      {plan.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button 
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(plan.id)}
                    >
                      <i className="bi bi-trash me-1"></i>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Create/Edit Plan Modal */}
        {showCreateModal && (
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingPlan ? 'Edit Plan' : 'Create New Plan'}
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingPlan(null);
                      resetForm();
                    }}
                  ></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Plan Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Plan Type</label>
                          <select
                            className="form-select"
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="Fibernet">Fibernet</option>
                            <option value="Broadband Copper">Broadband Copper</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-4">
                        <div className="mb-3">
                          <label className="form-label">Speed</label>
                          <input
                            type="text"
                            className="form-control"
                            name="speed"
                            value={formData.speed}
                            onChange={handleInputChange}
                            placeholder="e.g., 100 Mbps"
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-3">
                          <label className="form-label">Monthly Price (₹)</label>
                          <input
                            type="number"
                            className="form-control"
                            name="monthlyPrice"
                            value={formData.monthlyPrice}
                            onChange={handleInputChange}
                            min="0"
                            step="0.01"
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-3">
                          <label className="form-label">Data Quota</label>
                          <input
                            type="text"
                            className="form-control"
                            name="dataQuota"
                            value={formData.dataQuota}
                            onChange={handleInputChange}
                            placeholder="e.g., Unlimited or 500 GB"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="3"
                        required
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Features</label>
                      {formData.features.map((feature, index) => (
                        <div key={index} className="input-group mb-2">
                          <input
                            type="text"
                            className="form-control"
                            value={feature}
                            onChange={(e) => handleFeatureChange(index, e.target.value)}
                            placeholder="Enter feature"
                          />
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => removeFeature(index)}
                            disabled={formData.features.length === 1}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={addFeature}
                      >
                        <i className="bi bi-plus me-1"></i>
                        Add Feature
                      </button>
                    </div>
                    <div className="mb-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="isActive"
                          checked={formData.isActive}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label">
                          Plan is active
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowCreateModal(false);
                        setEditingPlan(null);
                        resetForm();
                      }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {editingPlan ? 'Update Plan' : 'Create Plan'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlansManagement;
