import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { hotelCities } from '../../data/hotelData';
import { Building2, ChevronDown, Check, MapPin, ShieldCheck, Star } from 'lucide-react';
import { formatDateDisplay } from './FlightSearchWidget';

const PROPERTY_TYPES = [
  { code: 'ALL', label: 'All Property Types', shortName: 'All Stays', desc: 'Hotels, Resorts & Villas' },
  { code: 'HOTEL', label: 'Hotels & Suites', shortName: 'Hotels', desc: 'City center & boutique' },
  { code: 'RESORT', label: 'Luxury Resorts', shortName: 'Resorts', desc: 'Beachfront & pool retreats' },
  { code: 'VILLA', label: 'Private Villas & Homestays', shortName: 'Villas', desc: 'Full property privacy' },
  { code: '5STAR', label: '5-Star Luxury Palace', shortName: '5-Star Stay', desc: 'Premium palace service' }
];

export default function HotelSearchWidget({ initialValues = {}, onSearch }) {
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];
  const [stayCategoryTab, setStayCategoryTab] = useState('hotels'); // hotels | homestays | luxury | hourly
  const [city, setCity] = useState(initialValues.city || 'Goa');
  const [checkInDate, setCheckInDate] = useState(initialValues.checkInDate || '2026-10-05');
  const [checkOutDate, setCheckOutDate] = useState(initialValues.checkOutDate || '2026-10-08');
  const [rooms, setRooms] = useState(initialValues.rooms || 1);
  const [adults, setAdults] = useState(initialValues.adults || 2);
  const [children, setChildren] = useState(initialValues.children || 0);
  const [propertyType, setPropertyType] = useState('ALL');
  const [stayDeal, setStayDeal] = useState('standard');
  const [checkInGuarantee, setCheckInGuarantee] = useState(false);

  // Dropdowns & Popups
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [guestDropdownOpen, setGuestDropdownOpen] = useState(false);
  const [propertyDropdownOpen, setPropertyDropdownOpen] = useState(false);

  const [cityQuery, setCityQuery] = useState('');

  const cityRef = useRef(null);
  const guestRef = useRef(null);
  const propertyRef = useRef(null);

  const checkInDateObj = formatDateDisplay(checkInDate);
  const checkOutDateObj = formatDateDisplay(checkOutDate);

  useEffect(() => {
    function handleClickOutside(e) {
      if (cityRef.current && !cityRef.current.contains(e.target)) {
        setCityDropdownOpen(false);
      }
      if (guestRef.current && !guestRef.current.contains(e.target)) {
        setGuestDropdownOpen(false);
      }
      if (propertyRef.current && !propertyRef.current.contains(e.target)) {
        setPropertyDropdownOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setCityDropdownOpen(false);
        setGuestDropdownOpen(false);
        setPropertyDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Ensure checkout is after checkin
  useEffect(() => {
    if (checkOutDate <= checkInDate) {
      const nextDay = new Date(checkInDate);
      nextDay.setDate(nextDay.getDate() + 1);
      setCheckOutDate(nextDay.toISOString().split('T')[0]);
    }
  }, [checkInDate, checkOutDate]);

  const filteredCities = hotelCities.filter((c) =>
    c.toLowerCase().includes(cityQuery.toLowerCase())
  );

  const currentPropertyObj = PROPERTY_TYPES.find((p) => p.code === propertyType) || PROPERTY_TYPES[0];

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const searchParams = {
      city,
      checkInDate,
      checkOutDate,
      rooms,
      adults,
      children,
      propertyType,
      stayDeal,
      checkInGuarantee
    };

    if (onSearch) {
      onSearch(searchParams);
    } else {
      navigate('/hotel-booking', { state: searchParams });
    }
  };

  return (
    <div className="search-widget-box hotel-widget modern-ss-widget">
      {/* Top Options Bar */}
      <div className="search-top-bar modern-ss-topbar">
        <div className="trip-radio-group modern-radio-group">
          <label className={`radio-dot-option ${stayCategoryTab === 'hotels' ? 'active' : ''}`}>
            <input
              type="radio"
              name="stayCategoryTab"
              checked={stayCategoryTab === 'hotels'}
              onChange={() => setStayCategoryTab('hotels')}
            />
            <span className="custom-radio-dot" />
            <span className="radio-label-text">Hotels & Resorts</span>
          </label>
          <label className={`radio-dot-option ${stayCategoryTab === 'homestays' ? 'active' : ''}`}>
            <input
              type="radio"
              name="stayCategoryTab"
              checked={stayCategoryTab === 'homestays'}
              onChange={() => {
                setStayCategoryTab('homestays');
                setPropertyType('VILLA');
              }}
            />
            <span className="custom-radio-dot" />
            <span className="radio-label-text">Homestays & Villas</span>
          </label>
          <label className={`radio-dot-option ${stayCategoryTab === 'luxury' ? 'active' : ''}`}>
            <input
              type="radio"
              name="stayCategoryTab"
              checked={stayCategoryTab === 'luxury'}
              onChange={() => {
                setStayCategoryTab('luxury');
                setPropertyType('5STAR');
              }}
            />
            <span className="custom-radio-dot" />
            <span className="radio-label-text">Luxury 5-Star Palaces</span>
          </label>
        </div>

        <div className="top-info-banner-right">
          <span className="top-info-text">100% Verified Properties</span>
          <div className="flight-cab-highlight-badge">
            <span className="highlight-lead">Couple & Family Friendly :</span>
            <span className="highlight-sub">Local IDs Accepted</span>
            <span className="badge-new-pill">NEW</span>
          </div>
        </div>
      </div>

      {/* Main Unified Segmented Input Grid (5 Columns) */}
      <div className="unified-segmented-box hotel-unified-box">
        {/* 1. CITY / DESTINATION */}
        <div className="search-cell-block cell-city" ref={cityRef}>
          <div
            className="search-cell-clickable"
            onClick={() => {
              setCityDropdownOpen(!cityDropdownOpen);
              setGuestDropdownOpen(false);
              setPropertyDropdownOpen(false);
            }}
            tabIndex={0}
            role="button"
          >
            <div className="search-cell-label-row">
              <span className="search-cell-label">City / Destination / Hotel</span>
            </div>
            <h3 className="search-cell-main">{city}</h3>
            <p className="search-cell-sub">India • Top tourist destinations</p>
          </div>

          {cityDropdownOpen && (
            <div className="airport-dropdown">
              <input
                type="text"
                placeholder="Search city, locality, landmark or hotel..."
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

        {/* 2. CHECK-IN DATE */}
        <div className="search-cell-block cell-departure date-cell-block">
          <div className="search-cell-clickable">
            <div className="search-cell-label-row">
              <span className="search-cell-label">Check-In</span>
              <ChevronDown size={13} className="cell-chevron text-blue-500" />
            </div>
            <div className="search-cell-main date-headline">
              <span className="date-number">{checkInDateObj.day}</span>
              <span className="date-month-year">{checkInDateObj.monthYear}</span>
            </div>
            <p className="search-cell-sub">{checkInDateObj.weekday}</p>
          </div>
          <input
            id="hotel-checkin-date"
            type="date"
            min={today}
            className="custom-date-overlay-input"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            aria-label="Check-in Date"
          />
        </div>

        {/* 3. CHECK-OUT DATE */}
        <div className="search-cell-block cell-return date-cell-block">
          <div className="search-cell-clickable">
            <div className="search-cell-label-row">
              <span className="search-cell-label">Check-Out</span>
              <ChevronDown size={13} className="cell-chevron text-blue-500" />
            </div>
            <div className="search-cell-main date-headline">
              <span className="date-number">{checkOutDateObj.day}</span>
              <span className="date-month-year">{checkOutDateObj.monthYear}</span>
            </div>
            <p className="search-cell-sub">{checkOutDateObj.weekday}</p>
          </div>
          <input
            id="hotel-checkout-date"
            type="date"
            min={checkInDate || today}
            className="custom-date-overlay-input"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            aria-label="Check-out Date"
          />
        </div>

        {/* 4. ROOMS & GUESTS */}
        <div className="search-cell-block cell-travellers" ref={guestRef}>
          <div
            className="search-cell-clickable"
            onClick={() => {
              setGuestDropdownOpen(!guestDropdownOpen);
              setCityDropdownOpen(false);
              setPropertyDropdownOpen(false);
            }}
            tabIndex={0}
            role="button"
          >
            <div className="search-cell-label-row">
              <span className="search-cell-label">Rooms & Guests</span>
              <ChevronDown size={13} className="cell-chevron text-blue-500" />
            </div>
            <h3 className="search-cell-main">{rooms}R, {adults + children}G</h3>
            <p className="search-cell-sub">
              {rooms} Room, {adults} Adults{children ? `, ${children} Ch` : ''}
            </p>
          </div>

          {guestDropdownOpen && (
            <div className="traveller-popup modern-traveller-dropdown">
              <div className="popup-section">
                <div className="counter-row">
                  <div>
                    <strong>Rooms</strong>
                    <small>Max 5 rooms</small>
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
            </div>
          )}
        </div>

        {/* 5. PROPERTY TYPE / STAR RATING */}
        <div className="search-cell-block cell-class" ref={propertyRef}>
          <div
            className="search-cell-clickable"
            onClick={() => {
              setPropertyDropdownOpen(!propertyDropdownOpen);
              setCityDropdownOpen(false);
              setGuestDropdownOpen(false);
            }}
            tabIndex={0}
            role="button"
          >
            <div className="search-cell-label-row">
              <span className="search-cell-label">Property Type</span>
              <ChevronDown size={13} className="cell-chevron text-blue-500" />
            </div>
            <h3 className="search-cell-main search-cell-cabin">
              {currentPropertyObj.shortName}
            </h3>
            <p className="search-cell-sub">{currentPropertyObj.desc}</p>
          </div>

          {propertyDropdownOpen && (
            <div className="traveller-popup modern-class-dropdown" style={{ minWidth: '240px' }}>
              <div className="popup-section class-section">
                <strong>Select Property Category</strong>
                <div className="class-pills-list mt-2">
                  {PROPERTY_TYPES.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      className={`class-option-btn ${propertyType === item.code ? 'active' : ''}`}
                      onClick={() => {
                        setPropertyType(item.code);
                        setPropertyDropdownOpen(false);
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
      </div>

      {/* Select Stay Deal / Preference Row */}
      <div className="modern-special-fares-row">
        <div className="special-fare-heading-col">
          <span className="special-fare-lead">Select a</span>
          <strong className="special-fare-strong">stay deal</strong>
        </div>

        <div className="modern-fare-cards-grid">
          {[
            { id: 'standard', title: 'Best Rate', subtitle: 'Standard hotel rates' },
            { id: 'breakfast', title: 'Free Breakfast', badge: 'popular', subtitle: 'Complimentary morning buffet' },
            { id: 'couple', title: 'Couple Friendly', subtitle: 'Local IDs accepted & safe' },
            { id: 'pool_beach', title: 'Beach & Pool', subtitle: 'Sea facing infinity pool' },
            { id: 'business', title: 'Business Travel', badge: 'gst invoice', subtitle: 'Express check-in & Wi-Fi' },
            { id: 'villa_private', title: 'Private Villa', subtitle: 'Exclusive luxury villa' }
          ].map((fare) => (
            <div
              key={fare.id}
              className={`modern-fare-card ${stayDeal === fare.id ? 'active' : ''}`}
              onClick={() => {
                setStayDeal(fare.id);
                if (fare.id === 'villa_private') setPropertyType('VILLA');
                else if (fare.id === 'pool_beach') setPropertyType('RESORT');
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

      {/* Guaranteed Check-in Protection Strip */}
      <div className="price-drop-status-row">
        <label className="price-drop-checkbox-box">
          <input
            type="checkbox"
            checked={checkInGuarantee}
            onChange={(e) => setCheckInGuarantee(e.target.checked)}
          />
          <div className="price-drop-text-block">
            <strong>Add Guaranteed Check-in (2x Refund Shield)</strong>
            <span>Zero front desk rejection guarantee or get double refund instantly.</span>
            <a href="#view-details" onClick={(e) => e.preventDefault()} className="price-drop-link">View Details</a>
          </div>
          <div className="price-drop-icon-shield" title="Guaranteed Check-in Active">
            <span className="shield-symbol">₹</span>
          </div>
        </label>

        <button
          type="button"
          className="flight-status-cta-pill"
          onClick={() => navigate('/hotels')}
        >
          <span className="ticket-icon">🛎️</span>
          <span>Last-Minute Hotel Deals</span>
        </button>
      </div>

      {/* Floating SEARCH Button */}
      <div className="search-action-wrap-floating">
        <button
          type="button"
          className="search-submit-hero-btn modern-floating-btn"
          onClick={handleSearchSubmit}
        >
          SEARCH HOTELS
        </button>
      </div>
    </div>
  );
}
