import { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, Check, X, Settings2, ExternalLink, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const COOKIE_CONSENT_KEY = 'eazetrip_cookie_consent';

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Always true & disabled
    analytics: true,
    marketing: true,
    personalization: true
  });

  useEffect(() => {
    try {
      const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!savedConsent) {
        // Show after a subtle 1-second delay for smooth page entrance
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const fullConsent = {
      essential: true,
      analytics: true,
      marketing: true,
      personalization: true,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(fullConsent));
    } catch {}
    setIsVisible(false);
    setShowPreferencesModal(false);
  };

  const handleDeclineOptional = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      marketing: false,
      personalization: false,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(essentialOnly));
    } catch {}
    setIsVisible(false);
    setShowPreferencesModal(false);
  };

  const handleSavePreferences = () => {
    const customConsent = {
      ...preferences,
      essential: true,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(customConsent));
    } catch {}
    setIsVisible(false);
    setShowPreferencesModal(false);
  };

  if (!isVisible && !showPreferencesModal) return null;

  return (
    <>
      {/* Floating Bottom Cookie & User Agreement Banner */}
      {isVisible && !showPreferencesModal && (
        <aside className="cookie-consent-floating-bar" aria-label="Cookie and Privacy Consent">
          <div className="cookie-bar-container">
            <div className="cookie-bar-left">
              <div className="cookie-icon-circle">
                <Cookie size={24} color="#034ea2" />
              </div>
              <div className="cookie-text-content">
                <div className="cookie-header-row">
                  <strong>Privacy Preferences & Cookie Policy</strong>
                  <span className="privacy-badge">
                    <ShieldCheck size={12} /> DPDP & GDPR Compliant
                  </span>
                </div>
                <p>
                  We use essential cookies for secure booking transactions and encrypted payments, along with analytics to deliver personalized travel offers, fare alerts, and faster checkout experiences. By clicking <strong>"Accept All"</strong>, you agree to our{' '}
                  <Link to="/cancellation-refund" className="cookie-link">
                    Customer Agreement
                  </Link>
                  ,{' '}
                  <Link to="/about" className="cookie-link">
                    Privacy Policy
                  </Link>
                  , and cookie usage.
                </p>
              </div>
            </div>

            <div className="cookie-bar-actions">
              <button
                type="button"
                className="cookie-customize-btn"
                onClick={() => setShowPreferencesModal(true)}
              >
                <Settings2 size={15} /> Preferences
              </button>
              <button
                type="button"
                className="cookie-decline-btn"
                onClick={handleDeclineOptional}
              >
                Essential Only
              </button>
              <button
                type="button"
                className="cookie-accept-all-btn"
                onClick={handleAcceptAll}
              >
                <Check size={16} /> Accept All
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Detailed Cookie & Privacy Preferences Modal */}
      {showPreferencesModal && (
        <div className="modal-overlay" onClick={() => setShowPreferencesModal(false)}>
          <div
            className="modal-container cookie-preferences-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-custom cookie-modal-header">
              <div>
                <div className="cookie-modal-tag">
                  <Lock size={14} />
                  <span>TRANSPARENT USER PRIVACY</span>
                </div>
                <h3>Cookie & Data Privacy Preferences</h3>
                <span className="sub-tagline">
                  Manage how EazeTrip uses cookies and personal data for your travel experience.
                </span>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setShowPreferencesModal(false)}
                type="button"
                aria-label="Close preferences"
              >
                <X size={20} />
              </button>
            </div>

            <div className="cookie-modal-body p-4">
              <p className="preferences-intro">
                When you visit EazeTrip, we store cookies on your browser to facilitate secure flight/hotel reservations, authenticate your account, and prevent transaction fraud. You can customize your preferences below.
              </p>

              <div className="preference-items-list mt-3">
                {/* 1. Essential Cookies */}
                <div className="preference-item-row locked">
                  <div className="pref-info">
                    <div className="pref-title-row">
                      <strong>1. Strictly Necessary & Security Cookies</strong>
                      <span className="locked-badge">ALWAYS ACTIVE</span>
                    </div>
                    <p>
                      Required for basic site navigation, account authentication, Razorpay payment gateway encryption, and PNR verification.
                    </p>
                  </div>
                  <div className="pref-toggle">
                    <input type="checkbox" checked disabled className="toggle-checkbox" />
                  </div>
                </div>

                {/* 2. Personalization */}
                <div className="preference-item-row">
                  <div className="pref-info">
                    <div className="pref-title-row">
                      <strong>2. Personalization & Travel Memory</strong>
                    </div>
                    <p>
                      Remembers your name, recent flight/hotel route searches, preferred currency (INR), and pre-fills passenger details for faster bookings.
                    </p>
                  </div>
                  <div className="pref-toggle">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={preferences.personalization}
                        onChange={(e) =>
                          setPreferences({ ...preferences, personalization: e.target.checked })
                        }
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>

                {/* 3. Analytics */}
                <div className="preference-item-row">
                  <div className="pref-info">
                    <div className="pref-title-row">
                      <strong>3. Performance & Speed Analytics</strong>
                    </div>
                    <p>
                      Helps us analyze site speed, flight search latency, and optimize user experience without identifying you personally.
                    </p>
                  </div>
                  <div className="pref-toggle">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) =>
                          setPreferences({ ...preferences, analytics: e.target.checked })
                        }
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>

                {/* 4. Marketing & Personalized Offers */}
                <div className="preference-item-row">
                  <div className="pref-info">
                    <div className="pref-title-row">
                      <strong>4. Tailored Discounts & Fare Drop Alerts</strong>
                    </div>
                    <p>
                      Enables customized holiday coupon codes (e.g. 25% OFF), seasonal price drops, and WhatsApp booking reminders.
                    </p>
                  </div>
                  <div className="pref-toggle">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={(e) =>
                          setPreferences({ ...preferences, marketing: e.target.checked })
                        }
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="cookie-modal-actions mt-4">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={handleDeclineOptional}
                >
                  Reject Non-Essential
                </button>
                <button
                  type="button"
                  className="outline-btn"
                  onClick={handleSavePreferences}
                >
                  Save My Preferences
                </button>
                <button
                  type="button"
                  className="primary-btn"
                  onClick={handleAcceptAll}
                >
                  Accept All Cookies
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
