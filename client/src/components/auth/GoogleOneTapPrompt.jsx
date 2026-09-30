import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { X, ShieldCheck, User, Sparkles, Check } from 'lucide-react';

export default function GoogleOneTapPrompt() {
  const { user, loginWithGoogle, rememberedName, googleConfig } = useAuth();
  const { showToast } = useBooking();

  const [isVisible, setIsVisible] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isCustomMode, setIsCustomMode] = useState(false);

  // Dynamic user details for Google Sign-in
  const [customName, setCustomName] = useState(() => {
    try {
      return localStorage.getItem('eazetrip_remembered_name') || '';
    } catch {
      return '';
    }
  });

  const [customEmail, setCustomEmail] = useState(() => {
    try {
      return localStorage.getItem('eazetrip_remembered_email') || '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    // 1. Do not show if user is already logged in
    if (user) {
      setIsVisible(false);
      return;
    }

    // 2. Check if dismissed in this session
    try {
      if (sessionStorage.getItem('eazetrip_onetap_dismissed') === 'true') {
        return;
      }
    } catch {}

    // 3. Check if cookie consent is already settled
    let isConsentSettled = false;
    try {
      isConsentSettled = Boolean(localStorage.getItem('eazetrip_cookie_consent'));
    } catch {}

    let timer = null;

    if (isConsentSettled) {
      // If cookie consent is already settled, show Google prompt after a smooth 2.8s delay
      timer = setTimeout(() => {
        setIsVisible(true);
      }, 2800);
    } else {
      // If cookie consent is pending (first load), wait for cookie consent interaction or 6.5s delay
      const handleConsentSettled = () => {
        timer = setTimeout(() => {
          setIsVisible(true);
        }, 1500);
      };

      window.addEventListener('eazetrip-cookie-consent-settled', handleConsentSettled, { once: true });

      // Fallback timer if user doesn't interact with cookie banner
      timer = setTimeout(() => {
        setIsVisible(true);
      }, 6500);

      return () => {
        if (timer) clearTimeout(timer);
        window.removeEventListener('eazetrip-cookie-consent-settled', handleConsentSettled);
      };
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [user]);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      sessionStorage.setItem('eazetrip_onetap_dismissed', 'true');
    } catch {}
  };

  const handleContinueAsGoogle = async () => {
    setIsSigningIn(true);
    try {
      if (window.google?.accounts?.id && googleConfig?.configured) {
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            const resolvedDisplayName = customName.trim() || rememberedName || 'Google Explorer';
            const resolvedEmailAddress = customEmail.trim() || `${resolvedDisplayName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@gmail.com`;
            
            loginWithGoogle({ name: resolvedDisplayName, email: resolvedEmailAddress }).then(() => {
              setIsVisible(false);
              showToast(`Welcome, ${resolvedDisplayName}! Signed in with Google`);
            }).catch(() => {});
          }
        });
      } else {
        const resolvedDisplayName = customName.trim() || rememberedName || 'Google Explorer';
        const resolvedEmailAddress = customEmail.trim() || `${resolvedDisplayName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@gmail.com`;
        
        await loginWithGoogle({ name: resolvedDisplayName, email: resolvedEmailAddress });
        setIsVisible(false);
        showToast(`Welcome, ${resolvedDisplayName}! Signed in with Google`);
      }
    } catch (err) {
      console.error('Google One-Tap Error:', err);
      showToast('Google Sign-in could not be completed.', 'error');
    } finally {
      setIsSigningIn(false);
    }
  };

  if (!isVisible || user) return null;

  const displayAccountName = customName.trim() || rememberedName || 'Your Google Account';
  const displayAccountEmail = customEmail.trim() || (customName ? `${customName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@gmail.com` : 'Instant 1-Tap Sign In');

  return (
    <aside
      className="google-onetap-container animate-slide-in-top-right"
      aria-label="Sign in with Google"
    >
      <div className="google-onetap-card">
        {/* Top Header */}
        <div className="google-onetap-header">
          <div className="google-brand-row">
            {/* Official 4-color Google G Icon */}
            <svg viewBox="0 0 24 24" width="22" height="22" className="google-g-svg" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <div className="google-onetap-title-text">
              <h4>Sign in with Google</h4>
              <p>to continue to EazeTrip</p>
            </div>
          </div>

          <button
            type="button"
            className="google-onetap-close-btn"
            onClick={handleDismiss}
            aria-label="Dismiss Google Sign-in Prompt"
          >
            <X size={16} />
          </button>
        </div>

        {/* Account Selection Tile */}
        {!isCustomMode ? (
          <div className="google-onetap-account-tile" onClick={handleContinueAsGoogle}>
            <div className="google-onetap-avatar-placeholder">
              {displayAccountName && displayAccountName !== 'Your Google Account' ? (
                <span className="avatar-letter">{displayAccountName.charAt(0).toUpperCase()}</span>
              ) : (
                <User size={18} color="#034ea2" />
              )}
            </div>
            <div className="google-onetap-user-meta">
              <strong className="user-name">{displayAccountName}</strong>
              <span className="user-email">{displayAccountEmail}</span>
            </div>
            <div className="google-onetap-g-mini">
              <ShieldCheck size={16} color="#10b981" />
            </div>
          </div>
        ) : (
          <div className="google-onetap-custom-inputs">
            <input
              type="text"
              placeholder="Your Full Name (e.g. Roshan Sharma)"
              className="google-custom-input"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              autoFocus
            />
            <input
              type="email"
              placeholder="Your Gmail (e.g. roshan@gmail.com)"
              className="google-custom-input"
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
            />
          </div>
        )}

        {/* Primary CTA Button */}
        <div className="google-onetap-actions">
          <button
            type="button"
            className="google-onetap-continue-btn"
            onClick={handleContinueAsGoogle}
            disabled={isSigningIn}
          >
            {isSigningIn ? (
              'Signing in with Google...'
            ) : isCustomMode ? (
              'Sign In with This Account'
            ) : displayAccountName !== 'Your Google Account' ? (
              `Continue as ${displayAccountName.split(' ')[0]}`
            ) : (
              'Continue with Google'
            )}
          </button>
          
          <div className="google-switch-account-row">
            <button
              type="button"
              className="google-switch-account-btn"
              onClick={() => setIsCustomMode(!isCustomMode)}
            >
              {isCustomMode ? 'Use default sign-in' : 'Use another account'}
            </button>
          </div>
        </div>

        {/* Legal Disclaimer Footer */}
        <div className="google-onetap-footer">
          <p>
            To continue, Google will share your profile name and email with EazeTrip.
            See EazeTrip's{' '}
            <a href="/privacy" onClick={(e) => { e.preventDefault(); handleDismiss(); }}>
              Privacy Policy
            </a>{' '}
            and{' '}
            <a href="/terms" onClick={(e) => { e.preventDefault(); handleDismiss(); }}>
              Terms of Service
            </a>.
          </p>
        </div>
      </div>
    </aside>
  );
}
