import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { Mail, Lock, User, Phone, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function AuthPage({ mode = 'register' }) {
  const navigate = useNavigate();
  const { register, login } = useAuth();
  const { showToast } = useBooking();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

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

      await register({ name, email, phone, password });
      showToast('Account created successfully! Welcome to ExploreEase.');
      navigate('/');
    } else {
      await login({ identifier: email, password, method: 'email' });
      showToast('Signed in successfully!');
      navigate('/');
    }
  };

  return (
    <div className="container page-wrap">
      <div className="page-shell narrow auth-page-shell">
        <div className="content-card form-card auth-page-card">
          <div className="auth-head-center">
            <div className="brand-logo-custom">
              <span className="brand-name-explore">Explore</span>
              <span className="brand-name-eaz">Eaz</span>
            </div>
            <h1>{mode === 'register' ? 'Create an Account' : 'Sign In to ExploreEase'}</h1>
            <p>
              {mode === 'register'
                ? 'Join thousands of smart travelers getting the best airfares and hotel deals'
                : 'Manage your flight tickets, hotel reservations and download e-tickets'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="stack-form mt-4">
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

            <button type="submit" className="primary-btn full auth-btn">
              {mode === 'register' ? 'CREATE ACCOUNT' : 'SIGN IN'}
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
                New to ExploreEase?{' '}
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
