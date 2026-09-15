import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { Mail, Lock, User, Phone, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function AuthPage({ mode = 'register' }) {
  const navigate = useNavigate();
  const { register, login, loginWithGoogle } = useAuth();
  const { showToast } = useBooking();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === 'register') {
      if (password !== confirmPassword) {
        showToast('Passwords do not match!', 'error');
        return;
      }
      if (!agreeTerms) {
        showToast('Please agree to terms & conditions', 'error');
        return;
      }

      setIsSubmitting(true);
      await register({ name, email, phone, password });
      setIsSubmitting(false);
      showToast('Account created successfully! Welcome to EazeTrip.');
      navigate('/');
    } else {
      setIsSubmitting(true);
      await login({ identifier: email, password, method: 'email' });
      setIsSubmitting(false);
      showToast('Signed in successfully!');
      navigate('/');
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      showToast('Signed in with Google successfully!');
      navigate('/');
    } catch (err) {
      showToast('Google sign-in could not be completed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container page-wrap">
      <div className="page-shell narrow auth-page-shell">
        <div className="content-card form-card auth-page-card">
          <div className="auth-head-center">
            <div className="auth-brand-centered">
              <img src="/logo.png" alt="EazeTrip Logo" className="modal-brand-logo-img" />
            </div>
            <h1>{mode === 'register' ? 'Create an Account' : 'Sign In to EazeTrip'}</h1>
            <p>
              {mode === 'register'
                ? 'Join thousands of smart travelers getting the best airfares and hotel deals'
                : 'Manage your flight tickets, hotel reservations and download e-tickets'}
            </p>
          </div>

          {/* Google Sign In Option */}
          <button
            type="button"
            className="google-auth-btn"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
          >
            <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>{mode === 'register' ? 'Sign up with Google' : 'Sign in with Google'}</span>
          </button>

          <div className="auth-or-divider">
            <span>OR CONTINUE WITH EMAIL</span>
          </div>

          <form onSubmit={handleSubmit} className="stack-form mt-2">
            {mode === 'register' && (
              <div className="form-group">
                <label>Full Name *</label>
                <div className="input-with-icon">
                  <User size={16} className="field-icon" />
                  <input
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
              <label>Email Address *</label>
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

            {mode === 'register' && (
              <div className="form-group">
                <label>Mobile Number</label>
                <div className="input-with-icon">
                  <Phone size={16} className="field-icon" />
                  <input
                    type="tel"
                    placeholder="10 digit number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Password *</label>
              <div className="input-with-icon">
                <Lock size={16} className="field-icon" />
                <input
                  type="password"
                  placeholder="Enter secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {mode === 'register' && (
              <div className="form-group">
                <label>Confirm Password *</label>
                <div className="input-with-icon">
                  <Lock size={16} className="field-icon" />
                  <input
                    type="password"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {mode === 'register' && (
              <label className="checkbox-label terms-agree-row">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <span>
                  I agree to the <Link to="/terms" className="accent-link">Terms & Conditions</Link> and <Link to="/privacy" className="accent-link">Privacy Policy</Link>.
                </span>
              </label>
            )}

            <button type="submit" className="primary-btn full auth-btn" disabled={isSubmitting}>
              {isSubmitting ? 'PLEASE WAIT...' : mode === 'register' ? 'CREATE ACCOUNT' : 'SIGN IN'}
            </button>
          </form>

          <div className="auth-bottom-switch">
            {mode === 'register' ? (
              <p>
                Already have an account?{' '}
                <Link to="/user-login" className="accent-link">
                  Sign In
                </Link>
              </p>
            ) : (
              <p>
                New to EazeTrip?{' '}
                <Link to="/user-register" className="accent-link">
                  Create an Account
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
