import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const departments = [
    { value: 'inventory', label: 'Inventory' },
    { value: 'sales', label: 'Sales' },
    { value: 'procurement', label: 'Procurement' },
    { value: 'technical', label: 'Technical' },
    { value: 'finance', label: 'Finance' }
  ];

  const roles = [
    { value: 'staff', label: 'Staff', color: 'info' },
    { value: 'manager', label: 'Manager', color: 'warning' },
    { value: 'admin', label: 'Admin', color: 'danger' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registrationData } = formData;
      const result = await register(registrationData);
      
      if (result.success) {
        // Role-based redirection
        const redirectPath = `/${result.user.role}`;
        navigate(redirectPath, { replace: true });
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow">
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <i className="bi bi-lightning-charge-fill text-primary fs-1"></i>
                  <h2 className="fw-bold text-dark">Join Lumen Quest</h2>
                  <p className="text-muted">Create your account</p>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="name" className="form-label">
                        <i className="bi bi-person me-1"></i>
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="employeeId" className="form-label">
                        <i className="bi bi-badge-tm me-1"></i>
                        Employee ID
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="employeeId"
                        name="employeeId"
                        value={formData.employeeId}
                        onChange={handleChange}
                        required
                        placeholder="e.g., EMP001"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      <i className="bi bi-envelope me-1"></i>
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="password" className="form-label">
                        <i className="bi bi-lock me-1"></i>
                        Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Min 6 characters"
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="confirmPassword" className="form-label">
                        <i className="bi bi-lock-fill me-1"></i>
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        placeholder="Repeat password"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="role" className="form-label">
                        <i className="bi bi-shield-check me-1"></i>
                        Role
                      </label>
                      <select
                        className="form-select"
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                      >
                        {roles.map(role => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                      <div className="form-text">
                        <span className={`badge bg-${roles.find(r => r.value === formData.role)?.color}`}>
                          {roles.find(r => r.value === formData.role)?.label}
                        </span>
                      </div>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="department" className="form-label">
                        <i className="bi bi-building me-1"></i>
                        Department
                      </label>
                      <select
                        className="form-select"
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                          <option key={dept.value} value={dept.value}>
                            {dept.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">
                      <i className="bi bi-telephone me-1"></i>
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit phone number"
                      pattern="[0-9]{10}"
                    />
                  </div>

                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-person-plus me-2"></i>
                          Create Account
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <div className="text-center mt-4">
                  <p className="mb-0">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary text-decoration-none">
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-3">
              <small className="text-muted">
                © 2025 Lumen Quest. Telecom Inventory Management System
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
