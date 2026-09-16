import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { api } from '../services/api';
import {
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  Clock,
  HelpCircle,
  Phone,
  ArrowRight,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  Printer,
  Zap,
  CreditCard,
  Building,
  Smartphone,
  Plane,
  Building2,
  Bus,
  Train,
  Calculator,
  MessageSquare,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  X,
  Plus,
  Copy,
  Check,
  Award
} from 'lucide-react';

export default function CancellationRefundPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { requestCancellationRefund, showToast } = useBooking();

  const initialRef = searchParams.get('ref') || searchParams.get('pnr') || searchParams.get('bookingId') || '';
  const initialOpenClaim = searchParams.get('openClaim') === 'true' || searchParams.get('claim') === 'true';

  const [trackQuery, setTrackQuery] = useState(initialRef);
  const [isSearchingRefund, setIsSearchingRefund] = useState(false);
  const [trackedRefund, setTrackedRefund] = useState(null);
  const [trackError, setTrackError] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Direct Refund Claim Modal States
  const [showClaimModal, setShowClaimModal] = useState(initialOpenClaim);
  const [claimStep, setClaimStep] = useState(1);
  const [claimCategory, setClaimCategory] = useState('airline_cancellation');
  const [claimPnr, setClaimPnr] = useState('');
  const [claimServiceType, setClaimServiceType] = useState('flight');
  const [claimServiceTitle, setClaimServiceTitle] = useState('IndiGo (6E-2041) • Mumbai to Delhi');
  const [claimName, setClaimName] = useState(user?.name || 'Rohit Sharma');
  const [claimEmail, setClaimEmail] = useState(user?.email || 'rohit@example.com');
  const [claimPhone, setClaimPhone] = useState(user?.phone || '+91 9876543210');
  const [claimAmount, setClaimAmount] = useState(4999);
  const [claimRemarks, setClaimRemarks] = useState('');
  const [claimPayoutMode, setClaimPayoutMode] = useState('wallet');
  const [claimUpiId, setClaimUpiId] = useState('');
  const [claimBankAccount, setClaimBankAccount] = useState('');
  const [claimIfscCode, setClaimIfscCode] = useState('');
  const [isSubmittingClaim, setIsSubmittingClaim] = useState(false);
  const [claimResult, setClaimResult] = useState(null);

  // Calculator Widget States
  const [calcService, setCalcService] = useState('flight');
  const [calcAmount, setCalcAmount] = useState(4800);
  const [calcNoticeHours, setCalcNoticeHours] = useState(48);
  const [calcHasShield, setCalcHasShield] = useState(false);
  const [calcResult, setCalcResult] = useState(null);

  // Policy Accordion state
  const [expandedPolicy, setExpandedPolicy] = useState('flights');

  // Auto-track if URL query parameter provided
  useEffect(() => {
    if (initialRef) {
      handleSearchRefund(initialRef);
    } else {
      // Load default demo refund for demonstration
      handleSearchRefund('RFND-10492');
    }
  }, [initialRef]);

  // Compute live calculator
  useEffect(() => {
    computeRefundEstimate();
  }, [calcService, calcAmount, calcNoticeHours, calcHasShield]);

  const computeRefundEstimate = async () => {
    const gross = Number(calcAmount) || 0;
    try {
      const res = await api.calculateRefund({
        serviceType: calcService,
        grossAmount: gross,
        hoursBeforeDeparture: calcNoticeHours,
        hasShield: calcHasShield
      });
      if (res) {
        setCalcResult(res);
        return;
      }
    } catch {
      // Local calculation fallback
    }

    let penalty = 0;
    if (!calcHasShield) {
      if (calcService === 'flight') penalty = calcNoticeHours >= 72 ? 1200 : calcNoticeHours >= 24 ? 2500 : 3500;
      else if (calcService === 'hotel') penalty = calcNoticeHours >= 24 ? 0 : Math.round(gross * 0.5);
      else if (calcService === 'bus') penalty = Math.round(gross * (calcNoticeHours >= 12 ? 0.15 : 0.35));
      else penalty = 180;
    }

    const net = Math.max(0, gross - penalty);
    setCalcResult({
      serviceType: calcService,
      grossAmount: gross,
      penaltyAmount: penalty,
      netRefundAmount: net,
      penaltyDescription: calcHasShield ? 'Zero Cancellation Shield Protected' : 'Standard Operator Cancellation Penalty',
      bonusWalletCredits: Math.round(net * 0.05 + 100),
      hasShield: calcHasShield
    });
  };

  const handleSearchRefund = async (queryToSearch) => {
    const query = (queryToSearch || trackQuery).trim();
    if (!query) {
      setTrackError('Please enter a Refund ID, Booking ID, or PNR to track status.');
      return;
    }

    setIsSearchingRefund(true);
    setTrackError(null);

    try {
      const res = await api.trackRefund(query);
      if (res) {
        setTrackedRefund(res);
      } else {
        setTrackError(`No refund records found matching "${query}". Please verify your reference number.`);
        setTrackedRefund(null);
      }
    } catch (err) {
      setTrackError('Unable to fetch refund status. Please check your tracking ID.');
      setTrackedRefund(null);
    } finally {
      setIsSearchingRefund(false);
    }
  };

  const handleCopyLink = () => {
    if (!trackedRefund) return;
    const url = `${window.location.origin}/cancellation-refund?ref=${trackedRefund.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    showToast('Direct tracking link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleSubmitDirectClaim = async (e) => {
    if (e) e.preventDefault();
    if (!claimPnr.trim()) {
      showToast('Please enter your PNR or Booking Reference Number.', 'error');
      return;
    }

    setIsSubmittingClaim(true);

    const categoryNames = {
      airline_cancellation: 'Flight Cancelled / Rescheduled by Airline (>3h delay)',
      medical_emergency: 'Medical Emergency / Passenger Health Waiver',
      duplicate_debit: 'Duplicate Payment / Double Debited Order',
      train_waitlist: 'IRCTC Charted Waiting List (Auto-Refund Claim)',
      hotel_issue: 'Hotel Check-in Denied / Property Closed',
      other: 'Direct Customer Travel Claim'
    };

    const payload = {
      bookingId: `BK-${claimPnr.trim()}`,
      pnr: claimPnr.trim().toUpperCase(),
      customerName: claimName,
      customerEmail: claimEmail,
      customerPhone: claimPhone,
      serviceType: claimServiceType,
      serviceTitle: claimServiceTitle,
      grossAmount: Number(claimAmount) || 3000,
      reason: `${categoryNames[claimCategory] || 'Direct Claim'}${claimRemarks ? ` - ${claimRemarks}` : ''}`,
      payoutMode: claimPayoutMode,
      bankAccount: claimBankAccount,
      ifscCode: claimIfscCode,
      upiId: claimUpiId,
      hasShield: claimCategory === 'airline_cancellation' || claimCategory === 'medical_emergency'
    };

    try {
      const result = await requestCancellationRefund(payload);
      setClaimResult(result);
      setTrackedRefund(result);
      setTrackQuery(result.id);
      setClaimStep(3);
      showToast(`Direct claim registered! Tracking Ref: #${result.id}`);
    } catch (err) {
      console.error('Direct claim submission error', err);
      showToast('Claim registration error. Please check details.', 'error');
    } finally {
      setIsSubmittingClaim(false);
    }
  };

  const closeClaimModal = () => {
    setShowClaimModal(false);
    setClaimStep(1);
    setClaimResult(null);
  };

  return (
    <div className="cancellation-refund-page container page-wrap">
      <div className="page-shell">
        <div className="page-topbar">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Cancellation & Refund Hub</span>
        </div>

        {/* Hero Section */}
        <div className="refund-hub-hero">
          <div className="refund-hero-top-row flex-between-center">
            <div className="refund-hero-tag">
              <ShieldCheck size={18} />
              <span>100% TRANSPARENT DGCA & IRCTC COMPLIANT REFUNDS</span>
            </div>
            <button
              type="button"
              className="primary-btn hero-claim-cta-btn"
              onClick={() => {
                setShowClaimModal(true);
                setClaimStep(1);
              }}
            >
              <Plus size={16} /> Submit Direct Refund Claim
            </button>
          </div>
          <h1>Cancellation & Refund Resolution Hub</h1>
          <p className="refund-hero-sub">
            Track live refund disbursements, calculate instant fare deductions, and claim zero-surcharge payments in real time.
          </p>

          {/* Search / Track Box */}
          <div className="refund-tracker-search-card">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearchRefund(trackQuery);
              }}
              className="refund-search-form"
            >
              <div className="refund-search-input-wrap">
                <Search size={20} color="#034ea2" />
                <input
                  type="text"
                  placeholder="Enter Refund ID (e.g. RFND-10492), PNR, or Booking ID..."
                  value={trackQuery}
                  onChange={(e) => setTrackQuery(e.target.value)}
                  className="refund-query-input"
                />
              </div>
              <button
                type="submit"
                className="primary-btn refund-search-submit-btn"
                disabled={isSearchingRefund}
              >
                {isSearchingRefund ? 'Tracking...' : 'Track Refund Status'}
              </button>
            </form>

            <div className="quick-lookup-hints">
              <span>Try sample references:</span>
              <button
                type="button"
                className="lookup-pill-btn"
                onClick={() => {
                  setTrackQuery('RFND-10492');
                  handleSearchRefund('RFND-10492');
                }}
              >
                RFND-10492 (Flight)
              </button>
              <button
                type="button"
                className="lookup-pill-btn"
                onClick={() => {
                  setTrackQuery('RFND-20941');
                  handleSearchRefund('RFND-20941');
                }}
              >
                RFND-20941 (Hotel)
              </button>
            </div>
          </div>
        </div>

        {/* Tracked Refund Status Result Card */}
        {trackError && (
          <div className="refund-error-banner content-card mt-4">
            <AlertCircle size={24} color="#dc2626" />
            <div>
              <strong>Tracking Search Result</strong>
              <p>{trackError}</p>
            </div>
          </div>
        )}

        {trackedRefund && (
          <div className="content-card tracked-refund-display-card mt-4 animate-fade-in">
            <div className="tracked-card-header">
              <div className="tracked-header-left">
                <span className="live-pulse-badge">
                  <span className="pulse-dot"></span> LIVE STATUS
                </span>
                <h2>Refund Reference: #{trackedRefund.id}</h2>
                <span className="tracked-meta-line">
                  Linked Booking: <strong>{trackedRefund.bookingId}</strong> • PNR: <strong>{trackedRefund.pnr}</strong> • {trackedRefund.serviceTitle}
                </span>
              </div>
              <div className="tracked-header-right">
                <span className={`refund-status-tag ${trackedRefund.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                  {trackedRefund.status === 'Completed' ? '✓ Refund Disbursed' : '⏳ In Progress (Step 3/4)'}
                </span>
                <button
                  type="button"
                  className="copy-track-link-btn"
                  onClick={handleCopyLink}
                  title="Copy direct tracking link"
                >
                  {copiedLink ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
                </button>
                <button
                  type="button"
                  className="receipt-download-btn"
                  onClick={() => window.print()}
                >
                  <Printer size={15} /> Print Credit Note
                </button>
              </div>
            </div>

            {/* 4-Step Interactive Progress Stepper */}
            <div className="refund-timeline-track-box mt-4">
              <div className="timeline-stepper-row">
                {trackedRefund.timeline?.map((step, idx) => (
                  <div
                    key={step.step || idx}
                    className={`timeline-step-col ${step.completed ? 'completed' : 'pending'} ${
                      trackedRefund.statusStep === step.step ? 'current' : ''
                    }`}
                  >
                    <div className="timeline-step-marker">
                      {step.completed ? (
                        <CheckCircle2 size={20} color="#10b981" />
                      ) : (
                        <span className="step-number-dot">{step.step}</span>
                      )}
                    </div>
                    <div className="timeline-step-content">
                      <strong>{step.title}</strong>
                      <p className="step-desc-text">{step.desc}</p>
                      <span className="step-time-stamp">{step.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Refund Financials & Payout Details */}
            <div className="refund-financial-grid mt-4">
              <div className="financial-cell">
                <span className="cell-label">Gross Fare Paid</span>
                <strong className="cell-val">₹{Number(trackedRefund.grossAmount || 0).toLocaleString('en-IN')}</strong>
              </div>
              <div className="financial-cell">
                <span className="cell-label">Operator Penalty</span>
                <strong className={`cell-val ${trackedRefund.penaltyAmount === 0 ? 'text-success' : 'text-danger'}`}>
                  {trackedRefund.penaltyAmount === 0 ? '₹0 (Waived)' : `-₹${Number(trackedRefund.penaltyAmount || 0).toLocaleString('en-IN')}`}
                </strong>
              </div>
              <div className="financial-cell highlight-cell">
                <span className="cell-label">Net Refund Amount</span>
                <strong className="cell-val text-success">₹{Number(trackedRefund.netRefundAmount || 0).toLocaleString('en-IN')}</strong>
              </div>
              <div className="financial-cell full-span">
                <span className="cell-label">Disbursement Channel & Banking Reference</span>
                <strong className="cell-val channel-val">
                  {trackedRefund.payoutDetails} • ARN Code: <span className="arn-code">{trackedRefund.arnNumber}</span>
                </strong>
              </div>
            </div>
          </div>
        )}

        {/* 2-Column Section: Interactive Calculator + SLA Timelines */}
        <div className="refund-interactive-grid mt-4">
          {/* Left: Interactive Refund Estimator Widget */}
          <div className="content-card refund-calc-card">
            <div className="calc-header">
              <div className="calc-icon-circle">
                <Calculator size={22} color="#034ea2" />
              </div>
              <div>
                <h3>Instant Refund Calculator</h3>
                <p>Estimate your penalty slabs and net refund before cancelling.</p>
              </div>
            </div>

            <div className="calc-service-selector mt-3">
              {[
                { key: 'flight', label: 'Flight', icon: <Plane size={15} /> },
                { key: 'hotel', label: 'Hotel', icon: <Building2 size={15} /> },
                { key: 'bus', label: 'Bus', icon: <Bus size={15} /> },
                { key: 'train', label: 'Railway', icon: <Train size={15} /> }
              ].map((s) => (
                <button
                  key={s.key}
                  type="button"
                  className={`calc-service-btn ${calcService === s.key ? 'active' : ''}`}
                  onClick={() => setCalcService(s.key)}
                >
                  {s.icon} {s.label}
                </button>
              ))}
            </div>

            <div className="form-group mt-3">
              <label>Ticket / Reservation Fare (₹)</label>
              <input
                type="number"
                className="native-input font-bold"
                value={calcAmount}
                onChange={(e) => setCalcAmount(Math.max(0, Number(e.target.value)))}
                min="0"
                step="100"
              />
            </div>

            <div className="form-group mt-3">
              <label>Notice Window (Hours before Departure / Check-in)</label>
              <select
                value={calcNoticeHours}
                onChange={(e) => setCalcNoticeHours(Number(e.target.value))}
                className="native-select"
              >
                <option value={96}>More than 72 Hours</option>
                <option value={48}>24 to 72 Hours</option>
                <option value={12}>4 to 24 Hours</option>
                <option value={2}>Under 4 Hours (Last Minute)</option>
              </select>
            </div>

            <div className="shield-toggle-card mt-3">
              <label className="checkbox-custom-label">
                <input
                  type="checkbox"
                  checked={calcHasShield}
                  onChange={(e) => setCalcHasShield(e.target.checked)}
                />
                <span className="checkbox-text">
                  <strong>Zero Cancellation Shield Active</strong>
                  <small className="d-block text-xs text-muted">100% operator penalty waiver protection</small>
                </span>
              </label>
            </div>

            {calcResult && (
              <div className="calc-result-box mt-4">
                <div className="calc-result-row">
                  <span>Gross Fare:</span>
                  <strong>₹{calcResult.grossAmount.toLocaleString('en-IN')}</strong>
                </div>
                <div className="calc-result-row">
                  <span>Estimated Penalty:</span>
                  <strong className={calcResult.penaltyAmount === 0 ? 'text-success' : 'text-danger'}>
                    {calcResult.penaltyAmount === 0 ? '₹0 (Zero Penalty)' : `-₹${calcResult.penaltyAmount.toLocaleString('en-IN')}`}
                  </strong>
                </div>
                <div className="calc-result-row net-row">
                  <span>Estimated Net Refund:</span>
                  <strong className="net-amount">₹{calcResult.netRefundAmount.toLocaleString('en-IN')}</strong>
                </div>

                <div className="wallet-bonus-hint mt-2">
                  <Zap size={14} color="#ea580c" />
                  <span>Choose Instant EazeWallet for <strong>+₹{calcResult.bonusWalletCredits} Bonus Booking Voucher</strong></span>
                </div>
              </div>
            )}
          </div>

          {/* Right: Disbursement Channels & SLAs */}
          <div className="content-card refund-channels-card">
            <h3>Disbursement Channels & Guaranteed SLAs</h3>
            <p className="channels-sub">All refunds are routed automatically via NPCI and direct banking clearing gateways.</p>

            <div className="channels-detailed-list mt-3">
              <div className="channel-detail-box">
                <div className="channel-box-icon upi">
                  <Smartphone size={22} />
                </div>
                <div>
                  <div className="channel-title-row">
                    <strong>UPI (Google Pay, PhonePe, Paytm, BHIM)</strong>
                    <span className="sla-pill fast">2 TO 24 HOURS</span>
                  </div>
                  <p>Direct bank account settlement via NPCI UPI clearing engine with real-time UTR transmission.</p>
                </div>
              </div>

              <div className="channel-detail-box">
                <div className="channel-box-icon wallet">
                  <Zap size={22} />
                </div>
                <div>
                  <div className="channel-title-row">
                    <strong>Instant EazeWallet Credit</strong>
                    <span className="sla-pill instant">⚡ 0 SECONDS</span>
                  </div>
                  <p>Immediate balance ledger update with <strong>+5% Bonus Credit</strong> and 1-year booking validity.</p>
                </div>
              </div>

              <div className="channel-detail-box">
                <div className="channel-box-icon card">
                  <CreditCard size={22} />
                </div>
                <div>
                  <div className="channel-title-row">
                    <strong>Credit & Debit Cards (Visa, Mastercard, RuPay)</strong>
                    <span className="sla-pill standard">3 TO 5 BANKING DAYS</span>
                  </div>
                  <p>Payment reversal posted directly to your issuing bank card statement under original authorization code.</p>
                </div>
              </div>

              <div className="channel-detail-box">
                <div className="channel-box-icon bank">
                  <Building size={22} />
                </div>
                <div>
                  <div className="channel-title-row">
                    <strong>Net Banking & Direct NEFT Transfer</strong>
                    <span className="sla-pill standard">24 TO 48 HOURS</span>
                  </div>
                  <p>Electronic clearing to any RBI-regulated Indian commercial or cooperative bank account.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DGCA & IRCTC Statutory Cancellation Policies Accordion */}
        <div className="content-card policies-accordion-card mt-4">
          <div className="section-title-wrap">
            <span className="section-tag">OFFICIAL REGULATORY GUIDELINES</span>
            <h2>Service-Specific Cancellation & Refund Rules</h2>
            <p>Our cancellation slabs are governed strictly by DGCA passenger charter, IRCTC regulations, and State transport rules.</p>
          </div>

          <div className="policy-accordion-items mt-4">
            {/* Flights Policy */}
            <div className={`policy-item ${expandedPolicy === 'flights' ? 'expanded' : ''}`}>
              <div
                className="policy-item-header"
                onClick={() => setExpandedPolicy(expandedPolicy === 'flights' ? '' : 'flights')}
              >
                <div className="policy-title-left">
                  <Plane size={20} color="#034ea2" />
                  <strong>1. Domestic & International Flight Bookings (DGCA Governed)</strong>
                </div>
                {expandedPolicy === 'flights' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>

              {expandedPolicy === 'flights' && (
                <div className="policy-item-body">
                  <div className="rules-grid-modern">
                    <div className="rule-box">
                      <span className="rule-time">&gt; 72 Hours Before Flight</span>
                      <strong className="rule-fee">₹1,500 - ₹3,000 / Passenger</strong>
                      <p>Standard airline penalty. Complete statutory airport tax (UDF, PSF) is 100% refundable.</p>
                    </div>
                    <div className="rule-box">
                      <span className="rule-time">24 to 72 Hours Before Flight</span>
                      <strong className="rule-fee">₹2,500 - ₹3,500 / Passenger</strong>
                      <p>Standard airline cancellation tier per operator fare rules.</p>
                    </div>
                    <div className="rule-box">
                      <span className="rule-time">&lt; 4 Hours of Departure</span>
                      <strong className="rule-fee">No-Show / Non-Refundable</strong>
                      <p>Airlines classify as No-Show. Airport taxes remain refundable upon claim.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Hotels Policy */}
            <div className={`policy-item ${expandedPolicy === 'hotels' ? 'expanded' : ''}`}>
              <div
                className="policy-item-header"
                onClick={() => setExpandedPolicy(expandedPolicy === 'hotels' ? '' : 'hotels')}
              >
                <div className="policy-title-left">
                  <Building2 size={20} color="#034ea2" />
                  <strong>2. Hotels, Resorts & Stays Policy</strong>
                </div>
                {expandedPolicy === 'hotels' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>

              {expandedPolicy === 'hotels' && (
                <div className="policy-item-body">
                  <div className="rules-grid-modern">
                    <div className="rule-box">
                      <span className="rule-time">&gt; 24 - 48 Hours Check-in</span>
                      <strong className="rule-fee text-success">100% Full Refund (Free)</strong>
                      <p>Applicable on all rate plans designated with Free Cancellation.</p>
                    </div>
                    <div className="rule-box">
                      <span className="rule-time">12 to 24 Hours Check-in</span>
                      <strong className="rule-fee">1st Night Room Charge</strong>
                      <p>Standard hospitality deduction for late cancellation notice.</p>
                    </div>
                    <div className="rule-box">
                      <span className="rule-time">Non-Refundable Promo Rates</span>
                      <strong className="rule-fee">Non-Refundable</strong>
                      <p>Special promotional rates explicitly tagged as non-refundable.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Buses Policy */}
            <div className={`policy-item ${expandedPolicy === 'buses' ? 'expanded' : ''}`}>
              <div
                className="policy-item-header"
                onClick={() => setExpandedPolicy(expandedPolicy === 'buses' ? '' : 'buses')}
              >
                <div className="policy-title-left">
                  <Bus size={20} color="#034ea2" />
                  <strong>3. Intercity AC & Luxury Buses Policy</strong>
                </div>
                {expandedPolicy === 'buses' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>

              {expandedPolicy === 'buses' && (
                <div className="policy-item-body">
                  <div className="rules-grid-modern">
                    <div className="rule-box">
                      <span className="rule-time">&gt; 12 Hours Departure</span>
                      <strong className="rule-fee">85% - 90% Refund</strong>
                      <p>10-15% operator cancellation surcharge applies.</p>
                    </div>
                    <div className="rule-box">
                      <span className="rule-time">4 to 12 Hours Departure</span>
                      <strong className="rule-fee">50% - 65% Refund</strong>
                      <p>Partial refund credited within 3-5 banking days.</p>
                    </div>
                    <div className="rule-box">
                      <span className="rule-time">&lt; 4 Hours Departure</span>
                      <strong className="rule-fee">Non-Refundable</strong>
                      <p>Bus operators do not permit cancellations once charting is completed.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Railways Policy */}
            <div className={`policy-item ${expandedPolicy === 'trains' ? 'expanded' : ''}`}>
              <div
                className="policy-item-header"
                onClick={() => setExpandedPolicy(expandedPolicy === 'trains' ? '' : 'trains')}
              >
                <div className="policy-title-left">
                  <Train size={20} color="#034ea2" />
                  <strong>4. Indian Railways (IRCTC Partner Rules)</strong>
                </div>
                {expandedPolicy === 'trains' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>

              {expandedPolicy === 'trains' && (
                <div className="policy-item-body">
                  <div className="rules-grid-modern">
                    <div className="rule-box">
                      <span className="rule-time">&gt; 48 Hours Before Train</span>
                      <strong className="rule-fee">₹60 - ₹240 Flat Clerkage</strong>
                      <p>Fixed IRCTC clerkage per passenger based on class (1A, 2A, 3A, SL).</p>
                    </div>
                    <div className="rule-box">
                      <span className="rule-time">12 to 48 Hours Before Train</span>
                      <strong className="rule-fee">25% Fare Deduction</strong>
                      <p>Subject to the minimum flat clerkage charge.</p>
                    </div>
                    <div className="rule-box">
                      <span className="rule-time">Tatkal Confirm Tickets</span>
                      <strong className="rule-fee">Non-Refundable</strong>
                      <p>As per IRCTC rules, confirmed Tatkal tickets are non-refundable.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 24/7 Resolution Helpline Strip */}
        <div className="content-card refund-help-strip mt-4">
          <div className="help-strip-left">
            <div className="help-icon-circle">
              <Phone size={24} color="#034ea2" />
            </div>
            <div>
              <h3>Need Urgent Cancellation or Refund Escalation?</h3>
              <p>Our dedicated 24/7 concierge resolution team is available to assist you with emergency flight rescheduling, medical waivers, and payment inquiries.</p>
            </div>
          </div>
          <div className="help-strip-actions">
            <a
              href="https://wa.me/918269054018?text=Hello%20EazeTrip%20Support%2C%20I%20need%20urgent%20assistance%20with%20my%20refund%20status."
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-btn"
            >
              <MessageSquare size={16} /> WhatsApp Support
            </a>
            <a href="tel:+918269054018" className="primary-btn">
              <Phone size={16} /> Call +91 8269054018
            </a>
          </div>
        </div>

        {/* 3-Step Interactive Direct Refund Claim Modal */}
        {showClaimModal && (
          <div className="modal-overlay" onClick={closeClaimModal}>
            <div
              className="modal-container refund-wizard-modal direct-claim-modal"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="refund-modal-header">
                <div>
                  <div className="refund-modal-tag">
                    <ShieldCheck size={16} />
                    <span>DIRECT DISPUTE & REFUND ESCALATION</span>
                  </div>
                  <h3>Submit Direct Refund Claim</h3>
                  <span className="refund-ref-sub">
                    Fast-track claims for airline cancellations, medical emergencies, duplicate charges & waitlists
                  </span>
                </div>
                <button
                  className="modal-close-btn"
                  onClick={closeClaimModal}
                  type="button"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Stepper Bar */}
              <div className="refund-stepper-bar">
                <div className={`refund-step-item ${claimStep >= 1 ? 'active' : ''} ${claimStep > 1 ? 'completed' : ''}`}>
                  <span className="step-num">1</span>
                  <span className="step-label">Claim Reason</span>
                </div>
                <div className="step-divider-line"></div>
                <div className={`refund-step-item ${claimStep >= 2 ? 'active' : ''} ${claimStep > 2 ? 'completed' : ''}`}>
                  <span className="step-num">2</span>
                  <span className="step-label">Booking & Passenger</span>
                </div>
                <div className="step-divider-line"></div>
                <div className={`refund-step-item ${claimStep === 3 ? 'active completed' : ''}`}>
                  <span className="step-num">3</span>
                  <span className="step-label">Disbursement & Credit</span>
                </div>
              </div>

              {/* Step 1: Select Claim Category */}
              {claimStep === 1 && (
                <div className="refund-modal-body">
                  <h4 className="payout-selection-heading">Select the reason for your refund claim:</h4>
                  <p className="payout-selection-sub">DGCA & IRCTC statutory guidelines apply to full penalty waivers.</p>

                  <div className="claim-categories-grid mt-3">
                    {[
                      {
                        key: 'airline_cancellation',
                        title: '✈️ Airline Cancelled / Rescheduled (>3 hrs)',
                        badge: '100% Full Refund Guarantee',
                        desc: 'Flight cancelled by airline or delayed beyond 3 hours. Zero airline deduction.',
                        type: 'flight'
                      },
                      {
                        key: 'medical_emergency',
                        title: '🏥 Medical Emergency / Health Waiver',
                        badge: 'Waiver Shield Eligible',
                        desc: 'Hospitalisation or certified passenger illness. Eligible for full penalty waiver.',
                        type: 'flight'
                      },
                      {
                        key: 'duplicate_debit',
                        title: '💳 Duplicate Debit / Double Charged',
                        badge: 'Auto-Reversal',
                        desc: 'Account was debited multiple times during checkout or payment gateway timeout.',
                        type: 'flight'
                      },
                      {
                        key: 'train_waitlist',
                        title: '🚆 IRCTC Waiting List Auto-Cancelled',
                        badge: 'IRCTC Regulated',
                        desc: 'Waitlisted train ticket dropped automatically after chart preparation.',
                        type: 'train'
                      },
                      {
                        key: 'hotel_issue',
                        title: '🏨 Hotel Check-in Denied / Property Closed',
                        badge: 'EazeTrip Shield',
                        desc: 'Hotel room was unavailable or property refused check-in upon arrival.',
                        type: 'hotel'
                      },
                      {
                        key: 'other',
                        title: '📝 Other Booking Cancellation Dispute',
                        badge: 'Standard Claim',
                        desc: 'Any other customer dispute or special itinerary modification claim.',
                        type: 'flight'
                      }
                    ].map((cat) => (
                      <div
                        key={cat.key}
                        className={`claim-cat-card ${claimCategory === cat.key ? 'selected' : ''}`}
                        onClick={() => {
                          setClaimCategory(cat.key);
                          setClaimServiceType(cat.type);
                        }}
                      >
                        <div className="cat-header-row">
                          <strong>{cat.title}</strong>
                          <span className="cat-badge">{cat.badge}</span>
                        </div>
                        <p className="cat-desc">{cat.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="refund-actions-bar mt-4">
                    <button type="button" className="secondary-btn" onClick={closeClaimModal}>
                      Cancel
                    </button>
                    <button type="button" className="primary-btn" onClick={() => setClaimStep(2)}>
                      Enter Booking Details <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Booking Details */}
              {claimStep === 2 && (
                <div className="refund-modal-body">
                  <h4 className="payout-selection-heading">Enter Itinerary & Passenger Information</h4>
                  <p className="payout-selection-sub">Provide the reference number and passenger details linked to this transaction.</p>

                  <div className="claim-form-grid mt-3">
                    <div className="form-group">
                      <label>PNR or Booking Reference *</label>
                      <input
                        type="text"
                        className="native-input font-bold uppercase"
                        placeholder="e.g. 6EZ9KM or EZ-FL-74892"
                        value={claimPnr}
                        onChange={(e) => setClaimPnr(e.target.value.toUpperCase())}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Travel Medium *</label>
                      <select
                        className="native-select"
                        value={claimServiceType}
                        onChange={(e) => setClaimServiceType(e.target.value)}
                      >
                        <option value="flight">Flight (Domestic / International)</option>
                        <option value="hotel">Hotel / Resort Stay</option>
                        <option value="bus">Intercity Bus</option>
                        <option value="train">Indian Railways (IRCTC)</option>
                        <option value="holiday">Holiday Tour Package</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Lead Passenger Full Name *</label>
                      <input
                        type="text"
                        className="native-input"
                        placeholder="e.g. Rohit Sharma"
                        value={claimName}
                        onChange={(e) => setClaimName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Approx. Gross Ticket Fare Paid (₹) *</label>
                      <input
                        type="number"
                        className="native-input font-bold"
                        value={claimAmount}
                        onChange={(e) => setClaimAmount(Number(e.target.value))}
                        min="100"
                        step="100"
                      />
                    </div>

                    <div className="form-group">
                      <label>Contact Email (For Tracking Credit Note) *</label>
                      <input
                        type="email"
                        className="native-input"
                        value={claimEmail}
                        onChange={(e) => setClaimEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Contact Mobile (+91) *</label>
                      <input
                        type="tel"
                        className="native-input"
                        value={claimPhone}
                        onChange={(e) => setClaimPhone(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Route / Hotel Name / Flight Details</label>
                      <input
                        type="text"
                        className="native-input"
                        placeholder="e.g. IndiGo 6E-2041 BOM-DEL or Taj Palace Goa"
                        value={claimServiceTitle}
                        onChange={(e) => setClaimServiceTitle(e.target.value)}
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Detailed Explanation / Supporting Remarks</label>
                      <textarea
                        className="native-textarea"
                        rows="2"
                        placeholder="e.g. Flight 6E-2041 was cancelled by IndiGo on 22 Sep. SMS notice received."
                        value={claimRemarks}
                        onChange={(e) => setClaimRemarks(e.target.value)}
                      ></textarea>
                    </div>
                  </div>

                  <div className="refund-actions-bar mt-4">
                    <button type="button" className="secondary-btn" onClick={() => setClaimStep(1)}>
                      Back
                    </button>
                    <button
                      type="button"
                      className="primary-btn"
                      disabled={!claimPnr.trim() || !claimName.trim()}
                      onClick={() => setClaimStep(3)}
                    >
                      Choose Disbursement Mode <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Disbursement Preference & Submission */}
              {claimStep === 3 && !claimResult && (
                <div className="refund-modal-body">
                  <h4 className="payout-selection-heading">Choose Your Payout Destination</h4>
                  <p className="payout-selection-sub">Select how you would like to receive the ₹{Number(claimAmount || 0).toLocaleString('en-IN')} refund credit.</p>

                  <div className="payout-options-grid mt-3">
                    {/* Option 1: Instant EazeWallet */}
                    <div
                      className={`payout-option-card ${claimPayoutMode === 'wallet' ? 'selected' : ''}`}
                      onClick={() => setClaimPayoutMode('wallet')}
                    >
                      <div className="payout-card-radio">
                        <input
                          type="radio"
                          name="claimPayout"
                          checked={claimPayoutMode === 'wallet'}
                          onChange={() => setClaimPayoutMode('wallet')}
                        />
                      </div>
                      <div className="payout-card-icon wallet">
                        <Zap size={22} />
                      </div>
                      <div className="payout-card-content">
                        <div className="payout-title-row">
                          <strong>Instant EazeWallet Credit</strong>
                          <span className="instant-badge">⚡ 0-SECOND CREDIT</span>
                        </div>
                        <p>Immediate ledger balance update with <strong>+₹{Math.round(Number(claimAmount || 0) * 0.05 + 100)} Bonus Voucher</strong> and 1-year booking validity.</p>
                      </div>
                    </div>

                    {/* Option 2: Original Mode */}
                    <div
                      className={`payout-option-card ${claimPayoutMode === 'original_mode' ? 'selected' : ''}`}
                      onClick={() => setClaimPayoutMode('original_mode')}
                    >
                      <div className="payout-card-radio">
                        <input
                          type="radio"
                          name="claimPayout"
                          checked={claimPayoutMode === 'original_mode'}
                          onChange={() => setClaimPayoutMode('original_mode')}
                        />
                      </div>
                      <div className="payout-card-icon card">
                        <CreditCard size={22} />
                      </div>
                      <div className="payout-card-content">
                        <div className="payout-title-row">
                          <strong>Original Payment Method (Source)</strong>
                          <span className="standard-badge">24 - 48 HRS</span>
                        </div>
                        <p>Credited back to the original UPI, Card, or Net Banking account used during ticket checkout.</p>
                      </div>
                    </div>

                    {/* Option 3: UPI VPA */}
                    <div
                      className={`payout-option-card ${claimPayoutMode === 'upi' ? 'selected' : ''}`}
                      onClick={() => setClaimPayoutMode('upi')}
                    >
                      <div className="payout-card-radio">
                        <input
                          type="radio"
                          name="claimPayout"
                          checked={claimPayoutMode === 'upi'}
                          onChange={() => setClaimPayoutMode('upi')}
                        />
                      </div>
                      <div className="payout-card-icon upi">
                        <Smartphone size={22} />
                      </div>
                      <div className="payout-card-content">
                        <div className="payout-title-row">
                          <strong>Direct UPI VPA Transfer</strong>
                          <span className="instant-badge">2 - 6 HRS</span>
                        </div>
                        <p>Direct bank account settlement via NPCI UPI clearing engine.</p>
                        {claimPayoutMode === 'upi' && (
                          <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              className="native-input"
                              placeholder="Enter your UPI ID (e.g. mobile@okaxis)"
                              value={claimUpiId}
                              onChange={(e) => setClaimUpiId(e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Option 4: Bank NEFT */}
                    <div
                      className={`payout-option-card ${claimPayoutMode === 'bank_transfer' ? 'selected' : ''}`}
                      onClick={() => setClaimPayoutMode('bank_transfer')}
                    >
                      <div className="payout-card-radio">
                        <input
                          type="radio"
                          name="claimPayout"
                          checked={claimPayoutMode === 'bank_transfer'}
                          onChange={() => setClaimPayoutMode('bank_transfer')}
                        />
                      </div>
                      <div className="payout-card-icon bank">
                        <Building size={22} />
                      </div>
                      <div className="payout-card-content">
                        <div className="payout-title-row">
                          <strong>Direct Bank Account (NEFT / IMPS)</strong>
                          <span className="standard-badge">1 - 2 BANKING DAYS</span>
                        </div>
                        <p>Electronic clearing to any Indian bank account.</p>
                        {claimPayoutMode === 'bank_transfer' && (
                          <div className="payout-nested-inputs mt-2" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              className="native-input mb-2"
                              placeholder="Account Number"
                              value={claimBankAccount}
                              onChange={(e) => setClaimBankAccount(e.target.value)}
                            />
                            <input
                              type="text"
                              className="native-input"
                              placeholder="Bank IFSC Code"
                              value={claimIfscCode}
                              onChange={(e) => setClaimIfscCode(e.target.value.toUpperCase())}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="refund-actions-bar mt-4">
                    <button type="button" className="secondary-btn" onClick={() => setClaimStep(2)}>
                      Back
                    </button>
                    <button
                      type="button"
                      className="primary-btn submit-claim-now-btn"
                      onClick={handleSubmitDirectClaim}
                      disabled={isSubmittingClaim}
                    >
                      {isSubmittingClaim ? 'Registering Claim...' : `Submit Official Claim & Disburse ₹${Number(claimAmount).toLocaleString('en-IN')}`}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3 Success Voucher */}
              {claimResult && (
                <div className="refund-modal-body text-center py-4">
                  <div className="refund-success-icon-circle mx-auto mb-3">
                    <CheckCircle2 size={48} color="#10b981" />
                  </div>

                  <h3>Refund Claim Successfully Registered!</h3>
                  <p className="refund-success-lead">
                    Your claim has been logged into the DGCA/IRCTC clearing gateway. Tracking ID: <strong>{claimResult.id}</strong>
                  </p>

                  <div className="refund-receipt-voucher-card text-start mt-4">
                    <div className="voucher-header">
                      <span className="voucher-badge">OFFICIAL REFUND CREDIT NOTE</span>
                      <span className="voucher-status-pill">{claimResult.status}</span>
                    </div>

                    <div className="voucher-details-grid mt-3">
                      <div className="voucher-field">
                        <span>Refund Tracking ID:</span>
                        <strong>{claimResult.id}</strong>
                      </div>
                      <div className="voucher-field">
                        <span>Banking Reference (ARN):</span>
                        <strong>{claimResult.arnNumber}</strong>
                      </div>
                      <div className="voucher-field">
                        <span>PNR / Reference:</span>
                        <strong>{claimResult.pnr}</strong>
                      </div>
                      <div className="voucher-field">
                        <span>Net Refund Amount:</span>
                        <strong className="text-success font-bold">₹{Number(claimResult.netRefundAmount || 0).toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="voucher-field full-width">
                        <span>Disbursement Channel:</span>
                        <strong>{claimResult.payoutDetails}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="refund-confirmation-actions mt-4">
                    <button
                      type="button"
                      className="secondary-btn"
                      onClick={() => window.print()}
                    >
                      <Printer size={16} /> Print Credit Note
                    </button>
                    <button
                      type="button"
                      className="primary-btn"
                      onClick={() => {
                        closeClaimModal();
                        handleSearchRefund(claimResult.id);
                      }}
                    >
                      Track Live Progress on Hub →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
