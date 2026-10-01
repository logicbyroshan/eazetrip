import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { popularBusOperators } from '../../data/siteData';
import { Bus, Zap, ShieldCheck, Star, ArrowRight, Route } from 'lucide-react';

export default function PopularBusOperators() {
  const [tab, setTab] = useState('premium'); // 'premium' | 'express'
  const navigate = useNavigate();

  const list = popularBusOperators[tab] || popularBusOperators.premium;

  const handleOperatorClick = (operator) => {
    navigate(`/bus-booking?operator=${encodeURIComponent(operator.name)}`);
  };

  return (
    <section className="section-block popular-bus-block">
      <div className="container">
        <div className="popular-bus-header-row">
          <div>
            <div className="section-tag-pill bus-tag-pill">
              <Bus size={14} />
              <span>CERTIFIED INTERCITY OPERATORS</span>
            </div>
            <h3 className="popular-bus-title">Popular Bus Operators</h3>
            <p className="popular-bus-sub">Book top-rated Volvo 9600, AC Sleeper & Green EV intercity coaches</p>
          </div>

          <div className="bus-scope-tabs">
            <button
              type="button"
              className={`bus-tab-btn ${tab === 'premium' ? 'active' : ''}`}
              onClick={() => setTab('premium')}
            >
              <Zap size={14} />
              <span>Premier & Luxury Volvo</span>
            </button>
            <button
              type="button"
              className={`bus-tab-btn ${tab === 'express' ? 'active' : ''}`}
              onClick={() => setTab('express')}
            >
              <Route size={14} />
              <span>State RTC & Superfast</span>
            </button>
          </div>
        </div>

        <div className="popular-bus-card">
          <div className="bus-grid-row">
            {list.map((operator) => (
              <button
                key={operator.id}
                type="button"
                className="bus-item-btn"
                onClick={() => handleOperatorClick(operator)}
                title={`Book ${operator.name} Buses`}
              >
                {/* SVG Bus / Brand Monogram */}
                <div
                  className="bus-icon-badge"
                  style={{
                    backgroundColor: `${operator.color}15`,
                    color: operator.color,
                    borderColor: `${operator.color}35`
                  }}
                >
                  {operator.id === 'intrcity' && (
                    <svg viewBox="0 0 36 36" width="32" height="32" fill="none">
                      <rect x="5" y="7" width="26" height="22" rx="4" fill="#0284c7" />
                      <rect x="8" y="10" width="20" height="7" rx="1.5" fill="#e0f2fe" />
                      <line x1="14" y1="10" x2="14" y2="17" stroke="#0284c7" strokeWidth="1.5" />
                      <line x1="20" y1="10" x2="20" y2="17" stroke="#0284c7" strokeWidth="1.5" />
                      <circle cx="10" cy="24" r="2.5" fill="#ffffff" />
                      <circle cx="26" cy="24" r="2.5" fill="#ffffff" />
                      <circle cx="10" cy="24" r="1.2" fill="#0f172a" />
                      <circle cx="26" cy="24" r="1.2" fill="#0f172a" />
                    </svg>
                  )}
                  {operator.id === 'zingbus' && (
                    <svg viewBox="0 0 36 36" width="32" height="32" fill="none">
                      <rect x="5" y="7" width="26" height="22" rx="4" fill="#16a34a" />
                      <path d="M9 13 L27 13 L25 18 L7 18 Z" fill="#ffffff" opacity="0.9" />
                      <path d="M12 21 L24 21" stroke="#fef08a" strokeWidth="2.5" strokeLinecap="round" />
                      <circle cx="10" cy="26" r="2.2" fill="#ffffff" />
                      <circle cx="26" cy="26" r="2.2" fill="#ffffff" />
                    </svg>
                  )}
                  {operator.id === 'nuego' && (
                    <svg viewBox="0 0 36 36" width="32" height="32" fill="none">
                      <rect x="5" y="7" width="26" height="22" rx="4" fill="#059669" />
                      <path d="M18 10 L14 17 L19 17 L17 24 L22 17 L17 17 Z" fill="#fef08a" />
                      <circle cx="10" cy="26" r="2" fill="#ffffff" />
                      <circle cx="26" cy="26" r="2" fill="#ffffff" />
                    </svg>
                  )}
                  {operator.id === 'vrltravels' && (
                    <svg viewBox="0 0 36 36" width="32" height="32" fill="none">
                      <rect x="5" y="7" width="26" height="22" rx="4" fill="#d97706" />
                      <rect x="8" y="10" width="7" height="6" rx="1" fill="#fef3c7" />
                      <rect x="17" y="10" width="11" height="6" rx="1" fill="#fef3c7" />
                      <circle cx="9" cy="25" r="2.2" fill="#451a03" />
                      <circle cx="27" cy="25" r="2.2" fill="#451a03" />
                      <line x1="5" y1="20" x2="31" y2="20" stroke="#fef3c7" strokeWidth="1.5" />
                    </svg>
                  )}
                  {operator.id === 'srstravels' && (
                    <svg viewBox="0 0 36 36" width="32" height="32" fill="none">
                      <rect x="5" y="7" width="26" height="22" rx="4" fill="#7c3aed" />
                      <path d="M9 11 L27 11 L25 17 L7 17 Z" fill="#ede9fe" />
                      <circle cx="10" cy="25" r="2.2" fill="#ffffff" />
                      <circle cx="26" cy="25" r="2.2" fill="#ffffff" />
                    </svg>
                  )}
                  {operator.id === 'ksrtc' && (
                    <svg viewBox="0 0 36 36" width="32" height="32" fill="none">
                      <rect x="5" y="7" width="26" height="22" rx="4" fill="#dc2626" />
                      <path d="M12 11 L24 11 L27 18 L9 18 Z" fill="#fef08a" />
                      <circle cx="10" cy="25" r="2.2" fill="#ffffff" />
                      <circle cx="26" cy="25" r="2.2" fill="#ffffff" />
                    </svg>
                  )}
                  {operator.id === 'orangetravels' && (
                    <svg viewBox="0 0 36 36" width="32" height="32" fill="none">
                      <rect x="5" y="7" width="26" height="22" rx="4" fill="#ea580c" />
                      <circle cx="18" cy="14" r="3.5" fill="#fef08a" />
                      <circle cx="10" cy="25" r="2.2" fill="#ffffff" />
                      <circle cx="26" cy="25" r="2.2" fill="#ffffff" />
                    </svg>
                  )}
                  {operator.id === 'upsrtc' && (
                    <svg viewBox="0 0 36 36" width="32" height="32" fill="none">
                      <rect x="5" y="7" width="26" height="22" rx="4" fill="#2563eb" />
                      <line x1="5" y1="18" x2="31" y2="18" stroke="#ffffff" strokeWidth="2" />
                      <circle cx="10" cy="25" r="2.2" fill="#ffffff" />
                      <circle cx="26" cy="25" r="2.2" fill="#ffffff" />
                    </svg>
                  )}
                  {operator.id === 'msrtc' && (
                    <svg viewBox="0 0 36 36" width="32" height="32" fill="none">
                      <rect x="5" y="7" width="26" height="22" rx="4" fill="#0891b2" />
                      <path d="M8 11 L28 11 L26 17 L6 17 Z" fill="#cffafe" />
                      <circle cx="10" cy="25" r="2.2" fill="#ffffff" />
                      <circle cx="26" cy="25" r="2.2" fill="#ffffff" />
                    </svg>
                  )}
                  {operator.id === 'hrtc' && (
                    <svg viewBox="0 0 36 36" width="32" height="32" fill="none">
                      <rect x="5" y="7" width="26" height="22" rx="4" fill="#4f46e5" />
                      <path d="M10 18 L18 10 L26 18 Z" fill="#e0e7ff" />
                      <circle cx="10" cy="25" r="2.2" fill="#ffffff" />
                      <circle cx="26" cy="25" r="2.2" fill="#ffffff" />
                    </svg>
                  )}
                </div>

                {/* Details */}
                <div className="bus-text-details">
                  <div className="bus-name-badge-row">
                    <span className="bus-name-text" style={{ color: operator.color }}>
                      {operator.name}
                    </span>
                    <span className="bus-rating-badge">{operator.rating}</span>
                  </div>
                  <span className="bus-tag-text">{operator.tag}</span>
                  <span className="bus-routes-text">{operator.routes}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
