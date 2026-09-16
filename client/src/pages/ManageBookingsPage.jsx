import { useState, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import { api } from '../services/api';
import {
  Plane,
  Building2,
  Bus,
  Train,
  Calendar,
  ShieldAlert,
  ShieldCheck,
  FileText,
  Download,
  X,
  Luggage,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  Zap,
  CreditCard,
  Building,
  Smartphone,
  ChevronRight,
  ExternalLink,
  Printer,
  Receipt
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function ManageBookingsPage() {
  const { bookings, openTicketModal, requestCancellationRefund } = useBooking();
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState('all'); // all | flight | hotel | bus | train
  const [filterStatus, setFilterStatus] = useState('all'); // all | Confirmed | Cancelled
  const [searchQuery, setSearchQuery] = useState('');

  // 3-Step Cancellation Modal States
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState(null);
  const [cancelStep, setCancelStep] = useState(1); // 1: Breakdown & Reason | 2: Payout Mode | 3: Confirmation
  const [cancelReason, setCancelReason] = useState('Travel plans changed');
  const [customRemark, setCustomRemark] = useState('');
  const [payoutMode, setPayoutMode] = useState('wallet'); // 'wallet' | 'original_mode' | 'bank_transfer' | 'upi'
  const [bankAccount, setBankAccount] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [upiId, setUpiId] = useState('');
  const [selectedPax, setSelectedPax] = useState([]);
  const [refundCalculation, setRefundCalculation] = useState(null);
  const [isSubmittingRefund, setIsSubmittingRefund] = useState(false);
  const [completedRefundResult, setCompletedRefundResult] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isSubmittingRefund) {
        closeCancelModal();
      }
    };
    if (selectedBookingForCancel) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedBookingForCancel, isSubmittingRefund]);

  // When a booking is selected for cancellation, calculate breakdown
  const handleOpenCancelModal = async (booking) => {
    setSelectedBookingForCancel(booking);
    setCancelStep(1);
    setCancelReason('Travel plans changed');
    setCustomRemark('');
    setPayoutMode('wallet');
    setBankAccount('');
    setIfscCode('');
    setUpiId('');
    setSelectedPax(booking.passengers?.map((p) => p.name) || []);
    setCompletedRefundResult(null);

    const gross = Number(booking.totalAmount || 3000);
    const hasShield = Boolean(booking.hasShield || booking.travelAssurance);

    // Call server calculate or compute locally
    try {
      const calc = await api.calculateRefund({
        serviceType: booking.type || 'flight',
        grossAmount: gross,
        hoursBeforeDeparture: 48,
        hasShield
      });
      if (calc) {
        setRefundCalculation(calc);
        return;
      }
    } catch {
      // Fallback calculation
    }

    const penalty = hasShield ? 0 : Math.round(gross * 0.25);
    setRefundCalculation({
      serviceType: booking.type || 'flight',
      grossAmount: gross,
      hasShield,
      penaltyAmount: penalty,
      penaltyDescription: hasShield ? 'Zero Cancellation Shield Active' : 'Standard Operator Penalty Slab',
      serviceFeeWaiver: 250,
      netRefundAmount: Math.max(0, gross - penalty),
      bonusWalletCredits: Math.round(gross * 0.05 + 100)
    });
  };

  const closeCancelModal = () => {
    setSelectedBookingForCancel(null);
    setCancelStep(1);
    setRefundCalculation(null);
    setCompletedRefundResult(null);
  };

  const handleProceedToPayout = () => {
    setCancelStep(2);
  };

  const handleConfirmRefundSubmission = async () => {
    if (!selectedBookingForCancel || !refundCalculation) return;

    setIsSubmittingRefund(true);
    const refundPayload = {
      bookingId: selectedBookingForCancel.id,
      pnr: selectedBookingForCancel.pnr,
      customerName: selectedBookingForCancel.passengers?.[0]?.name || 'Traveler',
      customerEmail: selectedBookingForCancel.contactEmail || selectedBookingForCancel.email || 'traveler@eazetrip.com',
      customerPhone: selectedBookingForCancel.contactPhone || selectedBookingForCancel.phone || '9876543210',
      serviceType: selectedBookingForCancel.type || 'flight',
      serviceTitle: selectedBookingForCancel.title || 'Trip Booking',
      grossAmount: refundCalculation.grossAmount,
      penaltyAmount: refundCalculation.penaltyAmount,
      netRefundAmount: refundCalculation.netRefundAmount,
      reason: `${cancelReason}${customRemark ? ` - ${customRemark}` : ''}`,
      payoutMode,
      bankAccount,
      ifscCode,
      upiId,
      hasShield: refundCalculation.hasShield,
      selectedPassengers: selectedPax
    };

    try {
      const result = await requestCancellationRefund(refundPayload);
      setCompletedRefundResult(result);
      setCancelStep(3);
    } catch (err) {
      console.error('Refund submission failed', err);
    } finally {
      setIsSubmittingRefund(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filterType !== 'all' && b.type !== filterType) return false;
    if (filterStatus !== 'all' && b.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = b.id?.toLowerCase().includes(q);
      const matchTitle = b.title?.toLowerCase().includes(q);
      const matchPnr = b.pnr?.toLowerCase().includes(q);
      const matchPax = b.passengers?.some((p) => p.name?.toLowerCase().includes(q));
      return matchId || matchTitle || matchPnr || matchPax;
    }
    return true;
  });

  const getTypeIcon = (type) => {
    if (type === 'flight') return <Plane size={20} color="#034ea2" />;
    if (type === 'hotel') return <Building2 size={20} color="#034ea2" />;
    if (type === 'bus') return <Bus size={20} color="#034ea2" />;
    return <Train size={20} color="#034ea2" />;
  };

  const activeCount = bookings.filter((b) => b.status === 'Confirmed').length;
  const cancelledCount = bookings.filter((b) => b.status === 'Cancelled').length;

  return (
    <div className="manage-bookings-page container page-wrap">
      <div className="page-shell">
        <div className="page-topbar">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>My Trips & Bookings</span>
        </div>

        {/* Top Header Banner */}
        <div className="bookings-hero-banner">
          <div className="bookings-banner-left">
            <div className="banner-tag">
              <Luggage size={16} />
              <span>ITINERARY & RESERVATIONS HUB</span>
            </div>
            <h1>Manage Your Bookings</h1>
            <p>Access your confirmed flight tickets, hotel vouchers, train PNRs, and track instant refund disbursements.</p>
          </div>
          <div className="bookings-banner-right">
            <Link to="/cancellation-refund" className="secondary-btn me-2">
              <Receipt size={16} /> Refund Status Hub
            </Link>
            <Link to="/" className="primary-btn">
              + Plan New Journey
            </Link>
          </div>
        </div>

        {/* Quick Stats Metrics */}
        <div className="bookings-stats-strip mt-3">
          <div className="booking-stat-chip">
            <span>Total Bookings:</span>
            <strong>{bookings.length}</strong>
          </div>
          <div className="booking-stat-chip active-stat">
            <span>Confirmed / Active:</span>
            <strong>{activeCount}</strong>
          </div>
          <div className="booking-stat-chip cancel-stat">
            <span>Cancelled & Refunded:</span>
            <strong>{cancelledCount}</strong>
          </div>
        </div>

        {/* Filter Toolbar & Search */}
        <div className="bookings-toolbar-card content-card mt-4">
          <div className="toolbar-filters-row">
            <div className="filter-pill-group">
              {[
                { key: 'all', label: 'All Trips' },
                { key: 'flight', label: 'Flights' },
                { key: 'hotel', label: 'Hotels' },
                { key: 'bus', label: 'Buses' },
                { key: 'train', label: 'Trains' }
              ].map((t) => (
                <button
                  key={t.key}
                  type="button"
                  className={`filter-pill-btn ${filterType === t.key ? 'active' : ''}`}
                  onClick={() => setFilterType(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="toolbar-controls-right">
              <div className="bookings-search-input">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search by Booking ID, PNR, City..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="native-select small status-dropdown"
              >
                <option value="all">All Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="content-card empty-bookings-box text-center py-5 mt-4">
            <div className="empty-icon-circle mx-auto mb-3">
              <FileText size={42} color="#94a3b8" />
            </div>
            <h3>No Bookings Found</h3>
            <p className="lead">
              {searchQuery
                ? `No booking records matched your search "${searchQuery}".`
                : "You don't have any bookings under this selected filter."}
            </p>
            <div className="mt-4">
              <Link to="/" className="primary-btn">
                Book Flights, Hotels or Trains
              </Link>
            </div>
          </div>
        ) : (
          <div className="bookings-cards-list mt-4">
            {filteredBookings.map((booking) => {
              const isCancelled = booking.status === 'Cancelled';
              return (
                <div
                  key={booking.id}
                  className={`booking-manage-card-elevated ${isCancelled ? 'cancelled-card' : ''}`}
                >
                  <div className="booking-card-main-grid">
                    {/* Left: Type Icon & ID */}
                    <div className="booking-service-badge-col">
                      <div className="booking-service-circle">
                        {getTypeIcon(booking.type)}
                      </div>
                      <span className="booking-id-text">ID: {booking.id}</span>
                    </div>

                    {/* Middle: Itinerary & Passenger Details */}
                    <div className="booking-itinerary-col">
                      <div className="booking-status-header">
                        <span className={`status-badge ${isCancelled ? 'cancelled' : 'confirmed'}`}>
                          {isCancelled ? '● Cancelled' : '✓ Confirmed'}
                        </span>
                        <span className="booking-service-type">{booking.type?.toUpperCase()}</span>
                      </div>

                      <h3 className="booking-title-text">{booking.title}</h3>

                      <div className="booking-meta-badges">
                        <div className="meta-badge-item">
                          <Calendar size={14} />
                          <span>Date: <strong>{booking.date}</strong></span>
                        </div>
                        {booking.pnr && (
                          <div className="meta-badge-item">
                            <span>PNR: <strong>{booking.pnr}</strong></span>
                          </div>
                        )}
                        {booking.passengers?.[0] && (
                          <div className="meta-badge-item">
                            <span>Lead Passenger: <strong>{booking.passengers[0].name}</strong></span>
                          </div>
                        )}
                      </div>

                      {isCancelled && (
                        <div className="refund-status-callout mt-2">
                          <ShieldAlert size={14} color="#ea580c" />
                          <span>
                            Refund Status: <strong>{booking.refundStatus || 'Processing to original payment mode'}</strong>
                          </span>
                          {booking.refundId && (
                            <Link
                              to={`/cancellation-refund?ref=${booking.refundId}`}
                              className="refund-track-link-pill"
                            >
                              Track Refund #{booking.refundId} →
                            </Link>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right: Fare & Actions */}
                    <div className="booking-action-price-col">
                      <div className="fare-display-box">
                        <span className="fare-label">Total Amount Paid</span>
                        <strong className="fare-amount-num">₹{Number(booking.totalAmount || 0).toLocaleString('en-IN')}</strong>
                      </div>

                      <div className="action-buttons-stack">
                        <button
                          type="button"
                          className="view-ticket-btn"
                          onClick={() => openTicketModal(booking)}
                        >
                          <FileText size={15} />
                          <span>View E-Ticket</span>
                        </button>

                        {!isCancelled ? (
                          <button
                            type="button"
                            className="cancel-trip-btn"
                            onClick={() => handleOpenCancelModal(booking)}
                          >
                            Cancel & Refund
                          </button>
                        ) : (
                          <Link
                            to={`/cancellation-refund?ref=${booking.refundId || booking.pnr || booking.id}`}
                            className="track-refund-secondary-btn"
                          >
                            Track Live Refund
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 3-Step Cancellation & Refund Experience Modal */}
        {selectedBookingForCancel && (
          <div className="modal-overlay" onClick={closeCancelModal}>
            <div
              className="modal-container refund-wizard-modal"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Stepper Header */}
              <div className="refund-modal-header">
                <div>
                  <div className="refund-modal-tag">
                    <ShieldCheck size={16} />
                    <span>TRANSPARENT REFUND GUARANTEE</span>
                  </div>
                  <h3>Cancel Booking & Initiate Refund</h3>
                  <span className="refund-ref-sub">
                    Booking ID: <strong>{selectedBookingForCancel.id}</strong> • PNR: <strong>{selectedBookingForCancel.pnr || 'N/A'}</strong>
                  </span>
                </div>
                <button
                  className="modal-close-btn"
                  onClick={closeCancelModal}
                  type="button"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Step Tracker Indicator */}
              <div className="refund-stepper-bar">
                <div className={`refund-step-item ${cancelStep >= 1 ? 'active' : ''} ${cancelStep > 1 ? 'completed' : ''}`}>
                  <span className="step-num">1</span>
                  <span className="step-label">Penalty & Breakdown</span>
                </div>
                <div className="step-divider-line"></div>
                <div className={`refund-step-item ${cancelStep >= 2 ? 'active' : ''} ${cancelStep > 2 ? 'completed' : ''}`}>
                  <span className="step-num">2</span>
                  <span className="step-label">Payout Destination</span>
                </div>
                <div className="step-divider-line"></div>
                <div className={`refund-step-item ${cancelStep === 3 ? 'active completed' : ''}`}>
                  <span className="step-num">3</span>
                  <span className="step-label">Confirmation & Receipt</span>
                </div>
              </div>

              {/* Step 1: Breakdown & Reason */}
              {cancelStep === 1 && refundCalculation && (
                <div className="refund-modal-body">
                  <div className="refund-summary-breakdown-card">
                    <div className="breakdown-row">
                      <span>Gross Booking Fare Paid:</span>
                      <strong>₹{refundCalculation.grossAmount.toLocaleString('en-IN')}</strong>
                    </div>

                    <div className="breakdown-row text-muted">
                      <span>
                        Operator Cancellation Penalty:
                        <small className="d-block text-xs text-secondary">{refundCalculation.penaltyDescription}</small>
                      </span>
                      <strong className={refundCalculation.penaltyAmount === 0 ? 'text-success' : 'text-danger'}>
                        {refundCalculation.penaltyAmount === 0 ? '₹0 (Waived)' : `-₹${refundCalculation.penaltyAmount.toLocaleString('en-IN')}`}
                      </strong>
                    </div>

                    <div className="breakdown-row text-muted">
                      <span>EazeTrip Processing & Resolution Fee:</span>
                      <strong className="text-success">₹0 (Free / Waived)</strong>
                    </div>

                    <div className="breakdown-divider"></div>

                    <div className="breakdown-row highlight-net">
                      <div>
                        <span className="net-refund-title">Estimated Net Refund Amount</span>
                        <small className="d-block text-xs text-muted">Directly credited with zero deduction surcharge</small>
                      </div>
                      <strong className="net-refund-price">₹{refundCalculation.netRefundAmount.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>

                  {refundCalculation.hasShield && (
                    <div className="shield-active-callout mt-3">
                      <ShieldCheck size={18} color="#10b981" />
                      <span>
                        <strong>Zero Cancellation Shield Protected</strong>: 100% of operator penalty waived.
                      </span>
                    </div>
                  )}

                  {/* Reason for Cancellation */}
                  <div className="form-group mt-3">
                    <label htmlFor="cancel-reason-input">Reason for Cancellation</label>
                    <select
                      id="cancel-reason-input"
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="native-select"
                    >
                      <option value="Travel plans changed">Travel plans changed</option>
                      <option value="Found better fare / dates">Found better fare / alternative dates</option>
                      <option value="Flight / Schedule rescheduled by airline">Flight rescheduled by airline</option>
                      <option value="Personal emergency / Health reasons">Personal emergency / Health reasons</option>
                      <option value="Booked duplicate ticket by mistake">Booked duplicate ticket by mistake</option>
                    </select>
                  </div>

                  <div className="form-group mt-2">
                    <label htmlFor="custom-remarks">Additional Notes (Optional)</label>
                    <input
                      id="custom-remarks"
                      type="text"
                      className="native-input"
                      placeholder="e.g. Doctor's note available, baggage adjustment..."
                      value={customRemark}
                      onChange={(e) => setCustomRemark(e.target.value)}
                    />
                  </div>

                  {/* Actions */}
                  <div className="refund-actions-bar mt-4">
                    <button type="button" className="secondary-btn" onClick={closeCancelModal}>
                      Keep Booking
                    </button>
                    <button type="button" className="primary-btn" onClick={handleProceedToPayout}>
                      Select Payout Method <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Choose Payout Destination */}
              {cancelStep === 2 && refundCalculation && (
                <div className="refund-modal-body">
                  <h4 className="payout-selection-heading">Where should we disburse your ₹{refundCalculation.netRefundAmount.toLocaleString('en-IN')} refund?</h4>
                  <p className="payout-selection-sub">Choose your preferred payout destination for instant or standard disbursement.</p>

                  <div className="payout-options-grid mt-3">
                    {/* Option 1: Instant EazeWallet */}
                    <div
                      className={`payout-option-card ${payoutMode === 'wallet' ? 'selected' : ''}`}
                      onClick={() => setPayoutMode('wallet')}
                    >
                      <div className="payout-card-radio">
                        <input
                          type="radio"
                          name="payoutMode"
                          checked={payoutMode === 'wallet'}
                          onChange={() => setPayoutMode('wallet')}
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
                        <p>Immediate credit to your EazeTrip wallet balance with <strong>+₹{refundCalculation.bonusWalletCredits} Bonus Booking Voucher</strong>.</p>
                      </div>
                    </div>

                    {/* Option 2: Original Mode */}
                    <div
                      className={`payout-option-card ${payoutMode === 'original_mode' ? 'selected' : ''}`}
                      onClick={() => setPayoutMode('original_mode')}
                    >
                      <div className="payout-card-radio">
                        <input
                          type="radio"
                          name="payoutMode"
                          checked={payoutMode === 'original_mode'}
                          onChange={() => setPayoutMode('original_mode')}
                        />
                      </div>
                      <div className="payout-card-icon card">
                        <CreditCard size={22} />
                      </div>
                      <div className="payout-card-content">
                        <div className="payout-title-row">
                          <strong>Original Payment Method</strong>
                          <span className="standard-badge">24 - 48 HRS</span>
                        </div>
                        <p>Credited back to the original UPI ID, Credit/Debit Card, or Net Banking account used during booking.</p>
                      </div>
                    </div>

                    {/* Option 3: Instant UPI */}
                    <div
                      className={`payout-option-card ${payoutMode === 'upi' ? 'selected' : ''}`}
                      onClick={() => setPayoutMode('upi')}
                    >
                      <div className="payout-card-radio">
                        <input
                          type="radio"
                          name="payoutMode"
                          checked={payoutMode === 'upi'}
                          onChange={() => setPayoutMode('upi')}
                        />
                      </div>
                      <div className="payout-card-icon upi">
                        <Smartphone size={22} />
                      </div>
                      <div className="payout-card-content">
                        <div className="payout-title-row">
                          <strong>Direct UPI Transfer</strong>
                          <span className="instant-badge">2 - 6 HRS</span>
                        </div>
                        <p>Disbursed directly to your personal UPI Virtual Payment Address (VPA).</p>

                        {payoutMode === 'upi' && (
                          <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              className="native-input"
                              placeholder="Enter your UPI ID (e.g. mobile@okhdfcbank)"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Option 4: Bank Transfer NEFT/IMPS */}
                    <div
                      className={`payout-option-card ${payoutMode === 'bank_transfer' ? 'selected' : ''}`}
                      onClick={() => setPayoutMode('bank_transfer')}
                    >
                      <div className="payout-card-radio">
                        <input
                          type="radio"
                          name="payoutMode"
                          checked={payoutMode === 'bank_transfer'}
                          onChange={() => setPayoutMode('bank_transfer')}
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
                        <p>Direct electronic clearing into your savings or current bank account.</p>

                        {payoutMode === 'bank_transfer' && (
                          <div className="payout-nested-inputs mt-2" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              className="native-input mb-2"
                              placeholder="Bank Account Number"
                              value={bankAccount}
                              onChange={(e) => setBankAccount(e.target.value)}
                            />
                            <input
                              type="text"
                              className="native-input"
                              placeholder="Bank IFSC Code (e.g. HDFC0000123)"
                              value={ifscCode}
                              onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="refund-actions-bar mt-4">
                    <button type="button" className="secondary-btn" onClick={() => setCancelStep(1)}>
                      Back to Breakdown
                    </button>
                    <button
                      type="button"
                      className="danger-btn"
                      onClick={handleConfirmRefundSubmission}
                      disabled={isSubmittingRefund}
                    >
                      {isSubmittingRefund ? 'Processing Cancellation...' : `Confirm Cancellation & Disburse ₹${refundCalculation.netRefundAmount.toLocaleString('en-IN')}`}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Confirmation & Receipt */}
              {cancelStep === 3 && completedRefundResult && (
                <div className="refund-modal-body text-center py-4">
                  <div className="refund-success-icon-circle mx-auto mb-3">
                    <CheckCircle2 size={48} color="#10b981" />
                  </div>

                  <h3>Cancellation Confirmed & Refund Disbursed!</h3>
                  <p className="refund-success-lead">
                    Your cancellation request has been recorded. Tracking Reference ID: <strong>{completedRefundResult.id}</strong>
                  </p>

                  <div className="refund-receipt-voucher-card text-start mt-4">
                    <div className="voucher-header">
                      <span className="voucher-badge">OFFICIAL REFUND CREDIT NOTE</span>
                      <span className="voucher-status-pill">{completedRefundResult.status}</span>
                    </div>

                    <div className="voucher-details-grid mt-3">
                      <div className="voucher-field">
                        <span>Refund Tracking ID:</span>
                        <strong>{completedRefundResult.id}</strong>
                      </div>
                      <div className="voucher-field">
                        <span>Banking ARN / Reference:</span>
                        <strong>{completedRefundResult.arnNumber || 'ARN-IND9928194821'}</strong>
                      </div>
                      <div className="voucher-field">
                        <span>Booking Reference:</span>
                        <strong>{completedRefundResult.bookingId} ({completedRefundResult.pnr || 'PNR'})</strong>
                      </div>
                      <div className="voucher-field">
                        <span>Net Refund Disbursed:</span>
                        <strong className="text-success font-bold">₹{Number(completedRefundResult.netRefundAmount || 0).toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="voucher-field full-width">
                        <span>Disbursement Channel:</span>
                        <strong>{completedRefundResult.payoutDetails || 'Instant EazeWallet Credit'}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="refund-confirmation-actions mt-4">
                    <button
                      type="button"
                      className="secondary-btn"
                      onClick={() => window.print()}
                    >
                      <Printer size={16} /> Print Refund Receipt
                    </button>
                    <Link
                      to={`/cancellation-refund?ref=${completedRefundResult.id}`}
                      className="primary-btn"
                      onClick={closeCancelModal}
                    >
                      Track Live Refund Status →
                    </Link>
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
