import { Link, useLocation } from 'react-router-dom';
import { Plane, Building2, Bus, Train, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openLoginModal, isAuthenticated, user } = useAuth();

  const services = [
    { label: 'Flights', path: '/flight-booking', icon: Plane },
    { label: 'Hotels', path: '/hotel-booking', icon: Building2 },
    { label: 'Bus', path: '/bus-booking', icon: Bus },
    { label: 'Railway', path: '/railway', icon: Train }
  ];

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="brand-wrap">
          <div className="brand-logo-custom">
            <span className="brand-name-explore">Explore</span>
            <span className="brand-name-eaz">Eaz</span>
            <span className="brand-dot">.</span>
          </div>
          <span className="brand-tagline">YOUR SMART TRAVEL PARTNER</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="main-nav desktop-nav">
          {services.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`service-tab ${isActive ? 'active' : ''}`}
              >
                <div className="tab-icon-wrap">
                  <Icon size={20} />
                </div>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Menu Trigger */}
        <button
          className="mobile-hamburger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <div className="mobile-services">
            {services.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`mobile-service-link ${isActive ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
          <div className="mobile-drawer-footer">
            {isAuthenticated ? (
              <Link
                to="/profile"
                className="mobile-profile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Logged in as <strong>{user.name}</strong>
              </Link>
            ) : (
              <button
                className="primary-btn full"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openLoginModal();
                }}
              >
                Login or Sign Up
              </button>
            )}
            <div className="mobile-links-grid">
              <Link to="/offers" onClick={() => setMobileMenuOpen(false)}>Offers</Link>
              <Link to="/manage-bookings" onClick={() => setMobileMenuOpen(false)}>Manage Bookings</Link>
              <Link to="/payment" onClick={() => setMobileMenuOpen(false)}>Make Payment</Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact Us</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
