import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/DiscountsManagement.css';

const DiscountsManagement = () => {
  const { user } = useAuth();
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'percentage',
    value: '',
    code: '',
    minAmount: '',
    maxDiscount: '',
    validFrom: '',
    validUntil: '',
    usageLimit: '',
    targetPlans: [],
    targetUserTypes: [],
    isActive: true
  });

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      // TODO: Replace with actual API call
      const mockDiscounts = [
        {
          id: '1',
          name: 'New User Welcome',
          description: 'Special discount for first-time subscribers',
          type: 'percentage',
          value: 25,
          code: 'WELCOME25',
          minAmount: 500,
          maxDiscount: 500,
          validFrom: new Date('2024-01-01'),
          validUntil: new Date('2024-12-31'),
          usageLimit: 1000,
          usageCount: 234,
          targetPlans: ['Fibernet Basic', 'Fibernet Premium'],
          targetUserTypes: ['new'],
          isActive: true,
          createdDate: new Date('2024-01-01'),
          revenue: 117000,
          conversionRate: 23.4
        },
        {
          id: '2',
          name: 'Upgrade Incentive',
          description: 'Encourage users to upgrade to higher plans',
          type: 'fixed',
          value: 200,
          code: 'UPGRADE200',
          minAmount: 1000,
          maxDiscount: 200,
          validFrom: new Date('2024-06-01'),
          validUntil: new Date('2024-08-31'),
          usageLimit: 500,
          usageCount: 89,
          targetPlans: ['Fibernet Ultra'],
          targetUserTypes: ['existing'],
          isActive: true,
          createdDate: new Date('2024-06-01'),
          revenue: 89000,
          conversionRate: 17.8
        },
        {
          id: '3',
          name: 'Student Discount',
          description: 'Special pricing for students',
          type: 'percentage',
          value: 15,
          code: 'STUDENT15',
          minAmount: 300,
          maxDiscount: 300,
          validFrom: new Date('2024-03-01'),
          validUntil: new Date('2024-12-31'),
          usageLimit: 2000,
          usageCount: 567,
          targetPlans: ['Fibernet Basic', 'Broadband Copper Basic'],
          targetUserTypes: ['student'],
          isActive: true,
          createdDate: new Date('2024-03-01'),
          revenue: 170100,
          conversionRate: 28.4
        },
        {
          id: '4',
          name: 'Summer Special',
          description: 'Limited time summer offer',
          type: 'percentage',
          value: 30,
          code: 'SUMMER30',
          minAmount: 800,
          maxDiscount: 600,
          validFrom: new Date('2024-05-01'),
          validUntil: new Date('2024-07-31'),
          usageLimit: 300,
          usageCount: 298,
          targetPlans: ['Fibernet Premium', 'Fibernet Ultra'],
          targetUserTypes: ['new', 'existing'],
          isActive: false,
          createdDate: new Date('2024-05-01'),
          revenue: 178800,
          conversionRate: 99.3
        }
      ];
      setDiscounts(mockDiscounts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching discounts:', error);
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

  const handleArrayInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateDiscountCode = () => {
    const prefix = formData.name.toUpperCase().replace(/\s+/g, '').substring(0, 6);
    const suffix = Math.floor(Math.random() * 100);
    setFormData(prev => ({
      ...prev,
      code: `${prefix}${suffix}`
    }));
  };

  const openModal = (discount = null) => {
    if (discount) {
      setEditingDiscount(discount);
      setFormData({
        name: discount.name,
        description: discount.description,
        type: discount.type,
        value: discount.value.toString(),
        code: discount.code,
        minAmount: discount.minAmount.toString(),
        maxDiscount: discount.maxDiscount.toString(),
        validFrom: discount.validFrom.toISOString().split('T')[0],
        validUntil: discount.validUntil.toISOString().split('T')[0],
        usageLimit: discount.usageLimit.toString(),
        targetPlans: discount.targetPlans,
        targetUserTypes: discount.targetUserTypes,
        isActive: discount.isActive
      });
    } else {
      setEditingDiscount(null);
      setFormData({
        name: '',
        description: '',
        type: 'percentage',
        value: '',
        code: '',
        minAmount: '',
        maxDiscount: '',
        validFrom: '',
        validUntil: '',
        usageLimit: '',
        targetPlans: [],
        targetUserTypes: [],
        isActive: true
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingDiscount(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Replace with actual API call
      const discountData = {
        ...formData,
        value: parseFloat(formData.value),
        minAmount: parseFloat(formData.minAmount),
        maxDiscount: parseFloat(formData.maxDiscount),
        usageLimit: parseInt(formData.usageLimit),
        validFrom: new Date(formData.validFrom),
        validUntil: new Date(formData.validUntil)
      };

      if (editingDiscount) {
        // Update existing discount
        setDiscounts(prev => prev.map(discount => 
          discount.id === editingDiscount.id 
            ? { ...discount, ...discountData }
            : discount
        ));
      } else {
        // Create new discount
        const newDiscount = {
          id: Date.now().toString(),
          ...discountData,
          usageCount: 0,
          createdDate: new Date(),
          revenue: 0,
          conversionRate: 0
        };
        setDiscounts(prev => [...prev, newDiscount]);
      }

      closeModal();
    } catch (error) {
      console.error('Error saving discount:', error);
    }
  };

  const toggleDiscountStatus = async (discountId) => {
    try {
      // TODO: Replace with actual API call
      setDiscounts(prev => prev.map(discount => 
        discount.id === discountId 
          ? { ...discount, isActive: !discount.isActive }
          : discount
      ));
    } catch (error) {
      console.error('Error toggling discount status:', error);
    }
  };

  const deleteDiscount = async (discountId) => {
    if (window.confirm('Are you sure you want to delete this discount?')) {
      try {
        // TODO: Replace with actual API call
        setDiscounts(prev => prev.filter(discount => discount.id !== discountId));
      } catch (error) {
        console.error('Error deleting discount:', error);
      }
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

  const getDiscountValue = (discount) => {
    return discount.type === 'percentage' ? `${discount.value}%` : formatCurrency(discount.value);
  };

  const getUsagePercentage = (discount) => {
    return Math.round((discount.usageCount / discount.usageLimit) * 100);
  };

  const availablePlans = ['Fibernet Basic', 'Fibernet Premium', 'Fibernet Ultra', 'Broadband Copper Basic'];
  const userTypes = ['new', 'existing', 'student', 'corporate'];

  if (loading) {
    return (
      <div className="discounts-management">
        <div className="container-fluid">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading discounts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="discounts-management">
      <div className="container-fluid">
        {/* Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="page-title">
                <i className="bi bi-percent me-2"></i>
                Discounts Management
              </h1>
              <p className="page-subtitle">Create and manage promotional discounts and offers</p>
            </div>
            <div className="col-md-4 text-end">
              <button 
                className="btn btn-primary btn-lg"
                onClick={() => openModal()}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Create Discount
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="stat-card active">
              <div className="stat-icon">
                <i className="bi bi-check-circle"></i>
              </div>
              <div className="stat-content">
                <h3>{discounts.filter(d => d.isActive).length}</h3>
                <p>Active Discounts</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="stat-card usage">
              <div className="stat-icon">
                <i className="bi bi-graph-up"></i>
              </div>
              <div className="stat-content">
                <h3>{formatNumber(discounts.reduce((sum, d) => sum + d.usageCount, 0))}</h3>
                <p>Total Usage</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="stat-card revenue">
              <div className="stat-icon">
                <i className="bi bi-currency-rupee"></i>
              </div>
              <div className="stat-content">
                <h3>{formatCurrency(discounts.reduce((sum, d) => sum + d.revenue, 0))}</h3>
                <p>Revenue Generated</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="stat-card conversion">
              <div className="stat-icon">
                <i className="bi bi-target"></i>
              </div>
              <div className="stat-content">
                <h3>{(discounts.reduce((sum, d) => sum + d.conversionRate, 0) / discounts.length).toFixed(1)}%</h3>
                <p>Avg Conversion Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Discounts Grid */}
        <div className="row">
          {discounts.map(discount => (
            <div key={discount.id} className="col-lg-6 col-xl-4 mb-4">
              <div className={`discount-card ${!discount.isActive ? 'inactive' : ''}`}>
                <div className="discount-header">
                  <div className="discount-status">
                    <span className={`status-badge ${discount.isActive ? 'active' : 'inactive'}`}>
                      {discount.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="discount-type">{discount.type}</span>
                  </div>
                  <h3 className="discount-name">{discount.name}</h3>
                  <div className="discount-value">{getDiscountValue(discount)}</div>
                  <div className="discount-code">
                    <i className="bi bi-tag me-1"></i>
                    {discount.code}
                  </div>
                </div>

                <div className="discount-body">
                  <p className="discount-description">{discount.description}</p>
                  
                  <div className="discount-details">
                    <div className="detail-row">
                      <span className="label">Min Amount:</span>
                      <span className="value">{formatCurrency(discount.minAmount)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Max Discount:</span>
                      <span className="value">{formatCurrency(discount.maxDiscount)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Valid Until:</span>
                      <span className="value">{discount.validUntil.toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="usage-progress">
                    <div className="usage-header">
                      <span>Usage: {discount.usageCount}/{discount.usageLimit}</span>
                      <span>{getUsagePercentage(discount)}%</span>
                    </div>
                    <div className="progress">
                      <div 
                        className="progress-bar"
                        style={{ width: `${getUsagePercentage(discount)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="performance-metrics">
                    <div className="metric">
                      <span className="metric-label">Revenue</span>
                      <span className="metric-value">{formatCurrency(discount.revenue)}</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Conversion</span>
                      <span className="metric-value">{discount.conversionRate}%</span>
                    </div>
                  </div>

                  <div className="target-info">
                    <div className="target-plans">
                      <strong>Target Plans:</strong>
                      <div className="plan-tags">
                        {discount.targetPlans.map((plan, index) => (
                          <span key={index} className="plan-tag">{plan}</span>
                        ))}
                      </div>
                    </div>
                    <div className="target-users">
                      <strong>User Types:</strong>
                      <div className="user-tags">
                        {discount.targetUserTypes.map((type, index) => (
                          <span key={index} className="user-tag">{type}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="discount-actions">
                  <button 
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => openModal(discount)}
                  >
                    <i className="bi bi-pencil me-1"></i>
                    Edit
                  </button>
                  <button 
                    className={`btn btn-sm ${discount.isActive ? 'btn-warning' : 'btn-success'}`}
                    onClick={() => toggleDiscountStatus(discount.id)}
                  >
                    <i className={`bi ${discount.isActive ? 'bi-pause' : 'bi-play'} me-1`}></i>
                    {discount.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button 
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => deleteDiscount(discount.id)}
                  >
                    <i className="bi bi-trash me-1"></i>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingDiscount ? 'Edit Discount' : 'Create New Discount'}
                  </h5>
                  <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Discount Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Discount Type</label>
                        <select
                          className="form-select"
                          name="type"
                          value={formData.type}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="percentage">Percentage</option>
                          <option value="fixed">Fixed Amount</option>
                        </select>
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

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          {formData.type === 'percentage' ? 'Percentage (%)' : 'Amount (₹)'}
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          name="value"
                          value={formData.value}
                          onChange={handleInputChange}
                          min="0"
                          max={formData.type === 'percentage' ? '100' : undefined}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Discount Code</label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            name="code"
                            value={formData.code}
                            onChange={handleInputChange}
                            required
                          />
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={generateDiscountCode}
                          >
                            Generate
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Minimum Amount (₹)</label>
                        <input
                          type="number"
                          className="form-control"
                          name="minAmount"
                          value={formData.minAmount}
                          onChange={handleInputChange}
                          min="0"
                          required
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Max Discount (₹)</label>
                        <input
                          type="number"
                          className="form-control"
                          name="maxDiscount"
                          value={formData.maxDiscount}
                          onChange={handleInputChange}
                          min="0"
                          required
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Usage Limit</label>
                        <input
                          type="number"
                          className="form-control"
                          name="usageLimit"
                          value={formData.usageLimit}
                          onChange={handleInputChange}
                          min="1"
                          required
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Valid From</label>
                        <input
                          type="date"
                          className="form-control"
                          name="validFrom"
                          value={formData.validFrom}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Valid Until</label>
                        <input
                          type="date"
                          className="form-control"
                          name="validUntil"
                          value={formData.validUntil}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Target Plans</label>
                      <div className="checkbox-group">
                        {availablePlans.map(plan => (
                          <div key={plan} className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`plan-${plan}`}
                              checked={formData.targetPlans.includes(plan)}
                              onChange={(e) => {
                                const newPlans = e.target.checked
                                  ? [...formData.targetPlans, plan]
                                  : formData.targetPlans.filter(p => p !== plan);
                                handleArrayInputChange('targetPlans', newPlans);
                              }}
                            />
                            <label className="form-check-label" htmlFor={`plan-${plan}`}>
                              {plan}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Target User Types</label>
                      <div className="checkbox-group">
                        {userTypes.map(type => (
                          <div key={type} className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`user-${type}`}
                              checked={formData.targetUserTypes.includes(type)}
                              onChange={(e) => {
                                const newTypes = e.target.checked
                                  ? [...formData.targetUserTypes, type]
                                  : formData.targetUserTypes.filter(t => t !== type);
                                handleArrayInputChange('targetUserTypes', newTypes);
                              }}
                            />
                            <label className="form-check-label" htmlFor={`user-${type}`}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="isActive"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label" htmlFor="isActive">
                        Activate discount immediately
                      </label>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={closeModal}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {editingDiscount ? 'Update Discount' : 'Create Discount'}
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

export default DiscountsManagement;
