import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { airports } from '../../data/flightData';
import { ArrowLeftRight } from 'lucide-react';

export default function FlightSearchWidget({ initialValues = {}, onSearch }) {
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];

  const [tripType, setTripType] = useState(initialValues.tripType || 'oneWay');
  const [fromAirport, setFromAirport] = useState(initialValues.from || 'BOM');
  const [toAirport, setToAirport] = useState(initialValues.to || 'DEL');
  const [departureDate, setDepartureDate] = useState(initialValues.departureDate || '2026-09-22');
  const [returnDate, setReturnDate] = useState(initialValues.returnDate || '2026-09-28');
  const [nonStopOnly, setNonStopOnly] = useState(initialValues.nonStopOnly || false);
  const [specialFare, setSpecialFare] = useState(initialValues.specialFare || 'regular');

  // Travellers & Class
  const [adults, setAdults] = useState(initialValues.adults || 1);
  const [children, setChildren] = useState(initialValues.children || 0);
  const [infants, setInfants] = useState(initialValues.infants || 0);
  const [cabinClass, setCabinClass] = useState(initialValues.cabinClass || 'Economy');
  const [travellerMenuOpen, setTravellerMenuOpen] = useState(false);

  // Dropdowns
  const [fromSearchOpen, setFromSearchOpen] = useState(false);
  const [toSearchOpen, setToSearchOpen] = useState(false);
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');

  const travellerRef = useRef(null);
  const fromFieldRef = useRef(null);
  const toFieldRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (travellerRef.current && !travellerRef.current.contains(e.target)) {
        setTravellerMenuOpen(false);
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

  const handleSwapAirports = () => {
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
      specialFare
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

  return (
    <div className="search-widget-box flight-widget">
      {/* Top Options Bar */}
      <div className="search-top-bar">
        <div className="trip-radio-group">
          <label className={`radio-pill ${tripType === 'oneWay' ? 'active' : ''}`}>
            <input
              type="radio"
              name="tripType"
              checked={tripType === 'oneWay'}
              onChange={() => setTripType('oneWay')}
            />
            <span>One Way</span>
          </label>
          <label className={`radio-pill ${tripType === 'roundTrip' ? 'active' : ''}`}>
            <input
              type="radio"
              name="tripType"
              checked={tripType === 'roundTrip'}
              onChange={() => setTripType('roundTrip')}
            />
            <span>Round Trip</span>
          </label>
          <label className={`radio-pill ${tripType === 'multiCity' ? 'active' : ''}`}>
            <input
              type="radio"
              name="tripType"
              checked={tripType === 'multiCity'}
              onChange={() => setTripType('multiCity')}
            />
            <span>Multi City</span>
          </label>
        </div>

        <div className="top-filter-right">
          <label className="checkbox-pill nonstop-toggle">
            <input
              type="checkbox"
              checked={nonStopOnly}
              onChange={(e) => setNonStopOnly(e.target.checked)}
            />
            <span>Direct Flights Only</span>
          </label>
        </div>
      </div>

      {/* Main Input Grid */}
      <div className="search-fields-grid flight-grid">
        {/* FROM Field */}
        <div className="search-field-block" ref={fromFieldRef}>
          <label id="flight-from-label">FROM</label>
          <div
            className="field-value-card"
            onClick={() => {
              setFromSearchOpen(!fromSearchOpen);
              setToSearchOpen(false);
            }}
            tabIndex={0}
            role="button"
            aria-labelledby="flight-from-label"
          >
            <span className="city-title">{fromAirportObj.city}</span>
            <span className="code-sub">
              [{fromAirportObj.code}] {fromAirportObj.name.slice(0, 22)}...
            </span>
          </div>

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

        {/* Swap Button */}
        <button
          type="button"
          className="swap-button"
          onClick={handleSwapAirports}
          title="Swap origin and destination"
          aria-label="Swap origin and destination airports"
        >
          <ArrowLeftRight size={16} />
        </button>

        {/* TO Field */}
        <div className="search-field-block" ref={toFieldRef}>
          <label id="flight-to-label">TO</label>
          <div
            className="field-value-card"
            onClick={() => {
              setToSearchOpen(!toSearchOpen);
              setFromSearchOpen(false);
            }}
            tabIndex={0}
            role="button"
            aria-labelledby="flight-to-label"
          >
            <span className="city-title">{toAirportObj.city}</span>
            <span className="code-sub">
              [{toAirportObj.code}] {toAirportObj.name.slice(0, 22)}...
            </span>
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

        {/* DEPARTURE DATE */}
        <div className="search-field-block">
          <label htmlFor="flight-dep-date">DEPARTURE</label>
          <div className="field-value-card date-card">
            <input
              id="flight-dep-date"
              type="date"
              min={today}
              className="native-date-input"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
            />
          </div>
        </div>

        {/* RETURN DATE */}
        <div className={`search-field-block ${tripType !== 'roundTrip' ? 'disabled' : ''}`}>
          <label htmlFor="flight-ret-date">RETURN</label>
          <div className="field-value-card date-card">
            {tripType === 'roundTrip' ? (
              <input
                id="flight-ret-date"
                type="date"
                min={departureDate || today}
                className="native-date-input"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            ) : (
              <div className="disabled-return" onClick={() => setTripType('roundTrip')}>
                <span>Click to add return trip</span>
              </div>
            )}
          </div>
        </div>

        {/* TRAVELLERS & CLASS */}
        <div className="search-field-block" ref={travellerRef}>
          <label id="flight-traveller-label">TRAVELLERS & CLASS</label>
          <div
            className="field-value-card traveller-card"
            onClick={() => setTravellerMenuOpen(!travellerMenuOpen)}
            tabIndex={0}
            role="button"
            aria-labelledby="flight-traveller-label"
          >
            <span className="city-title">{totalPassengers} Traveller{totalPassengers > 1 ? 's' : ''}</span>
            <span className="code-sub">{cabinClass}</span>
          </div>

          {travellerMenuOpen && (
            <div className="traveller-popup">
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

              <div className="popup-section class-section">
                <strong>Travel Class</strong>
                <div className="class-pills">
                  {['Economy', 'Premium Economy', 'Business', 'First Class'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`class-pill ${cabinClass === c ? 'active' : ''}`}
                      onClick={() => setCabinClass(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="primary-btn full small"
                onClick={() => setTravellerMenuOpen(false)}
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Special Fares Strip */}
      <div className="special-fares-strip">
        <span className="fare-label">Special Fares (Optional):</span>
        <div className="fare-chips">
          {[
            { id: 'regular', label: 'Regular Fare' },
            { id: 'student', label: 'Student (+ Extra Baggage)' },
            { id: 'senior', label: 'Senior Citizen' },
            { id: 'armed', label: 'Armed Forces' },
            { id: 'doctor', label: 'Doctors & Nurses' }
          ].map((fare) => (
            <label
              key={fare.id}
              className={`fare-chip ${specialFare === fare.id ? 'active' : ''}`}
            >
              <input
                type="radio"
                name="specialFare"
                checked={specialFare === fare.id}
                onChange={() => setSpecialFare(fare.id)}
              />
              <span>{fare.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="search-action-wrap">
        <button
          type="button"
          className="search-submit-hero-btn"
          onClick={handleSearchSubmit}
        >
          SEARCH FLIGHTS
        </button>
      </div>
    </div>
  );
}
