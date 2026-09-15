import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Phone, Home, User, LogOut, ShieldCheck, CreditCard, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function TopBar() {
  const { user, isAuthenticated, logout, openLoginModal } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="topbar">
      <div className="container topbar-inner">
        <div className="topbar-left">
          <Link to="/" title="Home" className="topbar-home-btn">
            <Home size={16} />
          </Link>
          <a
            href="https://wa.me/918269054018"
            target="_blank"
            rel="noreferrer"
            className="topbar-whatsapp"
            title="Chat on WhatsApp"
          >
            <span className="wa-icon">◉</span> WhatsApp Support
          </a>
          <a href="tel:+918269054018" className="topbar-phone">
            <Phone size={13} />
            <span>+91 8269054018</span>
          </a>
        </div>

        <div className="topbar-right">
          <div className="currency-selector">
            <span className="flag">🇮🇳</span>
            <span className="currency-tag">INR</span>
          </div>

          <div className="topbar-links">
            <Link to="/offers" className="topbar-sublink">Offers</Link>
            <Link to="/manage-bookings" className="topbar-sublink">Manage Bookings</Link>
            <Link to="/payment" className="topbar-sublink">Make Payment</Link>
          </div>

          {isAuthenticated ? (
            <div className="user-menu-wrap" ref={dropdownRef}>
              <button
                className="user-profile-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="user-avatar-sm">{user.name?.charAt(0) || 'U'}</div>
                <span className="user-name-text">{user.name?.split(' ')[0]}</span>
                <ChevronDown size={14} />
              </button>

              {dropdownOpen && (
                <div className="user-dropdown-menu">
                  <div className="dropdown-header">
                    <strong>{user.name}</strong>
                    <small>{user.email || user.phone}</small>
                  </div>
                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User size={15} /> My Profile
                  </Link>
                  <Link
                    to="/manage-bookings"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <ShieldCheck size={15} /> My Bookings
                  </Link>
                  <Link
                    to="/payment"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <CreditCard size={15} /> Make Payment
                  </Link>
                  <button
                    className="dropdown-item logout-btn"
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                    }}
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="login-pill-btn" onClick={openLoginModal}>
              <User size={14} />
              <span>Login or Signup</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
