import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { User, Mail, Phone, MapPin, Calendar, ShieldCheck, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { user, updateProfile, openLoginModal, isAuthenticated } = useAuth();
  const { showToast } = useBooking();

  const [name, setName] = useState(user?.name || 'Rohit Sharma');
  const [email, setEmail] = useState(user?.email || 'rohit.sharma@example.com');
  const [phone, setPhone] = useState(user?.phone || '+91 9876543210');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');

  const [savedTravellers, setSavedTravellers] = useState([
    { id: 1, name: 'Rohit Sharma', gender: 'Male', dob: '1992-04-30', relation: 'Self' },
    { id: 2, name: 'Ritika Sharma', gender: 'Female', dob: '1995-12-21', relation: 'Spouse' }
  ]);

  const [newTravellerName, setNewTravellerName] = useState('');
  const [newTravellerGender, setNewTravellerGender] = useState('Male');
  const [newTravellerRelation, setNewTravellerRelation] = useState('Friend');
  const [showAddTraveller, setShowAddTraveller] = useState(false);

  if (!isAuthenticated && !user) {
    return (
      <div className="container page-wrap">
        <div className="content-card form-card text-center">
          <h2>Please Sign In</h2>
          <p>You need to be logged in to view and edit your profile.</p>
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

  const handleAddTraveller = (e) => {
    e.preventDefault();
    if (!newTravellerName) return;

    setSavedTravellers([
      ...savedTravellers,
      {
        id: Date.now(),
        name: newTravellerName,
        gender: newTravellerGender,
        dob: '1998-01-01',
        relation: newTravellerRelation
      }
    ]);
    setNewTravellerName('');
    setShowAddTraveller(false);
    showToast('Traveller added to your quick-book list!');
  };

  const handleRemoveTraveller = (id) => {
    setSavedTravellers(savedTravellers.filter((t) => t.id !== id));
    showToast('Traveller removed.');
  };

  return (
    <div className="container profile-page-wrap">
      <div className="profile-layout-grid">
        {/* Left Profile Overview Card */}
        <aside className="profile-sidebar-card">
          <div className="profile-avatar-large">
            {name?.charAt(0) || 'U'}
          </div>
          <h3>{name}</h3>
          <span className="user-tier-pill">{user?.tier || 'Gold Explorer'}</span>

          <div className="sidebar-contact-meta">
            <div className="meta-line">
              <Mail size={14} />
              <span>{email}</span>
            </div>
            <div className="meta-line">
              <Phone size={14} />
              <span>{phone}</span>
            </div>
            <div className="meta-line">
              <MapPin size={14} />
              <span>{city}, {state}</span>
            </div>
          </div>

          <div className="profile-sidebar-links">
            <Link to="/manage-bookings" className="sidebar-link">
              <ShieldCheck size={16} /> My Bookings
            </Link>
            <Link to="/payment" className="sidebar-link">
              Make Invoice Payment
            </Link>
            <Link to="/offers" className="sidebar-link">
              Exclusive Offers
            </Link>
          </div>
        </aside>

        {/* Right Main Content */}
        <main className="profile-main-content">
          {/* Edit Profile Form */}
          <div className="content-card form-card">
            <h2>Personal Information</h2>
            <form onSubmit={handleSaveProfile} className="profile-form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Mobile Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>State / Region</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>

              <div className="form-full-row">
                <button type="submit" className="primary-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Saved Travellers Section */}
          <div className="content-card mt-4">
            <div className="section-header">
              <div>
                <h2>Saved Travellers (Fast Checkout)</h2>
                <p>Add family & friends for 1-click booking on flights, hotels, and buses</p>
              </div>
              <button
                type="button"
                className="secondary-btn small"
                onClick={() => setShowAddTraveller(!showAddTraveller)}
              >
                <Plus size={15} /> Add Traveller
              </button>
            </div>

            {showAddTraveller && (
              <form onSubmit={handleAddTraveller} className="add-traveller-form">
                <div className="form-grid three-col">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Ananya Roy"
                      value={newTravellerName}
                      onChange={(e) => setNewTravellerName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Gender</label>
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
                    <label>Relation</label>
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
                    </select>
                  </div>
                </div>
                <div className="mt-3">
                  <button type="submit" className="primary-btn small">
                    Save Traveller
                  </button>
                </div>
              </form>
            )}

            <div className="travellers-list">
              {savedTravellers.map((traveller) => (
                <div key={traveller.id} className="traveller-item-card">
                  <div className="traveller-info">
                    <strong>{traveller.name}</strong>
                    <span className="traveller-sub">
                      {traveller.gender} • {traveller.relation}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="delete-traveller-btn"
                    onClick={() => handleRemoveTraveller(traveller.id)}
                    title="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
