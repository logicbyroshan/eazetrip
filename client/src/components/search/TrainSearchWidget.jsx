import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { railwayStations } from '../../data/trainData';
import { Train, ArrowLeftRight, ChevronDown, Check, ShieldCheck, Ticket } from 'lucide-react';
import { formatDateDisplay } from './FlightSearchWidget';

const QUOTA_OPTIONS = [
  { code: 'GN', label: 'General Quota (GN)', desc: 'Standard general quota' },
  { code: 'TQ', label: 'Tatkal Quota (TQ)', desc: 'Last-minute quota' },
  { code: 'LD', label: 'Ladies Quota (LD)', desc: 'Reserved women coach' },
  { code: 'SS', label: 'Senior Citizen (SS)', desc: 'Lower berth preference' },
  { code: 'HP', label: 'Divyangjan (HP)', desc: 'Physically challenged concession' },
  { code: 'DP', label: 'Duty Pass (DP)', desc: 'Railway staff duty pass' }
];

const CLASS_OPTIONS = [
  { code: 'ALL', label: 'All Classes', shortName: 'All Classes', desc: 'Any available coach' },
  { code: '1A', label: 'AC First Class (1A)', shortName: 'AC First (1A)', desc: 'Executive luxury coupe' },
  { code: '2A', label: 'AC 2 Tier (2A)', shortName: 'AC 2 Tier (2A)', desc: '2-tier air conditioned' },
  { code: '3A', label: 'AC 3 Tier (3A)', shortName: 'AC 3 Tier (3A)', desc: 'Best value AC coach' },
  { code: '3E', label: 'AC 3 Economy (3E)', shortName: 'AC 3 Econ (3E)', desc: 'Budget AC comfort' },
  { code: 'SL', label: 'Sleeper Class (SL)', shortName: 'Sleeper (SL)', desc: 'Non-AC sleeper berth' },
  { code: 'CC', label: 'AC Chair Car (CC)', shortName: 'Chair Car (CC)', desc: 'Executive chair seating' }
];

export default function TrainSearchWidget({ initialValues = {}, onSearch }) {
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];
  const [trainServiceMode, setTrainServiceMode] = useState('tickets'); // tickets | pnr | live
  const [fromStation, setFromStation] = useState(initialValues.from || 'NDLS');
  const [toStation, setToStation] = useState(initialValues.to || 'BCT');
  const [travelDate, setTravelDate] = useState(initialValues.travelDate || '2026-10-02');
  const [travelClass, setTravelClass] = useState(initialValues.travelClass || 'ALL');
  const [quota, setQuota] = useState(initialValues.quota || 'GN');
  const [specialConcession, setSpecialConcession] = useState('general');
  const [freeCancellation, setFreeCancellation] = useState(false);

  // Dropdown Open States
  const [fromDropdownOpen, setFromDropdownOpen] = useState(false);
  const [toDropdownOpen, setToDropdownOpen] = useState(false);
  const [quotaDropdownOpen, setQuotaDropdownOpen] = useState(false);
  const [classDropdownOpen, setClassDropdownOpen] = useState(false);

  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');

  const fromRef = useRef(null);
  const toRef = useRef(null);
  const quotaRef = useRef(null);
  const classRef = useRef(null);

  const travelDateObj = formatDateDisplay(travelDate);

  useEffect(() => {
    function handleClickOutside(e) {
      if (fromRef.current && !fromRef.current.contains(e.target)) {
        setFromDropdownOpen(false);
      }
      if (toRef.current && !toRef.current.contains(e.target)) {
        setToDropdownOpen(false);
      }
      if (quotaRef.current && !quotaRef.current.contains(e.target)) {
        setQuotaDropdownOpen(false);
      }
      if (classRef.current && !classRef.current.contains(e.target)) {
        setClassDropdownOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setFromDropdownOpen(false);
        setToDropdownOpen(false);
        setQuotaDropdownOpen(false);
        setClassDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const getStation = (code) => railwayStations.find((s) => s.code === code) || railwayStations[0];

  const handleSwap = (e) => {
    if (e) e.stopPropagation();
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };

  const fromStationObj = getStation(fromStation);
  const toStationObj = getStation(toStation);

  const filteredFromStations = railwayStations.filter(
    (s) =>
      s.name.toLowerCase().includes(fromQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(fromQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(fromQuery.toLowerCase())
  );

  const filteredToStations = railwayStations.filter(
    (s) =>
      s.name.toLowerCase().includes(toQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(toQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(toQuery.toLowerCase())
  );

  const currentQuotaObj = QUOTA_OPTIONS.find((q) => q.code === quota) || QUOTA_OPTIONS[0];
  const currentClassObj = CLASS_OPTIONS.find((c) => c.code === travelClass) || CLASS_OPTIONS[0];

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const searchParams = {
      from: fromStation,
      to: toStation,
      travelDate,
      travelClass,
      quota,
      specialConcession,
      freeCancellation
    };

    if (onSearch) {
      onSearch(searchParams);
    } else {
      navigate('/railway', { state: searchParams });
    }
  };

  return (
    <div className="search-widget-box train-widget modern-ss-widget">
      {/* Top Options Bar (Matching Screenshots) */}
      <div className="search-top-bar modern-ss-topbar">
        <div className="trip-radio-group modern-radio-group">
          <label className={`radio-dot-option ${trainServiceMode === 'tickets' ? 'active' : ''}`}>
            <input
              type="radio"
              name="trainServiceMode"
              checked={trainServiceMode === 'tickets'}
              onChange={() => setTrainServiceMode('tickets')}
            />
            <span className="custom-radio-dot" />
            <span className="radio-label-text">Book Train Tickets</span>
          </label>
          <label className={`radio-dot-option ${trainServiceMode === 'pnr' ? 'active' : ''}`}>
            <input
              type="radio"
              name="trainServiceMode"
              checked={trainServiceMode === 'pnr'}
              onChange={() => setTrainServiceMode('pnr')}
            />
            <span className="custom-radio-dot" />
            <span className="radio-label-text">Check PNR Status</span>
          </label>
          <label className={`radio-dot-option ${trainServiceMode === 'live' ? 'active' : ''}`}>
            <input
              type="radio"
              name="trainServiceMode"
              checked={trainServiceMode === 'live'}
              onChange={() => setTrainServiceMode('live')}
            />
            <span className="custom-radio-dot" />
            <span className="radio-label-text">Live Train Tracking</span>
          </label>
        </div>

        <div className="top-info-banner-right">
          <span className="top-info-text">IRCTC Authorized Partner</span>
          <div className="flight-cab-highlight-badge">
            <span className="highlight-lead">Zero PG Charges :</span>
            <span className="highlight-sub">Instant Refund on UPI</span>
            <span className="badge-new-pill">OFFER</span>
          </div>
        </div>
      </div>

      {/* Main Unified Connected Segmented Input Grid (5 Columns) */}
      <div className="unified-segmented-box train-unified-box">
        {/* 1. FROM Station */}
        <div className="search-cell-block cell-from" ref={fromRef}>
          <div
            className="search-cell-clickable"
            onClick={() => {
              setFromDropdownOpen(!fromDropdownOpen);
              setToDropdownOpen(false);
              setClassDropdownOpen(false);
              setQuotaDropdownOpen(false);
            }}
            tabIndex={0}
            role="button"
          >
            <div className="search-cell-label-row">
              <span className="search-cell-label">From Station</span>
            </div>
            <h3 className="search-cell-main">{fromStationObj.city}</h3>
            <p className="search-cell-sub">
              [{fromStationObj.code}] {fromStationObj.name.slice(0, 22)}...
            </p>
          </div>

          {/* Floating Swap Button */}
          <button
            type="button"
            className="segmented-swap-btn"
            onClick={handleSwap}
            title="Swap origin and destination stations"
            aria-label="Swap from and to stations"
          >
            <ArrowLeftRight size={13} />
          </button>

          {fromDropdownOpen && (
            <div className="airport-dropdown">
              <input
                type="text"
                placeholder="Search station name or code..."
                className="dropdown-search-input"
                autoFocus
                value={fromQuery}
                onChange={(e) => setFromQuery(e.target.value)}
                aria-label="Search origin station"
              />
              <div className="airport-list">
                {filteredFromStations.map((station) => (
                  <div
                    key={station.code}
                    className={`airport-item ${station.code === fromStation ? 'selected' : ''}`}
                    onClick={() => {
                      setFromStation(station.code);
                      setFromDropdownOpen(false);
                    }}
                  >
                    <Train size={15} />
                    <div className="airport-meta">
                      <strong>{station.city} ({station.code})</strong>
                      <small>{station.name}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2. TO Station */}
        <div className="search-cell-block cell-to" ref={toRef}>
          <div
            className="search-cell-clickable"
            onClick={() => {
              setToDropdownOpen(!toDropdownOpen);
              setFromDropdownOpen(false);
              setClassDropdownOpen(false);
              setQuotaDropdownOpen(false);
            }}
            tabIndex={0}
            role="button"
          >
            <div className="search-cell-label-row">
              <span className="search-cell-label">To Station</span>
            </div>
            <h3 className="search-cell-main">{toStationObj.city}</h3>
            <p className="search-cell-sub">
              [{toStationObj.code}] {toStationObj.name.slice(0, 22)}...
            </p>
          </div>

          {toDropdownOpen && (
            <div className="airport-dropdown">
              <input
                type="text"
                placeholder="Search station name or code..."
                className="dropdown-search-input"
                autoFocus
                value={toQuery}
                onChange={(e) => setToQuery(e.target.value)}
                aria-label="Search destination station"
              />
              <div className="airport-list">
                {filteredToStations.map((station) => (
                  <div
                    key={station.code}
                    className={`airport-item ${station.code === toStation ? 'selected' : ''}`}
                    onClick={() => {
                      setToStation(station.code);
                      setToDropdownOpen(false);
                    }}
                  >
                    <Train size={15} />
                    <div className="airport-meta">
                      <strong>{station.city} ({station.code})</strong>
                      <small>{station.name}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3. TRAVEL DATE */}
        <div className="search-cell-block cell-departure date-cell-block">
          <div className="search-cell-clickable">
            <div className="search-cell-label-row">
              <span className="search-cell-label">Travel Date</span>
              <ChevronDown size={13} className="cell-chevron text-blue-500" />
            </div>
            <div className="search-cell-main date-headline">
              <span className="date-number">{travelDateObj.day}</span>
              <span className="date-month-year">{travelDateObj.monthYear}</span>
            </div>
            <p className="search-cell-sub">{travelDateObj.weekday}</p>
          </div>
          <input
            id="train-dep-date"
            type="date"
            min={today}
            className="custom-date-overlay-input"
            value={travelDate}
            onChange={(e) => setTravelDate(e.target.value)}
            aria-label="Travel Date"
          />
        </div>

        {/* 4. CLASS */}
        <div className="search-cell-block cell-class" ref={classRef}>
          <div
            className="search-cell-clickable"
            onClick={() => {
              setClassDropdownOpen(!classDropdownOpen);
              setFromDropdownOpen(false);
              setToDropdownOpen(false);
              setQuotaDropdownOpen(false);
            }}
            tabIndex={0}
            role="button"
          >
            <div className="search-cell-label-row">
              <span className="search-cell-label">Class</span>
              <ChevronDown size={13} className="cell-chevron text-blue-500" />
            </div>
            <h3 className="search-cell-main search-cell-cabin">
              {currentClassObj.shortName}
            </h3>
            <p className="search-cell-sub">
              {currentClassObj.desc}
            </p>
          </div>

          {classDropdownOpen && (
            <div className="traveller-popup modern-class-dropdown" style={{ minWidth: '240px' }}>
              <div className="popup-section class-section">
                <strong>Select Travel Class</strong>
                <div className="class-pills-list mt-2">
                  {CLASS_OPTIONS.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      className={`class-option-btn ${travelClass === item.code ? 'active' : ''}`}
                      onClick={() => {
                        setTravelClass(item.code);
                        setClassDropdownOpen(false);
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

        {/* 5. QUOTA */}
        <div className="search-cell-block cell-quota" ref={quotaRef}>
          <div
            className="search-cell-clickable"
            onClick={() => {
              setQuotaDropdownOpen(!quotaDropdownOpen);
              setFromDropdownOpen(false);
              setToDropdownOpen(false);
              setClassDropdownOpen(false);
            }}
            tabIndex={0}
            role="button"
          >
            <div className="search-cell-label-row">
              <span className="search-cell-label">Quota</span>
              <ChevronDown size={13} className="cell-chevron text-blue-500" />
            </div>
            <h3 className="search-cell-main search-cell-cabin">
              {currentQuotaObj.code}
            </h3>
            <p className="search-cell-sub">
              {currentQuotaObj.label.split('(')[0]}
            </p>
          </div>

          {quotaDropdownOpen && (
            <div className="traveller-popup modern-class-dropdown" style={{ minWidth: '240px' }}>
              <div className="popup-section class-section">
                <strong>Select Train Quota</strong>
                <div className="class-pills-list mt-2">
                  {QUOTA_OPTIONS.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      className={`class-option-btn ${quota === item.code ? 'active' : ''}`}
                      onClick={() => {
                        setQuota(item.code);
                        setQuotaDropdownOpen(false);
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

      {/* Select a Train Concession / Special Quota Row */}
      <div className="modern-special-fares-row">
        <div className="special-fare-heading-col">
          <span className="special-fare-lead">Select a</span>
          <strong className="special-fare-strong">train quota</strong>
        </div>

        <div className="modern-fare-cards-grid">
          {[
            { id: 'general', title: 'General', subtitle: 'Regular train fares' },
            { id: 'tatkal', title: 'Tatkal (TQ)', badge: 'urgent', subtitle: 'Last minute booking' },
            { id: 'ladies', title: 'Ladies Quota', subtitle: 'Reserved women coach' },
            { id: 'senior', title: 'Senior Citizen', badge: 'lower berth', subtitle: 'Lower berth allocation' },
            { id: 'divyangjan', title: 'Divyangjan', subtitle: 'Concession card quota' },
            { id: 'duty_pass', title: 'Duty Pass', subtitle: 'Railway employee pass' }
          ].map((fare) => (
            <div
              key={fare.id}
              className={`modern-fare-card ${specialConcession === fare.id ? 'active' : ''}`}
              onClick={() => {
                setSpecialConcession(fare.id);
                if (fare.id === 'tatkal') setQuota('TQ');
                else if (fare.id === 'ladies') setQuota('LD');
                else if (fare.id === 'senior') setQuota('SS');
                else if (fare.id === 'divyangjan') setQuota('HP');
                else if (fare.id === 'duty_pass') setQuota('DP');
                else setQuota('GN');
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

      {/* Free Cancellation & Live PNR Strip */}
      <div className="price-drop-status-row">
        <label className="price-drop-checkbox-box">
          <input
            type="checkbox"
            checked={freeCancellation}
            onChange={(e) => setFreeCancellation(e.target.checked)}
          />
          <div className="price-drop-text-block">
            <strong>Add Free Train Cancellation (Zero Charge)</strong>
            <span>100% full refund on cancellation before chart prep.</span>
            <a href="#view-details" onClick={(e) => e.preventDefault()} className="price-drop-link">View Terms</a>
          </div>
          <div className="price-drop-icon-shield" title="Zero Penalty Guarantee">
            <span className="shield-symbol">₹</span>
          </div>
        </label>

        <button
          type="button"
          className="flight-status-cta-pill"
          onClick={() => navigate('/railway')}
        >
          <span className="ticket-icon">🎟️</span>
          <span>PNR Enquiry & Live Train</span>
        </button>
      </div>

      {/* Floating SEARCH Button (Centered Half-Inside, Half-Outside bottom edge) */}
      <div className="search-action-wrap-floating">
        <button
          type="button"
          className="search-submit-hero-btn modern-floating-btn"
          onClick={handleSearchSubmit}
        >
          SEARCH TRAINS
        </button>
      </div>
    </div>
  );
}
