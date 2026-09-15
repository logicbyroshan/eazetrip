import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { railwayStations } from '../../data/trainData';
import { Train, ArrowLeftRight, Calendar, MapPin, ChevronDown, Check } from 'lucide-react';

const QUOTA_OPTIONS = [
  { code: 'GN', label: 'General Quota (GN)' },
  { code: 'TQ', label: 'Tatkal Quota (TQ)' },
  { code: 'LD', label: 'Ladies Quota (LD)' },
  { code: 'SS', label: 'Senior Citizen (SS)' }
];

const CLASS_OPTIONS = [
  { code: 'ALL', label: 'All Classes', shortName: 'All Classes' },
  { code: '1A', label: 'AC First Class (1A)', shortName: 'AC First (1A)' },
  { code: '2A', label: 'AC 2 Tier (2A)', shortName: 'AC 2 Tier (2A)' },
  { code: '3A', label: 'AC 3 Tier (3A)', shortName: 'AC 3 Tier (3A)' },
  { code: '3E', label: 'AC 3 Economy (3E)', shortName: 'AC 3 Econ (3E)' },
  { code: 'SL', label: 'Sleeper Class (SL)', shortName: 'Sleeper (SL)' }
];

export default function TrainSearchWidget({ initialValues = {}, onSearch }) {
  const navigate = useNavigate();

  const [fromStation, setFromStation] = useState(initialValues.from || 'NDLS');
  const [toStation, setToStation] = useState(initialValues.to || 'BCT');
  const [travelDate, setTravelDate] = useState(initialValues.travelDate || '2026-09-25');
  const [travelClass, setTravelClass] = useState(initialValues.travelClass || 'ALL');
  const [quota, setQuota] = useState(initialValues.quota || 'GN');

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

  const handleSwap = () => {
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
      quota
    };

    if (onSearch) {
      onSearch(searchParams);
    } else {
      navigate('/railway', { state: searchParams });
    }
  };

  return (
    <div className="search-widget-box train-widget">
      <div className="search-top-bar">
        <span className="widget-badge-text">IRCTC Authorized Train Ticket Booking & PNR Status</span>
        
        {/* Custom Sleek Quota Dropdown */}
        <div className="quota-select-custom-wrap" ref={quotaRef}>
          <span className="quota-prefix-label">Quota:</span>
          <button
            type="button"
            className="quota-custom-trigger"
            onClick={() => setQuotaDropdownOpen(!quotaDropdownOpen)}
            aria-haspopup="listbox"
            aria-expanded={quotaDropdownOpen}
          >
            <span>{currentQuotaObj.label}</span>
            <ChevronDown size={15} className={`chevron-indicator ${quotaDropdownOpen ? 'rotated' : ''}`} />
          </button>

          {quotaDropdownOpen && (
            <div className="custom-floating-menu quota-menu" role="listbox">
              {QUOTA_OPTIONS.map((item) => (
                <div
                  key={item.code}
                  className={`custom-menu-item ${item.code === quota ? 'selected' : ''}`}
                  onClick={() => {
                    setQuota(item.code);
                    setQuotaDropdownOpen(false);
                  }}
                  role="option"
                  aria-selected={item.code === quota}
                >
                  <span className="menu-item-text">{item.label}</span>
                  {item.code === quota && <Check size={14} className="menu-check-icon" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="search-fields-grid train-grid">
        {/* FROM Station */}
        <div className="search-field-block" ref={fromRef}>
          <label>FROM STATION</label>
          <div
            className="field-value-card"
            onClick={() => {
              setFromDropdownOpen(!fromDropdownOpen);
              setToDropdownOpen(false);
              setClassDropdownOpen(false);
            }}
            tabIndex={0}
            role="button"
          >
            <span className="city-title">{fromStationObj.city}</span>
            <span className="code-sub">
              [{fromStationObj.code}] {fromStationObj.name.slice(0, 20)}
            </span>
          </div>

          {fromDropdownOpen && (
            <div className="airport-dropdown">
              <input
                type="text"
                placeholder="Search station or code..."
                className="dropdown-search-input"
                autoFocus
                value={fromQuery}
                onChange={(e) => setFromQuery(e.target.value)}
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

        {/* Swap Button */}
        <button
          type="button"
          className="swap-button"
          onClick={handleSwap}
          title="Swap stations"
          aria-label="Swap from and to stations"
        >
          <ArrowLeftRight size={16} />
        </button>

        {/* TO Station */}
        <div className="search-field-block" ref={toRef}>
          <label>TO STATION</label>
          <div
            className="field-value-card"
            onClick={() => {
              setToDropdownOpen(!toDropdownOpen);
              setFromDropdownOpen(false);
              setClassDropdownOpen(false);
            }}
            tabIndex={0}
            role="button"
          >
            <span className="city-title">{toStationObj.city}</span>
            <span className="code-sub">
              [{toStationObj.code}] {toStationObj.name.slice(0, 20)}
            </span>
          </div>

          {toDropdownOpen && (
            <div className="airport-dropdown">
              <input
                type="text"
                placeholder="Search station or code..."
                className="dropdown-search-input"
                autoFocus
                value={toQuery}
                onChange={(e) => setToQuery(e.target.value)}
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

        {/* Travel Date */}
        <div className="search-field-block">
          <label>TRAVEL DATE</label>
          <div className="field-value-card date-card">
            <input
              type="date"
              className="native-date-input"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
            />
          </div>
        </div>

        {/* Class Selection Custom Dropdown Card */}
        <div className="search-field-block" ref={classRef}>
          <label>CLASS</label>
          <div
            className="field-value-card select-card"
            onClick={() => {
              setClassDropdownOpen(!classDropdownOpen);
              setFromDropdownOpen(false);
              setToDropdownOpen(false);
            }}
            tabIndex={0}
            role="button"
          >
            <span className="city-title">{currentClassObj.shortName}</span>
            <span className="code-sub">{currentClassObj.label}</span>
          </div>

          {classDropdownOpen && (
            <div className="custom-floating-menu class-menu" role="listbox">
              {CLASS_OPTIONS.map((item) => (
                <div
                  key={item.code}
                  className={`custom-menu-item ${item.code === travelClass ? 'selected' : ''}`}
                  onClick={() => {
                    setTravelClass(item.code);
                    setClassDropdownOpen(false);
                  }}
                  role="option"
                  aria-selected={item.code === travelClass}
                >
                  <div className="class-option-meta">
                    <strong>{item.shortName}</strong>
                    <small>{item.label}</small>
                  </div>
                  {item.code === travelClass && <Check size={14} className="menu-check-icon" />}
                </div>
              ))}
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
          SEARCH TRAINS
        </button>
      </div>
    </div>
  );
}
