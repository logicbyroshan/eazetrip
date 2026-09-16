import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { useNotification } from '../context/NotificationContext';
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
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { user, updateProfile, openLoginModal, isAuthenticated, logout } = useAuth();
  const { bookings, openTicketModal, showToast } = useBooking();
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

  const [activeTab, setActiveTab] = useState('trips'); // 'trips' | 'personal' | 'travellers' | 'preferences' | 'notifications'
  const [tripFilter, setTripFilter] = useState('all'); // 'all' | 'flight' | 'hotel' | 'bus' | 'train' | 'holiday'
  const [simulatingFail, setSimulatingFail] = useState(false);
  const [campaignSuccessToast, setCampaignSuccessToast] = useState('');

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
          <h2>Please Sign In to Access Your Account</h2>
          <p className="lead">You need to be signed in to view and manage your travel profile, bookings, and saved passengers.</p>
          <button type="button" className="primary-btn mt-3" onClick={openLoginModal}>
            Sign In / Register
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

  const confirmedCount = bookings.filter((b) => b.status === 'Confirmed').length;
  const filteredBookings = bookings.filter((b) => {
    if (tripFilter === 'all') return true;
    return b.type === tripFilter;
  });

  return (
    <div className="container profile-page-wrap">
      <div className="page-shell">
        <div className="page-topbar">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>My Profile & Account</span>
        </div>

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
              <Sparkles size={20} />
            </div>
            <div>
              <strong>{(confirmedCount * 250 + 1200).toLocaleString('en-IN')} pts</strong>
              <small>EazeRewards Balance</small>
            </div>
          </div>

          <div className="stat-metric-card">
            <div className="metric-icon-box purple">
              <User size={20} />
            </div>
            <div>
              <strong>{savedTravellers.length}</strong>
              <small>Saved Travellers</small>
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
            <div className="section-title-wrap flex-between-center mb-3">
              <div>
                <h2>Recent Trips & Active Reservations</h2>
                <p>Track your confirmed flights, hotels, trains, and bus tickets</p>
              </div>
              <Link to="/manage-bookings" className="secondary-btn small flex-align-center gap-1">
                Full Management Hub <ArrowRight size={14} />
              </Link>
            </div>

            {/* Filter Pills */}
            <div className="profile-trip-filter-row mb-3">
              {['all', 'flight', 'hotel', 'bus', 'train', 'holiday'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`trip-cat-chip ${tripFilter === cat ? 'active' : ''}`}
                  onClick={() => setTripFilter(cat)}
                >
                  {cat.toUpperCase()}
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
                {filteredBookings.map((b) => (
                  <div key={b.id} className="profile-booking-item-card">
                    <div className="booking-item-left">
                      <div className="type-badge-icon">{getTypeIcon(b.type)}</div>
                      <div className="booking-item-details">
                        <div className="booking-title-row">
                          <strong>{b.title}</strong>
                          <span className={`status-pill-badge ${b.status?.toLowerCase()}`}>
                            {b.status === 'Confirmed' ? '✓ Confirmed' : b.status}
                          </span>
                        </div>
                        <div className="booking-meta-chips">
                          <span><Calendar size={13} /> {b.date}</span>
                          <span><strong>PNR:</strong> {b.pnr || b.bookingRef || b.id}</span>
                          {b.passengers?.[0]?.name && <span><strong>Lead:</strong> {b.passengers[0].name}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="booking-item-right">
                      <div className="booking-amount-box">
                        <small>Total Paid</small>
                        <strong>₹{(b.totalAmount || 4999).toLocaleString('en-IN')}</strong>
                      </div>
                      <button
                        type="button"
                        className="view-ticket-btn flex-align-center gap-1"
                        onClick={() => openTicketModal(b)}
                      >
                        <FileText size={14} /> View E-Ticket
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 1: Personal Information Form */}
        {activeTab === 'personal' && (
          <div className="content-card form-card mt-3">
            <div className="section-title-wrap mb-3">
              <h2>Personal & Contact Information</h2>
              <p>Manage your account details and contact preferences for e-ticket delivery</p>
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
            <div className="section-header-row">
              <div>
                <h2>Saved Co-Travellers (Fast Checkout)</h2>
                <p>Pre-save family and colleagues to autofill passenger details during flight, hotel, and train booking.</p>
              </div>
              <button
                type="button"
                className="primary-btn small"
                onClick={() => setShowAddTraveller(!showAddTraveller)}
              >
                <Plus size={15} /> {showAddTraveller ? 'Cancel' : 'Add New Traveller'}
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
            <div className="section-title-wrap mb-3">
              <h2>Travel Preferences & Loyalty</h2>
              <p>Customise your preferred seat selection, meal plans, and airline frequent flyer numbers.</p>
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
            <div className="section-title-wrap flex-between-center mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 text-blue-800 rounded-lg">
                    <Bell size={20} />
                  </div>
                  <div>
                    <h2 className="mb-0">Multi-Channel Communications & Delivery Queue</h2>
                    <p className="text-sm text-slate-500 mb-0">
                      Configure WhatsApp & Email channels, simulate customer re-engagement campaigns, and monitor resilient Dead-Letter Queue (DLQ) recoveries.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="secondary-btn small flex-align-center gap-1"
                  onClick={refreshQueueStatus}
                  title="Refresh Queue Metrics"
                >
                  <RefreshCw size={14} className={notifLoading ? 'animate-spin' : ''} />
                  <span>Refresh Queue</span>
                </button>
              </div>
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
                    <div className="campaign-icon-wrap bg-amber-100 text-amber-800">
                      <Palmtree size={22} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 mb-1">
                        🌴 3-Month Inactivity Holiday Offer Campaign
                      </h4>
                      <p className="text-xs text-slate-600 mb-0">
                        Sends a tailored vacation voucher (<strong>HOLIDAY25</strong> - 25% OFF) to customers who haven't taken a trip in over 90 days.
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
                      className="camp-btn preview-email"
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
                    <div className="campaign-icon-wrap bg-blue-100 text-blue-800">
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
                      className="camp-btn preview-email"
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
                    <div className="campaign-icon-wrap bg-purple-100 text-purple-800">
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
                    <div className="campaign-icon-wrap bg-emerald-100 text-emerald-800">
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
              <div className="flex-between-center mb-3">
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
                    className="secondary-btn small text-amber-700 border-amber-300 bg-amber-50"
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
                    <AlertOctagon size={13} /> Simulate Provider Glitch
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
                <div className="q-metric-box text-emerald-600">
                  <span className="q-metric-val">{queueStatus?.metrics?.totalDelivered || 0}</span>
                  <span className="q-metric-label">Delivered Successfully</span>
                </div>
                <div className="q-metric-box text-blue-600">
                  <span className="q-metric-val">{queueStatus?.metrics?.activePending || 0}</span>
                  <span className="q-metric-label">In Active Queue</span>
                </div>
                <div className="q-metric-box text-red-600">
                  <span className="q-metric-val">{queueStatus?.metrics?.deadLetterQueueCount || 0}</span>
                  <span className="q-metric-label">Dead-Letter Queue (DLQ)</span>
                </div>
                <div className="q-metric-box text-slate-800">
                  <span className="q-metric-val">{queueStatus?.metrics?.successRatePercent || 100}%</span>
                  <span className="q-metric-label">Delivery Success Rate</span>
                </div>
              </div>

              {/* Dead-Letter Queue Table */}
              <div className="dlq-table-wrapper">
                <div className="dlq-table-header flex-between-center">
                  <div className="flex items-center gap-2">
                    <AlertOctagon size={16} className="text-red-600" />
                    <span className="font-semibold text-sm text-slate-800">
                      Dead-Letter Queue (Failed Messages Quarantined)
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    {queueStatus?.deadLetterQueue?.length || 0} items quarantined
                  </span>
                </div>

                {(!queueStatus?.deadLetterQueue || queueStatus.deadLetterQueue.length === 0) ? (
                  <div className="dlq-empty-state">
                    <CheckCircle2 size={32} className="text-emerald-500 mb-2 mx-auto" />
                    <p className="font-semibold text-slate-700 text-sm mb-0">Dead-Letter Queue is Clean</p>
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
      </div>
    </div>
  );
}
