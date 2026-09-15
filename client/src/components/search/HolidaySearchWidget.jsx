import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { holidayDestinations, holidayThemes } from '../../data/holidayData';
import { MapPin, Calendar, Compass, Users } from 'lucide-react';

export default function HolidaySearchWidget({ initialValues = {}, onSearch }) {
  const navigate = useNavigate();

  const [destination, setDestination] = useState(initialValues.destination || 'Goa');
  const [departureCity, setDepartureCity] = useState(initialValues.fromCity || 'Mumbai');
  const [travelMonth, setTravelMonth] = useState(initialValues.month || 'October 2026');
  const [selectedTheme, setSelectedTheme] = useState(initialValues.theme || 'All Themes');
  const [destDropdownOpen, setDestDropdownOpen] = useState(false);
  const [destQuery, setDestQuery] = useState('');

  const destRef = useRef(null);

  const months = [
    'September 2026',
    'October 2026',
    'November 2026',
    'December 2026',
    'January 2027',
    'February 2027',
    'March 2027',
    'April 2027'
  ];

  const departureCities = [
    'Mumbai',
    'New Delhi',
    'Bengaluru',
    'Kolkata',
    'Chennai',
    'Hyderabad',
    'Ahmedabad',
    'Pune',
    'Chandigarh',
    'Jaipur'
  ];

  useEffect(() => {
    function handleClickOutside(e) {
      if (destRef.current && !destRef.current.contains(e.target)) {
        setDestDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredDestinations = holidayDestinations.filter(
    (d) =>
      d.name.toLowerCase().includes(destQuery.toLowerCase()) ||
      d.country.toLowerCase().includes(destQuery.toLowerCase()) ||
      d.tag.toLowerCase().includes(destQuery.toLowerCase())
  );

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const searchParams = {
      destination,
      fromCity: departureCity,
      month: travelMonth,
      theme: selectedTheme
    };

    if (onSearch) {
      onSearch(searchParams);
    } else {
      navigate('/holiday-booking', { state: searchParams });
    }
  };

  return (
    <div className="search-widget-box holiday-widget">
      {/* Top Themes Pills */}
      <div className="search-top-bar">
        <div className="trip-radio-group">
          {['All Destinations', 'Domestic Wonders', 'International Escapes'].map((cat, idx) => (
            <label key={cat} className={`radio-pill ${idx === 0 ? 'active' : ''}`}>
              <input type="radio" name="holidayCat" defaultChecked={idx === 0} />
              <span>{cat}</span>
            </label>
          ))}
        </div>

        <div className="top-filter-right">
          <span className="special-tag-pill">✨ Handcrafted Itineraries & Flights Included</span>
        </div>
      </div>

      {/* Main Search Grid */}
      <div className="search-fields-grid holiday-grid">
        {/* DESTINATION */}
        <div className="search-field-block" ref={destRef}>
          <label id="holiday-dest-label">DESTINATION / PACKAGE</label>
          <div
            className="field-value-card"
            onClick={() => setDestDropdownOpen(!destDropdownOpen)}
            tabIndex={0}
            role="button"
            aria-labelledby="holiday-dest-label"
          >
            <span className="city-title">{destination}</span>
            <span className="code-sub">Explore handpicked tour packages</span>
          </div>

          {destDropdownOpen && (
            <div className="airport-dropdown holiday-dropdown">
              <input
                type="text"
                placeholder="Search destination (e.g. Kashmir, Goa, Dubai, Bali)..."
                className="dropdown-search-input"
                autoFocus
                value={destQuery}
                onChange={(e) => setDestQuery(e.target.value)}
                aria-label="Search holiday destination"
              />
              <div className="airport-list">
                {filteredDestinations.map((dest) => (
                  <div
                    key={dest.code}
                    className={`airport-item ${dest.name === destination ? 'selected' : ''}`}
                    onClick={() => {
                      setDestination(dest.name);
                      setDestDropdownOpen(false);
                    }}
                  >
                    <div className="airport-meta">
                      <strong>{dest.name} ({dest.country})</strong>
                      <small>{dest.tag} • {dest.type}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* DEPARTURE CITY */}
        <div className="search-field-block">
          <label htmlFor="holiday-departure-city">STARTING FROM</label>
          <div className="field-value-card select-card">
            <select
              id="holiday-departure-city"
              value={departureCity}
              onChange={(e) => setDepartureCity(e.target.value)}
              className="native-field-select"
            >
              {departureCities.map((city) => (
                <option key={city} value={city}>
                  {city} (Flights / Private Cab)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* MONTH OF TRAVEL */}
        <div className="search-field-block">
          <label htmlFor="holiday-travel-month">MONTH OF TRAVEL</label>
          <div className="field-value-card select-card">
            <select
              id="holiday-travel-month"
              value={travelMonth}
              onChange={(e) => setTravelMonth(e.target.value)}
              className="native-field-select"
            >
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* THEME */}
        <div className="search-field-block">
          <label htmlFor="holiday-package-theme">HOLIDAY THEME</label>
          <div className="field-value-card select-card">
            <select
              id="holiday-package-theme"
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className="native-field-select"
            >
              {holidayThemes.map((th) => (
                <option key={th} value={th}>
                  {th}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Special Highlights Bar */}
      <div className="special-fares-strip">
        <span className="fare-label">Popular Themes:</span>
        <div className="fare-chips">
          {['Honeymoon & Romantic', 'Beach Escapes', 'Adventure & Trekking', 'Family Holidays', 'Heritage & Culture'].map((th) => (
            <button
              key={th}
              type="button"
              className={`fare-chip-btn ${selectedTheme === th ? 'active' : ''}`}
              onClick={() => setSelectedTheme(th)}
            >
              {th}
            </button>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="search-action-wrap">
        <button
          type="button"
          className="search-submit-hero-btn holiday-submit-btn"
          onClick={handleSearchSubmit}
        >
          EXPLORE HOLIDAY PACKAGES
        </button>
      </div>
    </div>
  );
}
