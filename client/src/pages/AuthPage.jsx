import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Plane,
  Sparkles,
  Star,
  Zap,
  Compass
} from 'lucide-react';

export default function AuthPage({ mode = 'register' }) {
  const navigate = useNavigate();
  const { register, login, loginWithGoogle } = useAuth();
  const { showToast } = useBooking();

  const [currentMode, setCurrentMode] = useState(mode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isRegister = currentMode === 'register';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (isRegister) {
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match! Please check and re-enter.');
        showToast('Passwords do not match!', 'error');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters.');
        return;
      }
      if (!agreeTerms) {
        setErrorMsg('Please accept the Terms of Service & Privacy Policy.');
        showToast('Please accept the Terms of Service', 'error');
        return;
      }

      setIsSubmitting(true);
      try {
        await register({ name, email, phone, password });
        showToast('Account created successfully! Welcome to EazeTrip.');
        navigate('/');
      } catch (err) {
        setErrorMsg(err.message || 'Registration failed. Please try again.');
        showToast('Registration failed.', 'error');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(true);
      try {
        await login({ identifier: email, password, method: 'email' });
        showToast('Signed in successfully! Welcome back.');
        navigate('/');
      } catch (err) {
        setErrorMsg(err.message || 'Invalid email or password.');
        showToast('Sign in failed.', 'error');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      showToast('Signed in with Google successfully!');
      navigate('/');
    } catch (err) {
      setErrorMsg('Google sign-in could not be completed.');
      showToast('Google sign-in failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-hero-backdrop-page">
      {/* Full-Screen Big Destination Background */}
      <div className="auth-fullscreen-bg-image"></div>
      <div className="auth-fullscreen-bg-overlay"></div>

      <div className="auth-page-container">
        {/* Floating Top Nav Bar on top of Destination Image */}
        <header className="auth-floating-topbar">
          <Link to="/" className="auth-floating-brand">
            <img src="/logo.png" alt="EazeTrip" className="auth-floating-logo-img" />
          </Link>

          <div className="auth-top-nav-actions">
            {isRegister ? (
              <button
                type="button"
                className="auth-floating-nav-btn"
                onClick={() => {
                  setCurrentMode('login');
                  setErrorMsg('');
                }}
              >
                <ArrowLeft size={16} />
                <span>Back to Login</span>
              </button>
            ) : (
              <button
                type="button"
                className="auth-floating-nav-btn"
                onClick={() => navigate('/')}
              >
                <ArrowLeft size={16} />
                <span>Back to Home</span>
              </button>
            )}
          </div>
        </header>

        {/* Main Content: Left Hero Perks + Right Floating Form on top of Destination Image */}
        <div className="auth-hero-content-grid">
          {/* Left Hero Destination Copy */}
          <div className="auth-hero-left-col">
            <div className="auth-hero-pill-tag">
              <Sparkles size={15} />
              <span>India's Smartest Travel Booking Platform</span>
            </div>

            <h1 className="auth-hero-main-title">
              Your Next Great Journey Begins Here.
            </h1>

            <p className="auth-hero-desc">
              Join over 2.4 million smart travelers who book flights, hotels, luxury buses and IRCTC trains with zero surcharge payments and instant refunds.
            </p>

            <div className="auth-floating-perks-stack">
              <div className="auth-floating-perk-card">
                <div className="perk-card-icon">
                  <Plane size={18} />
                </div>
                <div>
                  <strong>Lowest Guaranteed Airfares</strong>
                  <p>Special unpublished member fares on IndiGo, Air India & Akasa Air</p>
                </div>
              </div>

              <div className="auth-floating-perk-card">
                <div className="perk-card-icon">
                  <Zap size={18} />
                </div>
                <div>
                  <strong>Live IRCTC Tatkal & GPS Sync</strong>
                  <p>High confirmation chance predictions and real-time station alerts</p>
                </div>
              </div>

              <div className="auth-floating-perk-card">
                <div className="perk-card-icon">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <strong>Zero Surcharge Instant UPI Refunds</strong>
                  <p>Powered by Razorpay 256-bit encrypted bank checkout</p>
                </div>
              </div>
            </div>

            <div className="auth-rating-glass-pill">
              <div className="rating-stars-cluster">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <span><strong>4.9 / 5</strong> rating from 85,000+ verified customer reviews</span>
            </div>
          </div>

          {/* Right Floating Compact Form Card Directly On Top of Image */}
          <div className="auth-hero-right-col">
            <div className="auth-floating-form-card compact-side-by-side">
              <div className="auth-card-top-header">
                <div className="auth-card-badge-row">
                  <span className="auth-card-badge">
                    <Compass size={13} />
                    {isRegister ? 'New Traveler Registration' : 'Member Sign In'}
                  </span>
                </div>
                <h2>{isRegister ? 'Create an Account' : 'Welcome Back'}</h2>
                <p>
                  {isRegister
                    ? 'Fill in your details below to unlock member discounts.'
                    : 'Log in to access your bookings and faster checkout.'}
                </p>
              </div>

              {/* Google SSO Button */}
              <button
                type="button"
                className="google-sso-floating-btn"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
              >
                <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{isRegister ? 'Sign up with Google' : 'Sign in with Google'}</span>
              </button>

              <div className="auth-or-line-divider">
                <span>OR CONTINUE WITH EMAIL</span>
              </div>

              {errorMsg && <div className="auth-card-error-msg">{errorMsg}</div>}

              <form onSubmit={handleSubmit} className="auth-card-form-stack">
                {isRegister ? (
                  <>
                    {/* Row 1: Side by Side (Full Name + Mobile) */}
                    <div className="auth-form-row-2col">
                      <div className="form-group">
                        <label htmlFor="reg-name">Full Name *</label>
                        <div className="input-with-icon">
                          <User size={16} className="field-icon" />
                          <input
                            id="reg-name"
                            type="text"
                            placeholder="e.g. Priyansh Sharma"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="reg-phone">Mobile Number</label>
                        <div className="input-with-prefix">
                          <span className="phone-prefix">+91</span>
                          <input
                            id="reg-phone"
                            type="tel"
                            maxLength={10}
                            placeholder="10 digit number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 2: Full width Email Address */}
                    <div className="form-group">
                      <label htmlFor="reg-email">Email Address *</label>
                      <div className="input-with-icon">
                        <Mail size={16} className="field-icon" />
                        <input
                          id="reg-email"
                          type="email"
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Row 3: Side by Side (Password + Confirm Password) */}
                    <div className="auth-form-row-2col">
                      <div className="form-group">
                        <label htmlFor="reg-password">Password *</label>
                        <div className="input-with-icon">
                          <Lock size={16} className="field-icon" />
                          <input
                            id="reg-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Min. 6 chars"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          <button
                            type="button"
                            className="password-toggle-btn"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                          >
                            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="reg-confirm-password">Confirm Password *</label>
                        <div className="input-with-icon">
                          <Lock size={16} className="field-icon" />
                          <input
                            id="reg-confirm-password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Re-enter password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                          />
                          <button
                            type="button"
                            className="password-toggle-btn"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                          >
                            {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-group">
                      <label htmlFor="reg-email">Email Address *</label>
                      <div className="input-with-icon">
                        <Mail size={16} className="field-icon" />
                        <input
                          id="reg-email"
                          type="email"
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="label-with-action">
                        <label htmlFor="reg-password">Password *</label>
                        <a
                          href="#forgot"
                          onClick={(e) => {
                            e.preventDefault();
                            showToast('Password reset link sent to your registered email.');
                          }}
                          className="forgot-link"
                        >
                          Forgot Password?
                        </a>
                      </div>
                      <div className="input-with-icon">
                        <Lock size={16} className="field-icon" />
                        <input
                          id="reg-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="password-toggle-btn"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {isRegister && (
                  <label className="checkbox-label terms-agree-row">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                    />
                    <span>
                      I agree to EazeTrip's{' '}
                      <Link to="/terms" target="_blank" className="accent-link">
                        Terms
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" target="_blank" className="accent-link">
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  </label>
                )}

                <button
                  type="submit"
                  className="primary-btn full luxury-auth-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? 'Please wait...'
                    : isRegister
                    ? 'CREATE FREE ACCOUNT'
                    : 'SIGN IN TO ACCOUNT'}
                </button>
              </form>

              <div className="auth-card-bottom-switch">
                {isRegister ? (
                  <p>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentMode('login');
                        setErrorMsg('');
                      }}
                      className="accent-link-button"
                    >
                      Log In
                    </button>
                  </p>
                ) : (
                  <p>
                    New to EazeTrip?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentMode('register');
                        setErrorMsg('');
                      }}
                      className="accent-link-button"
                    >
                      Create an Account
                    </button>
                  </p>
                )}
              </div>

              <div className="auth-card-footer-badge">
                <ShieldCheck size={14} color="#16a34a" />
                <span>256-bit SSL Bank-Grade Encryption · Verified Safe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
