import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { Phone, User, LogOut, ShieldCheck, CreditCard, ChevronDown, Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import NotificationCenter from './NotificationCenter';

export default function TopBar() {
  const { user, isAuthenticated, logout, openLoginModal, firstName } = useAuth();
  const { currency, setCurrency, currencies, language, setLanguage, t } = useCurrency();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const dropdownRef = useRef(null);
  const currencyRef = useRef(null);
  const langRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (currencyRef.current && !currencyRef.current.contains(event.target)) {
        setCurrencyOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setDropdownOpen(false);
        setCurrencyOpen(false);
        setLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const activeCurr = currencies[currency] || currencies.INR;

  return (
    <div className="topbar">
      <div className="container topbar-inner">
        <div className="topbar-left">
          <a
            href="https://wa.me/918269054018"
            target="_blank"
            rel="noreferrer"
            className="topbar-whatsapp"
            title="Chat on WhatsApp"
          >
            <svg className="wa-svg-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm5.79 14.15c-.24.68-1.4 1.26-1.92 1.32-.49.06-1.11.08-3.56-.89-2.88-1.15-4.75-4.04-4.89-4.23-.14-.19-1.16-1.54-1.16-2.94 0-1.4.74-2.09 1-2.38.26-.29.58-.36.77-.36.19 0 .39 0 .56.01.18.01.42-.07.66.5.24.58.82 2.01.9 2.15.07.15.12.33.02.53-.1.19-.15.31-.3.49-.15.17-.31.39-.45.52-.15.15-.3.31-.13.61.17.29.77 1.27 1.65 2.05 1.13 1 2.08 1.32 2.37 1.47.29.14.47.12.64-.08.18-.19.77-.9 1-.21.23-.31.46-.26.77-.14.31.12 1.98.93 2.32 1.1.34.17.56.26.65.4.08.14.08.82-.16 1.5z"/>
            </svg>
            <span>{t('whatsappSupport', 'WhatsApp Support')}</span>
          </a>
          <a href="tel:+918269054018" className="topbar-phone">
            <Phone size={13} />
            <span>+91 8269054018</span>
          </a>
        </div>

        <div className="topbar-right">
          {/* Interactive Multi-Currency Dropdown */}
          <div className="currency-selector-wrap" ref={currencyRef}>
            <button
              type="button"
              className="currency-selector-btn"
              onClick={() => setCurrencyOpen(!currencyOpen)}
              title="Change Display Currency"
              aria-label="Change Display Currency"
            >
              <span className="flag">{activeCurr.flag}</span>
              <span className="currency-tag">{activeCurr.code} ({activeCurr.symbol})</span>
              <ChevronDown size={12} className={currencyOpen ? 'rotate-180' : ''} />
            </button>

            {currencyOpen && (
              <div className="currency-dropdown-menu">
                <div className="currency-dropdown-header">Select Currency</div>
                {Object.values(currencies).map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    className={`currency-option-item ${currency === c.code ? 'active' : ''}`}
                    onClick={() => {
                      setCurrency(c.code);
                      setCurrencyOpen(false);
                    }}
                  >
                    <span className="curr-flag">{c.flag}</span>
                    <span className="curr-code">{c.code}</span>
                    <span className="curr-symbol">({c.symbol})</span>
                    <span className="curr-name">{c.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Interactive Language Selector */}
          <div className="lang-selector-wrap" ref={langRef}>
            <button
              type="button"
              className="lang-selector-btn"
              onClick={() => setLangOpen(!langOpen)}
              title="Change Language"
              aria-label="Change Language"
            >
              <Globe size={13} />
              <span>{language === 'hi' ? 'हिन्दी' : 'EN'}</span>
              <ChevronDown size={12} className={langOpen ? 'rotate-180' : ''} />
            </button>

            {langOpen && (
              <div className="lang-dropdown-menu">
                <button
                  type="button"
                  className={`lang-option-item ${language === 'en' ? 'active' : ''}`}
                  onClick={() => {
                    setLanguage('en');
                    setLangOpen(false);
                  }}
                >
                  <span className="lang-flag">🇬🇧</span>
                  <span className="lang-label">English</span>
                </button>
                <button
                  type="button"
                  className={`lang-option-item ${language === 'hi' ? 'active' : ''}`}
                  onClick={() => {
                    setLanguage('hi');
                    setLangOpen(false);
                  }}
                >
                  <span className="lang-flag">🇮🇳</span>
                  <span className="lang-label">हिन्दी</span>
                </button>
              </div>
            )}
          </div>

          <NotificationCenter />

          {isAuthenticated ? (
            <div className="user-menu-wrap" ref={dropdownRef}>
              <button
                className="user-profile-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="user-avatar-sm">{user.name?.charAt(0) || 'U'}</div>
                <span className="user-name-text">Hi, {user.name?.split(' ')[0]}</span>
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
          ) : firstName ? (
            <button className="login-pill-btn remembered-login-btn" onClick={openLoginModal} title={`Welcome back, ${firstName}! Click to log in.`}>
              <User size={14} />
              <span>Hi {firstName} (Login)</span>
            </button>
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
