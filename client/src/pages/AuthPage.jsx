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
  Zap
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
    <div className="auth-split-fullscreen-page">
      {/* Left Visual Destination Panel */}
      <div className="auth-visual-side">
        <div className="auth-visual-backdrop-img"></div>
        <div className="auth-visual-gradient-overlay"></div>

        <div className="auth-visual-content">
          <div className="auth-visual-top-logo">
            <Link to="/" className="auth-brand-link">
              <img src="/logo.png" alt="EazeTrip" className="auth-panel-logo" />
            </Link>
          </div>

          <div className="auth-visual-center-text">
            <div className="auth-perk-badge">
              <Sparkles size={14} />
              <span>Your Premium Travel Gateway</span>
            </div>
            <h1 className="auth-hero-title">
              Explore the World with Complete Peace of Mind
            </h1>
            <p className="auth-hero-subtitle">
              Book flights, hotels, luxury buses and IRCTC trains with zero convenience fees, instant Tatkal sync, and 24/7 priority support.
            </p>

            <div className="auth-perks-list">
              <div className="auth-perk-item">
                <div className="perk-icon-circle">
                  <Plane size={16} />
                </div>
                <div>
                  <strong>10,000+ Domestic & International Routes</strong>
                  <p>Guaranteed lowest airfares with instant e-ticket delivery</p>
                </div>
              </div>

              <div className="auth-perk-item">
                <div className="perk-icon-circle">
                  <Zap size={16} />
                </div>
                <div>
                  <strong>Instant IRCTC Tatkal & Bus Tracking</strong>
                  <p>Live confirmation probabilities and real-time GPS updates</p>
                </div>
              </div>

              <div className="auth-perk-item">
                <div className="perk-icon-circle">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <strong>Zero Surcharge Razorpay UPI Payments</strong>
                  <p>100% secure checkout and instant refunds on cancellations</p>
                </div>
              </div>
            </div>
          </div>

          <div className="auth-social-proof-card">
            <div className="stars-row">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
              ))}
              <span className="rating-num">4.9 / 5</span>
            </div>
            <span className="proof-text">Trusted by over 2.4 Million happy travelers across India</span>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="auth-form-side">
        <div className="auth-form-inner-container">
          {/* Top Actions Row: Back button */}
          <div className="auth-top-nav-bar">
            {isRegister ? (
              <button
                type="button"
                className="auth-back-nav-btn"
                onClick={() => setCurrentMode('login')}
              >
                <ArrowLeft size={16} />
                <span>Back to Login</span>
              </button>
            ) : (
              <button
                type="button"
                className="auth-back-nav-btn"
                onClick={() => navigate('/')}
              >
                <ArrowLeft size={16} />
                <span>Back to Home</span>
              </button>
            )}

            <Link to="/" className="mobile-only-logo">
              <img src="/logo.png" alt="EazeTrip" height="32" />
            </Link>
          </div>

          <div className="auth-form-main-card">
            <div className="auth-form-header">
              <h2>{isRegister ? 'Create your Account' : 'Welcome Back'}</h2>
              <p>
                {isRegister
                  ? 'Join EazeTrip for fast checkouts, member fares & instant booking updates.'
                  : 'Enter your credentials to access your trips, saved travelers & tickets.'}
              </p>
            </div>

            {/* Google Sign-in Button */}
            <button
              type="button"
              className="google-auth-button-luxury"
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

            <div className="auth-form-divider">
              <span>OR CONTINUE WITH EMAIL</span>
            </div>

            {errorMsg && <div className="auth-form-error-alert">{errorMsg}</div>}

            <form onSubmit={handleSubmit} className="auth-input-fields-stack">
              {isRegister && (
                <div className="form-group">
                  <label htmlFor="reg-name">Full Name *</label>
                  <div className="input-with-icon">
                    <User size={17} className="field-icon" />
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
              )}

              <div className="form-group">
                <label htmlFor="reg-email">Email Address *</label>
                <div className="input-with-icon">
                  <Mail size={17} className="field-icon" />
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

              {isRegister && (
                <div className="form-group">
                  <label htmlFor="reg-phone">Mobile Number</label>
                  <div className="input-with-prefix">
                    <span className="phone-prefix">+91</span>
                    <input
                      id="reg-phone"
                      type="tel"
                      maxLength={10}
                      placeholder="10 digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <div className="label-with-action">
                  <label htmlFor="reg-password">Password *</label>
                  {!isRegister && (
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
                  )}
                </div>
                <div className="input-with-icon">
                  <Lock size={17} className="field-icon" />
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={isRegister ? 'Create secure password (min. 6 chars)' : 'Enter your password'}
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
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {isRegister && (
                <div className="form-group">
                  <label htmlFor="reg-confirm-password">Confirm Password *</label>
                  <div className="input-with-icon">
                    <Lock size={17} className="field-icon" />
                    <input
                      id="reg-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter your password"
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
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
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
                      Terms of Service
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

            <div className="auth-bottom-toggle-box">
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

            <div className="auth-form-security-footer">
              <ShieldCheck size={14} color="#16a34a" />
              <span>256-bit SSL Encrypted · 100% Privacy Protected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
