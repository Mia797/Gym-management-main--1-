import React from 'react';
import { Dumbbell, Instagram, Twitter, Facebook } from 'lucide-react';

function Footer() {
  return (
    <footer className="py-5" style={{ backgroundColor: 'var(--bg-dark-800)', borderTop: '1px solid var(--glass-border)' }}>
      <div className="container">
        <div className="row g-4 text-center text-md-start">
          <div className="col-md-4">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start mb-3">
              <Dumbbell size={24} className="me-2" style={{ color: 'var(--accent-primary)' }} />
              <h4 className="fw-black text-white text-uppercase mb-0"><span className="text-gradient">Gold</span>fit</h4>
            </div>
            <p className="small text-secondary" style={{ maxWidth: '300px' }}>The ultimate fitness experience. Build the body you deserve with world-class equipment and elite trainers.</p>
          </div>
          
          <div className="col-md-4">
            <h5 className="text-white text-uppercase mb-3" style={{ fontSize: '1rem', letterSpacing: '1px' }}>Quick Links</h5>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li><a href="/" className="text-muted text-decoration-none" onMouseOver={(e)=>e.currentTarget.style.color='var(--accent-primary)'} onMouseOut={(e)=>e.currentTarget.style.color='var(--text-muted)'}>Home</a></li>
              <li><a href="/trainers" className="text-muted text-decoration-none" onMouseOver={(e)=>e.currentTarget.style.color='var(--accent-primary)'} onMouseOut={(e)=>e.currentTarget.style.color='var(--text-muted)'}>Trainers</a></li>
              <li><a href="/nutritionists" className="text-muted text-decoration-none" onMouseOver={(e)=>e.currentTarget.style.color='var(--accent-primary)'} onMouseOut={(e)=>e.currentTarget.style.color='var(--text-muted)'}>Nutritionists</a></li>
              <li><a href="/machines" className="text-muted text-decoration-none" onMouseOver={(e)=>e.currentTarget.style.color='var(--accent-primary)'} onMouseOut={(e)=>e.currentTarget.style.color='var(--text-muted)'}>Equipment</a></li>
            </ul>
          </div>
          
          <div className="col-md-4">
            <h5 className="text-white text-uppercase mb-3" style={{ fontSize: '1rem', letterSpacing: '1px' }}>Social Media</h5>
            <div className="d-flex gap-3 justify-content-center justify-content-md-start">
              <a href="#" className="text-muted" style={{ transition: 'all 0.3s' }} onMouseOver={(e)=>e.currentTarget.style.color='var(--accent-primary)'} onMouseOut={(e)=>e.currentTarget.style.color='var(--text-muted)'}><Instagram size={24} /></a>
              <a href="#" className="text-muted" style={{ transition: 'all 0.3s' }} onMouseOver={(e)=>e.currentTarget.style.color='var(--accent-primary)'} onMouseOut={(e)=>e.currentTarget.style.color='var(--text-muted)'}><Twitter size={24} /></a>
              <a href="#" className="text-muted" style={{ transition: 'all 0.3s' }} onMouseOver={(e)=>e.currentTarget.style.color='var(--accent-primary)'} onMouseOut={(e)=>e.currentTarget.style.color='var(--text-muted)'}><Facebook size={24} /></a>
            </div>
          </div>
        </div>
        <hr className="my-5" style={{ borderColor: 'var(--glass-border)' }} />
        <p className="text-center small mb-0 text-muted">&copy; 2026 GOLDFIT. Engineered for Excellence.</p>
      </div>
    </footer>
  );
}

export default Footer;
