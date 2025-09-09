import React from 'react';
import { Link } from 'react-router-dom';

const NotAuthorized = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{background: 'linear-gradient(135deg, #0a0a0f, #1a1a2e)'}}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="card border-0" style={{background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.1))', backdropFilter: 'blur(20px)'}}>
              <div className="card-body text-center p-5">
                <div className="mb-4">
                  <div className="rounded-circle bg-danger bg-opacity-20 p-4 d-inline-flex">
                    <i className="bi bi-shield-x text-danger" style={{fontSize: '3rem'}}></i>
                  </div>
                </div>
                
                <h1 className="text-white mb-3 fw-bold">Access Denied</h1>
                <p className="text-light opacity-75 mb-4 lead">
                  Your Google account is not registered in our system. Only pre-registered users can access Lumen Quest.
                </p>
                
                <div className="alert alert-warning border-0 mb-4" style={{backgroundColor: 'rgba(255, 193, 7, 0.1)'}}>
                  <i className="bi bi-info-circle me-2"></i>
                  <strong>Need Access?</strong> Contact your system administrator to register your email address.
                </div>
                
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                  <Link to="/login" className="btn btn-primary btn-lg">
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to Login
                  </Link>
                  <a href="mailto:admin@lumenquest.com" className="btn btn-outline-light btn-lg">
                    <i className="bi bi-envelope me-2"></i>
                    Contact Admin
                  </a>
                </div>
                
                <hr className="my-4 opacity-25" />
                
                <div className="text-center">
                  <small className="text-muted">
                    <i className="bi bi-shield-check me-1"></i>
                    Lumen Quest - Secure Telecom Operations
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotAuthorized;
