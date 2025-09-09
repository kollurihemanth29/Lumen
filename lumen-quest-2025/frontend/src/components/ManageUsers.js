import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    role: 'staff',
    department: 'inventory',
    employeeId: '',
    phone: ''
  });

  const { user: currentUser, token } = useAuth();

  useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      fetchUsers();
    }
  }, [currentUser]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/auth/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setUsers(response.data.data.users);
      }
    } catch (error) {
      console.error('ManageUsers - Response status:', error.response?.status);
      setError('Failed to fetch users: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };


  // Filter and sort users
  const filteredAndSortedUsers = users
    .filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === 'all' || user.role === filterRole;
      const matchesDepartment = filterDepartment === 'all' || user.department === filterDepartment;
      return matchesSearch && matchesRole && matchesDepartment;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/auth/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(users.filter(u => u._id !== userId));
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (error) {
      setError('Failed to delete user: ' + (error.response?.data?.message || error.message));
    }
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const openEditModal = (user) => {
    setUserToEdit(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      employeeId: user.employeeId,
      phone: user.phone || ''
    });
    setShowEditModal(true);
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/api/auth/admin/users/${userToEdit._id}`, editFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        // Update the user in the users array
        setUsers(users.map(user => 
          user._id === userToEdit._id ? response.data.data.user : user
        ));
        setShowEditModal(false);
        setUserToEdit(null);
        setError('');
      }
    } catch (error) {
      setError('Failed to update user: ' + (error.response?.data?.message || error.message));
    }
  };

  const getUserStats = () => {
    const total = users.length;
    const active = users.filter(u => u.isActive).length;
    const admins = users.filter(u => u.role === 'admin').length;
    const managers = users.filter(u => u.role === 'manager').length;
    const staff = users.filter(u => u.role === 'staff').length;
    return { total, active, admins, managers, staff };
  };

  const stats = getUserStats();

  if (!currentUser || currentUser.role !== 'admin') {
    return <div>Access denied. Admin privileges required.</div>;
  }

  return (
    <div className="container-fluid">
      {/* Header Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="text-white mb-2 fw-bold">
                <i className="bi bi-people-fill me-3"></i>
                User Management
              </h1>
              <p className="text-light opacity-75 mb-0">Manage system users, roles, and permissions</p>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-light btn-lg">
                <i className="bi bi-download me-2"></i>
                Export
              </button>
              <button 
                className="btn btn-primary btn-lg" 
                style={{background: 'linear-gradient(135deg, #8b5cf6, #ec4899)'}}
                onClick={() => window.location.href = '/admin/create-user'}
              >
                <i className="bi bi-person-plus me-2"></i>
                Add User
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-xl-2 col-md-4 col-6 mb-3">
          <div className="card border-0 h-100" style={{background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.2))', backdropFilter: 'blur(10px)'}}>
            <div className="card-body text-center">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <div className="rounded-circle bg-primary bg-opacity-20 p-3">
                  <i className="bi bi-people text-primary" style={{fontSize: '1.5rem'}}></i>
                </div>
              </div>
              <h3 className="text-white mb-1">{stats.total}</h3>
              <p className="text-light opacity-75 mb-0 small">Total Users</p>
            </div>
          </div>
        </div>
        <div className="col-xl-2 col-md-4 col-6 mb-3">
          <div className="card border-0 h-100" style={{background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.2))', backdropFilter: 'blur(10px)'}}>
            <div className="card-body text-center">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <div className="rounded-circle bg-success bg-opacity-20 p-3">
                  <i className="bi bi-check-circle text-success" style={{fontSize: '1.5rem'}}></i>
                </div>
              </div>
              <h3 className="text-white mb-1">{stats.active}</h3>
              <p className="text-light opacity-75 mb-0 small">Active Users</p>
            </div>
          </div>
        </div>
        <div className="col-xl-2 col-md-4 col-6 mb-3">
          <div className="card border-0 h-100" style={{background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.2))', backdropFilter: 'blur(10px)'}}>
            <div className="card-body text-center">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <div className="rounded-circle bg-danger bg-opacity-20 p-3">
                  <i className="bi bi-shield-check text-danger" style={{fontSize: '1.5rem'}}></i>
                </div>
              </div>
              <h3 className="text-white mb-1">{stats.admins}</h3>
              <p className="text-light opacity-75 mb-0 small">Admins</p>
            </div>
          </div>
        </div>
        <div className="col-xl-2 col-md-4 col-6 mb-3">
          <div className="card border-0 h-100" style={{background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.2))', backdropFilter: 'blur(10px)'}}>
            <div className="card-body text-center">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <div className="rounded-circle bg-warning bg-opacity-20 p-3">
                  <i className="bi bi-people text-warning" style={{fontSize: '1.5rem'}}></i>
                </div>
              </div>
              <h3 className="text-white mb-1">{stats.managers}</h3>
              <p className="text-light opacity-75 mb-0 small">Managers</p>
            </div>
          </div>
        </div>
        <div className="col-xl-2 col-md-4 col-6 mb-3">
          <div className="card border-0 h-100" style={{background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(99, 102, 241, 0.2))', backdropFilter: 'blur(10px)'}}>
            <div className="card-body text-center">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <div className="rounded-circle bg-info bg-opacity-20 p-3">
                  <i className="bi bi-person text-info" style={{fontSize: '1.5rem'}}></i>
                </div>
              </div>
              <h3 className="text-white mb-1">{stats.staff}</h3>
              <p className="text-light opacity-75 mb-0 small">Staff</p>
            </div>
          </div>
        </div>
        <div className="col-xl-2 col-md-4 col-6 mb-3">
          <div className="card border-0 h-100" style={{background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(168, 85, 247, 0.2))', backdropFilter: 'blur(10px)'}}>
            <div className="card-body text-center">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <div className="rounded-circle bg-purple bg-opacity-20 p-3">
                  <i className="bi bi-graph-up text-purple" style={{fontSize: '1.5rem', color: '#a855f7'}}></i>
                </div>
              </div>
              <h3 className="text-white mb-1">{filteredAndSortedUsers.length}</h3>
              <p className="text-light opacity-75 mb-0 small">Filtered</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="alert alert-danger border-0 rounded-3" style={{backgroundColor: 'rgba(220, 53, 69, 0.1)'}}>
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0" style={{background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.1))', backdropFilter: 'blur(20px)'}}>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-lg-4">
                  <div className="position-relative">
                    <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                    <input
                      type="text"
                      className="form-control form-control-lg bg-dark text-white border-0 ps-5 white-placeholder"
                      placeholder="Search by name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.05)'
                      }}
                    />
                    <style>
                      {`.white-placeholder::placeholder { color: white !important; opacity: 0.8; }`}
                    </style>
                  </div>
                </div>
                <div className="col-lg-2">
                  <select
                    className="form-select form-select-lg bg-dark text-white border-0"
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    style={{backgroundColor: 'rgba(255,255,255,0.05)'}}
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>
                <div className="col-lg-2">
                  <select
                    className="form-select form-select-lg bg-dark text-white border-0"
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    style={{backgroundColor: 'rgba(255,255,255,0.05)'}}
                  >
                    <option value="all">All Departments</option>
                    <option value="inventory">Inventory</option>
                    <option value="sales">Sales</option>
                    <option value="procurement">Procurement</option>
                    <option value="technical">Technical</option>
                    <option value="finance">Finance</option>
                  </select>
                </div>
                <div className="col-lg-2">
                  <select
                    className="form-select form-select-lg bg-dark text-white border-0"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{backgroundColor: 'rgba(255,255,255,0.05)'}}
                  >
                    <option value="name">Sort by Name</option>
                    <option value="email">Sort by Email</option>
                    <option value="role">Sort by Role</option>
                    <option value="department">Sort by Department</option>
                    <option value="employeeId">Sort by Employee ID</option>
                  </select>
                </div>
                <div className="col-lg-2">
                  <button
                    className="btn btn-outline-light btn-lg w-100"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  >
                    <i className={`bi ${sortOrder === 'asc' ? 'bi-sort-alpha-down' : 'bi-sort-alpha-up'} me-2`}></i>
                    {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0" style={{background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.1))', backdropFilter: 'blur(20px)'}}>
            <div className="card-header border-0 bg-transparent">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="text-white mb-0">
                  <i className="bi bi-table me-2"></i>
                  Users Directory ({filteredAndSortedUsers.length} users)
                </h5>
                <div className="d-flex gap-2">
                  <button className="btn btn-outline-light btn-sm" onClick={fetchUsers}>
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Refresh
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-light">Loading users...</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-dark table-hover mb-0">
                    <thead style={{backgroundColor: 'rgba(0,0,0,0.3)'}}>
                      <tr>
                        <th className="border-0 py-3 px-4">
                          <button className="btn btn-link text-white text-decoration-none p-0" onClick={() => handleSort('name')}>
                            <i className="bi bi-person me-2"></i>
                            Name
                            {sortBy === 'name' && <i className={`bi ${sortOrder === 'asc' ? 'bi-chevron-up' : 'bi-chevron-down'} ms-1`}></i>}
                          </button>
                        </th>
                        <th className="border-0 py-3 px-4">
                          <button className="btn btn-link text-white text-decoration-none p-0" onClick={() => handleSort('email')}>
                            <i className="bi bi-envelope me-2"></i>
                            Email
                            {sortBy === 'email' && <i className={`bi ${sortOrder === 'asc' ? 'bi-chevron-up' : 'bi-chevron-down'} ms-1`}></i>}
                          </button>
                        </th>
                        <th className="border-0 py-3 px-4">
                          <button className="btn btn-link text-white text-decoration-none p-0" onClick={() => handleSort('role')}>
                            <i className="bi bi-shield me-2"></i>
                            Role
                            {sortBy === 'role' && <i className={`bi ${sortOrder === 'asc' ? 'bi-chevron-up' : 'bi-chevron-down'} ms-1`}></i>}
                          </button>
                        </th>
                        <th className="border-0 py-3 px-4">
                          <button className="btn btn-link text-white text-decoration-none p-0" onClick={() => handleSort('department')}>
                            <i className="bi bi-building me-2"></i>
                            Department
                            {sortBy === 'department' && <i className={`bi ${sortOrder === 'asc' ? 'bi-chevron-up' : 'bi-chevron-down'} ms-1`}></i>}
                          </button>
                        </th>
                        <th className="border-0 py-3 px-4">
                          <button className="btn btn-link text-white text-decoration-none p-0" onClick={() => handleSort('employeeId')}>
                            <i className="bi bi-badge-tm me-2"></i>
                            Employee ID
                            {sortBy === 'employeeId' && <i className={`bi ${sortOrder === 'asc' ? 'bi-chevron-up' : 'bi-chevron-down'} ms-1`}></i>}
                          </button>
                        </th>
                        <th className="border-0 py-3 px-4">
                          <i className="bi bi-activity me-2"></i>
                          Status
                        </th>
                        <th className="border-0 py-3 px-4 text-center">
                          <i className="bi bi-gear me-2"></i>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSortedUsers.map((user, index) => (
                        <tr key={user._id || `user-${index}`} style={{borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                          <td className="py-3 px-4">
                            <div className="d-flex align-items-center">
                              <div className="rounded-circle bg-primary bg-opacity-20 p-2 me-3">
                                <i className="bi bi-person text-primary"></i>
                              </div>
                              <div>
                                <div className="text-white fw-semibold">{user.name}</div>
                                <small className="text-muted">ID: {user._id ? user._id.slice(-6) : 'N/A'}</small>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-white">{user.email}</div>
                            {user.phone && <small className="text-muted d-block">{user.phone}</small>}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`badge rounded-pill px-3 py-2 ${
                              user.role === 'admin' ? 'bg-danger' : 
                              user.role === 'manager' ? 'bg-warning text-dark' : 
                              'bg-info'
                            }`}>
                              <i className={`bi ${
                                user.role === 'admin' ? 'bi-shield-check' : 
                                user.role === 'manager' ? 'bi-people' : 
                                'bi-person'
                              } me-1`}></i>
                              {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'N/A'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-white text-capitalize">{user.department}</div>
                          </td>
                          <td className="py-3 px-4">
                            <code className="bg-dark text-light px-2 py-1 rounded">{user.employeeId}</code>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`badge rounded-pill px-3 py-2 ${user.isActive ? 'bg-success' : 'bg-secondary'}`}>
                              <i className={`bi ${user.isActive ? 'bi-check-circle' : 'bi-x-circle'} me-1`}></i>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="btn-group" role="group">
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => openEditModal(user)}
                                title="Edit User"
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => openDeleteModal(user)}
                                disabled={user._id === currentUser?._id}
                                title={user._id === currentUser?._id ? "Cannot delete yourself" : "Delete User"}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {filteredAndSortedUsers.length === 0 && (
                    <div className="text-center py-5">
                      <i className="bi bi-search text-muted mb-3" style={{fontSize: '3rem'}}></i>
                      <h5 className="text-light">No users found</h5>
                      <p className="text-muted">Try adjusting your search criteria or filters</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {showEditModal && userToEdit && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.8)'}}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-dark border-primary">
              <div className="modal-header border-primary">
                <h5 className="modal-title text-white">
                  <i className="bi bi-pencil-square text-primary me-2"></i>
                  Edit User: {userToEdit.name}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowEditModal(false)}></button>
              </div>
              <form onSubmit={handleEditUser}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label text-white">
                        <i className="bi bi-person me-2"></i>Name
                      </label>
                      <input
                        type="text"
                        className="form-control bg-dark text-white border-secondary"
                        value={editFormData.name}
                        onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-white">
                        <i className="bi bi-envelope me-2"></i>Email
                      </label>
                      <input
                        type="email"
                        className="form-control bg-dark text-white border-secondary"
                        value={editFormData.email}
                        onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-white">
                        <i className="bi bi-shield me-2"></i>Role
                      </label>
                      <select
                        className="form-select bg-dark text-white border-secondary"
                        value={editFormData.role}
                        onChange={(e) => setEditFormData({...editFormData, role: e.target.value})}
                      >
                        <option value="staff">Staff</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-white">
                        <i className="bi bi-building me-2"></i>Department
                      </label>
                      <select
                        className="form-select bg-dark text-white border-secondary"
                        value={editFormData.department}
                        onChange={(e) => setEditFormData({...editFormData, department: e.target.value})}
                      >
                        <option value="inventory">Inventory</option>
                        <option value="sales">Sales</option>
                        <option value="procurement">Procurement</option>
                        <option value="technical">Technical</option>
                        <option value="finance">Finance</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-white">
                        <i className="bi bi-badge-tm me-2"></i>Employee ID
                      </label>
                      <input
                        type="text"
                        className="form-control bg-dark text-white border-secondary"
                        value={editFormData.employeeId}
                        onChange={(e) => setEditFormData({...editFormData, employeeId: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-white">
                        <i className="bi bi-telephone me-2"></i>Phone
                      </label>
                      <input
                        type="tel"
                        className="form-control bg-dark text-white border-secondary"
                        value={editFormData.phone}
                        onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-primary">
                  <button type="button" className="btn btn-outline-light" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="bi bi-check-circle me-2"></i>
                    Update User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.8)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark border-danger">
              <div className="modal-header border-danger">
                <h5 className="modal-title text-white">
                  <i className="bi bi-exclamation-triangle text-danger me-2"></i>
                  Confirm Deletion
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                <p className="text-light">
                  Are you sure you want to delete the user <strong className="text-warning">{userToDelete.name}</strong>?
                </p>
                <div className="alert alert-warning border-0" style={{backgroundColor: 'rgba(255, 193, 7, 0.1)'}}>
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  This action cannot be undone. All user data will be permanently removed.
                </div>
              </div>
              <div className="modal-footer border-danger">
                <button type="button" className="btn btn-outline-light" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={() => handleDeleteUser(userToDelete._id)}>
                  <i className="bi bi-trash me-2"></i>
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
