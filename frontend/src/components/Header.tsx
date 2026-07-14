import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Header.css';
import logoImg from '../assets/logoo.png';
import { useAuth } from '../context/AuthContext';

interface NavItem {
  name: string;
  link: string;
}

const navItems: NavItem[] = [
  { name: 'Home', link: '#' },
  { name: 'About', link: '#about' },
  { name: 'How it works', link: '#HowitWorks' },
  { name: 'Become a Partner', link: '#partner-form' },
];

const Header: React.FC = () => {
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const homeForRole = user?.role === 'admin' ? '/admin' : user?.role === 'partner' ? '/partner' : '/dashboard';

  const handleLoginRedirect = () => {
    setShowDropdown(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const handleSignupRedirect = () => {
    setShowDropdown(false);
    setMobileMenuOpen(false);
    navigate('/register');
  };

  const handleLogout = () => {
    setShowDropdown(false);
    setMobileMenuOpen(false);
    logout();
    navigate('/');
  };

  return (
    <header className="header container-fluid fixed-top">
      <div className="container-fluid d-flex align-items-center justify-content-between px-4 position-relative">
        
        {/* Left Side: Mobile Menu Button + Logo */}
        <div className="logo-container d-flex align-items-center">
          <button 
            className="hamburger-btn d-lg-none me-3" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            <i className={`bi ${mobileMenuOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
          </button>
          
          <img src={logoImg} alt="Talabaty Logo" className="header-logo" />
        </div>

        {/* Center Side: Desktop Link Row */}
        <nav className="d-none d-lg-flex header-nav-center">
          {navItems.map((item, index) => (
            <a key={index} href={item.link} className="nav-link px-4">
              {item.name}
            </a>
          ))}
        </nav>

        {/* Mobile Navigation Drawer Overlay */}
        <div className={`mobile-navigation-overlay d-lg-none ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-content p-4">
            <nav className="d-flex flex-column gap-3">
              {navItems.map((item, index) => (
                <a 
                  key={index} 
                  href={item.link} 
                  className="nav-link mobile-nav-link py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Right Side: Action Icons */}
        <div className="header-actions d-flex align-items-center">
          
          {/* Conditional Search Section */}
          {showSearch ? (
            <div className="search-bar-expanded d-flex align-items-center me-3 animate-slide-in">
              <input type="text" placeholder="Search stores or items..." className="form-control" />
              <button className="btn btn-close-search" onClick={() => setShowSearch(false)} aria-label="Close search"></button>
            </div>
          ) : (
            <button className="icon-btn search-icon me-3" onClick={() => setShowSearch(true)} aria-label="Search">
              <i className="bi bi-search"></i>
            </button>
          )}

          {/* Interactive Account Section */}
          <div className="account-container position-relative">
            <button className="icon-btn account-icon" onClick={() => setShowDropdown(!showDropdown)} aria-label="Account options">
              <i className="bi bi-person-circle"></i>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="account-dropdown position-absolute dropdown-menu-end shadow animate-fade-in">
                {user ? (
                  <>
                    <div className="dropdown-header text-center py-3 px-4">
                      <h5>Hi, {user.name.split(" ")[0]}</h5>
                      <p className="text-capitalize">{user.role} account</p>
                    </div>

                    <div className="dropdown-body p-3">
                      <Link
                        to={homeForRole}
                        className="btn btn-primary w-100 d-flex align-items-center mb-2"
                        onClick={() => setShowDropdown(false)}
                      >
                        <i className="bi bi-speedometer2 me-2"></i> My dashboard
                      </Link>

                      {user.role === "customer" && (
                        <Link
                          to="/orders"
                          className="btn btn-outline-primary w-100 d-flex align-items-center mb-2"
                          onClick={() => setShowDropdown(false)}
                        >
                          <i className="bi bi-bag-check me-2"></i> My orders
                        </Link>
                      )}

                      <button
                        type="button"
                        className="btn btn-outline-danger w-100 d-flex align-items-center"
                        onClick={handleLogout}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i> Log out
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="dropdown-header text-center py-3 px-4">
                      <h5>Welcome to Talabaty</h5>
                      <p>Sign in to continue</p>
                    </div>

                    <div className="dropdown-body p-3">
                      <span className="dropdown-label d-block text-muted text-uppercase mb-2">I Want To</span>

                      <button
                        className="btn btn-primary w-100 d-flex align-items-center mb-2"
                        onClick={handleLoginRedirect}
                      >
                        <i className="bi bi-key-fill me-2 login-icon"></i> Log in
                      </button>

                      <button
                        className="btn btn-outline-primary w-100 d-flex align-items-center"
                        onClick={handleSignupRedirect}
                      >
                        <i className="bi bi-person-plus-fill me-2 signup-icon"></i> Sign up
                      </button>
                    </div>
                  </>
                )}

                <div className="dropdown-footer text-center border-top p-3">
                  <a 
                    href="#partner-form" 
                    className="become-partner-link d-flex align-items-center justify-content-center"
                    onClick={() => setShowDropdown(false)}
                  >
                    <i className="bi bi-building me-2"></i> Become a Partner
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;
