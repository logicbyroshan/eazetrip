import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { busCities } from '../../data/busData';
import { Bus, ArrowLeftRight, Calendar, MapPin } from 'lucide-react';

export default function BusSearchWidget({ initialValues = {}, onSearch }) {
  const navigate = useNavigate();

  const [fromCity, setFromCity] = useState(initialValues.from || 'Pune');
  const [toCity, setToCity] = useState(initialValues.to || 'Mumbai');
  const [journeyDate, setJourneyDate] = useState(initialValues.journeyDate || '2026-09-28');

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

  const handleSwap = () => {
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

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const searchParams = {
      from: fromCity,
      to: toCity,
      journeyDate
    };

    if (onSearch) {
      onSearch(searchParams);
    } else {
      navigate('/bus-booking', { state: searchParams });
    }
  };

  return (
    <div className="search-widget-box bus-widget">
      <div className="search-top-bar">
        <span className="widget-badge-text">Intercity AC Sleeper, Bharat Benz & Volvo Bus Booking</span>
      </div>

      <div className="search-fields-grid bus-grid">
        {/* FROM City */}
        <div className="search-field-block" ref={fromRef}>
          <label>FROM</label>
          <div
            className="field-value-card"
            onClick={() => {
              setFromDropdownOpen(!fromDropdownOpen);
              setToDropdownOpen(false);
            }}
          >
            <span className="city-title">{fromCity}</span>
            <span className="code-sub">Boarding City</span>
          </div>

          {fromDropdownOpen && (
            <div className="airport-dropdown">
              <input
                type="text"
                placeholder="Search boarding city..."
                className="dropdown-search-input"
                autoFocus
                value={fromQuery}
                onChange={(e) => setFromQuery(e.target.value)}
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

        {/* Swap Button */}
        <button
          type="button"
          className="swap-button"
          onClick={handleSwap}
          title="Swap locations"
        >
          <ArrowLeftRight size={16} />
        </button>

        {/* TO City */}
        <div className="search-field-block" ref={toRef}>
          <label>TO</label>
          <div
            className="field-value-card"
            onClick={() => {
              setToDropdownOpen(!toDropdownOpen);
              setFromDropdownOpen(false);
            }}
          >
            <span className="city-title">{toCity}</span>
            <span className="code-sub">Destination City</span>
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

        {/* Journey Date */}
        <div className="search-field-block">
          <label>JOURNEY DATE</label>
          <div className="field-value-card date-card">
            <input
              type="date"
              className="native-date-input"
              value={journeyDate}
              onChange={(e) => setJourneyDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="search-action-wrap">
        <button
          type="button"
          className="search-submit-hero-btn"
          onClick={handleSearchSubmit}
        >
          SEARCH BUSES
        </button>
      </div>
    </div>
  );
}
