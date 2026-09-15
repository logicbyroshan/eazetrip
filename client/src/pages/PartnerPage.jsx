import { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { Building2, ShieldCheck, Mail, Lock, User, Phone, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PartnerPage({ mode = 'login' }) {
  const { showToast } = useBooking();
  const [email, setEmail] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    showToast(
      mode === 'login'
        ? 'Partner portal access granted (Demo Mode).'
        : 'Partner application submitted! Our team will review within 24 hours.'
    );
  };

  return (
    <div className="container page-wrap">
      <div className="page-shell narrow">
        <div className="page-topbar">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>{mode === 'login' ? 'Partner Login' : 'Partner Registration'}</span>
        </div>

        <div className="content-card form-card">
          <div className="partner-header-box">
            <div className="partner-icon">
              <Building2 size={28} />
            </div>
            <div>
              <h1>{mode === 'login' ? 'B2B Travel Partner Portal' : 'Register as a Travel Partner'}</h1>
              <p>Special agent commissions, GDS flight integrations, and dedicated B2B credit limits.</p>
            </div>
          </div>

          {submitted ? (
            <div className="text-center py-4">
              <CheckCircle2 size={48} color="#16a34a" className="mx-auto mb-2" />
              <h3>Request Processed Successfully</h3>
              <p>Welcome to the ExploreEase B2B Partner Network.</p>
              <Link to="/" className="primary-btn mt-3">
                Go to Homepage
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="stack-form mt-4">
              {mode !== 'login' && (
                <div className="form-group">
                  <label>Travel Agency / Company Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Skyline Holidays Pvt Ltd"
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label>Business Email *</label>
                <input
                  type="email"
                  placeholder="agent@agency.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  placeholder="Enter partner password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="primary-btn full">
                {mode === 'login' ? 'LOGIN TO B2B DESK' : 'SUBMIT AGENT REGISTRATION'}
              </button>

              <div className="partner-toggle-links mt-3 text-center">
                {mode === 'login' ? (
                  <Link to="/partner-registration" className="accent-link">
                    Need a B2B Agent Account? Apply Here
                  </Link>
                ) : (
                  <Link to="/partnerLogin" className="accent-link">
                    Already registered? Partner Sign In
                  </Link>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
