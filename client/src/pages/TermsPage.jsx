import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  ShieldCheck,
  Search,
  Printer,
  ChevronRight,
  Plane,
  Building2,
  Bus,
  Train,
  Palmtree,
  CreditCard,
  RotateCcw,
  AlertTriangle,
  Scale,
  Mail,
  ExternalLink,
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function TermsPage({ title = 'Terms & Conditions & User Agreement' }) {
  const [activeSection, setActiveSection] = useState('acceptance');
  const [searchQuery, setSearchQuery] = useState('');

  const sections = [
    {
      id: 'acceptance',
      title: '1. Acceptance of Agreement',
      icon: Scale,
      content: (
        <>
          <p>
            Welcome to <strong>EazeTrip</strong> (accessible via website and mobile endpoints, collectively the "Platform"), operated by EazeTrip Online Private Limited. By accessing, browsing, registering an account, or purchasing any travel product on our platform, you explicitly acknowledge that you have read, understood, and agreed to be legally bound by these Terms and Conditions, our Privacy Policy, and any service-specific supplier fare rules.
          </p>
          <div className="legal-highlight-box blue">
            <ShieldCheck size={20} className="text-primary flex-shrink-0" />
            <div>
              <strong>Binding Legal Contract:</strong> If you do not agree with any part of this agreement, you must immediately discontinue your use of the platform. Continued usage constitutes irrevocable consent.
            </div>
          </div>
        </>
      )
    },
    {
      id: 'eligibility',
      title: '2. User Eligibility & Account Security',
      icon: Lock,
      content: (
        <>
          <p>
            To use EazeTrip services or make financial transactions, you must satisfy the following statutory conditions:
          </p>
          <ul className="legal-bullets">
            <li><strong>Age Requirement:</strong> You must be at least 18 years of age and possess the legal capacity to enter into binding agreements under the Indian Contract Act, 1872.</li>
            <li><strong>Account Integrity:</strong> You are responsible for safeguarding your login credentials (passwords, OTPs, Google authentication sessions). You must notify EazeTrip immediately if you suspect unauthorized account access.</li>
            <li><strong>Accurate Traveler Data:</strong> When booking on behalf of others, you warrant that all passenger names, government ID numbers, dates of birth, contact phone numbers, and passport details match official government documents (Aadhaar, Passport, Voter ID).</li>
          </ul>
        </>
      )
    },
    {
      id: 'services',
      title: '3. Travel Booking Services & Supplier Roles',
      icon: Plane,
      content: (
        <>
          <p>
            EazeTrip operates as an online travel marketplace and technology facilitator connecting travelers with third-party carriers and suppliers:
          </p>
          <div className="legal-services-grid">
            <div className="legal-service-item">
              <div className="service-header"><Plane size={18} /> <strong>Flights (DGCA Compliant)</strong></div>
              <p>Flight schedules, baggage allowances, web check-in gates, seat allocations, and delays are governed by the respective airline (IndiGo, Air India, Akasa Air, SpiceJet) under Ministry of Civil Aviation / DGCA CAR regulations.</p>
            </div>
            <div className="legal-service-item">
              <div className="service-header"><Building2 size={18} /> <strong>Hotels & Resorts</strong></div>
              <p>Standard check-in (14:00) and check-out (11:00) times apply unless early/late requests are confirmed by the property. Local taxes and mandatory incidental security deposits may be collected at check-in.</p>
            </div>
            <div className="legal-service-item">
              <div className="service-header"><Train size={18} /> <strong>Indian Railways (IRCTC)</strong></div>
              <p>Train reservations are subject to IRCTC terms, dynamic quota allocations, chart preparation timings, and Ministry of Railways cancellation schedules.</p>
            </div>
            <div className="legal-service-item">
              <div className="service-header"><Bus size={18} /> <strong>Intercity Buses</strong></div>
              <p>Boarding points, bus amenities, live GPS tracking, and route changes are managed directly by the bus fleet operators.</p>
            </div>
            <div className="legal-service-item">
              <div className="service-header"><Palmtree size={18} /> <strong>Holiday Packages</strong></div>
              <p>Sightseeing itineraries, guide fees, hotel transfers, and travel insurance policies are bundled under specified tour packages with dedicated local operators.</p>
            </div>
          </div>
        </>
      )
    },
    {
      id: 'payments',
      title: '4. Pricing, Taxes & Payment Gateway',
      icon: CreditCard,
      content: (
        <>
          <p>
            All fares, room tariffs, and package rates displayed on EazeTrip are in Indian Rupees (INR) unless explicitly toggled to foreign currencies.
          </p>
          <ul className="legal-bullets">
            <li><strong>Inclusive Taxes:</strong> Displayed prices include Goods & Services Tax (GST), airport user development fees, and fuel surcharges.</li>
            <li><strong>Secure Transactions:</strong> Payments processed through RBI-authorized payment aggregators (Razorpay, UPI, NetBanking) are encrypted with 256-bit SSL protocols. EazeTrip never stores raw debit/credit card CVVs or net-banking passwords.</li>
            <li><strong>Convenience Fees:</strong> Non-refundable nominal technology and payment gateway processing fees may apply to cover automated ticketing, PNR generation, and 24/7 help desk support.</li>
          </ul>
        </>
      )
    },
    {
      id: 'cancellations',
      title: '5. Cancellations, Modifications & Zero Shield',
      icon: RotateCcw,
      content: (
        <>
          <p>
            Cancellation penalties and refund eligibility depend on the specific fare class, booking type, and time of cancellation prior to departure:
          </p>
          <div className="legal-highlight-box emerald">
            <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0" />
            <div>
              <strong>Zero Cancellation Shield:</strong> Bookings with active Zero Cancellation Shield protection are entitled to 100% full airline penalty waivers when cancelled at least 24 hours prior to scheduled departure.
            </div>
          </div>
          <p className="mt-3">
            To track live refund progress, dispute an airline cancellation, or calculate exact deduction penalties, visit the <Link to="/cancellation-refund" className="text-primary font-bold">Cancellation & Refund Resolution Hub →</Link>.
          </p>
        </>
      )
    },
    {
      id: 'conduct',
      title: '6. User Conduct, Anti-Fraud & Prohibitions',
      icon: AlertTriangle,
      content: (
        <>
          <p>Users agree not to misuse the platform for any of the following restricted activities:</p>
          <ul className="legal-bullets">
            <li>Using automated bots, scrapers, or crawlers to extract live inventory pricing or duplicate booking slots.</li>
            <li>Making speculative, fraudulent, or duplicate reservations in anticipation of demand.</li>
            <li>Transmitting malicious code, attempting SQL injection, prototype pollution, or bypassing rate-limiting security mechanisms.</li>
            <li>Reselling EazeTrip inventory for unauthorized commercial brokerage without an active B2B Partner agreement.</li>
          </ul>
        </>
      )
    },
    {
      id: 'liability',
      title: '7. Limitation of Liability & Disclaimers',
      icon: ShieldCheck,
      content: (
        <>
          <p>
            EazeTrip facilitates booking arrangements but does not operate aircraft, manage hotel properties, or run train locomotives. Consequently:
          </p>
          <ul className="legal-bullets">
            <li>EazeTrip shall not be held liable for any flight delays, cancellations, overbookings, strikes, extreme weather disruptions (Force Majeure), or loss of luggage caused by third-party suppliers.</li>
            <li>In all instances, EazeTrip’s maximum aggregate liability to the traveler under any claim shall be strictly limited to the total convenience fee received by EazeTrip for the specific booking in dispute.</li>
          </ul>
        </>
      )
    },
    {
      id: 'jurisdiction',
      title: '8. Legal Jurisdiction & Grievance Officer',
      icon: Scale,
      content: (
        <>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the Republic of India. All disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts in Madhya Pradesh, India.
          </p>
          <div className="legal-contact-card">
            <h4>Nodal Grievance & Compliance Officer:</h4>
            <p><strong>Name:</strong> Legal & Compliance Cell, EazeTrip Online Pvt Ltd</p>
            <p><strong>Email:</strong> <a href="mailto:support@eazetrip.com" className="text-primary font-semibold">support@eazetrip.com</a></p>
            <p><strong>Address:</strong> Tech Park Boulevard, Sector 4, Bhopal, Madhya Pradesh, India — 462001</p>
            <p><strong>SLA:</strong> Formal consumer complaints are acknowledged within 24 business hours and resolved within 15 working days.</p>
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
      <div className="page-topbar">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>Legal & Compliance</span>
        <span>/</span>
        <span className="current-crumb">{title.includes('User Agreement') ? 'User Agreement' : 'Terms & Conditions'}</span>
      </div>

      {/* Hero Header Banner */}
      <div className="legal-hero-banner">
        <div className="legal-hero-badge">
          <ShieldCheck size={16} />
          <span>STATUTORY COMPLIANCE & CONSUMER PROTECTION</span>
        </div>
        <h1>{title}</h1>
        <p className="legal-hero-sub">
          Official Master Service Agreement governing bookings, passenger rights, payments, cancellation waivers, and dispute resolution across all EazeTrip mediums.
        </p>

        <div className="legal-hero-toolbar">
          <div className="legal-search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search legal clauses, airline rules, refunds, payments..."
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
              title="Print official legal terms"
            >
              <Printer size={15} />
              <span>Print Agreement</span>
            </button>
            <Link to="/privacy" className="legal-action-btn">
              <Lock size={15} />
              <span>Privacy Policy</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main 2-Column Content Grid */}
      <div className="legal-content-layout mt-4">
        {/* Left Sticky Table of Contents Sidebar */}
        <aside className="legal-sidebar-nav">
          <div className="sidebar-nav-card">
            <h3 className="sidebar-nav-heading">Table of Contents</h3>
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
                <Link to="/privacy" className="policy-chip-link">
                  <ShieldCheck size={13} /> Privacy & Data Policy
                </Link>
                <Link to="/cancellation-refund" className="policy-chip-link">
                  <RotateCcw size={13} /> Refund & Penalty Matrix
                </Link>
                <Link to="/faq" className="policy-chip-link">
                  <FileText size={13} /> Travel FAQs & Help
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
                <span className="doc-version-pill">VERSION 2.4 (CURRENT)</span>
                <span className="doc-date-text">Last Updated & Verified: January 1, 2026</span>
              </div>
              <span className="doc-jurisdiction-text">Jurisdiction: Republic of India</span>
            </div>

            {filteredSections.length === 0 ? (
              <div className="text-center py-5">
                <Search size={36} className="text-slate-300 mx-auto mb-2" />
                <h4>No matching clauses found</h4>
                <p className="text-slate-500 text-sm">Try searching for keywords like "airline", "refund", "taxes", or "payment".</p>
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
