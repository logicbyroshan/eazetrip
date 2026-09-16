import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
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
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { user, updateProfile, openLoginModal, isAuthenticated, logout } = useAuth();
  const { bookings, openTicketModal, showToast } = useBooking();

  const [activeTab, setActiveTab] = useState('trips'); // 'trips' | 'personal' | 'travellers' | 'preferences'
  const [tripFilter, setTripFilter] = useState('all'); // 'all' | 'flight' | 'hotel' | 'bus' | 'train' | 'holiday'

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
      </div>
    </div>
  );
}
