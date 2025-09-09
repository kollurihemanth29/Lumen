import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';

const LandingPage = () => {
  useEffect(() => {
    // Professional scroll-based navbar
    const handleScroll = () => {
      const navbar = document.getElementById('navbar');
      if (navbar) {
        if (window.scrollY > 100) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }
    };

    // Smooth scrolling for navigation
    const handleSmoothScroll = (e) => {
      if (e.target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    };

    // Intersection Observer for fade-in animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
        }
      });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .stat-item, .timeline-item');
    animateElements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.animationDelay = `${index * 0.1}s`;
      observer.observe(el);
    });

    // Add event listeners
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleSmoothScroll);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleSmoothScroll);
      observer.disconnect();
    };
  }, []);

  const handleRegistration = () => {
    // Navigate to login page for registration
    window.location.href = '/login';
  };

  return (
    <div className="landing-page">
      {/* High-Performance Animated Background System */}
      <div className="bg-system">
        {/* Layer 1: Flowing Neon Gradient Waves */}
        <div className="neon-waves"></div>
        
        {/* Layer 2: Network Mesh */}
        <div className="network-mesh">
          {/* Network Nodes */}
          <div className="network-node" style={{top: '20%', left: '15%', animationDelay: '0s'}}></div>
          <div className="network-node" style={{top: '40%', left: '25%', animationDelay: '1s'}}></div>
          <div className="network-node" style={{top: '60%', left: '35%', animationDelay: '2s'}}></div>
          <div className="network-node" style={{top: '30%', right: '20%', animationDelay: '0.5s'}}></div>
          <div className="network-node" style={{top: '70%', right: '30%', animationDelay: '1.5s'}}></div>
          <div className="network-node" style={{bottom: '25%', left: '45%', animationDelay: '2.5s'}}></div>
          <div className="network-node" style={{top: '15%', left: '60%', animationDelay: '3s'}}></div>
          <div className="network-node" style={{bottom: '40%', right: '15%', animationDelay: '3.5s'}}></div>
          
          {/* Network Lines */}
          <div className="network-line" style={{top: '20%', left: '15%', width: '150px', transform: 'rotate(25deg)', animationDelay: '1s'}}></div>
          <div className="network-line" style={{top: '40%', left: '25%', width: '120px', transform: 'rotate(-15deg)', animationDelay: '2s'}}></div>
          <div className="network-line" style={{top: '60%', left: '35%', width: '180px', transform: 'rotate(45deg)', animationDelay: '3s'}}></div>
          <div className="network-line" style={{top: '30%', right: '20%', width: '100px', transform: 'rotate(-30deg)', animationDelay: '1.5s'}}></div>
        </div>
        
        {/* Layer 3: Micro Particles */}
        <div className="data-particles">
          {Array.from({length: 25}, (_, i) => (
            <div 
              key={i}
              className="particle" 
              style={{
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 15}s`,
                animationDuration: `${15 + Math.random() * 10}s`
              }}
            ></div>
          ))}
        </div>
        
        {/* Layer 4: Fiber Optic Streaks */}
        <div className="fiber-streaks">
          <div className="fiber-streak" style={{top: '15%'}}></div>
          <div className="fiber-streak" style={{top: '30%'}}></div>
          <div className="fiber-streak" style={{top: '60%'}}></div>
        </div>
      </div>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            🚀 Advanced Telecom Management - Enterprise Ready
          </div>
          <h1 className="hero-title">LUMEN QUEST</h1>
          <p className="hero-subtitle">
            Next-generation telecom inventory management system designed for modern enterprises. 
            Streamline operations, enhance security, and drive efficiency across your organization.
          </p>
          <div className="hero-actions">
            <Link to="/login" className="btn btn-primary">
              Get Started
              <span>→</span>
            </Link>
            <a href="#about" className="btn btn-secondary">
              Learn More
              <span>↓</span>
            </a>
          </div>
          <div className="stats">
            <div className="stat-item">
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Uptime</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Enterprises</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">ISO</div>
              <div className="stat-label">Certified</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section">
        <div className="section-header">
          <h2 className="section-title">The Solution</h2>
          <p className="section-subtitle">
            Revolutionizing telecom inventory management with cutting-edge technology and intelligent automation.
          </p>
        </div>
        
        <div className="problem-statement">
          <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--electric-cyan)' }}>
            Transforming Telecom Operations
          </h3>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
            In today's fast-paced telecom industry, efficient inventory management is crucial for operational success. 
            Lumen Quest provides a comprehensive platform that integrates advanced analytics, real-time tracking, 
            and intelligent automation to streamline your entire inventory ecosystem. From equipment procurement 
            to deployment tracking, our solution ensures optimal resource utilization and cost efficiency.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section">
        <div className="section-header">
          <h2 className="section-title">Why Choose Lumen Quest?</h2>
          <p className="section-subtitle">
            Enterprise-grade features designed for the modern telecom industry.
          </p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3 className="feature-title">Enterprise Security</h3>
            <p className="feature-description">
              Role-based access control, end-to-end encryption, and compliance with industry standards including SOC 2 and ISO 27001.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">Advanced Analytics</h3>
            <p className="feature-description">
              Real-time dashboards, predictive analytics, and comprehensive reporting to optimize inventory decisions and reduce costs.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3 className="feature-title">Automation Engine</h3>
            <p className="feature-description">
              Intelligent workflows, automated reordering, and smart alerts to minimize manual tasks and prevent stockouts.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌐</div>
            <h3 className="feature-title">Multi-Location Support</h3>
            <p className="feature-description">
              Centralized management across multiple sites, warehouses, and regions with seamless data synchronization.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔧</div>
            <h3 className="feature-title">API Integration</h3>
            <p className="feature-description">
              Seamless integration with existing ERP, CRM, and procurement systems through robust RESTful APIs.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3 className="feature-title">Mobile Ready</h3>
            <p className="feature-description">
              Responsive design and mobile apps for field technicians and managers to access inventory data anywhere.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="register" className="section">
        <div className="final-cta">
          <h2>Ready to Transform Your Operations?</h2>
          <p>
            Join leading telecom companies who trust Lumen Quest for their inventory management needs. 
            Start your digital transformation today.
          </p>
          <Link to="/login" className="btn-hero">
            Sign In
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Lumen Quest</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              The premier telecom inventory management platform trusted by enterprises worldwide. 
              Streamlining operations through intelligent automation.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">📧</a>
              <a href="#" className="social-link">🐦</a>
              <a href="#" className="social-link">💼</a>
              <a href="#" className="social-link">📷</a>
            </div>
          </div>
          
          <div className="footer-section">
            <h3>Platform</h3>
            <ul className="footer-links">
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Sign Up</Link></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#">Pricing</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Resources</h3>
            <ul className="footer-links">
              <li><a href="#">API Documentation</a></li>
              <li><a href="#">Integration Guide</a></li>
              <li><a href="#">Best Practices</a></li>
              <li><a href="#">Case Studies</a></li>
              <li><a href="#">Support Center</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Contact</h3>
            <ul className="footer-links">
              <li>📧 support@lumenquest.com</li>
              <li>📱 +1 (800) 555-0123</li>
              <li>📍 Enterprise Plaza, Tech District</li>
              <li>🕒 24/7 Enterprise Support</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 Lumen Quest. All rights reserved. | Privacy Policy | Terms of Service | Security</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
