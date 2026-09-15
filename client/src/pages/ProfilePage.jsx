import { useState } from 'react';
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
  Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { user, updateProfile, openLoginModal, isAuthenticated } = useAuth();
  const { showToast } = useBooking();

  const [activeTab, setActiveTab] = useState('personal'); // personal | travellers | preferences

  const [name, setName] = useState(user?.name || 'Rohit Sharma');
  const [email, setEmail] = useState(user?.email || 'rohit.sharma@example.com');
  const [phone, setPhone] = useState(user?.phone || '+91 9876543210');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');

  // Preferences
  const [seatPref, setSeatPref] = useState('Window');
  const [mealPref, setMealPref] = useState('Vegetarian');
  const [frequentFlyer, setFrequentFlyer] = useState('AI-994821');

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
                Member since {user?.memberSince || '2024'} • Verified Traveler • EazeTrip Rewards
              </p>
            </div>
          </div>

          <div className="profile-quick-actions">
            <Link to="/manage-bookings" className="profile-head-btn">
              <Luggage size={15} /> My Bookings
            </Link>
            <Link to="/payment" className="profile-head-btn">
              Make Payment
            </Link>
          </div>
        </div>

        {/* Travel Stats Metrics Row */}
        <div className="profile-stats-strip mt-4">
          <div className="stat-metric-card">
            <div className="metric-icon-box blue">
              <Plane size={20} />
            </div>
            <div>
              <strong>14</strong>
              <small>Total Bookings</small>
            </div>
          </div>

          <div className="stat-metric-card">
            <div className="metric-icon-box teal">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <strong>12</strong>
              <small>Trips Completed</small>
            </div>
          </div>

          <div className="stat-metric-card">
            <div className="metric-icon-box amber">
              <Sparkles size={20} />
            </div>
            <div>
              <strong>2,450 pts</strong>
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
            <Luggage size={16} />
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
