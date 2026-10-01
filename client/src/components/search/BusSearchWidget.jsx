import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { busCities } from '../../data/busData';
import { Bus, ArrowLeftRight, ChevronDown, Check, MapPin, ShieldCheck } from 'lucide-react';
import { formatDateDisplay } from './FlightSearchWidget';

const BUS_TYPES = [
  { code: 'ALL', label: 'All Bus Types', shortName: 'All Buses', desc: 'AC, Non-AC, Sleeper & Seater' },
  { code: 'SLEEPER', label: 'AC Sleeper (2+1)', shortName: 'AC Sleeper', desc: 'Plush reclining single/double' },
  { code: 'SEATER', label: 'AC Seater / Semi-Sleeper', shortName: 'AC Seater', desc: 'Comfortable push-back seats' },
  { code: 'VOLVO', label: 'Volvo Multi-Axle / Scania', shortName: 'Volvo Luxury', desc: 'Ultra-smooth air suspension' },
  { code: 'ELECTRIC', label: 'Electric Luxury Coach', shortName: 'EV Green Bus', desc: 'Zero noise & eco friendly' }
];

export default function BusSearchWidget({ initialValues = {}, onSearch }) {
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];
  const [busFilterTab, setBusFilterTab] = useState('all'); // all | sleeper | primo | govt
  const [fromCity, setFromCity] = useState(initialValues.from || 'Pune');
  const [toCity, setToCity] = useState(initialValues.to || 'Mumbai');
  const [journeyDate, setJourneyDate] = useState(initialValues.journeyDate || '2026-10-02');
  const [busType, setBusType] = useState('ALL');
  const [seats, setSeats] = useState(1);
  const [specialPreference, setSpecialPreference] = useState('regular');
  const [delayAssurance, setDelayAssurance] = useState(false);

  // Dropdowns & Popups
  const [fromDropdownOpen, setFromDropdownOpen] = useState(false);
  const [toDropdownOpen, setToDropdownOpen] = useState(false);
  const [busTypeDropdownOpen, setBusTypeDropdownOpen] = useState(false);
  const [seatsDropdownOpen, setSeatsDropdownOpen] = useState(false);

  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');

  const fromRef = useRef(null);
  const toRef = useRef(null);
  const busTypeRef = useRef(null);
  const seatsRef = useRef(null);

  const journeyDateObj = formatDateDisplay(journeyDate);

  useEffect(() => {
    function handleClickOutside(e) {
      if (fromRef.current && !fromRef.current.contains(e.target)) {
        setFromDropdownOpen(false);
      }
      if (toRef.current && !toRef.current.contains(e.target)) {
        setToDropdownOpen(false);
      }
      if (busTypeRef.current && !busTypeRef.current.contains(e.target)) {
        setBusTypeDropdownOpen(false);
      }
      if (seatsRef.current && !seatsRef.current.contains(e.target)) {
        setSeatsDropdownOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setFromDropdownOpen(false);
        setToDropdownOpen(false);
        setBusTypeDropdownOpen(false);
        setSeatsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSwap = (e) => {
    if (e) e.stopPropagation();
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const filteredFromCities = busCities.filter((c) =>
    c.toLowerCase().includes(fromQuery.toLowerCase())
  );

  const filteredToCities = busCities.filter((c) =>
    c.toLowerCase().includes(toQuery.toLowerCase())
  );

  const currentBusTypeObj = BUS_TYPES.find((b) => b.code === busType) || BUS_TYPES[0];

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const searchParams = {
      from: fromCity,
      to: toCity,
      journeyDate,
      busType,
      seats,
      specialPreference,
      delayAssurance
    };

    if (onSearch) {
      onSearch(searchParams);
    } else {
      navigate('/bus-booking', { state: searchParams });
    }
  };

  return (
    <div className="search-widget-box bus-widget modern-ss-widget">
      {/* Top Options Bar */}
      <div className="search-top-bar modern-ss-topbar">
        <div className="trip-radio-group modern-radio-group">
          <label className={`radio-dot-option ${busFilterTab === 'all' ? 'active' : ''}`}>
            <input
              type="radio"
              name="busFilterTab"
              checked={busFilterTab === 'all'}
              onChange={() => setBusFilterTab('all')}
            />
            <span className="custom-radio-dot" />
            <span className="radio-label-text">All Intercity Buses</span>
          </label>
          <label className={`radio-dot-option ${busFilterTab === 'sleeper' ? 'active' : ''}`}>
            <input
              type="radio"
              name="busFilterTab"
              checked={busFilterTab === 'sleeper'}
              onChange={() => {
                setBusFilterTab('sleeper');
                setBusType('SLEEPER');
              }}
            />
            <span className="custom-radio-dot" />
            <span className="radio-label-text">AC Sleeper Coaches</span>
          </label>
          <label className={`radio-dot-option ${busFilterTab === 'primo' ? 'active' : ''}`}>
            <input
              type="radio"
              name="busFilterTab"
              checked={busFilterTab === 'primo'}
              onChange={() => setBusFilterTab('primo')}
            />
            <span className="custom-radio-dot" />
            <span className="radio-label-text">Primo / Luxury EV</span>
          </label>
        </div>

        <div className="top-info-banner-right">
          <span className="top-info-text">Primo Certified Buses</span>
          <div className="flight-cab-highlight-badge">
            <span className="highlight-lead">Live GPS Tracking :</span>
            <span className="highlight-sub">Free Water & Blanket</span>
            <span className="badge-new-pill">NEW</span>
          </div>
        </div>
      </div>

      {/* Main Unified Segmented Input Grid (5 Columns) */}
      <div className="unified-segmented-box bus-unified-box">
        {/* 1. FROM City */}
        <div className="search-cell-block cell-from" ref={fromRef}>
          <div
            className="search-cell-clickable"
            onClick={() => {
              setFromDropdownOpen(!fromDropdownOpen);
              setToDropdownOpen(false);
              setBusTypeDropdownOpen(false);
              setSeatsDropdownOpen(false);
            }}
            tabIndex={0}
            role="button"
          >
            <div className="search-cell-label-row">
              <span className="search-cell-label">From City</span>
            </div>
            <h3 className="search-cell-main">{fromCity}</h3>
            <p className="search-cell-sub">Boarding points & highway stops</p>
          </div>

          {/* Floating Swap Button */}
          <button
            type="button"
            className="segmented-swap-btn"
            onClick={handleSwap}
            title="Swap origin and destination cities"
            aria-label="Swap from and to cities"
          >
            <ArrowLeftRight size={13} />
          </button>

          {fromDropdownOpen && (
            <div className="airport-dropdown">
              <input
                type="text"
                placeholder="Search boarding city..."
                className="dropdown-search-input"
                autoFocus
                value={fromQuery}
                onChange={(e) => setFromQuery(e.target.value)}
                aria-label="Search origin city"
              />
              <div className="airport-list">
                {filteredFromCities.map((city) => (
                  <div
                    key={city}
                    className={`airport-item ${city === fromCity ? 'selected' : ''}`}
                    onClick={() => {
                      setFromCity(city);
                      setFromDropdownOpen(false);
                    }}
                  >
                    <MapPin size={15} />
                    <strong>{city}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2. TO City */}
        <div className="search-cell-block cell-to" ref={toRef}>
          <div
            className="search-cell-clickable"
            onClick={() => {
              setToDropdownOpen(!toDropdownOpen);
              setFromDropdownOpen(false);
              setBusTypeDropdownOpen(false);
              setSeatsDropdownOpen(false);
            }}
            tabIndex={0}
            role="button"
          >
            <div className="search-cell-label-row">
              <span className="search-cell-label">To City</span>
            </div>
            <h3 className="search-cell-main">{toCity}</h3>
            <p className="search-cell-sub">Destination dropoff points</p>
          </div>

          {toDropdownOpen && (
            <div className="airport-dropdown">
              <input
                type="text"
                placeholder="Search destination city..."
                className="dropdown-search-input"
                autoFocus
                value={toQuery}
                onChange={(e) => setToQuery(e.target.value)}
                aria-label="Search destination city"
              />
              <div className="airport-list">
                {filteredToCities.map((city) => (
                  <div
                    key={city}
                    className={`airport-item ${city === toCity ? 'selected' : ''}`}
                    onClick={() => {
                      setToCity(city);
                      setToDropdownOpen(false);
                    }}
                  >
                    <MapPin size={15} />
                    <strong>{city}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3. JOURNEY DATE */}
        <div className="search-cell-block cell-departure date-cell-block">
          <div className="search-cell-clickable">
            <div className="search-cell-label-row">
              <span className="search-cell-label">Journey Date</span>
              <ChevronDown size={13} className="cell-chevron text-blue-500" />
            </div>
            <div className="search-cell-main date-headline">
              <span className="date-number">{journeyDateObj.day}</span>
              <span className="date-month-year">{journeyDateObj.monthYear}</span>
            </div>
            <p className="search-cell-sub">{journeyDateObj.weekday}</p>
          </div>
          <input
            id="bus-dep-date"
            type="date"
            min={today}
            className="custom-date-overlay-input"
            value={journeyDate}
            onChange={(e) => setJourneyDate(e.target.value)}
            aria-label="Journey Date"
          />
        </div>

        {/* 4. BUS TYPE */}
        <div className="search-cell-block cell-class" ref={busTypeRef}>
          <div
            className="search-cell-clickable"
            onClick={() => {
              setBusTypeDropdownOpen(!busTypeDropdownOpen);
              setFromDropdownOpen(false);
              setToDropdownOpen(false);
              setSeatsDropdownOpen(false);
            }}
            tabIndex={0}
            role="button"
          >
            <div className="search-cell-label-row">
              <span className="search-cell-label">Bus Type</span>
              <ChevronDown size={13} className="cell-chevron text-blue-500" />
            </div>
            <h3 className="search-cell-main search-cell-cabin">
              {currentBusTypeObj.shortName}
            </h3>
            <p className="search-cell-sub">{currentBusTypeObj.desc}</p>
          </div>

          {busTypeDropdownOpen && (
            <div className="traveller-popup modern-class-dropdown" style={{ minWidth: '240px' }}>
              <div className="popup-section class-section">
                <strong>Select Bus Category</strong>
                <div className="class-pills-list mt-2">
                  {BUS_TYPES.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      className={`class-option-btn ${busType === item.code ? 'active' : ''}`}
                      onClick={() => {
                        setBusType(item.code);
                        setBusTypeDropdownOpen(false);
                      }}
                    >
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 5. PASSENGERS & SEATS */}
        <div className="search-cell-block cell-travellers" ref={seatsRef}>
          <div
            className="search-cell-clickable"
            onClick={() => {
              setSeatsDropdownOpen(!seatsDropdownOpen);
              setFromDropdownOpen(false);
              setToDropdownOpen(false);
              setBusTypeDropdownOpen(false);
            }}
            tabIndex={0}
            role="button"
          >
            <div className="search-cell-label-row">
              <span className="search-cell-label">Seats</span>
              <ChevronDown size={13} className="cell-chevron text-blue-500" />
            </div>
            <h3 className="search-cell-main">{seats}</h3>
            <p className="search-cell-sub">{seats === 1 ? '1 Seat reserved' : `${seats} Seats reserved`}</p>
          </div>

          {seatsDropdownOpen && (
            <div className="traveller-popup modern-traveller-dropdown">
              <div className="popup-section">
                <div className="counter-row">
                  <div>
                    <strong>Passengers / Seats</strong>
                    <small>Max 6 per booking</small>
                  </div>
                  <div className="counter-controls">
                    <button
                      type="button"
                      disabled={seats <= 1}
                      onClick={() => setSeats(seats - 1)}
                      aria-label="Decrease seats"
                    >
                      -
                    </button>
                    <span>{seats}</span>
                    <button
                      type="button"
                      disabled={seats >= 6}
                      onClick={() => setSeats(seats + 1)}
                      aria-label="Increase seats"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Select Bus Preference Row */}
      <div className="modern-special-fares-row">
        <div className="special-fare-heading-col">
          <span className="special-fare-lead">Select a</span>
          <strong className="special-fare-strong">bus deal</strong>
        </div>

        <div className="modern-fare-cards-grid">
          {[
            { id: 'regular', title: 'Regular', subtitle: 'Standard bus fares' },
            { id: 'primo', title: 'Primo Certified', badge: 'top rated', subtitle: '4.5+ star verified GPS' },
            { id: 'sleeper', title: 'AC Sleeper', subtitle: 'Single & double berths' },
            { id: 'electric', title: 'EV Green Bus', badge: 'eco', subtitle: 'Zero noise & eco friendly' },
            { id: 'women', title: 'Women Exclusive', subtitle: 'Single lady seat safety' },
            { id: 'return_pass', title: 'Round Trip Saver', subtitle: 'Extra 15% return off' }
          ].map((fare) => (
            <div
              key={fare.id}
              className={`modern-fare-card ${specialPreference === fare.id ? 'active' : ''}`}
              onClick={() => {
                setSpecialPreference(fare.id);
                if (fare.id === 'sleeper') setBusType('SLEEPER');
                else if (fare.id === 'electric') setBusType('ELECTRIC');
              }}
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

      {/* Bus Delay Assurance Strip */}
      <div className="price-drop-status-row">
        <label className="price-drop-checkbox-box">
          <input
            type="checkbox"
            checked={delayAssurance}
            onChange={(e) => setDelayAssurance(e.target.checked)}
          />
          <div className="price-drop-text-block">
            <strong>Add Bus On-Time & Delay Assurance</strong>
            <span>Get ₹150 instant refund if bus departure is delayed over 30 mins.</span>
            <a href="#view-details" onClick={(e) => e.preventDefault()} className="price-drop-link">View Details</a>
          </div>
          <div className="price-drop-icon-shield" title="On-Time Guarantee">
            <span className="shield-symbol">₹</span>
          </div>
        </label>

        <button
          type="button"
          className="flight-status-cta-pill"
          onClick={() => navigate('/buses')}
        >
          <span className="ticket-icon">📍</span>
          <span>Live Bus Tracker</span>
        </button>
      </div>

      {/* Floating SEARCH Button */}
      <div className="search-action-wrap-floating">
        <button
          type="button"
          className="search-submit-hero-btn modern-floating-btn"
          onClick={handleSearchSubmit}
        >
          SEARCH BUSES
        </button>
      </div>
    </div>
  );
}
