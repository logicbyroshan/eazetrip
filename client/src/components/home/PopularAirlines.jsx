import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { popularAirlines } from '../../data/siteData';

export default function PopularAirlines() {
  const navigate = useNavigate();

  const handleAirlineClick = (airline) => {
    navigate(`/flight-booking?airline=${airline.name}`);
  };

  return (
    <section className="section-block popular-airlines-block">
      <div className="container">
        <h3 className="popular-airlines-title">Popular Domestic Airlines</h3>

        <div className="popular-airlines-card">
          <div className="airlines-grid-row">
            {popularAirlines.map((airline) => (
              <button
                key={airline.id}
                type="button"
                className="airline-logo-item"
                onClick={() => handleAirlineClick(airline)}
                title={`Book ${airline.name} Flights`}
              >
                {/* SVG Stylized Tailfin for authentic airline branding */}
                <div className="airline-tailfin-wrap">
                  {airline.id === 'indigo' && (
                    <svg viewBox="0 0 32 32" className="tailfin-svg" width="32" height="32">
                      <path d="M6 28 L16 4 L26 28 Z" fill="#001b94" />
                      <circle cx="16" cy="18" r="3" fill="#ffffff" />
                      <path d="M12 20 L20 20 L16 12 Z" fill="#00a8ff" />
                    </svg>
                  )}
                  {airline.id === 'airindia' && (
                    <svg viewBox="0 0 32 32" className="tailfin-svg" width="32" height="32">
                      <path d="M6 28 C12 24 16 12 26 4 L20 28 Z" fill="#ed1c24" />
                      <path d="M10 26 C14 20 18 10 24 6" stroke="#fdb913" strokeWidth="2" fill="none" />
                    </svg>
                  )}
                  {airline.id === 'airindiaexpress' && (
                    <svg viewBox="0 0 32 32" className="tailfin-svg" width="32" height="32">
                      <path d="M8 28 L24 4 L26 28 Z" fill="#f37021" />
                      <path d="M14 18 L20 24" stroke="#ffffff" strokeWidth="2.5" />
                    </svg>
                  )}
                  {airline.id === 'akasaair' && (
                    <svg viewBox="0 0 32 32" className="tailfin-svg" width="32" height="32">
                      <path d="M8 28 L18 6 L26 28 Z" fill="#5b2c6f" />
                      <path d="M14 28 L22 14 L26 28 Z" fill="#ff6600" />
                    </svg>
                  )}
                  {airline.id === 'allianceair' && (
                    <svg viewBox="0 0 32 32" className="tailfin-svg" width="32" height="32">
                      <path d="M6 28 L20 6 L24 28 Z" fill="#e2e8f0" stroke="#c0392b" strokeWidth="2" />
                      <circle cx="18" cy="16" r="3" fill="#c0392b" />
                    </svg>
                  )}
                  {airline.id === 'spicejet' && (
                    <svg viewBox="0 0 32 32" className="tailfin-svg" width="32" height="32">
                      <path d="M6 28 L22 4 L26 28 Z" fill="#e74c3c" />
                      <circle cx="14" cy="18" r="1.5" fill="#f1c40f" />
                      <circle cx="18" cy="14" r="1.5" fill="#f1c40f" />
                      <circle cx="20" cy="20" r="1.5" fill="#f1c40f" />
                    </svg>
                  )}
                </div>

                <span className="airline-name-text" style={{ color: airline.color }}>
                  {airline.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
