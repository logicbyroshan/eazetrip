import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { airports } from '../../data/flightData';
import { ArrowLeftRight, ChevronDown, ShieldCheck, Ticket, Sparkles } from 'lucide-react';

export const formatDateDisplay = (dateStr) => {
  if (!dateStr) return { day: '--', monthYear: '--', weekday: '--' };
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const dayNum = parseInt(parts[2], 10);
      const d = new Date(year, month, dayNum);
      const day = d.getDate();
      const monthShort = d.toLocaleString('en-US', { month: 'short' });
      const yearShort = String(d.getFullYear()).slice(-2);
      const weekday = d.toLocaleString('en-US', { weekday: 'long' });
      return {
        day: String(day),
        monthYear: `${monthShort}'${yearShort}`,
        weekday
      };
    }
  } catch (e) {
    // fallback
  }
  return { day: '2', monthYear: "Oct'26", weekday: 'Friday' };
};

export default function FlightSearchWidget({ initialValues = {}, onSearch }) {
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];

  const [tripType, setTripType] = useState(initialValues.tripType || 'oneWay');
  const [fromAirport, setFromAirport] = useState(initialValues.from || 'BOM');
  const [toAirport, setToAirport] = useState(initialValues.to || 'BHO');
  const [departureDate, setDepartureDate] = useState(initialValues.departureDate || '2026-10-02');
  const [returnDate, setReturnDate] = useState(initialValues.returnDate || '2026-10-08');
  const [nonStopOnly, setNonStopOnly] = useState(initialValues.nonStopOnly || false);
  const [specialFare, setSpecialFare] = useState(initialValues.specialFare || 'regular');
  const [priceDropProtection, setPriceDropProtection] = useState(false);

  // Travellers & Class
  const [adults, setAdults] = useState(initialValues.adults || 1);
  const [children, setChildren] = useState(initialValues.children || 0);
  const [infants, setInfants] = useState(initialValues.infants || 0);
  const [cabinClass, setCabinClass] = useState(initialValues.cabinClass || 'Economy');
  const [travellerMenuOpen, setTravellerMenuOpen] = useState(false);
  const [classMenuOpen, setClassMenuOpen] = useState(false);

  // Dropdowns
  const [fromSearchOpen, setFromSearchOpen] = useState(false);
  const [toSearchOpen, setToSearchOpen] = useState(false);
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');

  const travellerRef = useRef(null);
  const classRef = useRef(null);
  const fromFieldRef = useRef(null);
  const toFieldRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (travellerRef.current && !travellerRef.current.contains(e.target)) {
        setTravellerMenuOpen(false);
      }
      if (classRef.current && !classRef.current.contains(e.target)) {
        setClassMenuOpen(false);
      }
      if (fromFieldRef.current && !fromFieldRef.current.contains(e.target)) {
        setFromSearchOpen(false);
      }
      if (toFieldRef.current && !toFieldRef.current.contains(e.target)) {
        setToSearchOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setTravellerMenuOpen(false);
        setClassMenuOpen(false);
        setFromSearchOpen(false);
        setToSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Ensure return date is not before departure date
  useEffect(() => {
    if (tripType === 'roundTrip' && returnDate < departureDate) {
      setReturnDate(departureDate);
    }
  }, [departureDate, tripType, returnDate]);

  const getAirport = (code) => airports.find((a) => a.code === code) || airports[0];

  const handleSwapAirports = (e) => {
    if (e) e.stopPropagation();
    const temp = fromAirport;
    setFromAirport(toAirport);
    setToAirport(temp);
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const searchParams = {
      tripType,
      from: fromAirport,
      to: toAirport,
      departureDate,
      returnDate: tripType === 'roundTrip' ? returnDate : null,
      adults,
      children,
      infants,
      cabinClass,
      nonStopOnly,
      specialFare,
      priceDropProtection
    };

    if (onSearch) {
      onSearch(searchParams);
    } else {
      navigate('/flight-booking', { state: searchParams });
    }
  };

  const fromAirportObj = getAirport(fromAirport);
  const toAirportObj = getAirport(toAirport);

  const filteredFromAirports = airports.filter(
    (a) =>
      a.city.toLowerCase().includes(fromQuery.toLowerCase()) ||
      a.code.toLowerCase().includes(fromQuery.toLowerCase()) ||
      a.name.toLowerCase().includes(fromQuery.toLowerCase())
  );

  const filteredToAirports = airports.filter(
    (a) =>
      a.city.toLowerCase().includes(toQuery.toLowerCase()) ||
      a.code.toLowerCase().includes(toQuery.toLowerCase()) ||
      a.name.toLowerCase().includes(toQuery.toLowerCase())
  );

  const totalPassengers = adults + children + infants;
  const depDateObj = formatDateDisplay(departureDate);
  const retDateObj = formatDateDisplay(returnDate);

  return (
    <div className="search-widget-box flight-widget modern-ss-widget">
      {/* Top Options Bar */}
      <div className="search-top-bar modern-ss-topbar">
        <div className="trip-radio-group modern-radio-group">
          <label className={`radio-dot-option ${tripType === 'oneWay' ? 'active' : ''}`}>
            <input
              type="radio"
              name="tripType"
              checked={tripType === 'oneWay'}
              onChange={() => setTripType('oneWay')}
            />
            <span className="custom-radio-dot" />
            <span className="radio-label-text">One Way</span>
          </label>
          <label className={`radio-dot-option ${tripType === 'roundTrip' ? 'active' : ''}`}>
            <input
              type="radio"
              name="tripType"
              checked={tripType === 'roundTrip'}
              onChange={() => setTripType('roundTrip')}
            />
            <span className="custom-radio-dot" />
            <span className="radio-label-text">Round Trip</span>
          </label>
          <label className={`radio-dot-option ${tripType === 'multiCity' ? 'active' : ''}`}>
            <input
              type="radio"
              name="tripType"
              checked={tripType === 'multiCity'}
              onChange={() => setTripType('multiCity')}
            />
            <span className="custom-radio-dot" />
            <span className="radio-label-text">Multi City</span>
          </label>
        </div>

        <div className="top-info-banner-right">
          <span className="top-info-text">Book International and Domestic Flights</span>
          <div className="flight-cab-highlight-badge">
            <span className="highlight-lead">Flight + Cab connection :</span>
            <span className="highlight-sub">Reach anywhere in India</span>
            <span className="badge-new-pill">NEW</span>
          </div>
        </div>
      </div>

      {/* Main Unified Segmented Input Grid */}
      <div className="unified-segmented-box flight-unified-box">
        {/* 1. FROM Field */}
        <div className="search-cell-block cell-from" ref={fromFieldRef}>
          <div
            className="search-cell-clickable"
            onClick={() => {
              setFromSearchOpen(!fromSearchOpen);
              setToSearchOpen(false);
            }}
            tabIndex={0}
            role="button"
          >
            <span className="search-cell-label">From</span>
            <h3 className="search-cell-main">{fromAirportObj.city}</h3>
            <p className="search-cell-sub">
              {fromAirportObj.code}, {fromAirportObj.name.slice(0, 24)}...
            </p>
          </div>

          {/* Floating Swap Button */}
          <button
            type="button"
            className="segmented-swap-btn"
            onClick={handleSwapAirports}
            title="Swap origin and destination"
            aria-label="Swap origin and destination airports"
          >
            <ArrowLeftRight size={13} />
          </button>

          {fromSearchOpen && (
            <div className="airport-dropdown">
              <input
                type="text"
                placeholder="Type city or airport code..."
                className="dropdown-search-input"
                autoFocus
                value={fromQuery}
                onChange={(e) => setFromQuery(e.target.value)}
                aria-label="Search origin airport"
              />
              <div className="airport-list">
                {filteredFromAirports.map((airport) => (
                  <div
                    key={airport.code}
                    className={`airport-item ${airport.code === fromAirport ? 'selected' : ''}`}
                    onClick={() => {
                      setFromAirport(airport.code);
                      setFromSearchOpen(false);
                    }}
                  >
                    <div className="airport-meta">
                      <strong>{airport.city} ({airport.code})</strong>
                      <small>{airport.name}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2. TO Field */}
        <div className="search-cell-block cell-to" ref={toFieldRef}>
          <div
            className="search-cell-clickable"
            onClick={() => {
              setToSearchOpen(!toSearchOpen);
              setFromSearchOpen(false);
            }}
            tabIndex={0}
            role="button"
          >
            <span className="search-cell-label">To</span>
            <h3 className="search-cell-main">{toAirportObj.city}</h3>
            <p className="search-cell-sub">
              {toAirportObj.code}, {toAirportObj.name.slice(0, 24)}...
            </p>
          </div>

          {toSearchOpen && (
            <div className="airport-dropdown">
              <input
                type="text"
                placeholder="Type city or airport code..."
                className="dropdown-search-input"
                autoFocus
                value={toQuery}
                onChange={(e) => setToQuery(e.target.value)}
                aria-label="Search destination airport"
              />
              <div className="airport-list">
                {filteredToAirports.map((airport) => (
                  <div
                    key={airport.code}
                    className={`airport-item ${airport.code === toAirport ? 'selected' : ''}`}
                    onClick={() => {
                      setToAirport(airport.code);
                      setToSearchOpen(false);
                    }}
                  >
                    <div className="airport-meta">
                      <strong>{airport.city} ({airport.code})</strong>
                      <small>{airport.name}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3. DEPARTURE DATE */}
        <div className="search-cell-block cell-departure date-cell-block">
          <div className="search-cell-clickable">
            <div className="search-cell-label-row">
              <span className="search-cell-label">Departure</span>
              <ChevronDown size={13} className="cell-chevron text-blue-500" />
            </div>
            <div className="search-cell-main date-headline">
              <span className="date-number">{depDateObj.day}</span>
              <span className="date-month-year">{depDateObj.monthYear}</span>
            </div>
            <p className="search-cell-sub">{depDateObj.weekday}</p>
          </div>
          <input
            id="flight-dep-date"
            type="date"
            min={today}
            className="custom-date-overlay-input"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            aria-label="Departure Date"
          />
        </div>

        {/* 4. RETURN DATE */}
        <div className={`search-cell-block cell-return date-cell-block ${tripType !== 'roundTrip' ? 'empty-return-cell' : ''}`}>
          {tripType === 'roundTrip' ? (
            <>
              <div className="search-cell-clickable">
                <div className="search-cell-label-row">
                  <span className="search-cell-label">Return</span>
                  <ChevronDown size={13} className="cell-chevron text-blue-500" />
                </div>
                <div className="search-cell-main date-headline">
                  <span className="date-number">{retDateObj.day}</span>
                  <span className="date-month-year">{retDateObj.monthYear}</span>
                </div>
                <p className="search-cell-sub">{retDateObj.weekday}</p>
              </div>
              <input
                id="flight-ret-date"
                type="date"
                min={departureDate || today}
                className="custom-date-overlay-input"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                aria-label="Return Date"
              />
            </>
          ) : (
            <div
              className="search-cell-clickable return-prompt-inner"
              onClick={() => setTripType('roundTrip')}
              role="button"
              tabIndex={0}
            >
              <div className="search-cell-label-row">
                <span className="search-cell-label">Return</span>
                <ChevronDown size={13} className="cell-chevron text-blue-500" />
              </div>
              <p className="return-hint-text">
                Tap to add a return date for bigger discounts
              </p>
            </div>
          )}
        </div>

        {/* 5. TRAVELLERS */}
        <div className="search-cell-block cell-travellers" ref={travellerRef}>
          <div
            className="search-cell-clickable"
            onClick={() => {
              setTravellerMenuOpen(!travellerMenuOpen);
              setClassMenuOpen(false);
            }}
            tabIndex={0}
            role="button"
          >
            <div className="search-cell-label-row">
              <span className="search-cell-label">Travellers</span>
              <ChevronDown size={13} className="cell-chevron text-blue-500" />
            </div>
            <h3 className="search-cell-main">{totalPassengers}</h3>
            <p className="search-cell-sub">
              {totalPassengers === 1 ? 'Adult' : `${adults} Adults${children ? `, ${children} Ch` : ''}`}
            </p>
          </div>

          {travellerMenuOpen && (
            <div className="traveller-popup modern-traveller-dropdown">
              <div className="popup-section">
                <div className="counter-row">
                  <div>
                    <strong>Adults</strong>
                    <small>12+ yrs</small>
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
                      disabled={adults >= 9}
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
                    <small>2-12 yrs</small>
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

                <div className="counter-row">
                  <div>
                    <strong>Infants</strong>
                    <small>Below 2 yrs</small>
                  </div>
                  <div className="counter-controls">
                    <button
                      type="button"
                      disabled={infants <= 0}
                      onClick={() => setInfants(infants - 1)}
                      aria-label="Decrease infants"
                    >
                      -
                    </button>
                    <span>{infants}</span>
                    <button
                      type="button"
                      disabled={infants >= adults}
                      onClick={() => setInfants(infants + 1)}
                      aria-label="Increase infants"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="primary-btn full small mt-2"
                onClick={() => setTravellerMenuOpen(false)}
              >
                Apply Travellers
              </button>
            </div>
          )}
        </div>

        {/* 6. CABIN CLASS */}
        <div className="search-cell-block cell-cabin-class" ref={classRef}>
          <div
            className="search-cell-clickable"
            onClick={() => {
              setClassMenuOpen(!classMenuOpen);
              setTravellerMenuOpen(false);
            }}
            tabIndex={0}
            role="button"
          >
            <div className="search-cell-label-row">
              <span className="search-cell-label">Cabin Class</span>
              <ChevronDown size={13} className="cell-chevron text-blue-500" />
            </div>
            <h3 className="search-cell-main search-cell-cabin">
              {cabinClass === 'Economy' ? 'Economy/ Premium...' : cabinClass}
            </h3>
            <p className="search-cell-sub">
              {cabinClass === 'Economy' ? 'Best value fare' : 'Premium comfort'}
            </p>
          </div>

          {classMenuOpen && (
            <div className="traveller-popup modern-class-dropdown">
              <div className="popup-section class-section">
                <strong>Select Cabin Class</strong>
                <div className="class-pills-list mt-2">
                  {['Economy', 'Premium Economy', 'Business', 'First Class'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`class-option-btn ${cabinClass === c ? 'active' : ''}`}
                      onClick={() => {
                        setCabinClass(c);
                        setClassMenuOpen(false);
                      }}
                    >
                      <span>{c}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Select a special fare Row (Matching Screenshot) */}
      <div className="modern-special-fares-row">
        <div className="special-fare-heading-col">
          <span className="special-fare-lead">Select a</span>
          <strong className="special-fare-strong">special fare</strong>
        </div>

        <div className="modern-fare-cards-grid">
          {[
            { id: 'regular', title: 'Regular', subtitle: 'Regular fares' },
            { id: 'student', title: 'Student', subtitle: 'Extra discounts/baggage' },
            { id: 'armed', title: 'Armed Forces', subtitle: 'Up to ₹ 600 off' },
            { id: 'gst', title: 'Have a GST number ?', badge: 'new', subtitle: 'Lower cancellation charges' },
            { id: 'senior', title: 'Senior Citizen', subtitle: 'Up to ₹ 600 off' },
            { id: 'doctor', title: 'Doctor and Nurses', subtitle: 'Up to ₹ 600 off' }
          ].map((fare) => (
            <div
              key={fare.id}
              className={`modern-fare-card ${specialFare === fare.id ? 'active' : ''}`}
              onClick={() => setSpecialFare(fare.id)}
              role="button"
              tabIndex={0}
            >
              <div className="fare-card-title-row">
                <span className="fare-card-title">{fare.title}</span>
                {fare.badge && <span className="fare-mini-badge">{fare.badge}</span>}
              </div>
              <span className="fare-card-sub">{fare.subtitle}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Price Drop Protection & Flight Status Strip (Matching Screenshot) */}
      <div className="price-drop-status-row">
        <label className="price-drop-checkbox-box">
          <input
            type="checkbox"
            checked={priceDropProtection}
            onChange={(e) => setPriceDropProtection(e.target.checked)}
          />
          <div className="price-drop-text-block">
            <strong>Add Price Drop Protection</strong>
            <span>Price drops, we'll refund the difference.</span>
            <a href="#view-details" onClick={(e) => e.preventDefault()} className="price-drop-link">View Details</a>
          </div>
          <div className="price-drop-icon-shield" title="Price Drop Protection Active">
            <span className="shield-symbol">₹</span>
          </div>
        </label>

        <button
          type="button"
          className="flight-status-cta-pill"
          onClick={() => navigate('/flight-booking')}
        >
          <span className="ticket-icon">🎟️</span>
          <span>Flight Status</span>
        </button>
      </div>

      {/* Floating SEARCH Button (Centered Half-Inside, Half-Outside bottom edge) */}
      <div className="search-action-wrap-floating">
        <button
          type="button"
          className="search-submit-hero-btn modern-floating-btn"
          onClick={handleSearchSubmit}
        >
          SEARCH
        </button>
      </div>
    </div>
  );
}

