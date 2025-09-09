import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CreateUser = ({ onUserCreated, onCancel }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'staff',
    department: '',
    employeeId: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [fieldValidation, setFieldValidation] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState('');

  const departments = [
    { value: 'inventory', label: 'Inventory Management' },
    { value: 'sales', label: 'Sales' },
    { value: 'procurement', label: 'Procurement' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'finance', label: 'Finance' }
  ];

  const steps = [
    {
      id: 1,
      title: 'Personal Information',
      icon: 'bi-person-fill',
      fields: ['name', 'email', 'phone']
    },
    {
      id: 2,
      title: 'Account Details',
      icon: 'bi-shield-lock-fill',
      fields: ['password', 'confirmPassword']
    },
    {
      id: 3,
      title: 'Role & Department',
      icon: 'bi-building-fill',
      fields: ['role', 'department', 'employeeId']
    }
  ];

  // Check for duplicate user details
  const checkDuplicateUser = async (field, value) => {
    if (!value || (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/auth/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        const existingUsers = response.data.data.users;
        const duplicate = existingUsers.find(user => 
          (field === 'email' && user.email.toLowerCase() === value.toLowerCase()) ||
          (field === 'employeeId' && user.employeeId === value)
        );
        
        if (duplicate) {
          const fieldName = field === 'employeeId' ? 'Employee ID' : 'Email';
          setDuplicateWarning(`⚠️ ${fieldName} "${value}" is already registered for user: ${duplicate.name}`);
          return true;
        } else {
          setDuplicateWarning('');
          return false;
        }
      }
    } catch (error) {
      console.error('Error checking duplicate user:', error);
    }
    return false;
  };

  // Real-time validation
  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Name is required';
        else if (value.length < 2) error = 'Name must be at least 2 characters';
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) error = 'Email is required';
        else if (!emailRegex.test(value)) error = 'Please enter a valid email';
        break;
      case 'phone':
        const phoneRegex = /^\+?[\d\s\-\(\)]{10,15}$/;
        if (value && !phoneRegex.test(value)) error = 'Phone number must be 10-15 digits';
        break;
      case 'password':
        if (!value) error = 'Password is required';
        else if (value.length < 6) error = 'Password must be at least 6 characters';
        else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) 
          error = 'Password must contain uppercase, lowercase, and number';
        break;
      case 'confirmPassword':
        if (!value) error = 'Please confirm your password';
        else if (value !== formData.password) error = 'Passwords do not match';
        break;
      case 'employeeId':
        if (!value) error = 'Employee ID is required';
        else if (value.length < 3) error = 'Employee ID must be at least 3 characters';
        break;
      case 'department':
        if (!value) error = 'Department is required';
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Real-time validation
    const error = validateField(name, value);
    setFieldValidation(prev => ({
      ...prev,
      [name]: {
        isValid: !error,
        error: error,
        touched: true
      }
    }));
    
    // Check for duplicates on email and employeeId
    if ((name === 'email' || name === 'employeeId') && value.trim()) {
      // Debounce the duplicate check
      setTimeout(async () => {
        if (formData[name] === value) { // Only check if value hasn't changed
          await checkDuplicateUser(name, value);
        }
      }, 500);
    }
    
    // Clear general errors
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const roles = [
    { value: 'staff', label: 'Staff', color: 'info', icon: 'bi-person' },
    { value: 'manager', label: 'Manager', color: 'warning', icon: 'bi-people' },
    { value: 'admin', label: 'Admin', color: 'danger', icon: 'bi-shield-check' }
  ];

  // Step navigation functions
  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const validateCurrentStep = () => {
    const currentStepData = steps.find(step => step.id === currentStep);
    let isValid = true;
    const newErrors = {};

    currentStepData.fields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Password strength calculation
  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const getPasswordStrengthLabel = (strength) => {
    if (strength <= 2) return { label: 'Weak', color: 'danger' };
    if (strength <= 4) return { label: 'Medium', color: 'warning' };
    return { label: 'Strong', color: 'success' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all required fields before submission
    const requiredFields = ['name', 'email', 'password', 'confirmPassword', 'employeeId', 'department'];
    const validationErrors = {};
    
    requiredFields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        validationErrors[field] = error;
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccess('');

    try {
      const { confirmPassword, ...userData } = formData;
      const token = localStorage.getItem('token');
      
      // Debug logging
      console.log('Form data being sent:', userData);
      console.log('Token:', token ? 'Present' : 'Missing');
      
      const response = await axios.post('http://localhost:5000/api/auth/admin/create-user', userData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setSuccess('User created successfully!');
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'staff',
          department: '',
          employeeId: '',
          phone: ''
        });
        setCurrentStep(1);
        setFieldValidation({});
        setDuplicateWarning('');

        // Notify parent component
        if (onUserCreated) {
          onUserCreated(response.data.data.user);
        }

        // Auto-close after success
        setTimeout(() => {
          if (onCancel) onCancel();
        }, 2000);
      }
    } catch (error) {
      console.error('Create user error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to create user';
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // Render input field with validation
  const renderInputField = (name, label, type = 'text', placeholder = '', icon = '') => {
    const validation = fieldValidation[name];
    const hasError = errors[name];
    const isValid = validation?.isValid && validation?.touched;
    
    return (
      <div className="mb-4">
        <label className="form-label text-white fw-semibold">
          {icon && <i className={`${icon} me-2`}></i>}
          {label}
        </label>
        <div className="position-relative">
          <input
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            className={`form-control form-control-lg bg-dark text-white border-2 ${
              hasError ? 'border-danger' : isValid ? 'border-success' : 'border-secondary'
            }`}
            placeholder={placeholder}
            style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              transition: 'all 0.3s ease',
              paddingRight: '45px'
            }}
          />
          {/* Validation icon */}
          <div className="position-absolute top-50 end-0 translate-middle-y me-3">
            {hasError && <i className="bi bi-exclamation-circle text-danger"></i>}
            {isValid && <i className="bi bi-check-circle text-success"></i>}
          </div>
        </div>
        {hasError && (
          <div className="text-danger small mt-1">
            <i className="bi bi-exclamation-triangle me-1"></i>
            {hasError}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Modern Card Design */}
          <div className="card border-0 shadow-lg" style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px'
          }}>
            <div className="card-body p-5">
              {/* Header */}
              <div className="text-center mb-5">
                <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" 
                     style={{
                       width: '80px',
                       height: '80px',
                       background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                       animation: 'pulse 2s infinite'
                     }}>
                  <i className="bi bi-person-plus-fill text-white" style={{fontSize: '2rem'}}></i>
                </div>
                <h2 className="text-white mb-2 fw-bold">Create New User</h2>
                <p className="text-light opacity-75">Follow the steps to add a new team member</p>
              </div>

              {/* Progress Steps */}
              <div className="row mb-5">
                {steps.map((step, index) => (
                  <div key={step.id} className="col-4">
                    <div className="d-flex align-items-center">
                      <div className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${
                        currentStep >= step.id ? 'bg-primary' : 'bg-secondary'
                      }`} style={{width: '50px', height: '50px', transition: 'all 0.3s ease'}}>
                        <i className={`${step.icon} text-white`}></i>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className={`mb-0 ${currentStep >= step.id ? 'text-primary' : 'text-secondary'}`}>
                          Step {step.id}
                        </h6>
                        <small className={`${currentStep >= step.id ? 'text-white' : 'text-muted'}`}>
                          {step.title}
                        </small>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`flex-grow-1 border-top border-2 ms-3 ${
                          currentStep > step.id ? 'border-primary' : 'border-secondary'
                        }`} style={{transition: 'all 0.3s ease'}}></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Duplicate Warning Display */}
              {duplicateWarning && (
                <div className="alert alert-warning border-0 rounded-3 mb-4" style={{backgroundColor: 'rgba(255, 193, 7, 0.1)'}}>
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {duplicateWarning}
                  <div className="mt-2">
                    <small className="text-muted">
                      You can still proceed, but this will create a duplicate entry.
                    </small>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {errors.general && (
                <div className="alert alert-danger border-0 rounded-3 mb-4" style={{backgroundColor: 'rgba(220, 53, 69, 0.1)'}}>
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {errors.general}
                </div>
              )}

              {/* Success Display */}
              {success && (
                <div className="alert alert-success border-0 rounded-3 mb-4" style={{backgroundColor: 'rgba(25, 135, 84, 0.1)'}}>
                  <i className="bi bi-check-circle me-2"></i>
                  {success}
                </div>
              )}

              {/* Form Steps */}
              <form onSubmit={handleSubmit}>
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div className="step-content" style={{minHeight: '400px'}}>
                    <div className="row">
                      <div className="col-md-6">
                        {renderInputField('name', 'Full Name', 'text', 'Enter full name', 'bi-person')}
                      </div>
                      <div className="col-md-6">
                        {renderInputField('employeeId', 'Employee ID', 'text', 'e.g., EMP001', 'bi-badge-tm')}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        {renderInputField('email', 'Email Address', 'email', 'Enter email address', 'bi-envelope')}
                      </div>
                      <div className="col-md-6">
                        {renderInputField('phone', 'Phone Number', 'tel', 'Enter phone number', 'bi-telephone')}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Account Details */}
                {currentStep === 2 && (
                  <div className="step-content" style={{minHeight: '400px'}}>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-4">
                          <label className="form-label text-white fw-semibold">
                            <i className="bi bi-lock me-2"></i>Password
                          </label>
                          <div className="position-relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              className={`form-control form-control-lg bg-dark text-white border-2 ${
                                errors.password ? 'border-danger' : fieldValidation.password?.isValid ? 'border-success' : 'border-secondary'
                              }`}
                              placeholder="Enter password"
                              style={{
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                transition: 'all 0.3s ease',
                                paddingRight: '85px'
                              }}
                            />
                            <div className="position-absolute top-50 end-0 translate-middle-y me-3 d-flex gap-2">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary border-0"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                              </button>
                              {errors.password && <i className="bi bi-exclamation-circle text-danger"></i>}
                              {fieldValidation.password?.isValid && <i className="bi bi-check-circle text-success"></i>}
                            </div>
                          </div>
                          {/* Password Strength Indicator */}
                          {formData.password && (
                            <div className="mt-2">
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <small className="text-muted">Password Strength</small>
                                <small className={`text-${getPasswordStrengthLabel(getPasswordStrength(formData.password)).color}`}>
                                  {getPasswordStrengthLabel(getPasswordStrength(formData.password)).label}
                                </small>
                              </div>
                              <div className="progress" style={{height: '4px'}}>
                                <div
                                  className={`progress-bar bg-${getPasswordStrengthLabel(getPasswordStrength(formData.password)).color}`}
                                  style={{width: `${(getPasswordStrength(formData.password) / 6) * 100}%`, transition: 'width 0.3s ease'}}
                                ></div>
                              </div>
                            </div>
                          )}
                          {errors.password && (
                            <div className="text-danger small mt-1">
                              <i className="bi bi-exclamation-triangle me-1"></i>
                              {errors.password}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-4">
                          <label className="form-label text-white fw-semibold">
                            <i className="bi bi-lock-fill me-2"></i>Confirm Password
                          </label>
                          <div className="position-relative">
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              className={`form-control form-control-lg bg-dark text-white border-2 ${
                                errors.confirmPassword ? 'border-danger' : fieldValidation.confirmPassword?.isValid ? 'border-success' : 'border-secondary'
                              }`}
                              placeholder="Confirm password"
                              style={{
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                transition: 'all 0.3s ease',
                                paddingRight: '85px'
                              }}
                            />
                            <div className="position-absolute top-50 end-0 translate-middle-y me-3 d-flex gap-2">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary border-0"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                              </button>
                              {errors.confirmPassword && <i className="bi bi-exclamation-circle text-danger"></i>}
                              {fieldValidation.confirmPassword?.isValid && <i className="bi bi-check-circle text-success"></i>}
                            </div>
                          </div>
                          {errors.confirmPassword && (
                            <div className="text-danger small mt-1">
                              <i className="bi bi-exclamation-triangle me-1"></i>
                              {errors.confirmPassword}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Role & Department */}
                {currentStep === 3 && (
                  <div className="step-content" style={{minHeight: '400px'}}>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-4">
                          <label className="form-label text-white fw-semibold">
                            <i className="bi bi-shield-check me-2"></i>Role
                          </label>
                          <div className="row g-2">
                            {roles.map(role => (
                              <div key={role.value} className="col-12">
                                <input
                                  type="radio"
                                  className="btn-check"
                                  name="role"
                                  id={`role-${role.value}`}
                                  value={role.value}
                                  checked={formData.role === role.value}
                                  onChange={handleChange}
                                />
                                <label
                                  className={`btn btn-outline-${role.color} w-100 text-start d-flex align-items-center p-3`}
                                  htmlFor={`role-${role.value}`}
                                  style={{transition: 'all 0.3s ease'}}
                                >
                                  <i className={`${role.icon} me-3`} style={{fontSize: '1.2rem'}}></i>
                                  <div>
                                    <div className="fw-semibold">{role.label}</div>
                                    <small className="opacity-75">
                                      {role.value === 'admin' && 'Full system access and user management'}
                                      {role.value === 'manager' && 'Department management and oversight'}
                                      {role.value === 'staff' && 'Basic operations and daily tasks'}
                                    </small>
                                  </div>
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-4">
                          <label className="form-label text-white fw-semibold">
                            <i className="bi bi-building me-2"></i>Department
                          </label>
                          <select
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            className={`form-select form-select-lg bg-dark text-white border-2 ${
                              errors.department ? 'border-danger' : fieldValidation.department?.isValid ? 'border-success' : 'border-secondary'
                            }`}
                            style={{
                              backgroundColor: 'rgba(255,255,255,0.05)',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            <option value="">Select Department</option>
                            {departments.map(dept => (
                              <option key={dept.value} value={dept.value} style={{backgroundColor: '#1a1a2e', color: '#fff'}}>
                                {dept.label}
                              </option>
                            ))}
                          </select>
                          {errors.department && (
                            <div className="text-danger small mt-1">
                              <i className="bi bi-exclamation-triangle me-1"></i>
                              {errors.department}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="d-flex justify-content-between align-items-center mt-5">
                  <div>
                    {currentStep > 1 && (
                      <button
                        type="button"
                        className="btn btn-outline-light btn-lg px-4"
                        onClick={prevStep}
                        disabled={loading}
                      >
                        <i className="bi bi-arrow-left me-2"></i>
                        Previous
                      </button>
                    )}
                  </div>
                  
                  <div className="d-flex gap-2">
                    {onCancel && (
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-lg px-4"
                        onClick={onCancel}
                        disabled={loading}
                      >
                        Cancel
                      </button>
                    )}
                    
                    {currentStep < 3 ? (
                      <button
                        type="button"
                        className="btn btn-primary btn-lg px-4"
                        onClick={nextStep}
                        disabled={loading}
                        style={{background: 'linear-gradient(135deg, #8b5cf6, #ec4899)'}}
                      >
                        Next
                        <i className="bi bi-arrow-right ms-2"></i>
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="btn btn-success btn-lg px-4"
                        disabled={loading}
                        style={{background: 'linear-gradient(135deg, #10b981, #059669)'}}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Creating...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-person-plus me-2"></i>
                            Create User
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
