import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { popularTrains } from '../../data/siteData';

export default function PopularTrains() {
  const [tab, setTab] = useState('premier'); // 'premier' | 'express'
  const navigate = useNavigate();

  const list = popularTrains[tab] || popularTrains.premier;

  const handleTrainClick = (train) => {
    if (train.trainNo) {
      navigate(`/railways?train=${train.trainNo}&trainName=${encodeURIComponent(train.name)}`);
    } else {
      navigate('/railways');
    }
  };

  return (
    <section className="section-block popular-trains-block">
      <div className="container">
        <div className="popular-trains-header-row">
          <div>
            <h3 className="popular-trains-title">Popular Trains</h3>
            <p className="popular-trains-sub">Book premier high-speed, superfast & express trains across India</p>
          </div>

          <div className="train-scope-tabs">
            <button
              type="button"
              className={`train-tab-btn ${tab === 'premier' ? 'active' : ''}`}
              onClick={() => setTab('premier')}
            >
              Premier
            </button>
            <button
              type="button"
              className={`train-tab-btn ${tab === 'express' ? 'active' : ''}`}
              onClick={() => setTab('express')}
            >
              Express
            </button>
          </div>
        </div>

        <div className="popular-trains-card">
          <div className="trains-grid-row">
            {list.map((train) => (
              <button
                key={train.id}
                type="button"
                className="train-item-btn"
                onClick={() => handleTrainClick(train)}
                title={`Book ${train.name} Tickets`}
              >
                {/* Clean Train Brand Monogram */}
                <div className="train-brand-wrap">
                  {train.id === 'vandebharat' && (
                    <svg viewBox="0 0 36 36" className="train-brand-svg" width="36" height="36" fill="none">
                      <path d="M6 24 C6 14 10 7 24 7 L30 14 L30 26 C30 28 28 30 26 30 L10 30 C7.8 30 6 28 6 24 Z" fill="#004b87" />
                      <path d="M22 10 L28 15 L22 15 Z" fill="#ffffff" opacity="0.9" />
                      <circle cx="12" cy="24" r="2.5" fill="#f59e0b" />
                      <circle cx="24" cy="24" r="2.5" fill="#f59e0b" />
                      <line x1="8" y1="19" x2="28" y2="19" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                  {train.id === 'rajdhani' && (
                    <svg viewBox="0 0 36 36" className="train-brand-svg" width="36" height="36" fill="none">
                      <rect x="5" y="8" width="26" height="20" rx="4" fill="#b91c1c" />
                      <rect x="8" y="11" width="6" height="6" rx="1.5" fill="#fef08a" />
                      <rect x="16" y="11" width="6" height="6" rx="1.5" fill="#fef08a" />
                      <rect x="24" y="11" width="4" height="6" rx="1" fill="#fef08a" />
                      <line x1="5" y1="21" x2="31" y2="21" stroke="#f59e0b" strokeWidth="2.5" />
                      <circle cx="10" cy="28" r="2" fill="#475569" />
                      <circle cx="26" cy="28" r="2" fill="#475569" />
                    </svg>
                  )}
                  {train.id === 'shatabdi' && (
                    <svg viewBox="0 0 36 36" className="train-brand-svg" width="36" height="36" fill="none">
                      <path d="M5 24 C5 14 11 8 25 8 L31 16 L31 25 C31 28 29 29 26 29 L10 29 C7.2 29 5 27 5 24 Z" fill="#0284c7" />
                      <path d="M20 11 L28 17 L19 17 Z" fill="#ffffff" />
                      <rect x="9" y="18" width="5" height="4" rx="1" fill="#e0f2fe" />
                      <line x1="5" y1="24" x2="31" y2="24" stroke="#ffffff" strokeWidth="1.5" />
                    </svg>
                  )}
                  {train.id === 'tejas' && (
                    <svg viewBox="0 0 36 36" className="train-brand-svg" width="36" height="36" fill="none">
                      <rect x="5" y="8" width="26" height="20" rx="4" fill="#ea580c" />
                      <path d="M12 9 L24 9 L28 17 L8 17 Z" fill="#fed7aa" />
                      <circle cx="18" cy="13" r="2.5" fill="#ea580c" />
                      <line x1="5" y1="22" x2="31" y2="22" stroke="#fef08a" strokeWidth="2" />
                      <circle cx="10" cy="28" r="2" fill="#334155" />
                      <circle cx="26" cy="28" r="2" fill="#334155" />
                    </svg>
                  )}
                  {train.id === 'gatimaan' && (
                    <svg viewBox="0 0 36 36" className="train-brand-svg" width="36" height="36" fill="none">
                      <path d="M6 25 C6 14 12 7 26 7 L30 14 L30 25 C30 28 28 29 25 29 L10 29 C7.8 29 6 27.5 6 25 Z" fill="#7c3aed" />
                      <path d="M22 10 L28 15 L20 15 Z" fill="#ffffff" />
                      <line x1="6" y1="20" x2="30" y2="20" stroke="#c084fc" strokeWidth="2.5" />
                      <circle cx="11" cy="25" r="2" fill="#ffffff" />
                      <circle cx="25" cy="25" r="2" fill="#ffffff" />
                    </svg>
                  )}
                  {train.id === 'duronto' && (
                    <svg viewBox="0 0 36 36" className="train-brand-svg" width="36" height="36" fill="none">
                      <rect x="5" y="8" width="26" height="20" rx="4" fill="#16a34a" />
                      <path d="M5 16 C12 12 18 20 31 15" stroke="#facc15" strokeWidth="3" fill="none" />
                      <rect x="8" y="10" width="5" height="4" rx="1" fill="#ffffff" opacity="0.9" />
                      <rect x="16" y="10" width="5" height="4" rx="1" fill="#ffffff" opacity="0.9" />
                      <rect x="23" y="10" width="5" height="4" rx="1" fill="#ffffff" opacity="0.9" />
                    </svg>
                  )}
                  {train.id === 'humsafar' && (
                    <svg viewBox="0 0 36 36" className="train-brand-svg" width="36" height="36" fill="none">
                      <rect x="5" y="8" width="26" height="20" rx="4" fill="#0d9488" />
                      <path d="M5 18 C13 14 19 22 31 18" stroke="#ffedd5" strokeWidth="2.5" fill="none" />
                      <circle cx="12" cy="13" r="2" fill="#ffffff" />
                      <circle cx="24" cy="13" r="2" fill="#ffffff" />
                      <line x1="5" y1="23" x2="31" y2="23" stroke="#f97316" strokeWidth="2" />
                    </svg>
                  )}
                  {train.id === 'amritbharat' && (
                    <svg viewBox="0 0 36 36" className="train-brand-svg" width="36" height="36" fill="none">
                      <rect x="5" y="8" width="26" height="20" rx="4" fill="#d97706" />
                      <rect x="7" y="11" width="10" height="5" rx="1" fill="#f8fafc" />
                      <rect x="19" y="11" width="10" height="5" rx="1" fill="#f8fafc" />
                      <line x1="5" y1="20" x2="31" y2="20" stroke="#f8fafc" strokeWidth="2" />
                      <circle cx="11" cy="25" r="2" fill="#451a03" />
                      <circle cx="25" cy="25" r="2" fill="#451a03" />
                    </svg>
                  )}
                  {train.id === 'garibrath' && (
                    <svg viewBox="0 0 36 36" className="train-brand-svg" width="36" height="36" fill="none">
                      <rect x="5" y="8" width="26" height="20" rx="4" fill="#15803d" />
                      <line x1="5" y1="16" x2="31" y2="16" stroke="#fef08a" strokeWidth="2.5" />
                      <rect x="8" y="10" width="6" height="4" rx="1" fill="#ffffff" />
                      <rect x="22" y="10" width="6" height="4" rx="1" fill="#ffffff" />
                    </svg>
                  )}
                  {train.id === 'palaceonwheels' && (
                    <svg viewBox="0 0 36 36" className="train-brand-svg" width="36" height="36" fill="none">
                      <rect x="5" y="8" width="26" height="20" rx="4" fill="#701a75" />
                      <path d="M12 18 L18 10 L24 18 Z" fill="#fbbf24" />
                      <circle cx="18" cy="11" r="2" fill="#fbbf24" />
                      <line x1="5" y1="22" x2="31" y2="22" stroke="#fbbf24" strokeWidth="2" />
                    </svg>
                  )}
                </div>

                {/* Clean Train Text Details */}
                <div className="train-text-details">
                  <span className="train-name-text" style={{ color: train.color }}>
                    {train.name}
                  </span>
                  <span className="train-hub-text">{train.tag}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
