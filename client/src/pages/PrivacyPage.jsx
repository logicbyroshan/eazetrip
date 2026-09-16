import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
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
  Server
} from 'lucide-react';

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState('data-collection');
  const [searchQuery, setSearchQuery] = useState('');

  const sections = [
    {
      id: 'data-collection',
      title: '1. Information We Collect',
      icon: Database,
      content: (
        <>
          <p>
            When you use EazeTrip to search, compare, or book flights, hotels, bus routes, trains, or holiday tour packages, we collect information necessary to fulfill your travel itinerary:
          </p>
          <ul className="legal-bullets">
            <li><strong>Personal Identifiers:</strong> Lead passenger and co-passenger names, gender, date of birth, contact email address, mobile phone number, and physical residential/billing address.</li>
            <li><strong>Travel Documents:</strong> Passport numbers, expiration dates, visa details, and frequent flyer loyalty numbers (for international airline ticketing and immigration compliance).</li>
            <li><strong>Transactional Records:</strong> Encrypted booking IDs, PNRs, ticket vouchers, payment transaction hashes, and refund claim references.</li>
            <li><strong>Device & Interaction Telemetry:</strong> Anonymized IP address, browser type, operating system, and session timestamps used for fraud mitigation and rate limiting.</li>
          </ul>
        </>
      )
    },
    {
      id: 'data-use',
      title: '2. How We Use & Process Your Data',
      icon: Eye,
      content: (
        <>
          <p>We process your personal information strictly under statutory Indian data protection frameworks:</p>
          <div className="legal-services-grid">
            <div className="legal-service-item">
              <div className="service-header"><ShieldCheck size={18} /> <strong>Ticket Fulfillment</strong></div>
              <p>Communicating traveler rosters and passenger manifests directly to airlines, hotel reservations desks, IRCTC, and bus operators.</p>
            </div>
            <div className="legal-service-item">
              <div className="service-header"><Server size={18} /> <strong>Multi-Channel Alerts</strong></div>
              <p>Sending booking confirmations, PNR status updates, web check-in reminders, flight delay alerts, and refund tracking notes via Email, SMS, and WhatsApp.</p>
            </div>
            <div className="legal-service-item">
              <div className="service-header"><Lock size={18} /> <strong>Payment Verification & Security</strong></div>
              <p>Facilitating encrypted 256-bit payment gateway tokenization and anti-fraud checks to safeguard financial transactions.</p>
            </div>
          </div>
        </>
      )
    },
    {
      id: 'tokenization',
      title: '3. Payment Data Tokenization & Card Security',
      icon: CreditCard,
      content: (
        <>
          <p>
            EazeTrip complies with RBI Card-on-File Tokenization (CoFT) guidelines and PCI-DSS Level 1 standards:
          </p>
          <div className="legal-highlight-box emerald">
            <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0" />
            <div>
              <strong>Zero Raw Card Storage:</strong> We NEVER store your 16-digit debit/credit card number, CVV code, or banking authentication PINs on our servers. All financial transactions are tokenized via RBI-certified banking aggregators (Razorpay / UPI).
            </div>
          </div>
        </>
      )
    },
    {
      id: 'sharing',
      title: '4. Third-Party Sharing & Supplier Disclosures',
      icon: Key,
      content: (
        <>
          <p>
            Your information is shared only with verified suppliers directly responsible for your journey:
          </p>
          <ul className="legal-bullets">
            <li><strong>Aviation & Railway Carriers:</strong> Transmitting passenger manifests to IndiGo, Air India, Akasa Air, and IRCTC for passenger boarding rights.</li>
            <li><strong>Hospitality Partners:</strong> Sharing guest names and room preferences with hotel operators for room check-in.</li>
            <li><strong>Legal & Statutory Authorities:</strong> When required by civil aviation security agencies, Bureau of Immigration, or law enforcement under court order.</li>
            <li><strong>No Data Brokering:</strong> We NEVER sell, lease, or trade your personal contact info to third-party telemarketers or external advertising networks.</li>
          </ul>
        </>
      )
    },
    {
      id: 'rights',
      title: '5. Your Privacy Rights & Data Erasure',
      icon: ShieldCheck,
      content: (
        <>
          <p>You have full sovereignty over your personal account information:</p>
          <ul className="legal-bullets">
            <li><strong>Access & Rectification:</strong> View and update your profile details and saved travelers at any time from your <Link to="/profile" className="text-primary font-bold">Profile Dashboard →</Link>.</li>
            <li><strong>Right to Erasure (Right to be Forgotten):</strong> Request the permanent deletion of your account history by submitting an inquiry to <a href="mailto:support@eazetrip.com" className="text-primary font-bold">support@eazetrip.com</a>.</li>
            <li><strong>Notification Preferences:</strong> Manage email, WhatsApp, and promotional alerts directly in your Profile Communications settings.</li>
          </ul>
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
      <div className="page-topbar">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>Legal & Compliance</span>
        <span>/</span>
        <span className="current-crumb">Privacy Policy</span>
      </div>

      {/* Hero Header Banner */}
      <div className="legal-hero-banner privacy-theme">
        <div className="legal-hero-badge">
          <Lock size={16} />
          <span>DATA SECURITY & DPDP ACT COMPLIANCE</span>
        </div>
        <h1>Privacy Policy & Data Protection</h1>
        <p className="legal-hero-sub">
          How EazeTrip safeguards your personal identity, payment tokens, travel history, and communication preferences with 256-bit end-to-end encryption.
        </p>

        <div className="legal-hero-toolbar">
          <div className="legal-search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search data protection, cookies, card security, deletion rights..."
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

      {/* Main 2-Column Content Grid */}
      <div className="legal-content-layout mt-4">
        {/* Left Sticky Table of Contents Sidebar */}
        <aside className="legal-sidebar-nav">
          <div className="sidebar-nav-card">
            <h3 className="sidebar-nav-heading">Privacy Outline</h3>
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
              <span className="sidebar-policy-title">Related Policies</span>
              <div className="policy-chips-group mt-2">
                <Link to="/terms" className="policy-chip-link">
                  <FileText size={13} /> Terms & Conditions
                </Link>
                <Link to="/cancellation-refund" className="policy-chip-link">
                  <RotateCcw size={13} /> Refund & Penalty Matrix
                </Link>
                <Link to="/faq" className="policy-chip-link">
                  <ShieldCheck size={13} /> Help & Security FAQs
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Main Structured Content Area */}
        <main className="legal-main-body">
          <div className="legal-document-card">
            <div className="document-meta-header">
              <div>
                <span className="doc-version-pill emerald">DATA PRIVACY STANDARD</span>
                <span className="doc-date-text">Last Updated: January 1, 2026</span>
              </div>
              <span className="doc-jurisdiction-text">DPDP Act Compliant</span>
            </div>

            {filteredSections.length === 0 ? (
              <div className="text-center py-5">
                <Search size={36} className="text-slate-300 mx-auto mb-2" />
                <h4>No matching privacy clauses found</h4>
                <p className="text-slate-500 text-sm">Try searching for keywords like "data", "card", "sharing", or "rights".</p>
                <button
                  type="button"
                  className="btn-outline btn-sm mt-3"
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </button>
              </div>
            ) : (
              filteredSections.map((sec) => (
                <section key={sec.id} id={sec.id} className="legal-section-block">
                  <h2 className="legal-section-title">{sec.title}</h2>
                  <div className="legal-section-body">
                    {sec.content}
                  </div>
                </section>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
