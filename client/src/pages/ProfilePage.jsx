import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Plus,
  Trash2,
  CheckCircle2,
  Award,
  Luggage,
  Sparkles,
  Plane,
  Building2,
  Bus,
  Train,
  Palmtree,
  Heart,
  LogOut,
  FileText,
  Calendar,
  Clock,
  ArrowRight,
  Bell,
  MessageSquare,
  RefreshCw,
  Send,
  AlertOctagon,
  RotateCw,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Zap,
  RotateCcw,
  Receipt,
  Printer,
  CreditCard,
  Building,
  Smartphone,
  Search,
  X,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/common/Breadcrumb';

export default function ProfilePage() {
  const { user, firstName, updateProfile, openLoginModal, isAuthenticated, logout } = useAuth();
  const { bookings, refunds, openTicketModal, requestCancellationRefund, showToast } = useBooking();
  const navigate = useNavigate();
  const {
    queueStatus,
    preferences: notifPrefs,
    updatePreferences: updateNotifPrefs,
    triggerCampaign,
    retryFailed,
    refreshQueueStatus,
    openPreview,
    unreadCount,
    loading: notifLoading
  } = useNotification();

  const [activeTab, setActiveTab] = useState('trips'); // 'trips' | 'refunds' | 'personal' | 'travellers' | 'preferences' | 'notifications'
  const [tripFilter, setTripFilter] = useState('all'); // 'all' | 'flight' | 'hotel' | 'bus' | 'train' | 'holiday'
  const [refundFilter, setRefundFilter] = useState('all'); // 'all' | 'completed' | 'in_progress'
  const [simulatingFail, setSimulatingFail] = useState(false);

  // In-Page Cancellation Modal States
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState(null);
  const [cancelStep, setCancelStep] = useState(1);
  const [cancelReason, setCancelReason] = useState('Travel plans changed');
  const [customRemark, setCustomRemark] = useState('');
  const [payoutMode, setPayoutMode] = useState('wallet');
  const [bankAccount, setBankAccount] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [upiId, setUpiId] = useState('');
  const [refundCalculation, setRefundCalculation] = useState(null);
  const [isSubmittingRefund, setIsSubmittingRefund] = useState(false);
  const [completedRefundResult, setCompletedRefundResult] = useState(null);

  const [name, setName] = useState(user?.name || 'Traveler');
  const [email, setEmail] = useState(user?.email || 'traveler@eazetrip.com');
  const [phone, setPhone] = useState(user?.phone || '+91 9876543210');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');

  // Preferences
  const [seatPref, setSeatPref] = useState('Window');
  const [mealPref, setMealPref] = useState('Vegetarian');
  const [frequentFlyer, setFrequentFlyer] = useState('AI-994821');

  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
    }
  }, [user]);

  const [savedTravellers, setSavedTravellers] = useState(() => {
    try {
      const saved = localStorage.getItem('eazetrip_travellers') || localStorage.getItem('exploreeaz_travellers');
      return saved
        ? JSON.parse(saved)
        : [
            { id: 1, name: 'Rohit Sharma', gender: 'Male', dob: '1992-04-30', relation: 'Self' },
            { id: 2, name: 'Ritika Sharma', gender: 'Female', dob: '1995-12-21', relation: 'Spouse' }
          ];
    } catch {
      return [
        { id: 1, name: 'Rohit Sharma', gender: 'Male', dob: '1992-04-30', relation: 'Self' },
        { id: 2, name: 'Ritika Sharma', gender: 'Female', dob: '1995-12-21', relation: 'Spouse' }
      ];
    }
  });

  const [newTravellerName, setNewTravellerName] = useState('');
  const [newTravellerGender, setNewTravellerGender] = useState('Male');
  const [newTravellerRelation, setNewTravellerRelation] = useState('Friend');
  const [showAddTraveller, setShowAddTraveller] = useState(false);

  const saveTravellersToStorage = (list) => {
    setSavedTravellers(list);
    try {
      localStorage.setItem('eazetrip_travellers', JSON.stringify(list));
    } catch (e) {
      console.error('Failed to save travellers to storage', e);
    }
  };

  if (!isAuthenticated && !user) {
    return (
      <div className="container page-wrap">
        <div className="content-card form-card text-center py-5">
          <div className="profile-lock-icon mx-auto mb-3">
            <User size={48} color="#034ea2" />
          </div>
          <h2>{firstName ? `Welcome Back, ${firstName}! Please Sign In` : 'Please Sign In to Access Your Account'}</h2>
          <p className="lead">
            {firstName
              ? `Hello ${firstName}, sign in to access your saved traveler profiles, loyalty rewards balance, and active bookings.`
              : 'You need to be signed in to view and manage your travel profile, bookings, and saved passengers.'}
          </p>
          <button type="button" className="primary-btn mt-3" onClick={openLoginModal}>
            {firstName ? `Sign In as ${firstName}` : 'Sign In / Register'}
          </button>
        </div>
      </div>
    );
  }

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({ name, email, phone });
    showToast('Profile information updated successfully!');
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    showToast('Travel preferences saved successfully!');
  };

  const handleAddTraveller = (e) => {
    e.preventDefault();
    if (!newTravellerName.trim()) return;

    const updated = [
      ...savedTravellers,
      {
        id: Date.now(),
        name: newTravellerName.trim(),
        gender: newTravellerGender,
        dob: '1998-01-01',
        relation: newTravellerRelation
      }
    ];
    saveTravellersToStorage(updated);
    setNewTravellerName('');
    setShowAddTraveller(false);
    showToast('Traveller added to your quick-book list!');
  };

  const handleRemoveTraveller = (id) => {
    const updated = savedTravellers.filter((t) => t.id !== id);
    saveTravellersToStorage(updated);
    showToast('Traveller removed.');
  };

  const getTypeIcon = (type) => {
    if (type === 'flight') return <Plane size={18} color="#034ea2" />;
    if (type === 'hotel') return <Building2 size={18} color="#0097a7" />;
    if (type === 'bus') return <Bus size={18} color="#ea580c" />;
    if (type === 'holiday') return <Palmtree size={18} color="#16a34a" />;
    return <Train size={18} color="#7c3aed" />;
  };

  const handleOpenCancelModal = async (booking) => {
    setSelectedBookingForCancel(booking);
    setCancelStep(1);
    setCancelReason('Travel plans changed');
    setCustomRemark('');
    setPayoutMode('wallet');
    setBankAccount('');
    setIfscCode('');
    setUpiId('');
    setCompletedRefundResult(null);

    const gross = Number(booking.totalAmount || 3000);
    const hasShield = Boolean(booking.hasShield || booking.travelAssurance);

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
      // Local fallback calculation
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
      customerName: selectedBookingForCancel.passengers?.[0]?.name || name || 'Traveler',
      customerEmail: selectedBookingForCancel.contactEmail || selectedBookingForCancel.email || email,
      customerPhone: selectedBookingForCancel.contactPhone || selectedBookingForCancel.phone || phone,
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
      selectedPassengers: selectedBookingForCancel.passengers?.map((p) => p.name) || []
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

  const completedRefundsCount = refunds.filter((r) => r.status === 'Completed').length;
  const inProgressRefundsCount = refunds.filter((r) => r.status !== 'Completed').length;
  const totalDisbursedAmount = refunds
    .filter((r) => r.status === 'Completed')
    .reduce((acc, curr) => acc + Number(curr.netRefundAmount || 0), 0);

  const filteredRefunds = refunds.filter((r) => {
    if (refundFilter === 'completed') return r.status === 'Completed';
    if (refundFilter === 'in_progress') return r.status !== 'Completed';
    return true;
  });

  const confirmedCount = bookings.filter((b) => b.status === 'Confirmed').length;
  const filteredBookings = bookings.filter((b) => {
    if (tripFilter === 'all') return true;
    return b.type === tripFilter;
  });

  return (
    <div className="container profile-page-wrap">
      <div className="page-shell">
        <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'My Profile & Account' }]} />

        {/* Top Hero Account Banner */}
        <div className="profile-hero-banner">
          <div className="profile-avatar-block">
            <div className="avatar-ring-box">
              {user?.avatar ? (
                <img src={user.avatar} alt={name} className="avatar-img" />
              ) : (
                <div className="avatar-initials">{name?.charAt(0) || 'U'}</div>
              )}
            </div>
            <div className="profile-title-block">
              <div className="name-row">
                <h1>{name}</h1>
                <span className="gold-member-badge">
                  <Award size={14} /> {user?.tier || 'Gold Member'}
                </span>
              </div>
              <p className="profile-meta-sub">
                Member since {user?.memberSince || '2024'} • {email} • {phone}
              </p>
            </div>
          </div>

          <div className="profile-quick-actions">
            <Link to="/manage-bookings" className="profile-head-btn">
              <Luggage size={15} /> All Bookings
            </Link>
            <Link to="/cancellation-refund" className="profile-head-btn">
              <RotateCcw size={15} /> Refund Hub
            </Link>
            <button
              type="button"
              className="profile-head-btn logout-head-btn"
              onClick={logout}
              title="Sign Out of Account"
            >
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>

        {/* Travel Stats Metrics Row */}
        <div className="profile-stats-strip mt-4">
          <div className="stat-metric-card">
            <div className="metric-icon-box blue">
              <Plane size={20} />
            </div>
            <div>
              <strong>{bookings.length}</strong>
              <small>Total Bookings</small>
            </div>
          </div>

          <div className="stat-metric-card">
            <div className="metric-icon-box teal">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <strong>{confirmedCount}</strong>
              <small>Trips Confirmed</small>
            </div>
          </div>

          <div className="stat-metric-card">
            <div className="metric-icon-box amber">
              <RotateCcw size={20} />
            </div>
            <div>
              <strong>{refunds.length}</strong>
              <small>Refund Claims</small>
            </div>
          </div>

          <div className="stat-metric-card">
            <div className="metric-icon-box purple">
              <Sparkles size={20} />
            </div>
            <div>
              <strong>{(confirmedCount * 250 + 1200).toLocaleString('en-IN')} pts</strong>
              <small>EazeRewards Balance</small>
            </div>
          </div>
        </div>

        {/* Profile Tabs Navigation */}
        <div className="profile-tabs-strip mt-4">
          <button
            type="button"
            className={`profile-nav-tab ${activeTab === 'trips' ? 'active' : ''}`}
            onClick={() => setActiveTab('trips')}
          >
            <Luggage size={16} />
            <span>My Trips & Bookings ({bookings.length})</span>
          </button>
          <button
            type="button"
            className={`profile-nav-tab ${activeTab === 'refunds' ? 'active' : ''}`}
            onClick={() => setActiveTab('refunds')}
          >
            <RotateCcw size={16} />
            <span>Refunds & Claims ({refunds.length})</span>
            {inProgressRefundsCount > 0 && <span className="tab-badge-pill warning">{inProgressRefundsCount} in progress</span>}
          </button>
          <button
            type="button"
            className={`profile-nav-tab ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            <User size={16} />
            <span>Personal Information</span>
          </button>
          <button
            type="button"
            className={`profile-nav-tab ${activeTab === 'travellers' ? 'active' : ''}`}
            onClick={() => setActiveTab('travellers')}
          >
            <User size={16} />
            <span>Saved Travellers ({savedTravellers.length})</span>
          </button>
          <button
            type="button"
            className={`profile-nav-tab ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            <Heart size={16} />
            <span>Travel Preferences</span>
          </button>
          <button
            type="button"
            className={`profile-nav-tab ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('notifications');
              refreshQueueStatus();
            }}
          >
            <Bell size={16} />
            <span>Communications & Queue</span>
            {unreadCount > 0 && <span className="tab-badge-pill">{unreadCount}</span>}
          </button>
        </div>

        {/* Tab 0: Trips & Bookings */}
        {activeTab === 'trips' && (
          <div className="content-card form-card mt-3">
            {/* Header */}
            <div className="tab-section-header">
              <div className="tab-section-title-wrap">
                <h3 className="tab-section-title">My Trips & Bookings</h3>
                <p className="tab-section-sub">View and manage your upcoming and completed reservations</p>
              </div>
              <Link to="/manage-bookings" className="manage-all-link">
                <span>Manage All Bookings</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Filter Pills */}
            <div className="trip-filter-pill-bar mb-4">
              {[
                { id: 'all', label: 'All Bookings' },
                { id: 'flight', label: 'Flights' },
                { id: 'hotel', label: 'Hotels' },
                { id: 'bus', label: 'Buses' },
                { id: 'train', label: 'Trains' },
                { id: 'holiday', label: 'Holidays' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`trip-pill-btn ${tripFilter === cat.id ? 'active' : ''}`}
                  onClick={() => setTripFilter(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {filteredBookings.length === 0 ? (
              <div className="empty-state-card text-center py-4">
                <p>No {tripFilter !== 'all' ? tripFilter : ''} bookings found.</p>
                <Link to="/" className="primary-btn small mt-2 inline-block">
                  Book a New Trip →
                </Link>
              </div>
            ) : (
              <div className="profile-bookings-list">
                {filteredBookings.map((b) => {
                  const isCancelled = b.status === 'Cancelled';
                  return (
                    <div key={b.id} className={`profile-booking-item-card ${isCancelled ? 'cancelled-card' : ''}`}>
                      <div className="booking-item-left">
                        <div className="type-badge-icon">{getTypeIcon(b.type)}</div>
                        <div className="booking-item-details">
                          <div className="booking-title-row">
                            <strong>{b.title}</strong>
                            <span className={`status-pill-badge ${b.status?.toLowerCase()}`}>
                              {isCancelled ? '● Cancelled' : '✓ Confirmed'}
                            </span>
                          </div>
                          <div className="booking-meta-chips">
                            <span><Calendar size={13} /> {b.date}</span>
                            <span><strong>PNR:</strong> {b.pnr || b.bookingRef || b.id}</span>
                            {b.passengers?.[0]?.name && <span><strong>Lead:</strong> {b.passengers[0].name}</span>}
                          </div>

                          {isCancelled && (
                            <div className="profile-cancelled-callout mt-2">
                              <ShieldAlert size={14} color="#ea580c" />
                              <span>{b.refundStatus || 'Refund Initiated'}</span>
                              {b.refundId && (
                                <Link
                                  to={`/cancellation-refund?ref=${b.refundId}`}
                                  className="profile-refund-pill-link"
                                >
                                  Track Refund #{b.refundId} →
                                </Link>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="booking-item-right">
                        <div className="booking-amount-box">
                          <small>{isCancelled ? 'Gross Fare Paid' : 'Total Paid'}</small>
                          <strong>₹{(b.totalAmount || 4999).toLocaleString('en-IN')}</strong>
                        </div>
                        <div className="profile-card-action-btns">
                          <button
                            type="button"
                            className="view-ticket-btn"
                            onClick={() => openTicketModal(b)}
                          >
                            <FileText size={15} />
                            <span>View E-Ticket</span>
                          </button>
                          {!isCancelled ? (
                            <button
                              type="button"
                              className="profile-cancel-btn"
                              onClick={() => handleOpenCancelModal(b)}
                            >
                              <RotateCcw size={13} />
                              <span>Cancel & Refund</span>
                            </button>
                          ) : (
                            <Link
                              to={`/cancellation-refund?ref=${b.refundId || b.pnr || b.id}`}
                              className="profile-track-refund-btn"
                            >
                              <Zap size={13} />
                              <span>Track Refund</span>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab: Refunds & Claims */}
        {activeTab === 'refunds' && (
          <div className="content-card form-card mt-3 animate-fade-in">
            {/* Header */}
            <div className="tab-section-header">
              <div className="tab-section-title-wrap">
                <h3 className="tab-section-title">Refunds & Claims Resolution Hub</h3>
                <p className="tab-section-sub">
                  Track live refund disbursements, banking ARN reference codes, and DGCA/IRCTC claim status.
                </p>
              </div>
              <Link
                to="/cancellation-refund?openClaim=true"
                className="manage-all-link primary-cta"
              >
                <Plus size={15} />
                <span>Submit Direct Claim</span>
              </Link>
            </div>

            {/* Refund Metric Stat Chips */}
            <div className="profile-refund-stats-grid mb-4">
              <div className="refund-stat-box">
                <span className="stat-label">Total Claims Raised</span>
                <strong className="stat-num">{refunds.length}</strong>
                <small className="text-xs text-muted">All Mediums</small>
              </div>
              <div className="refund-stat-box success">
                <span className="stat-label">Total Disbursed</span>
                <strong className="stat-num text-success">₹{totalDisbursedAmount.toLocaleString('en-IN')}</strong>
                <small className="text-xs text-success">✓ 100% Settled</small>
              </div>
              <div className="refund-stat-box warning">
                <span className="stat-label">In Banking Clearing</span>
                <strong className="stat-num text-amber-600">{inProgressRefundsCount}</strong>
                <small className="text-xs text-amber-600">Active NPCI / Bank</small>
              </div>
              <div className="refund-stat-box info">
                <span className="stat-label">Instant EazeWallet SLA</span>
                <strong className="stat-num text-blue-600">⚡ 0 Seconds</strong>
                <small className="text-xs text-blue-600">+5% Bonus Credit</small>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="profile-refund-filters-row mb-3 flex-between-center">
              <div className="filter-pill-group">
                <button
                  type="button"
                  className={`filter-pill-btn ${refundFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setRefundFilter('all')}
                >
                  All Claims ({refunds.length})
                </button>
                <button
                  type="button"
                  className={`filter-pill-btn ${refundFilter === 'completed' ? 'active' : ''}`}
                  onClick={() => setRefundFilter('completed')}
                >
                  Completed ({completedRefundsCount})
                </button>
                <button
                  type="button"
                  className={`filter-pill-btn ${refundFilter === 'in_progress' ? 'active' : ''}`}
                  onClick={() => setRefundFilter('in_progress')}
                >
                  In Progress ({inProgressRefundsCount})
                </button>
              </div>

              <Link to="/cancellation-refund" className="text-xs text-blue-700 font-semibold flex-align-center gap-1 hover:underline">
                Open Full Cancellation Hub <ArrowRight size={13} />
              </Link>
            </div>

            {/* Refunds List */}
            {filteredRefunds.length === 0 ? (
              <div className="empty-state-card text-center py-5">
                <RotateCcw size={36} color="#94a3b8" className="mx-auto mb-2" />
                <h3>No Refund Claims Found</h3>
                <p className="text-slate-500 text-sm">
                  {refundFilter !== 'all'
                    ? `No claims matching "${refundFilter}".`
                    : 'You have zero active refund claims. All journeys are running smoothly!'}
                </p>
                <Link to="/cancellation-refund?openClaim=true" className="primary-btn small mt-3 inline-block">
                  Submit a Refund Claim
                </Link>
              </div>
            ) : (
              <div className="profile-refunds-list">
                {filteredRefunds.map((refund) => {
                  const isCompleted = refund.status === 'Completed';
                  return (
                    <div key={refund.id} className="profile-refund-item-card">
                      <div className="refund-card-top-row">
                        <div className="refund-ref-badge-group">
                          <span className="refund-id-tag">#{refund.id}</span>
                          <span className={`refund-status-tag ${isCompleted ? 'completed' : 'in-progress'}`}>
                            {isCompleted ? '✓ Disbursed' : '⏳ In Progress (Step 3/4)'}
                          </span>
                        </div>
                        <span className="refund-date-text">
                          {new Date(refund.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>

                      <div className="refund-card-middle-grid mt-3">
                        <div className="refund-service-details">
                          <h4 className="service-title-text">{refund.serviceTitle}</h4>
                          <div className="refund-meta-tags mt-1">
                            <span><strong>Booking ID:</strong> {refund.bookingId}</span>
                            {refund.pnr && <span><strong>PNR:</strong> {refund.pnr}</span>}
                            <span><strong>Reason:</strong> {refund.reason || 'Travel Plan Changed'}</span>
                          </div>
                        </div>

                        <div className="refund-finance-box">
                          <div className="finance-row">
                            <span>Gross Paid:</span>
                            <strong>₹{Number(refund.grossAmount || 0).toLocaleString('en-IN')}</strong>
                          </div>
                          <div className="finance-row">
                            <span>Penalty / Fees:</span>
                            <strong className={Number(refund.penaltyAmount) === 0 ? 'text-success' : 'text-danger'}>
                              {Number(refund.penaltyAmount) === 0 ? '₹0 (Waived)' : `-₹${Number(refund.penaltyAmount).toLocaleString('en-IN')}`}
                            </strong>
                          </div>
                          <div className="finance-row net-row">
                            <span>Net Refund:</span>
                            <strong className="text-success font-bold">₹{Number(refund.netRefundAmount || 0).toLocaleString('en-IN')}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="refund-card-footer mt-3">
                        <div className="payout-info-strip">
                          <span className="payout-label">Disbursed to:</span>
                          <span className="payout-value">{refund.payoutDetails}</span>
                          {refund.arnNumber && (
                            <span className="arn-badge">ARN: {refund.arnNumber}</span>
                          )}
                        </div>

                        <div className="refund-actions-row">
                          <button
                            type="button"
                            className="secondary-btn small"
                            onClick={() => window.print()}
                          >
                            <Printer size={13} /> Print Credit Note
                          </button>
                          <Link
                            to={`/cancellation-refund?ref=${refund.id}`}
                            className="primary-btn small flex-align-center gap-1"
                          >
                            <Zap size={13} /> Track Live Progress
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        {activeTab === 'personal' && (
          <div className="content-card form-card mt-3">
            <div className="tab-section-header">
              <div className="tab-section-title-wrap">
                <h3 className="tab-section-title">Personal & Contact Information</h3>
                <p className="tab-section-sub">Manage your account details and contact preferences for e-ticket delivery</p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="profile-form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <div className="input-with-icon">
                  <User size={16} className="field-icon" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <div className="input-with-icon">
                  <Mail size={16} className="field-icon" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Mobile Number *</label>
                <div className="input-with-icon">
                  <Phone size={16} className="field-icon" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>City</label>
                <div className="input-with-icon">
                  <MapPin size={16} className="field-icon" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>State / Region</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>

              <div className="form-full-row mt-2">
                <button type="submit" className="primary-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Saved Travellers */}
        {activeTab === 'travellers' && (
          <div className="content-card mt-3">
            <div className="tab-section-header">
              <div className="tab-section-title-wrap">
                <h3 className="tab-section-title">Saved Co-Travellers (Fast Checkout)</h3>
                <p className="tab-section-sub">Pre-save family and colleagues to autofill passenger details during flight, hotel, and train booking.</p>
              </div>
              <button
                type="button"
                className="manage-all-link primary-cta"
                onClick={() => setShowAddTraveller(!showAddTraveller)}
              >
                <Plus size={15} />
                <span>{showAddTraveller ? 'Cancel' : 'Add New Traveller'}</span>
              </button>
            </div>

            {showAddTraveller && (
              <form onSubmit={handleAddTraveller} className="add-traveller-form-elevated mt-3">
                <h4 className="form-subheading">Enter Traveller Details</h4>
                <div className="form-grid three-col">
                  <div className="form-group">
                    <label>Full Name (as per Govt ID) *</label>
                    <input
                      type="text"
                      placeholder="e.g. Ananya Roy"
                      value={newTravellerName}
                      onChange={(e) => setNewTravellerName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Gender *</label>
                    <select
                      value={newTravellerGender}
                      onChange={(e) => setNewTravellerGender(e.target.value)}
                      className="native-select"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Relationship *</label>
                    <select
                      value={newTravellerRelation}
                      onChange={(e) => setNewTravellerRelation(e.target.value)}
                      className="native-select"
                    >
                      <option value="Self">Self</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Child">Child</option>
                      <option value="Parent">Parent</option>
                      <option value="Friend">Friend</option>
                      <option value="Colleague">Colleague</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="primary-btn small mt-2">
                  Save to Quick-Book List
                </button>
              </form>
            )}

            <div className="travellers-grid mt-4">
              {savedTravellers.map((traveller) => (
                <div key={traveller.id} className="elevated-traveller-card">
                  <div className="traveller-avatar">
                    {traveller.name.charAt(0)}
                  </div>
                  <div className="traveller-meta">
                    <strong>{traveller.name}</strong>
                    <span>{traveller.gender} • {traveller.relation}</span>
                  </div>
                  <button
                    type="button"
                    className="delete-traveller-btn"
                    onClick={() => handleRemoveTraveller(traveller.id)}
                    title="Remove traveller"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Travel Preferences */}
        {activeTab === 'preferences' && (
          <div className="content-card form-card mt-3">
            <div className="tab-section-header">
              <div className="tab-section-title-wrap">
                <h3 className="tab-section-title">Travel Preferences & Loyalty</h3>
                <p className="tab-section-sub">Customise your preferred seat selection, meal plans, and airline frequent flyer numbers.</p>
              </div>
            </div>

            <form onSubmit={handleSavePreferences} className="profile-form-grid">
              <div className="form-group">
                <label>Preferred Flight Seat</label>
                <select
                  value={seatPref}
                  onChange={(e) => setSeatPref(e.target.value)}
                  className="native-select"
                >
                  <option value="Window">Window Seat</option>
                  <option value="Aisle">Aisle Seat</option>
                  <option value="Extra Legroom">Extra Legroom (Exit Row)</option>
                  <option value="No Preference">No Preference</option>
                </select>
              </div>

              <div className="form-group">
                <label>Preferred In-flight Meal</label>
                <select
                  value={mealPref}
                  onChange={(e) => setMealPref(e.target.value)}
                  className="native-select"
                >
                  <option value="Vegetarian">Vegetarian Hindu Meal (AVML)</option>
                  <option value="Non-Vegetarian">Non-Vegetarian Meal</option>
                  <option value="Jain Meal">Jain Vegetarian Meal (VJML)</option>
                  <option value="Diabetic">Diabetic Meal (DBML)</option>
                  <option value="No Meal">No In-flight Meal</option>
                </select>
              </div>

              <div className="form-group">
                <label>Air India / IndiGo Frequent Flyer ID</label>
                <input
                  type="text"
                  placeholder="e.g. AI-994821"
                  value={frequentFlyer}
                  onChange={(e) => setFrequentFlyer(e.target.value)}
                />
              </div>

              <div className="form-full-row mt-2">
                <button type="submit" className="primary-btn">
                  Update Preferences
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 4: Communications, Notifications & Live Queue Engine */}
        {activeTab === 'notifications' && (
          <div className="content-card form-card mt-3 animate-fade-in">
            {/* Header */}
            <div className="tab-section-header">
              <div className="tab-section-title-wrap">
                <h3 className="tab-section-title">Multi-Channel Communications & Delivery Queue</h3>
                <p className="tab-section-sub">
                  Configure WhatsApp & Email channels, simulate customer re-engagement campaigns, and monitor resilient Dead-Letter Queue (DLQ) recoveries.
                </p>
              </div>
              <button
                type="button"
                className="manage-all-link"
                onClick={refreshQueueStatus}
                title="Refresh Queue Metrics"
              >
                <RefreshCw size={14} className={notifLoading ? 'animate-spin' : ''} />
                <span>Refresh Queue</span>
              </button>
            </div>

            {/* Sub-Section 1: Channel Preferences */}
            <div className="notif-pref-section mb-5">
              <h3 className="text-base font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-600" />
                Notification Channel Subscriptions
              </h3>
              <div className="notif-pref-grid">
                {[
                  { key: 'whatsapp', label: 'WhatsApp Instant Updates', desc: 'Real-time PNR vouchers, web check-in links, and exclusive deals', icon: MessageSquare, color: 'emerald' },
                  { key: 'email', label: 'Email Itineraries & Tax Invoices', desc: 'HTML booking summaries, e-ticket PDFs, and billing receipts', icon: Mail, color: 'blue' },
                  { key: 'push', label: 'In-App & Browser Alerts', desc: 'Price drop notifications, gate change updates, and promo alerts', icon: Bell, color: 'amber' },
                  { key: 'sms', label: 'SMS Flight Status', desc: 'Emergency delay alerts and gate assignment alerts', icon: Phone, color: 'purple' }
                ].map((channel) => {
                  const Icon = channel.icon;
                  const isChecked = Boolean(notifPrefs[channel.key]);
                  return (
                    <div key={channel.key} className={`pref-card ${isChecked ? 'active' : ''}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={`pref-icon-box ${channel.color}`}>
                            <Icon size={18} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm text-slate-800">{channel.label}</h4>
                            <p className="text-xs text-slate-500 mb-0">{channel.desc}</p>
                          </div>
                        </div>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) =>
                              updateNotifPrefs({
                                ...notifPrefs,
                                [channel.key]: e.target.checked
                              })
                            }
                          />
                          <span className="slider round"></span>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sub-Section 2: Personalized Re-Engagement Campaign Simulator */}
            <div className="campaign-simulator-section mb-5">
              <div className="flex-between-center mb-3">
                <h3 className="text-base font-semibold text-slate-800 mb-0 flex items-center gap-2">
                  <Sparkles size={18} className="text-amber-500" />
                  Personalized Customer Re-Engagement & Campaign Simulator
                </h3>
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                  Dynamic Multi-Channel Trigger
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                Test how EazeTrip automatically crafts customized offers for customers based on travel history, inactivity, and booking lifecycles.
              </p>

              <div className="campaign-cards-grid">
                {/* Campaign 1: 3-Month Inactivity Holiday Offer */}
                <div className="campaign-card featured-campaign">
                  <div className="campaign-badge">Recommended</div>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="campaign-icon-wrap amber">
                      <Palmtree size={22} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 mb-1">
                        🌴 3-Month Inactivity Holiday Offer Campaign
                      </h4>
                      <p className="text-xs text-slate-600 mb-0">
                        Sends a tailored vacation voucher (<strong>HOLIDAY25</strong> — 25% OFF) to customers who haven't taken a trip in over 90 days.
                      </p>
                    </div>
                  </div>

                  <div className="campaign-action-btn-row">
                    <button
                      type="button"
                      className="camp-btn preview-wa"
                      onClick={() =>
                        openPreview('reengagement_inactivity', 'whatsapp', {
                          monthsInactive: 3,
                          promoCode: 'HOLIDAY25'
                        })
                      }
                    >
                      <MessageSquare size={13} /> WhatsApp Preview
                    </button>
                    <button
                      type="button"
                      className="camp-btn preview-mail"
                      onClick={() =>
                        openPreview('reengagement_inactivity', 'email', {
                          monthsInactive: 3,
                          promoCode: 'HOLIDAY25'
                        })
                      }
                    >
                      <Mail size={13} /> HTML Email Preview
                    </button>
                    <button
                      type="button"
                      className="camp-btn trigger-send"
                      disabled={notifLoading}
                      onClick={async () => {
                        try {
                          await triggerCampaign('reengagement_inactivity', {
                            monthsInactive: 3,
                            promoCode: 'HOLIDAY25'
                          });
                          showToast('🌴 3-Month Inactivity Holiday Offer dispatched to Email, WhatsApp & In-App!');
                        } catch {
                          showToast('Failed to dispatch campaign.');
                        }
                      }}
                    >
                      <Send size={13} /> Dispatch to Queue
                    </button>
                  </div>
                </div>

                {/* Campaign 2: Instant Booking E-Ticket Delivery */}
                <div className="campaign-card">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="campaign-icon-wrap blue">
                      <Plane size={22} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 mb-1">
                        🎟️ Booking Confirmation & E-Ticket Delivery
                      </h4>
                      <p className="text-xs text-slate-600 mb-0">
                        Dispatches PNR (<strong>FL2775</strong>), flight itinerary, passenger details, and PDF download link.
                      </p>
                    </div>
                  </div>

                  <div className="campaign-action-btn-row">
                    <button
                      type="button"
                      className="camp-btn preview-wa"
                      onClick={() =>
                        openPreview('booking_confirmation', 'whatsapp', {
                          pnr: 'FL2775',
                          serviceType: 'Flight',
                          carrier: 'IndiGo 6E-2041',
                          route: 'Mumbai (BOM) → New Delhi (DEL)',
                          travelDate: '24 Sep 2026, 06:00 AM',
                          amount: 4999
                        })
                      }
                    >
                      <MessageSquare size={13} /> WhatsApp Preview
                    </button>
                    <button
                      type="button"
                      className="camp-btn preview-mail"
                      onClick={() =>
                        openPreview('booking_confirmation', 'email', {
                          pnr: 'FL2775',
                          serviceType: 'Flight',
                          carrier: 'IndiGo 6E-2041',
                          route: 'Mumbai (BOM) → New Delhi (DEL)',
                          travelDate: '24 Sep 2026, 06:00 AM',
                          amount: 4999
                        })
                      }
                    >
                      <Mail size={13} /> HTML Email Preview
                    </button>
                    <button
                      type="button"
                      className="camp-btn trigger-send"
                      disabled={notifLoading}
                      onClick={async () => {
                        try {
                          await triggerCampaign('booking_confirmation', {
                            pnr: 'FL2775',
                            serviceType: 'Flight',
                            carrier: 'IndiGo 6E-2041',
                            route: 'Mumbai (BOM) → New Delhi (DEL)',
                            travelDate: '24 Sep 2026, 06:00 AM',
                            amount: 4999
                          });
                          showToast('🎟️ Booking Confirmation dispatched across all subscribed channels!');
                        } catch {
                          showToast('Failed to dispatch booking confirmation.');
                        }
                      }}
                    >
                      <Send size={13} /> Dispatch to Queue
                    </button>
                  </div>
                </div>

                {/* Campaign 3: 24h Web Check-in Reminder */}
                <div className="campaign-card">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="campaign-icon-wrap purple">
                      <Clock size={22} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 mb-1">
                        ⏰ 24h Web Check-in & Departure Alert
                      </h4>
                      <p className="text-xs text-slate-600 mb-0">
                        Reminds passenger of upcoming departure tomorrow morning with 1-click web check-in link.
                      </p>
                    </div>
                  </div>

                  <div className="campaign-action-btn-row">
                    <button
                      type="button"
                      className="camp-btn preview-wa"
                      onClick={() => openPreview('trip_reminder', 'whatsapp')}
                    >
                      <MessageSquare size={13} /> WhatsApp Preview
                    </button>
                    <button
                      type="button"
                      className="camp-btn trigger-send"
                      disabled={notifLoading}
                      onClick={async () => {
                        try {
                          await triggerCampaign('trip_reminder');
                          showToast('⏰ Web Check-in reminder dispatched!');
                        } catch {
                          showToast('Failed to dispatch reminder.');
                        }
                      }}
                    >
                      <Send size={13} /> Dispatch to Queue
                    </button>
                  </div>
                </div>

                {/* Campaign 4: Smart Price Drop Alert */}
                <div className="campaign-card">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="campaign-icon-wrap emerald">
                      <Zap size={22} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 mb-1">
                        📉 20% Price Drop Alert on Saved Route
                      </h4>
                      <p className="text-xs text-slate-600 mb-0">
                        Alerts user when fares on watched route Mumbai → Goa drop from ₹4,500 to ₹3,599.
                      </p>
                    </div>
                  </div>

                  <div className="campaign-action-btn-row">
                    <button
                      type="button"
                      className="camp-btn preview-wa"
                      onClick={() => openPreview('price_drop_alert', 'whatsapp')}
                    >
                      <MessageSquare size={13} /> WhatsApp Preview
                    </button>
                    <button
                      type="button"
                      className="camp-btn trigger-send"
                      disabled={notifLoading}
                      onClick={async () => {
                        try {
                          await triggerCampaign('price_drop_alert');
                          showToast('📉 Price drop alert dispatched!');
                        } catch {
                          showToast('Failed to dispatch alert.');
                        }
                      }}
                    >
                      <Send size={13} /> Dispatch to Queue
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-Section 3: Resilient Delivery Queue & Dead-Letter Queue (DLQ) */}
            <div className="queue-monitor-section">
              <div className="flex-between-center mb-3 flex-wrap gap-2">
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1 flex items-center gap-2">
                    <RotateCw size={18} className="text-blue-600" />
                    Fault-Tolerant Delivery Queue & Dead-Letter Recovery (DLQ)
                  </h3>
                  <p className="text-xs text-slate-500 mb-0">
                    Never-Fail Architecture: Automatic exponential backoff retries & safe quarantine in DLQ with zero data loss.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="secondary-btn small"
                    disabled={simulatingFail}
                    onClick={async () => {
                      setSimulatingFail(true);
                      try {
                        await triggerCampaign('reengagement_inactivity', {
                          channels: ['email', 'whatsapp'],
                          simulateFailure: true
                        });
                        showToast('Simulated transient failure enqueued. Retry engine will execute backoff & route to DLQ.');
                      } finally {
                        setSimulatingFail(false);
                      }
                    }}
                    title="Simulate transient provider failure to test retry engine"
                  >
                    <AlertOctagon size={13} color="#ea580c" /> Simulate Provider Glitch
                  </button>

                  <button
                    type="button"
                    className="primary-btn small flex items-center gap-1"
                    disabled={notifLoading || (queueStatus?.metrics?.deadLetterQueueCount || 0) === 0}
                    onClick={async () => {
                      try {
                        const res = await retryFailed('all');
                        showToast(res.message || 'All failed messages re-enqueued successfully!');
                      } catch {
                        showToast('Failed to retry messages.');
                      }
                    }}
                  >
                    <RefreshCw size={13} /> Retry All Failed ({queueStatus?.metrics?.deadLetterQueueCount || 0})
                  </button>
                </div>
              </div>

              {/* Live Queue Health Strip */}
              <div className="queue-stats-strip mb-4">
                <div className="q-metric-box">
                  <span className="q-metric-val">{queueStatus?.metrics?.totalHandled || 0}</span>
                  <span className="q-metric-label">Total Handled</span>
                </div>
                <div className="q-metric-box">
                  <span className="q-metric-val text-emerald-600">{queueStatus?.metrics?.totalDelivered || 0}</span>
                  <span className="q-metric-label">Delivered Successfully</span>
                </div>
                <div className="q-metric-box">
                  <span className="q-metric-val text-blue-600">{queueStatus?.metrics?.activePending || 0}</span>
                  <span className="q-metric-label">In Active Queue</span>
                </div>
                <div className="q-metric-box">
                  <span className="q-metric-val text-red-600">{queueStatus?.metrics?.deadLetterQueueCount || 0}</span>
                  <span className="q-metric-label">Dead-Letter Queue (DLQ)</span>
                </div>
                <div className="q-metric-box">
                  <span className="q-metric-val">{queueStatus?.metrics?.successRatePercent || 100}%</span>
                  <span className="q-metric-label">Delivery Success Rate</span>
                </div>
              </div>

              {/* Dead-Letter Queue Table */}
              <div className="dlq-table-wrapper">
                <div className="dlq-table-header flex-between-center">
                  <div className="flex items-center gap-2">
                    <AlertOctagon size={16} color="#dc2626" />
                    <span className="font-semibold text-sm text-slate-800">
                      Dead-Letter Queue (Failed Messages Quarantined)
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-semibold">
                    {queueStatus?.deadLetterQueue?.length || 0} items quarantined
                  </span>
                </div>

                {(!queueStatus?.deadLetterQueue || queueStatus.deadLetterQueue.length === 0) ? (
                  <div className="dlq-empty-state">
                    <CheckCircle2 size={32} color="#10b981" className="mb-2 mx-auto" />
                    <p className="font-semibold text-slate-700 text-sm mb-1">Dead-Letter Queue is Clean</p>
                    <p className="text-xs text-slate-400 mb-0">Zero failed messages. All outbound notifications delivered smoothly.</p>
                  </div>
                ) : (
                  <div className="dlq-items-list">
                    {queueStatus.deadLetterQueue.map((item) => (
                      <div key={item.id} className="dlq-item-row">
                        <div className="dlq-col-id">
                          <span className="dlq-id-pill">{item.id}</span>
                          <span className={`dlq-channel-tag ${item.channel}`}>{item.channel.toUpperCase()}</span>
                        </div>
                        <div className="dlq-col-details">
                          <span className="dlq-recipient font-mono text-xs">{item.recipient}</span>
                          <span className="dlq-error-text">{item.dlqReason || 'Handshake timeout after 3 retries'}</span>
                        </div>
                        <div className="dlq-col-attempts">
                          <span className="attempts-pill">Retries: {item.attempts}/{item.maxRetries}</span>
                        </div>
                        <div className="dlq-col-actions">
                          <button
                            type="button"
                            className="dlq-retry-btn"
                            onClick={async () => {
                              try {
                                await retryFailed(item.id);
                                showToast(`Re-enqueued item ${item.id} for delivery!`);
                              } catch {
                                showToast('Failed to retry item.');
                              }
                            }}
                          >
                            <RefreshCw size={12} /> Retry Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 3-Step In-Page Cancellation & Refund Experience Modal */}
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
