import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { X, Phone, Mail, Lock, Eye, EyeOff, RefreshCw, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, login } = useAuth();
  const { showToast } = useBooking();

  const [activeTab, setActiveTab] = useState('phone'); // 'phone' | 'email'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Captcha
  const [captchaCode, setCaptchaCode] = useState('7R9K2');
  const [captchaInput, setCaptchaInput] = useState('');
  const [error, setError] = useState('');

  const refreshCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let res = '';
    for (let i = 0; i < 5; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(res);
  };

  if (!isLoginModalOpen) return null;

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (captchaInput.toUpperCase() !== captchaCode) {
      setError('Invalid captcha. Please enter the characters shown.');
      return;
    }

    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!otpSent) {
      setOtpSent(true);
      showToast(`OTP sent to +91 ${phoneNumber}. (Use 1234 to login)`);
    } else {
      if (otp === '1234' || otp.length === 4) {
        login({ identifier: phoneNumber, method: 'phone' });
        showToast('Login successful! Welcome to ExploreEase.');
      } else {
        setError('Invalid OTP code. Please enter 1234.');
      }
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (captchaInput.toUpperCase() !== captchaCode) {
      setError('Invalid captcha code.');
      return;
    }

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 4) {
      setError('Please enter your password.');
      return;
    }

    login({ identifier: email, password, method: 'email' });
    showToast('Signed in successfully! Welcome back.');
  };

  return (
    <div className="modal-overlay" onClick={closeLoginModal}>
      <div className="modal-container auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={closeLoginModal} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="auth-header">
          <div className="auth-brand">
            <span className="brand-name-explore">Explore</span>
            <span className="brand-name-eaz">Eaz</span>
          </div>
          <h2>Welcome Back</h2>
          <p>Login to manage your bookings, special fares & fast checkout</p>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${activeTab === 'phone' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('phone');
              setError('');
            }}
          >
            <Phone size={16} />
            <span>Mobile OTP</span>
          </button>
          <button
            type="button"
            className={`auth-tab ${activeTab === 'email' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('email');
              setError('');
            }}
          >
            <Mail size={16} />
            <span>Email Login</span>
          </button>
        </div>

        {error && <div className="auth-error-banner">{error}</div>}

        {activeTab === 'phone' ? (
          <form onSubmit={handlePhoneSubmit} className="auth-form">
            {!otpSent ? (
              <>
                <div className="form-group">
                  <label>Mobile Number</label>
                  <div className="input-with-prefix">
                    <span className="phone-prefix">+91</span>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="Enter 10 digit number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      required
                    />
                  </div>
                </div>

                <div className="form-group captcha-group">
                  <label>Security Captcha</label>
                  <div className="captcha-row">
                    <div className="captcha-badge">{captchaCode}</div>
                    <button
                      type="button"
                      className="captcha-refresh-btn"
                      onClick={refreshCaptcha}
                      title="Refresh Captcha"
                    >
                      <RefreshCw size={16} />
                    </button>
                    <input
                      type="text"
                      placeholder="Enter text"
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                      maxLength={5}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="primary-btn full auth-submit-btn">
                  Send OTP
                </button>
              </>
            ) : (
              <>
                <div className="otp-info-badge">
                  <CheckCircle size={16} color="#16a34a" />
                  <span>OTP sent to +91 {phoneNumber}</span>
                </div>
                <div className="form-group">
                  <label>Enter 4-digit OTP (Demo code: 1234)</label>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="• • • •"
                    className="otp-input"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <button type="submit" className="primary-btn full auth-submit-btn">
                  Verify & Sign In
                </button>
                <button
                  type="button"
                  className="link-btn-text"
                  onClick={() => setOtpSent(false)}
                >
                  Change Mobile Number
                </button>
              </>
            )}
          </form>
        ) : (
          <form onSubmit={handleEmailSubmit} className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-with-icon">
                <Mail size={16} className="field-icon" />
                <input
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
                <label>Password</label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); showToast('Password reset link sent if account exists.'); }} className="forgot-link">
                  Forgot Password?
                </a>
              </div>
              <div className="input-with-icon">
                <Lock size={16} className="field-icon" />
                <input
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
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-group captcha-group">
              <label>Security Captcha</label>
              <div className="captcha-row">
                <div className="captcha-badge">{captchaCode}</div>
                <button
                  type="button"
                  className="captcha-refresh-btn"
                  onClick={refreshCaptcha}
                  title="Refresh Captcha"
                >
                  <RefreshCw size={16} />
                </button>
                <input
                  type="text"
                  placeholder="Enter text"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                  maxLength={5}
                  required
                />
              </div>
            </div>

            <button type="submit" className="primary-btn full auth-submit-btn">
              Sign In with Email
            </button>
          </form>
        )}

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/user-register" onClick={closeLoginModal} className="accent-link">
              Create an Account
            </Link>
          </p>
          <div className="auth-extra-links">
            <Link to="/partnerLogin" onClick={closeLoginModal}>Partner Login</Link>
            <span>•</span>
            <Link to="/corporate-login" onClick={closeLoginModal}>Corporate Access</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
