import { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import {
  Building2,
  Mail,
  Lock,
  User,
  Phone,
  CheckCircle2,
  Percent,
  Zap,
  Headphones,
  FileCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../components/common/Breadcrumb';

export default function PartnerPage({ mode = 'login' }) {
  const { showToast } = useBooking();
  const [currentMode, setCurrentMode] = useState(mode);
  const [email, setEmail] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    showToast(
      currentMode === 'login'
        ? 'B2B Partner portal access granted (Demo Mode).'
        : 'Partner application submitted! Our onboarding manager will contact you within 24 hours.'
    );
  };

  return (
    <div className="container page-wrap">
      <div className="page-shell narrow">
        <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'B2B Partner & Corporate Portal' }]} />

        {/* Top Benefits Cards Strip */}
        <div className="partner-perks-grid mb-4">
          <div className="perk-card">
            <div className="perk-icon-wrap">
              <Percent size={20} color="#034ea2" />
            </div>
            <h4>Highest Commissions</h4>
            <p>Earn up to 8.5% instant commission on domestic & international flights.</p>
          </div>

          <div className="perk-card">
            <div className="perk-icon-wrap">
              <Zap size={20} color="#0097a7" />
            </div>
            <h4>Instant GDS Issuance</h4>
            <p>Direct API access to 450+ airlines, 1M+ hotels, and IRCTC authorized rails.</p>
          </div>

          <div className="perk-card">
            <div className="perk-icon-wrap">
              <Headphones size={20} color="#16a34a" />
            </div>
            <h4>24/7 B2B Helpdesk</h4>
            <p>Dedicated relationship manager for urgent ticketing, voids, and date changes.</p>
          </div>
        </div>

        <div className="content-card form-card partner-portal-card">
          <div className="partner-header-box">
            <div className="partner-icon">
              <Building2 size={26} />
            </div>
            <div>
              <h1>{currentMode === 'login' ? 'B2B Travel Partner Login' : 'Register as a Travel Partner'}</h1>
              <p>Special agent commissions, GDS flight integrations, and dedicated B2B credit limits.</p>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="auth-tabs mt-3">
            <button
              type="button"
              className={`auth-tab ${currentMode === 'login' ? 'active' : ''}`}
              onClick={() => {
                setCurrentMode('login');
                setSubmitted(false);
              }}
            >
              Partner Sign In
            </button>
            <button
              type="button"
              className={`auth-tab ${currentMode === 'register' ? 'active' : ''}`}
              onClick={() => {
                setCurrentMode('register');
                setSubmitted(false);
              }}
            >
              New Agent Registration
            </button>
          </div>

          {submitted ? (
            <div className="text-center py-4">
              <CheckCircle2 size={48} color="#16a34a" className="mx-auto mb-2" />
              <h3>{currentMode === 'login' ? 'Welcome Back, Partner!' : 'Application Submitted!'}</h3>
              <p className="lead">
                {currentMode === 'login'
                  ? 'Your B2B agency console has been verified and opened.'
                  : 'Our B2B verification team is reviewing your agency details and will activate your live API keys shortly.'}
              </p>
              <Link to="/" className="primary-btn mt-3">
                Go to Homepage
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="stack-form mt-4">
              {currentMode === 'register' && (
                <>
                  <div className="form-group">
                    <label>Travel Agency / Company Name *</label>
                    <div className="input-with-icon">
                      <Building2 size={16} className="field-icon" />
                      <input
                        type="text"
                        placeholder="e.g. Skyline Holidays Pvt Ltd"
                        value={agencyName}
                        onChange={(e) => setAgencyName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-grid two-col">
                    <div className="form-group">
                      <label>Contact Person Name *</label>
                      <div className="input-with-icon">
                        <User size={16} className="field-icon" />
                        <input
                          type="text"
                          placeholder="e.g. Rajesh Mehra"
                          value={contactPerson}
                          onChange={(e) => setContactPerson(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Business Mobile Number *</label>
                      <div className="input-with-icon">
                        <Phone size={16} className="field-icon" />
                        <input
                          type="tel"
                          placeholder="10 digit number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>GST / IATA Number (Optional for verified invoicing)</label>
                    <div className="input-with-icon">
                      <FileCheck size={16} className="field-icon" />
                      <input
                        type="text"
                        placeholder="e.g. 27AAAAA0000A1Z5"
                        value={gstNumber}
                        onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="form-group">
                <label>Business Email Address *</label>
                <div className="input-with-icon">
                  <Mail size={16} className="field-icon" />
                  <input
                    type="email"
                    placeholder="agent@travelagency.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Account Password *</label>
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

              <button type="submit" className="primary-btn full mt-2">
                {currentMode === 'login' ? 'ACCESS B2B PORTAL' : 'SUBMIT PARTNER REGISTRATION'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
