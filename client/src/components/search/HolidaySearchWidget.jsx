import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { holidayDestinations, holidayThemes } from '../../data/holidayData';
import { Palmtree, ChevronDown, Check, MapPin, ShieldCheck, Compass, Sparkles } from 'lucide-react';

const DEPARTURE_CITIES = [
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

const MONTHS = [
  'October 2026',
  'November 2026',
  'December 2026',
  'January 2027',
  'February 2027',
  'March 2027',
  'April 2027',
  'May 2027'
];

export default function HolidaySearchWidget({ initialValues = {}, onSearch }) {
  const navigate = useNavigate();

  const [holidayCategoryTab, setHolidayCategoryTab] = useState('all'); // all | domestic | international | honeymoon
  const [destination, setDestination] = useState(initialValues.destination || 'Goa');
  const [departureCity, setDepartureCity] = useState(initialValues.fromCity || 'Mumbai');
  const [travelMonth, setTravelMonth] = useState(initialValues.month || 'October 2026');
  const [selectedTheme, setSelectedTheme] = useState(initialValues.theme || 'All Themes');
  const [travellers, setTravellers] = useState(2);
  const [packageDeal, setPackageDeal] = useState('all_inclusive');
  const [customizableShield, setCustomizableShield] = useState(false);

  // Dropdowns & Popups
  const [destDropdownOpen, setDestDropdownOpen] = useState(false);
  const [fromCityDropdownOpen, setFromCityDropdownOpen] = useState(false);
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [travellerDropdownOpen, setTravellerDropdownOpen] = useState(false);

  const [destQuery, setDestQuery] = useState('');

  const destRef = useRef(null);
  const fromCityRef = useRef(null);
  const monthRef = useRef(null);
  const themeRef = useRef(null);
  const travellerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (destRef.current && !destRef.current.contains(e.target)) {
        setDestDropdownOpen(false);
      }
      if (fromCityRef.current && !fromCityRef.current.contains(e.target)) {
        setFromCityDropdownOpen(false);
      }
      if (monthRef.current && !monthRef.current.contains(e.target)) {
        setMonthDropdownOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(e.target)) {
        setThemeDropdownOpen(false);
      }
      if (travellerRef.current && !travellerRef.current.contains(e.target)) {
        setTravellerDropdownOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setDestDropdownOpen(false);
        setFromCityDropdownOpen(false);
        setMonthDropdownOpen(false);
        setThemeDropdownOpen(false);
        setTravellerDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
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
      theme: selectedTheme,
      travellers,
      packageDeal,
      customizableShield
    };

    if (onSearch) {
      onSearch(searchParams);
    } else {
      navigate('/holiday-booking', { state: searchParams });
    }
  };

  return (
    <div className="search-widget-box holiday-widget modern-ss-widget">
      {/* Top Options Bar */}
      <div className="search-top-bar modern-ss-topbar">
        <div className="trip-radio-group modern-radio-group">
          <label className={`radio-dot-option ${holidayCategoryTab === 'all' ? 'active' : ''}`}>
            <input
              type="radio"
              name="holidayCategoryTab"
              checked={holidayCategoryTab === 'all'}
              onChange={() => setHolidayCategoryTab('all')}
            />
            <span className="custom-radio-dot" />
            <span className="radio-label-text">All Tour Packages</span>
          </label>
          <label className={`radio-dot-option ${holidayCategoryTab === 'domestic' ? 'active' : ''}`}>
            <input
              type="radio"
              name="holidayCategoryTab"
              checked={holidayCategoryTab === 'domestic'}
              onChange={() => setHolidayCategoryTab('domestic')}
            />
            <span className="custom-radio-dot" />
            <span className="radio-label-text">Domestic Wonders</span>
          </label>
          <label className={`radio-dot-option ${holidayCategoryTab === 'international' ? 'active' : ''}`}>
            <input
              type="radio"
              name="holidayCategoryTab"
              checked={holidayCategoryTab === 'international'}
              onChange={() => setHolidayCategoryTab('international')}
            />
            <span className="custom-radio-dot" />
            <span className="radio-label-text">International Escapes</span>
          </label>
        </div>

        <div className="top-info-banner-right">
          <span className="top-info-text">Handcrafted Travel Itineraries</span>
          <div className="flight-cab-highlight-badge">
            <span className="highlight-lead">Flights & Hotels Included :</span>
            <span className="highlight-sub">Private Cab & Sightseeing</span>
            <span className="badge-new-pill">BEST VALUE</span>
          </div>
        </div>
      </div>

      {/* Main Unified Segmented Input Grid (5 Columns) */}
      <div className="unified-segmented-box holiday-unified-box">
        {/* 1. DESTINATION / PACKAGE */}
        <div className="search-cell-block cell-city" ref={destRef}>
          <div
            className="search-cell-clickable"
            onClick={() => {
              setDestDropdownOpen(!destDropdownOpen);
              setFromCityDropdownOpen(false);
              setMonthDropdownOpen(false);
              setThemeDropdownOpen(false);
              setTravellerDropdownOpen(false);
            }}
            tabIndex={0}
            role="button"
          >
            <div className="search-cell-label-row">
              <span className="search-cell-label">Destination / Package</span>
            </div>
            <h3 className="search-cell-main">{destination}</h3>
            <p className="search-cell-sub">Top handpicked vacation packages</p>
          </div>

          {destDropdownOpen && (
            <div className="airport-dropdown holiday-dropdown">
              <input
                type="text"
                placeholder="Search destination (Goa, Kashmir, Dubai, Bali, Kerala)..."
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

        {/* 2. STARTING FROM */}
        <div className="search-cell-block cell-from" ref={fromCityRef}>
          <div
            className="search-cell-clickable"
            onClick={() => {
              setFromCityDropdownOpen(!fromCityDropdownOpen);
              setDestDropdownOpen(false);
              setMonthDropdownOpen(false);
              setThemeDropdownOpen(false);
              setTravellerDropdownOpen(false);
            }}
            tabIndex={0}
            role="button"
          >
            <div className="search-cell-label-row">
              <span className="search-cell-label">Starting From</span>
              <ChevronDown size={13} className="cell-chevron text-blue-500" />
            </div>
            <h3 className="search-cell-main">{departureCity}</h3>
            <p className="search-cell-sub">Direct flights & transfers included</p>
          </div>

          {fromCityDropdownOpen && (
            <div className="traveller-popup modern-class-dropdown" style={{ minWidth: '220px' }}>
              <div className="popup-section class-section">
                <strong>Select Departure City</strong>
                <div className="class-pills-list mt-2">
                  {DEPARTURE_CITIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`class-option-btn ${departureCity === c ? 'active' : ''}`}
                      onClick={() => {
                        setDepartureCity(c);
                        setFromCityDropdownOpen(false);
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

        {/* 3. TRAVEL MONTH */}
        <div className="search-cell-block cell-departure" ref={monthRef}>
          <div
            className="search-cell-clickable"
            onClick={() => {
              setMonthDropdownOpen(!monthDropdownOpen);
              setDestDropdownOpen(false);
              setFromCityDropdownOpen(false);
              setThemeDropdownOpen(false);
              setTravellerDropdownOpen(false);
            }}
            tabIndex={0}
            role="button"
          >
            <div className="search-cell-label-row">
              <span className="search-cell-label">Travel Month</span>
              <ChevronDown size={13} className="cell-chevron text-blue-500" />
            </div>
            <div className="search-cell-main date-headline">
              <span className="date-number">{travelMonth.split(' ')[0].slice(0, 3)}</span>
              <span className="date-month-year">'{travelMonth.split(' ')[1]?.slice(-2) || '26'}</span>
            </div>
            <p className="search-cell-sub">Best seasonal weather</p>
          </div>

          {monthDropdownOpen && (
            <div className="traveller-popup modern-class-dropdown" style={{ minWidth: '220px' }}>
              <div className="popup-section class-section">
                <strong>Select Travel Month</strong>
                <div className="class-pills-list mt-2">
                  {MONTHS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      className={`class-option-btn ${travelMonth === m ? 'active' : ''}`}
                      onClick={() => {
                        setTravelMonth(m);
                        setMonthDropdownOpen(false);
                      }}
                    >
                      <span>{m}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. PACKAGE THEME */}
        <div className="search-cell-block cell-class" ref={themeRef}>
          <div
            className="search-cell-clickable"
            onClick={() => {
              setThemeDropdownOpen(!themeDropdownOpen);
              setDestDropdownOpen(false);
              setFromCityDropdownOpen(false);
              setMonthDropdownOpen(false);
              setTravellerDropdownOpen(false);
            }}
            tabIndex={0}
            role="button"
          >
            <div className="search-cell-label-row">
              <span className="search-cell-label">Tour Theme</span>
              <ChevronDown size={13} className="cell-chevron text-blue-500" />
            </div>
            <h3 className="search-cell-main search-cell-cabin">
              {selectedTheme}
            </h3>
            <p className="search-cell-sub">Explore custom holiday types</p>
          </div>

          {themeDropdownOpen && (
            <div className="traveller-popup modern-class-dropdown" style={{ minWidth: '240px' }}>
              <div className="popup-section class-section">
                <strong>Select Package Theme</strong>
                <div className="class-pills-list mt-2">
                  {holidayThemes.map((th) => (
                    <button
                      key={th}
                      type="button"
                      className={`class-option-btn ${selectedTheme === th ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedTheme(th);
                        setThemeDropdownOpen(false);
                      }}
                    >
                      <span>{th}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 5. TRAVELLERS */}
        <div className="search-cell-block cell-travellers" ref={travellerRef}>
          <div
            className="search-cell-clickable"
            onClick={() => {
              setTravellerDropdownOpen(!travellerDropdownOpen);
              setDestDropdownOpen(false);
              setFromCityDropdownOpen(false);
              setMonthDropdownOpen(false);
              setThemeDropdownOpen(false);
            }}
            tabIndex={0}
            role="button"
          >
            <div className="search-cell-label-row">
              <span className="search-cell-label">Travellers</span>
              <ChevronDown size={13} className="cell-chevron text-blue-500" />
            </div>
            <h3 className="search-cell-main">{travellers}</h3>
            <p className="search-cell-sub">{travellers === 1 ? 'Solo Traveller' : `${travellers} Travellers (4N/5D)`}</p>
          </div>

          {travellerDropdownOpen && (
            <div className="traveller-popup modern-traveller-dropdown">
              <div className="popup-section">
                <div className="counter-row">
                  <div>
                    <strong>Total Travellers</strong>
                    <small>Adults & Children</small>
                  </div>
                  <div className="counter-controls">
                    <button
                      type="button"
                      disabled={travellers <= 1}
                      onClick={() => setTravellers(travellers - 1)}
                      aria-label="Decrease travellers"
                    >
                      -
                    </button>
                    <span>{travellers}</span>
                    <button
                      type="button"
                      disabled={travellers >= 12}
                      onClick={() => setTravellers(travellers + 1)}
                      aria-label="Increase travellers"
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

      {/* Select Holiday Package Deal / Special Row */}
      <div className="modern-special-fares-row">
        <div className="special-fare-heading-col">
          <span className="special-fare-lead">Select a</span>
          <strong className="special-fare-strong">tour deal</strong>
        </div>

        <div className="modern-fare-cards-grid">
          {[
            { id: 'all_inclusive', title: 'All-Inclusive', subtitle: 'Flights, stay & tours' },
            { id: 'honeymoon', title: 'Honeymoon Special', badge: 'exclusive', subtitle: 'Candlelight dinner & cake' },
            { id: 'family', title: 'Family Vacation', subtitle: 'Kid-friendly activities' },
            { id: 'adventure', title: 'Adventure & Trek', subtitle: 'Camping & river rafting' },
            { id: 'luxury', title: 'Luxury Resorts', subtitle: '5-star premium villas' },
            { id: 'budget', title: 'Budget Escape', subtitle: 'Under ₹15,000 / person' }
          ].map((fare) => (
            <div
              key={fare.id}
              className={`modern-fare-card ${packageDeal === fare.id ? 'active' : ''}`}
              onClick={() => {
                setPackageDeal(fare.id);
                if (fare.id === 'honeymoon') setSelectedTheme('Honeymoon & Romantic');
                else if (fare.id === 'adventure') setSelectedTheme('Adventure & Trekking');
                else if (fare.id === 'family') setSelectedTheme('Family Holidays');
                else if (fare.id === 'luxury') setSelectedTheme('Luxury & Wellness');
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

      {/* Customizable Itinerary Protection Strip */}
      <div className="price-drop-status-row">
        <label className="price-drop-checkbox-box">
          <input
            type="checkbox"
            checked={customizableShield}
            onChange={(e) => setCustomizableShield(e.target.checked)}
          />
          <div className="price-drop-text-block">
            <strong>Add 100% Customizable Itinerary Option</strong>
            <span>Freely adjust days, choose hotel upgrades, or add private cabs anytime.</span>
            <a href="#view-details" onClick={(e) => e.preventDefault()} className="price-drop-link">View Details</a>
          </div>
          <div className="price-drop-icon-shield" title="Customization Guaranteed">
            <span className="shield-symbol">₹</span>
          </div>
        </label>

        <button
          type="button"
          className="flight-status-cta-pill"
          onClick={() => navigate('/holidays')}
        >
          <span className="ticket-icon">📞</span>
          <span>Tour Expert Callback</span>
        </button>
      </div>

      {/* Floating SEARCH Button */}
      <div className="search-action-wrap-floating">
        <button
          type="button"
          className="search-submit-hero-btn modern-floating-btn"
          onClick={handleSearchSubmit}
        >
          EXPLORE HOLIDAYS
        </button>
      </div>
    </div>
  );
}
