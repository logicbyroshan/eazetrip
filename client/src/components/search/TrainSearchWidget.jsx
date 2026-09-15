import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { railwayStations } from '../../data/trainData';
import { Train, ArrowLeftRight, Calendar, MapPin } from 'lucide-react';

export default function TrainSearchWidget({ initialValues = {}, onSearch }) {
  const navigate = useNavigate();

  const [fromStation, setFromStation] = useState(initialValues.from || 'NDLS');
  const [toStation, setToStation] = useState(initialValues.to || 'BCT');
  const [travelDate, setTravelDate] = useState(initialValues.travelDate || '2026-09-25');
  const [travelClass, setTravelClass] = useState(initialValues.travelClass || 'ALL');
  const [quota, setQuota] = useState(initialValues.quota || 'GN');

  const [fromDropdownOpen, setFromDropdownOpen] = useState(false);
  const [toDropdownOpen, setToDropdownOpen] = useState(false);
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');

  const fromRef = useRef(null);
  const toRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (fromRef.current && !fromRef.current.contains(e.target)) {
        setFromDropdownOpen(false);
      }
      if (toRef.current && !toRef.current.contains(e.target)) {
        setToDropdownOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setFromDropdownOpen(false);
        setToDropdownOpen(false);
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
        <div className="quota-select-wrap">
          <label>Quota:</label>
          <select value={quota} onChange={(e) => setQuota(e.target.value)}>
            <option value="GN">General Quota</option>
            <option value="TQ">Tatkal Quota</option>
            <option value="LD">Ladies Quota</option>
            <option value="SS">Senior Citizen</option>
          </select>
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
            }}
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
            }}
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

        {/* Class Selection */}
        <div className="search-field-block">
          <label>CLASS</label>
          <div className="field-value-card select-card">
            <select
              value={travelClass}
              onChange={(e) => setTravelClass(e.target.value)}
              className="native-select"
            >
              <option value="ALL">All Classes</option>
              <option value="1A">AC First Class (1A)</option>
              <option value="2A">AC 2 Tier (2A)</option>
              <option value="3A">AC 3 Tier (3A)</option>
              <option value="3E">AC 3 Economy (3E)</option>
              <option value="SL">Sleeper (SL)</option>
            </select>
          </div>
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
