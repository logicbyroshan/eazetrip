import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { popularAirlines } from '../../data/siteData';

export default function PopularAirlines() {
  const [tab, setTab] = useState('domestic'); // 'domestic' | 'international'
  const navigate = useNavigate();

  const list = popularAirlines[tab] || popularAirlines.domestic;

  const handleAirlineClick = (airline) => {
    navigate(`/flight-booking?airline=${encodeURIComponent(airline.name)}`);
  };

  return (
    <section className="section-block popular-airlines-block">
      <div className="container">
        <div className="popular-airlines-header-row">
          <div>
            <h3 className="popular-airlines-title">Popular Airlines</h3>
            <p className="popular-airlines-sub">Book top rated domestic & international scheduled carriers</p>
          </div>

          <div className="airline-scope-tabs">
            <button
              type="button"
              className={`airline-tab-btn ${tab === 'domestic' ? 'active' : ''}`}
              onClick={() => setTab('domestic')}
            >
              Domestic
            </button>
            <button
              type="button"
              className={`airline-tab-btn ${tab === 'international' ? 'active' : ''}`}
              onClick={() => setTab('international')}
            >
              International
            </button>
          </div>
        </div>

        <div className="popular-airlines-card">
          <div className="airlines-grid-row">
            {list.map((airline) => (
              <button
                key={airline.id}
                type="button"
                className="airline-logo-item"
                onClick={() => handleAirlineClick(airline)}
                title={`Book ${airline.name} Flights`}
              >
                {/* SVG Tailfin / Brand Monogram */}
                <div className="airline-tailfin-wrap">
                  {airline.id === 'indigo' && (
                    <svg viewBox="0 0 36 36" className="tailfin-svg" width="36" height="36">
                      <path d="M6 32 L18 4 L30 32 Z" fill="#001b94" />
                      <circle cx="18" cy="20" r="3.5" fill="#ffffff" />
                      <path d="M13 22 L23 22 L18 13 Z" fill="#00a8ff" />
                    </svg>
                  )}
                  {airline.id === 'airindia' && (
                    <svg viewBox="0 0 36 36" className="tailfin-svg" width="36" height="36">
                      <path d="M6 32 C13 27 18 13 30 4 L23 32 Z" fill="#ed1c24" />
                      <path d="M10 30 C15 23 20 11 28 6" stroke="#fdb913" strokeWidth="2.5" fill="none" />
                    </svg>
                  )}
                  {airline.id === 'airindiaexpress' && (
                    <svg viewBox="0 0 36 36" className="tailfin-svg" width="36" height="36">
                      <path d="M8 32 L26 4 L28 32 Z" fill="#f37021" />
                      <path d="M15 20 L22 27" stroke="#ffffff" strokeWidth="3" />
                    </svg>
                  )}
                  {airline.id === 'akasaair' && (
                    <svg viewBox="0 0 36 36" className="tailfin-svg" width="36" height="36">
                      <path d="M8 32 L20 6 L30 32 Z" fill="#5b2c6f" />
                      <path d="M15 32 L24 16 L30 32 Z" fill="#ff6600" />
                    </svg>
                  )}
                  {airline.id === 'allianceair' && (
                    <svg viewBox="0 0 36 36" className="tailfin-svg" width="36" height="36">
                      <path d="M6 32 L22 6 L28 32 Z" fill="#f1f5f9" stroke="#c0392b" strokeWidth="2.5" />
                      <circle cx="20" cy="18" r="3.5" fill="#c0392b" />
                    </svg>
                  )}
                  {airline.id === 'spicejet' && (
                    <svg viewBox="0 0 36 36" className="tailfin-svg" width="36" height="36">
                      <path d="M6 32 L25 4 L30 32 Z" fill="#e74c3c" />
                      <circle cx="15" cy="20" r="1.8" fill="#f1c40f" />
                      <circle cx="20" cy="15" r="1.8" fill="#f1c40f" />
                      <circle cx="22" cy="23" r="1.8" fill="#f1c40f" />
                    </svg>
                  )}
                  {airline.id === 'emirates' && (
                    <svg viewBox="0 0 36 36" className="tailfin-svg" width="36" height="36">
                      <rect x="4" y="6" width="28" height="24" rx="4" fill="#d71921" />
                      <text x="18" y="23" fill="#ffffff" fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="serif">EK</text>
                    </svg>
                  )}
                  {airline.id === 'singaporeair' && (
                    <svg viewBox="0 0 36 36" className="tailfin-svg" width="36" height="36">
                      <path d="M6 32 L22 4 L30 32 Z" fill="#00205b" />
                      <path d="M14 18 L24 10 L22 24 Z" fill="#f59e0b" />
                    </svg>
                  )}
                  {airline.id === 'qatar' && (
                    <svg viewBox="0 0 36 36" className="tailfin-svg" width="36" height="36">
                      <rect x="4" y="6" width="28" height="24" rx="4" fill="#5c0632" />
                      <text x="18" y="23" fill="#ffffff" fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">QR</text>
                    </svg>
                  )}
                  {airline.id === 'etihad' && (
                    <svg viewBox="0 0 36 36" className="tailfin-svg" width="36" height="36">
                      <rect x="4" y="6" width="28" height="24" rx="4" fill="#1e293b" stroke="#bd9b60" strokeWidth="2" />
                      <text x="18" y="23" fill="#bd9b60" fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">EY</text>
                    </svg>
                  )}
                  {airline.id === 'britishairways' && (
                    <svg viewBox="0 0 36 36" className="tailfin-svg" width="36" height="36">
                      <path d="M6 32 L20 4 L28 32 Z" fill="#075aaa" />
                      <path d="M10 24 L24 20 L28 32 Z" fill="#d71921" />
                    </svg>
                  )}
                  {airline.id === 'lufthansa' && (
                    <svg viewBox="0 0 36 36" className="tailfin-svg" width="36" height="36">
                      <circle cx="18" cy="18" r="14" fill="#05164d" />
                      <circle cx="18" cy="18" r="12" fill="#ffb81c" />
                      <circle cx="18" cy="18" r="10" fill="#05164d" />
                      <path d="M12 18 L24 13 L20 22 Z" fill="#ffb81c" />
                    </svg>
                  )}
                </div>

                <div className="airline-text-details">
                  <span className="airline-name-text" style={{ color: airline.color }}>
                    {airline.name}
                  </span>
                  <span className="airline-hub-text">{airline.hub}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
