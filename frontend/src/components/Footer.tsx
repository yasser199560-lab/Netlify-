import React from 'react';
import '../styles/Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer container-fluid p-0 mt-auto">
      {/* Full-width Divider Line running edge-to-edge */}
      <div className="footer-border-line"></div>
      
      {/* Tight, compact layout content height */}
      <div className="container py-3">
        <div className="row align-items-center text-center">
          {/* Left Side: Copyright */}
          <div className="col-12 col-md-4 text-md-start mb-2 mb-md-0 copyright-text">
            &copy; {currentYear} Talabaty.
          </div>
          
          {/* Center Side: Community Target Credit */}
          <div className="col-12 col-md-4 text-center mb-2 mb-md-0 community-text">
            Made for the Bekaa community.
          </div>
          
          {/* Right Side: Quick Links */}
          <div className="col-12 col-md-4 text-md-end footer-links">
            <a href="#" className="ms-3 me-2">Privacy</a>
            <a href="#" className="mx-2">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;