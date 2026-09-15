import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { hotelCities } from '../../data/hotelData';
import { Building2, Calendar, Users, MapPin } from 'lucide-react';

export default function HotelSearchWidget({ initialValues = {}, onSearch }) {
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];

  const [city, setCity] = useState(initialValues.city || 'Goa');
  const [checkInDate, setCheckInDate] = useState(initialValues.checkInDate || '2026-10-05');
  const [checkOutDate, setCheckOutDate] = useState(initialValues.checkOutDate || '2026-10-08');
  const [rooms, setRooms] = useState(initialValues.rooms || 1);
  const [adults, setAdults] = useState(initialValues.adults || 2);
  const [children, setChildren] = useState(initialValues.children || 0);
  const [indianResident, setIndianResident] = useState(true);

  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [guestDropdownOpen, setGuestDropdownOpen] = useState(false);
  const [cityQuery, setCityQuery] = useState('');

  const guestRef = useRef(null);
  const cityRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (guestRef.current && !guestRef.current.contains(e.target)) {
        setGuestDropdownOpen(false);
      }
      if (cityRef.current && !cityRef.current.contains(e.target)) {
        setCityDropdownOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setGuestDropdownOpen(false);
        setCityDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Ensure checkout is not before checkin
  useEffect(() => {
    if (checkOutDate < checkInDate) {
      setCheckOutDate(checkInDate);
    }
  }, [checkInDate, checkOutDate]);

  const filteredCities = hotelCities.filter((c) =>
    c.toLowerCase().includes(cityQuery.toLowerCase())
  );

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const searchParams = {
      city,
      checkInDate,
      checkOutDate,
      rooms,
      adults,
      children,
      indianResident
    };

    if (onSearch) {
      onSearch(searchParams);
    } else {
      navigate('/hotel-booking', { state: searchParams });
    }
  };

  return (
    <div className="search-widget-box hotel-widget">
      <div className="search-top-bar">
        <span className="widget-badge-text">Book Hotels, Resorts, Homestays & Villas</span>
        <label className="checkbox-pill">
          <input
            type="checkbox"
            checked={indianResident}
            onChange={(e) => setIndianResident(e.target.checked)}
          />
          <span>Indian Resident</span>
        </label>
      </div>

      <div className="search-fields-grid hotel-grid">
        {/* City Destination */}
        <div className="search-field-block" ref={cityRef}>
          <label id="hotel-city-label">CITY / DESTINATION / HOTEL</label>
          <div
            className="field-value-card"
            onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
            tabIndex={0}
            role="button"
            aria-labelledby="hotel-city-label"
          >
            <span className="city-title">{city}</span>
            <span className="code-sub">India • Top Destinations</span>
          </div>

          {cityDropdownOpen && (
            <div className="airport-dropdown">
              <input
                type="text"
                placeholder="Search city..."
                className="dropdown-search-input"
                autoFocus
                value={cityQuery}
                onChange={(e) => setCityQuery(e.target.value)}
                aria-label="Search destination city"
              />
              <div className="airport-list">
                {filteredCities.map((item) => (
                  <div
                    key={item}
                    className={`airport-item ${item === city ? 'selected' : ''}`}
                    onClick={() => {
                      setCity(item);
                      setCityDropdownOpen(false);
                    }}
                  >
                    <MapPin size={15} />
                    <strong>{item}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Check-in Date */}
        <div className="search-field-block">
          <label htmlFor="hotel-checkin-date">CHECK-IN</label>
          <div className="field-value-card date-card">
            <input
              id="hotel-checkin-date"
              type="date"
              min={today}
              className="native-date-input"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
            />
          </div>
        </div>

        {/* Check-out Date */}
        <div className="search-field-block">
          <label htmlFor="hotel-checkout-date">CHECK-OUT</label>
          <div className="field-value-card date-card">
            <input
              id="hotel-checkout-date"
              type="date"
              min={checkInDate || today}
              className="native-date-input"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
            />
          </div>
        </div>

        {/* Rooms & Guests */}
        <div className="search-field-block" ref={guestRef}>
          <label id="hotel-guests-label">ROOMS & GUESTS</label>
          <div
            className="field-value-card traveller-card"
            onClick={() => setGuestDropdownOpen(!guestDropdownOpen)}
            tabIndex={0}
            role="button"
            aria-labelledby="hotel-guests-label"
          >
            <span className="city-title">{rooms} Room, {adults + children} Guests</span>
            <span className="code-sub">{adults} Adults, {children} Children</span>
          </div>

          {guestDropdownOpen && (
            <div className="traveller-popup">
              <div className="popup-section">
                <div className="counter-row">
                  <div>
                    <strong>Rooms</strong>
                  </div>
                  <div className="counter-controls">
                    <button
                      type="button"
                      disabled={rooms <= 1}
                      onClick={() => setRooms(rooms - 1)}
                      aria-label="Decrease rooms"
                    >
                      -
                    </button>
                    <span>{rooms}</span>
                    <button
                      type="button"
                      disabled={rooms >= 5}
                      onClick={() => setRooms(rooms + 1)}
                      aria-label="Increase rooms"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="counter-row">
                  <div>
                    <strong>Adults</strong>
                    <small>18+ yrs</small>
                  </div>
                  <div className="counter-controls">
                    <button
                      type="button"
                      disabled={adults <= 1}
                      onClick={() => setAdults(adults - 1)}
                      aria-label="Decrease adults"
                    >
                      -
                    </button>
                    <span>{adults}</span>
                    <button
                      type="button"
                      disabled={adults >= 10}
                      onClick={() => setAdults(adults + 1)}
                      aria-label="Increase adults"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="counter-row">
                  <div>
                    <strong>Children</strong>
                    <small>0-17 yrs</small>
                  </div>
                  <div className="counter-controls">
                    <button
                      type="button"
                      disabled={children <= 0}
                      onClick={() => setChildren(children - 1)}
                      aria-label="Decrease children"
                    >
                      -
                    </button>
                    <span>{children}</span>
                    <button
                      type="button"
                      disabled={children >= 6}
                      onClick={() => setChildren(children + 1)}
                      aria-label="Increase children"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="primary-btn full small"
                onClick={() => setGuestDropdownOpen(false)}
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="search-action-wrap">
        <button
          type="button"
          className="search-submit-hero-btn"
          onClick={handleSearchSubmit}
        >
          SEARCH HOTELS
        </button>
      </div>
    </div>
  );
}
