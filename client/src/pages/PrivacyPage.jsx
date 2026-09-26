import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../components/common/Breadcrumb';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Lock,
  ShieldCheck,
  Search,
  Printer,
  ChevronRight,
  Database,
  Eye,
  Key,
  CreditCard,
  FileText,
  RotateCcw,
  CheckCircle2,
  Server,
  Download,
  AlertCircle,
  UserCheck,
  Send,
  HelpCircle,
  Clock,
  ExternalLink,
  RefreshCw,
  Trash2,
  UserPlus
} from 'lucide-react';

export default function PrivacyPage() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('notice'); // 'notice' | 'rights_center' | 'dpo_contact'
  const [activeSection, setActiveSection] = useState('data-taxonomy');
  const [searchQuery, setSearchQuery] = useState('');

  // Self-Service Rights Center States
  const [exportLoading, setExportLoading] = useState(false);
  const [exportResult, setExportResult] = useState(null);
  
  // Consent Management States
  const [consentPreferences, setConsentPreferences] = useState({
    account_management: { status: 'granted', required: true },
    booking_fulfillment: { status: 'granted', required: true },
    promotional_marketing: { status: 'granted', required: false },
    whatsapp_alerts: { status: 'granted', required: false },
    travel_insurance: { status: 'granted', required: false },
    analytics_telemetry: { status: 'granted', required: false }
  });
  const [consentLoading, setConsentLoading] = useState(false);
  const [consentMsg, setConsentMsg] = useState('');

  // Grievance Submission States
  const [grievanceCategory, setGrievanceCategory] = useState('Consent & Withdrawal');
  const [grievanceDesc, setGrievanceDesc] = useState('');
  const [grievancePnr, setGrievancePnr] = useState('');
  const [grievanceName, setGrievanceName] = useState(user?.name || '');
  const [grievanceEmail, setGrievanceEmail] = useState(user?.email || '');
  const [grievancePhone, setGrievancePhone] = useState(user?.phone || '');
  const [grievanceSubmitting, setGrievanceSubmitting] = useState(false);
  const [grievanceSuccess, setGrievanceSuccess] = useState(null);

  // Nomination States
  const [nomineeName, setNomineeName] = useState('');
  const [nomineeRelation, setNomineeRelation] = useState('Spouse');
  const [nomineeEmail, setNomineeEmail] = useState('');
  const [nomineePhone, setNomineePhone] = useState('');
  const [nomineeSubmitting, setNomineeSubmitting] = useState(false);
  const [nomineeSuccess, setNomineeSuccess] = useState(null);

  // Erasure States
  const [erasureReason, setErasureReason] = useState('Account closure requested');
  const [erasureSubmitting, setErasureSubmitting] = useState(false);
  const [erasureSuccess, setErasureSuccess] = useState(null);

  // Fetch initial consent state if authenticated
  useEffect(() => {
    const fetchConsent = async () => {
      const res = await api.getUserConsent(user?.id || 'USR-1');
      if (res?.currentPreferences) {
        setConsentPreferences(res.currentPreferences);
      }
    };
    fetchConsent();
  }, [user]);

  // Handle Data Export (Access Right - Sec 11)
  const handleDownloadDataExport = async () => {
    setExportLoading(true);
    try {
      const res = await api.exportUserData(user?.id || 'USR-1');
      if (res.ok && res.data?.data) {
        setExportResult(res.data.data);
        // Create browser download blob
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(res.data.data, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', dataStr);
        downloadAnchor.setAttribute('download', `EazeTrip_DPDP_Data_Export_${user?.id || 'USR-1'}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
      }
    } catch (err) {
      console.error('Data export error:', err);
    } finally {
      setExportLoading(false);
    }
  };

  // Handle Consent Toggle / Withdrawal (Sec 6(4))
  const handleToggleConsent = async (purpose) => {
    const current = consentPreferences[purpose]?.status;
    const nextStatus = current === 'granted' ? 'withdrawn' : 'granted';

    setConsentLoading(true);
    setConsentMsg('');

    try {
      if (nextStatus === 'withdrawn') {
        const res = await api.withdrawConsent({
          userId: user?.id || 'USR-1',
          purpose
        });
        if (res.ok) {
          setConsentPreferences((prev) => ({
            ...prev,
            [purpose]: { ...prev[purpose], status: 'withdrawn' }
          }));
          setConsentMsg(`Consent for ${purpose.replace(/_/g, ' ')} has been withdrawn.`);
        }
      } else {
        const res = await api.recordConsent({
          userId: user?.id || 'USR-1',
          purpose,
          status: 'granted'
        });
        if (res.ok) {
          setConsentPreferences((prev) => ({
            ...prev,
            [purpose]: { ...prev[purpose], status: 'granted' }
          }));
          setConsentMsg(`Consent for ${purpose.replace(/_/g, ' ')} has been granted.`);
        }
      }
    } catch (err) {
      console.error('Consent update error:', err);
    } finally {
      setConsentLoading(false);
    }
  };

  // Handle Grievance Lodgement (Sec 13)
  const handleSubmitGrievance = async (e) => {
    e.preventDefault();
    if (!grievanceDesc.trim()) return;

    setGrievanceSubmitting(true);
    setGrievanceSuccess(null);

    try {
      const res = await api.submitPrivacyGrievance({
        userId: user?.id || 'USR-1',
        name: grievanceName || user?.name || 'Traveler',
        email: grievanceEmail || user?.email || 'traveler@eazetrip.com',
        phone: grievancePhone || user?.phone || '+91 9876543210',
        category: grievanceCategory,
        description: grievanceDesc,
        pnr: grievancePnr
      });

      if (res.ok && res.data?.grievance) {
        setGrievanceSuccess(res.data.grievance);
        setGrievanceDesc('');
      }
    } catch (err) {
      console.error('Grievance submission error:', err);
    } finally {
      setGrievanceSubmitting(false);
    }
  };

  // Handle Nomination (Sec 14)
  const handleSubmitNomination = async (e) => {
    e.preventDefault();
    if (!nomineeName.trim() || !nomineeEmail.trim()) return;

    setNomineeSubmitting(true);
    setNomineeSuccess(null);

    try {
      const res = await api.setNominee({
        userId: user?.id || 'USR-1',
        nomineeName,
        relationship: nomineeRelation,
        email: nomineeEmail,
        phone: nomineePhone
      });

      if (res.ok && res.data?.nominee) {
        setNomineeSuccess(res.data.nominee);
      }
    } catch (err) {
      console.error('Nominee submission error:', err);
    } finally {
      setNomineeSubmitting(false);
    }
  };

  // Handle Erasure Request (Sec 12(3))
  const handleRequestErasure = async (e) => {
    e.preventDefault();
    if (!window.confirm('Are you sure you wish to submit an Account Erasure request? This action cannot be reversed.')) return;

    setErasureSubmitting(true);
    setErasureSuccess(null);

    try {
      const res = await api.requestDataErasure({
        userId: user?.id || 'USR-1',
        reason: erasureReason
      });

      if (res.ok && res.data?.erasureRecord) {
        setErasureSuccess(res.data.erasureRecord);
      }
    } catch (err) {
      console.error('Erasure request error:', err);
    } finally {
      setErasureSubmitting(false);
    }
  };

  const sections = [
    {
      id: 'data-taxonomy',
      title: '1. Itemized Data Taxonomy & Purposes (Section 5)',
      icon: Database,
      content: (
        <>
          <p>
            Under Section 5 of the Digital Personal Data Protection Act, 2023 and DPDP Rules, 2025, EazeTrip provides an itemized description of personal data collected, specified purposes, and applicable retention schedules:
          </p>
          <div className="table-responsive mt-3">
            <table className="table table-bordered legal-taxonomy-table">
              <thead>
                <tr>
                  <th>Data Category</th>
                  <th>Specified Purpose</th>
                  <th>Legal Basis (DPDP Act)</th>
                  <th>Retention Schedule</th>
                  <th>Processors / Sharing</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Identity & Contact</strong><br /><small className="text-muted">Name, Email, Mobile, Profile</small></td>
                  <td>User authentication, account management, and profile access.</td>
                  <td><span className="badge bg-blue">Consent (Sec 6)</span></td>
                  <td>Active account + 3 years</td>
                  <td>Internal Auth Engine, Google SSO</td>
                </tr>
                <tr>
                  <td><strong>Passenger Manifests</strong><br /><small className="text-muted">Pax names, age, gender, DOB, seat/berth, IRCTC ID</small></td>
                  <td>Issuance of airline boarding passes, train reservations, bus seats, hotel guest check-in.</td>
                  <td><span className="badge bg-green">Legitimate Use (Sec 7(a))</span></td>
                  <td>7 Years (Statutory DGCA & Tax audit mandate)</td>
                  <td>IndiGo, Air India, IRCTC, Bus operators, Hotels</td>
                </tr>
                <tr>
                  <td><strong>Payment Identifiers</strong><br /><small className="text-muted">Razorpay Order ID, Payment ID, Bank ARN, UPI ID (Refunds)</small></td>
                  <td>Payment verification, GST tax invoicing, processing refunds. <em>(Zero raw credit card/CVV storage)</em>.</td>
                  <td><span className="badge bg-purple">Contract & CGST Act 2017</span></td>
                  <td>7 Years (Statutory financial ledger)</td>
                  <td>Razorpay Software Pvt Ltd, Banking Partners</td>
                </tr>
                <tr>
                  <td><strong>Promotional Marketing</strong><br /><small className="text-muted">Email, WhatsApp for holiday offers & fare alerts</small></td>
                  <td>Curated holiday package discounts and seasonal vouchers.</td>
                  <td><span className="badge bg-amber">Consent (Sec 6) — Optional</span></td>
                  <td>Until consent is withdrawn by user</td>
                  <td>Marketing Engine (Resend, Meta Cloud API)</td>
                </tr>
                <tr>
                  <td><strong>Customer Grievances</strong><br /><small className="text-muted">Inquiry logs, PNR, support messages</small></td>
                  <td>Resolving customer disputes, claims, and statutory privacy grievances.</td>
                  <td><span className="badge bg-teal">Right of Grievance (Sec 13)</span></td>
                  <td>3 Years post-resolution</td>
                  <td>Internal Concierge & DPO Support Desk</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )
    },
    {
      id: 'children-data',
      title: '2. Protection of Children’s Personal Data (Section 9)',
      icon: ShieldCheck,
      content: (
        <>
          <p>
            Under Section 9 of the DPDP Act 2023, a child is defined as an individual who has not completed eighteen years of age:
          </p>
          <div className="legal-highlight-box emerald">
            <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0" />
            <div>
              <strong>Strict Minor Safeguards:</strong> EazeTrip strictly prohibits targeted advertising, behavioral tracking, or automated profiling directed at children. Minor traveler details (infants and children) are processed solely under verifiable parental/guardian consent during travel booking to issue mandatory passenger manifests.
            </div>
          </div>
        </>
      )
    },
    {
      id: 'tokenization',
      title: '3. Payment Tokenization & RBI CoFT Standards',
      icon: CreditCard,
      content: (
        <>
          <p>
            EazeTrip complies with RBI Card-on-File Tokenization (CoFT) guidelines and PCI-DSS Level 1 standards:
          </p>
          <div className="legal-highlight-box blue">
            <Lock size={20} className="text-blue-600 flex-shrink-0" />
            <div>
              <strong>Zero Raw Card Storage:</strong> We NEVER store your 16-digit debit/credit card number, CVV code, or banking authentication PINs on our servers. All financial transactions are tokenized directly via RBI-certified banking aggregators (Razorpay / UPI).
            </div>
          </div>
        </>
      )
    },
    {
      id: 'dpo-redressal',
      title: '4. Grievance Redressal Officer & Board Escalation (Section 13)',
      icon: UserCheck,
      content: (
        <>
          <p>
            If you have any questions or grievances regarding the processing of your personal data, you may contact our designated Grievance Redressal Officer:
          </p>
          <div className="dpo-contact-card mt-3">
            <h4>Adarsh S. — Data Protection Officer & Grievance Redressal Officer</h4>
            <p><strong>Entity:</strong> EazeTrip Technologies Private Limited</p>
            <p><strong>Email:</strong> <a href="mailto:dpo@eazetrip.com" className="text-primary font-bold">dpo@eazetrip.com</a> / <a href="mailto:grievance@eazetrip.com" className="text-primary font-bold">grievance@eazetrip.com</a></p>
            <p><strong>Phone:</strong> +91 8269054018</p>
            <p><strong>Registered Address:</strong> Saubhagya Bindiya Tower, MP, India</p>
            <p><strong>Commitment:</strong> We acknowledge all grievances within 24 hours and resolve them within 15-30 days (Statutory maximum: 90 days as per DPDP Rules 2025).</p>
            <div className="dpbi-escalation-note mt-2 pt-2 border-t text-sm text-slate-600">
              <strong>Statutory Right to Appeal:</strong> If your grievance is not resolved to your satisfaction within 30 days, you have the right under Section 13(3) of the DPDP Act to file a complaint before the <strong>Data Protection Board of India (DPBI)</strong> at <a href="https://dpbd.gov.in" target="_blank" rel="noopener noreferrer" className="text-primary font-bold">dpbd.gov.in</a>.
            </div>
          </div>
        </>
      )
    }
  ];

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const q = searchQuery.toLowerCase();
    return sections.filter(
      (s) => s.title.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)
    );
  }, [searchQuery, sections]);

  return (
    <div className="terms-page-wrapper container page-wrap">
      {/* Breadcrumbs */}
      <Breadcrumb
        items={[
          { label: 'Home', path: '/' },
          { label: 'Legal & Governance', path: '/terms' },
          { label: 'Privacy & Data Protection' }
        ]}
      />

      {/* Hero Header Banner */}
      <div className="legal-hero-banner privacy-theme">
        <div className="legal-hero-badge">
          <Lock size={16} />
          <span>DPDP ACT 2023 & DPDP RULES 2025 COMPLIANT</span>
        </div>
        <h1>Privacy & Data Protection Center</h1>
        <p className="legal-hero-sub">
          Transparent data governance, itemized processing notices, and self-service Data Principal rights under the Digital Personal Data Protection Act, 2023.
        </p>

        {/* Tab Navigation Pill Bar */}
        <div className="privacy-mode-nav-tabs mt-3">
          <button
            type="button"
            className={`privacy-mode-tab ${activeTab === 'notice' ? 'active' : ''}`}
            onClick={() => setActiveTab('notice')}
          >
            <FileText size={16} /> Statutory Privacy Notice
          </button>
          <button
            type="button"
            className={`privacy-mode-tab ${activeTab === 'rights_center' ? 'active' : ''}`}
            onClick={() => setActiveTab('rights_center')}
          >
            <ShieldCheck size={16} /> Self-Service Privacy Rights Center
          </button>
          <button
            type="button"
            className={`privacy-mode-tab ${activeTab === 'dpo_contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('dpo_contact')}
          >
            <UserCheck size={16} /> DPO & Grievance Redressal
          </button>
        </div>

        <div className="legal-hero-toolbar mt-3">
          <div className="legal-search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search taxonomy, data export, consent withdrawal, minor protection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="legal-search-input"
            />
          </div>

          <div className="legal-actions-group">
            <button
              type="button"
              className="legal-action-btn"
              onClick={() => window.print()}
              title="Print official privacy policy"
            >
              <Printer size={15} />
              <span>Print Policy</span>
            </button>
            <Link to="/terms" className="legal-action-btn">
              <FileText size={15} />
              <span>Terms of Service</span>
            </Link>
          </div>
        </div>
      </div>

      {/* TAB 1: STATUTORY PRIVACY NOTICE */}
      {activeTab === 'notice' && (
        <div className="legal-content-layout mt-4">
          <aside className="legal-sidebar-nav">
            <div className="sidebar-nav-card">
              <h3 className="sidebar-nav-heading">Notice Outline</h3>
              <nav className="sidebar-nav-list">
                {sections.map((sec) => {
                  const Icon = sec.icon;
                  const isActive = activeSection === sec.id;
                  return (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveSection(sec.id);
                        document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                    >
                      <Icon size={16} className="nav-item-icon" />
                      <span>{sec.title}</span>
                      <ChevronRight size={14} className="nav-arrow" />
                    </a>
                  );
                })}
              </nav>

              <div className="sidebar-policy-links mt-4 pt-3 border-t">
                <span className="sidebar-policy-title">Data Rights Shortcuts</span>
                <div className="policy-chips-group mt-2">
                  <button
                    type="button"
                    className="policy-chip-link"
                    onClick={() => setActiveTab('rights_center')}
                  >
                    <Download size={13} /> Download My Data
                  </button>
                  <button
                    type="button"
                    className="policy-chip-link"
                    onClick={() => setActiveTab('dpo_contact')}
                  >
                    <UserCheck size={13} /> Contact DPO
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <main className="legal-main-body">
            <div className="legal-document-card">
              <div className="document-meta-header">
                <div>
                  <span className="doc-version-pill emerald">DPDP ACT COMPLIANT SPECIFICATION</span>
                  <span className="doc-date-text">Notice Version: v2026.1 • Effective: January 1, 2026</span>
                </div>
                <span className="doc-jurisdiction-text">Jurisdiction: India (DPBI)</span>
              </div>

              {filteredSections.map((sec) => (
                <section key={sec.id} id={sec.id} className="legal-section-block">
                  <h2 className="legal-section-title">{sec.title}</h2>
                  <div className="legal-section-body">
                    {sec.content}
                  </div>
                </section>
              ))}
            </div>
          </main>
        </div>
      )}

      {/* TAB 2: SELF-SERVICE PRIVACY RIGHTS CENTER */}
      {activeTab === 'rights_center' && (
        <div className="privacy-rights-center-wrapper mt-4">
          <div className="rights-intro-banner mb-4">
            <div className="flex-align-center gap-2">
              <ShieldCheck size={24} color="#034ea2" />
              <h3 className="m-0">Your Statutory Data Principal Rights (Sections 11–14)</h3>
            </div>
            <p className="text-slate-600 mt-1">
              Exercise your legal rights under the DPDP Act 2023 with real-time verification and zero administrative delay.
            </p>
          </div>

          <div className="rights-cards-grid">
            {/* 1. Right to Access (Section 11) */}
            <div className="rights-card">
              <div className="rights-card-header">
                <div className="rights-icon-wrap bg-blue-50">
                  <Download size={20} color="#034ea2" />
                </div>
                <div>
                  <h4>1. Download My Data (Section 11)</h4>
                  <p className="text-sm text-slate-500">Right to Access Information & Data Portability</p>
                </div>
              </div>
              <p className="rights-card-body">
                Obtain a complete, structured, machine-readable JSON summary of all personal data, passenger rosters, payment references, and third-party disclosures.
              </p>
              <button
                type="button"
                className="btn-outline btn-sm w-full mt-2"
                onClick={handleDownloadDataExport}
                disabled={exportLoading}
              >
                {exportLoading ? (
                  <span className="flex-align-center gap-1 justify-center"><RefreshCw size={14} className="animate-spin" /> Compiling Data...</span>
                ) : (
                  <span className="flex-align-center gap-1 justify-center"><Download size={14} /> Download Verified Data Archive</span>
                )}
              </button>
              {exportResult && (
                <div className="mt-2 p-2 bg-emerald-50 text-emerald-800 text-xs rounded">
                  ✓ Verified export generated for {exportResult.exportMetadata?.dataPrincipalId}
                </div>
              )}
            </div>

            {/* 2. Consent Preferences & Withdrawal (Section 6(4)) */}
            <div className="rights-card">
              <div className="rights-card-header">
                <div className="rights-icon-wrap bg-emerald-50">
                  <Key size={20} color="#059669" />
                </div>
                <div>
                  <h4>2. Manage & Withdraw Consent (Section 6(4))</h4>
                  <p className="text-sm text-slate-500">Granular Purpose-Based Consent Management</p>
                </div>
              </div>
              <div className="consent-toggles-list mt-2">
                <div className="consent-toggle-row">
                  <div>
                    <strong>Promotional Holiday Marketing</strong>
                    <small className="block text-slate-500">Email & SMS holiday discounts</small>
                  </div>
                  <button
                    type="button"
                    className={`toggle-pill-btn ${consentPreferences.promotional_marketing?.status === 'granted' ? 'granted' : 'withdrawn'}`}
                    onClick={() => handleToggleConsent('promotional_marketing')}
                    disabled={consentLoading}
                  >
                    {consentPreferences.promotional_marketing?.status === 'granted' ? 'GRANTED' : 'WITHDRAWN'}
                  </button>
                </div>

                <div className="consent-toggle-row mt-2">
                  <div>
                    <strong>WhatsApp Travel Alerts & Updates</strong>
                    <small className="block text-slate-500">Real-time gate & flight reminders</small>
                  </div>
                  <button
                    type="button"
                    className={`toggle-pill-btn ${consentPreferences.whatsapp_alerts?.status === 'granted' ? 'granted' : 'withdrawn'}`}
                    onClick={() => handleToggleConsent('whatsapp_alerts')}
                    disabled={consentLoading}
                  >
                    {consentPreferences.whatsapp_alerts?.status === 'granted' ? 'GRANTED' : 'WITHDRAWN'}
                  </button>
                </div>
              </div>
              {consentMsg && (
                <div className="mt-2 text-xs text-blue-700 bg-blue-50 p-2 rounded">
                  {consentMsg}
                </div>
              )}
            </div>

            {/* 3. Right to Nominate (Section 14) */}
            <div className="rights-card">
              <div className="rights-card-header">
                <div className="rights-icon-wrap bg-purple-50">
                  <UserPlus size={20} color="#7c3aed" />
                </div>
                <div>
                  <h4>3. Appoint Legal Nominee (Section 14)</h4>
                  <p className="text-sm text-slate-500">Nomination in Event of Incapacity</p>
                </div>
              </div>
              <form onSubmit={handleSubmitNomination} className="nominee-mini-form mt-2">
                <div className="form-group mb-2">
                  <label className="text-xs">Nominee Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Ritika Sharma"
                    className="form-control text-sm"
                    value={nomineeName}
                    onChange={(e) => setNomineeName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group mb-2">
                  <label className="text-xs">Nominee Email *</label>
                  <input
                    type="email"
                    placeholder="nominee@example.com"
                    className="form-control text-sm"
                    value={nomineeEmail}
                    onChange={(e) => setNomineeEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group mb-2">
                  <label className="text-xs">Nominee Mobile Phone *</label>
                  <input
                    type="tel"
                    placeholder="+91 9876543210"
                    className="form-control text-sm"
                    value={nomineePhone}
                    onChange={(e) => setNomineePhone(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary btn-sm w-full" disabled={nomineeSubmitting}>
                  {nomineeSubmitting ? 'Saving Nominee...' : 'Save Appointed Nominee'}
                </button>
                {nomineeSuccess && (
                  <div className="mt-2 p-2 bg-purple-50 text-purple-900 text-xs rounded">
                    ✓ Nominee '{nomineeSuccess.nomineeName}' registered successfully.
                  </div>
                )}
              </form>
            </div>

            {/* 4. Right to Erasure (Section 12(3)) */}
            <div className="rights-card">
              <div className="rights-card-header">
                <div className="rights-icon-wrap bg-red-50">
                  <Trash2 size={20} color="#dc2626" />
                </div>
                <div>
                  <h4>4. Right to Erasure (Section 12(3))</h4>
                  <p className="text-sm text-slate-500">Account Anonymization & Data Deletion</p>
                </div>
              </div>
              <p className="rights-card-body">
                Permanently anonymizes your profile, revokes tokens, and cancels promotional messaging. Invoices are retained in a locked statutory archive for 7 years under CGST Act requirements.
              </p>
              <form onSubmit={handleRequestErasure} className="mt-2">
                <div className="form-group mb-2">
                  <label className="text-xs">Reason for Erasure</label>
                  <input
                    type="text"
                    value={erasureReason}
                    onChange={(e) => setErasureReason(e.target.value)}
                    className="form-control text-sm"
                  />
                </div>
                <button type="submit" className="btn-danger btn-sm w-full" disabled={erasureSubmitting}>
                  {erasureSubmitting ? 'Submitting...' : 'Submit Erasure Request'}
                </button>
                {erasureSuccess && (
                  <div className="mt-2 p-2 bg-red-50 text-red-900 text-xs rounded">
                    ✓ Erasure processed under Request #{erasureSuccess.id}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DPO & GRIEVANCE LODGEMENT */}
      {activeTab === 'dpo_contact' && (
        <div className="grievance-portal-wrapper mt-4">
          <div className="grid-two-cols">
            {/* Left: Official DPO Card */}
            <div className="dpo-info-box card p-4">
              <div className="flex-align-center gap-2 mb-3">
                <UserCheck size={24} color="#034ea2" />
                <h3 className="m-0">Data Protection Officer</h3>
              </div>
              <p className="text-sm text-slate-600">
                Designated under Section 13 of the Digital Personal Data Protection Act, 2023 to address all privacy concerns, consent revocations, and data rights inquiries.
              </p>

              <div className="dpo-meta-list mt-3">
                <div className="dpo-meta-item">
                  <strong>Designated Officer:</strong>
                  <span>Adarsh S. (Lead Privacy Counsel & DPO)</span>
                </div>
                <div className="dpo-meta-item">
                  <strong>Official Email:</strong>
                  <a href="mailto:dpo@eazetrip.com" className="text-primary font-bold">dpo@eazetrip.com</a>
                </div>
                <div className="dpo-meta-item">
                  <strong>Direct Grievance Desk:</strong>
                  <a href="mailto:grievance@eazetrip.com" className="text-primary font-bold">grievance@eazetrip.com</a>
                </div>
                <div className="dpo-meta-item">
                  <strong>Direct Helpline:</strong>
                  <span>+91 8269054018</span>
                </div>
                <div className="dpo-meta-item">
                  <strong>Response SLA Commitment:</strong>
                  <span className="text-emerald-700 font-bold">Acknowledgement in &lt;24 hrs • Resolution in 15–30 days (Statutory max 90 days)</span>
                </div>
              </div>

              <div className="dpbi-box mt-4 p-3 bg-slate-50 border rounded text-xs text-slate-600">
                <strong>Data Protection Board of India (DPBI):</strong>
                <p className="mt-1">
                  In accordance with Section 13(3) of the Act, if a grievance is not resolved to your satisfaction within 30 days, you may approach the DPBI at <a href="https://dpbd.gov.in" target="_blank" rel="noopener noreferrer" className="text-primary underline">https://dpbd.gov.in</a>.
                </p>
              </div>
            </div>

            {/* Right: Statutory Privacy Grievance Form */}
            <div className="grievance-form-box card p-4">
              <div className="flex-align-center gap-2 mb-2">
                <FileText size={20} color="#034ea2" />
                <h3 className="m-0">Lodge Formal Privacy Grievance</h3>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                All submissions generate an immutable grievance ticket with statutory 90-day SLA compliance tracking.
              </p>

              <form onSubmit={handleSubmitGrievance}>
                <div className="form-group mb-2">
                  <label className="text-xs">Grievance Category *</label>
                  <select
                    className="form-control text-sm"
                    value={grievanceCategory}
                    onChange={(e) => setGrievanceCategory(e.target.value)}
                  >
                    <option value="Consent & Withdrawal">Consent & Withdrawal (Sec 6)</option>
                    <option value="Access to Personal Data">Access to Personal Data (Sec 11)</option>
                    <option value="Correction & Updation">Correction & Updation (Sec 12)</option>
                    <option value="Data Erasure">Data Erasure / Deletion (Sec 12(3))</option>
                    <option value="Children Data Safeguards">Children's Data Protection (Sec 9)</option>
                    <option value="Security & Unauthorized Disclosure">Security & Unauthorized Disclosure (Sec 8)</option>
                  </select>
                </div>

                <div className="form-group mb-2">
                  <label className="text-xs">Associated Booking PNR (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. FL2775 or HO9941"
                    className="form-control text-sm"
                    value={grievancePnr}
                    onChange={(e) => setGrievancePnr(e.target.value.toUpperCase())}
                  />
                </div>

                <div className="form-group mb-2">
                  <label className="text-xs">Detailed Grievance Description *</label>
                  <textarea
                    rows={4}
                    placeholder="Please specify your request or describe the issue in detail..."
                    className="form-control text-sm"
                    value={grievanceDesc}
                    onChange={(e) => setGrievanceDesc(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn-primary w-full mt-2" disabled={grievanceSubmitting}>
                  {grievanceSubmitting ? (
                    <span className="flex-align-center gap-1 justify-center"><RefreshCw size={14} className="animate-spin" /> Submitting...</span>
                  ) : (
                    <span className="flex-align-center gap-1 justify-center"><Send size={14} /> Submit Privacy Grievance to DPO</span>
                  )}
                </button>
              </form>

              {grievanceSuccess && (
                <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded text-emerald-900 text-xs">
                  <strong>✓ Grievance Registered Successfully!</strong>
                  <p className="mt-1">Grievance Ticket ID: <strong>#{grievanceSuccess.id}</strong></p>
                  <p>Assigned Officer: {grievanceSuccess.assignedOfficer} ({grievanceSuccess.officerEmail})</p>
                  <p>Target Resolution: <strong>{new Date(grievanceSuccess.targetResolutionDate).toLocaleDateString()}</strong> (Statutory Deadline: {new Date(grievanceSuccess.statutoryMaxDeadline).toLocaleDateString()})</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
