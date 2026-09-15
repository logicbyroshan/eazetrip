import { useState } from 'react';
import { Train, Clock, ArrowRight, Utensils, CheckCircle2, AlertCircle, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export default function TrainCard({ train, onBookClass }) {
  const [selectedClassCode, setSelectedClassCode] = useState(train.classes?.[0]?.code || '3A');

  const activeClassObj = train.classes?.find((c) => c.code === selectedClassCode) || train.classes?.[0];

  // Derive train type category badge
  const isRajdhani = train.trainName?.toLowerCase().includes('rajdhani');
  const isVandeBharat = train.trainName?.toLowerCase().includes('vande bharat');
  const isTejas = train.trainName?.toLowerCase().includes('tejas');
  const isSamparkKranti = train.trainName?.toLowerCase().includes('sampark');

  const trainBadgeLabel = isVandeBharat
    ? 'Vande Bharat Express'
    : isTejas
    ? 'Tejas Superfast'
    : isRajdhani
    ? 'Rajdhani Special'
    : isSamparkKranti
    ? 'Sampark Kranti'
    : 'Superfast Express';

  const dayLetters = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="train-card luxury-train-card">
      {/* Top Train Banner Header */}
      <div className="train-card-header">
        <div className="train-meta-left">
          <div className="train-type-icon-box">
            <Train size={22} className="train-main-icon" />
          </div>
          <div>
            <div className="train-title-row">
              <h3 className="train-name-title">{train.trainName}</h3>
              <span className="train-number-tag">#{train.trainNumber}</span>
              <span className={`train-category-pill ${isRajdhani || isTejas || isVandeBharat ? 'premium' : ''}`}>
                <Sparkles size={12} />
                {trainBadgeLabel}
              </span>
            </div>

            <div className="train-running-days-row">
              <span className="days-label">Runs On:</span>
              <div className="days-badges-group">
                {dayLetters.map((day, idx) => {
                  const runs = train.runningDays?.includes(day);
                  return (
                    <span
                      key={idx}
                      className={`train-day-dot ${runs ? 'runs-active' : 'runs-inactive'}`}
                      title={`${day}: ${runs ? 'Operating' : 'Not Operating'}`}
                    >
                      {day}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="train-meta-right">
          {train.pantry && (
            <div className="train-pantry-badge">
              <Utensils size={14} className="pantry-icon" />
              <span>{train.pantry}</span>
            </div>
          )}
          <div className="train-irctc-verified">
            <ShieldCheck size={14} />
            <span>IRCTC Live Sync</span>
          </div>
        </div>
      </div>

      {/* Train Schedule Timetable */}
      <div className="train-schedule-grid">
        <div className="train-station-block origin">
          <span className="station-departure-time">{train.departureTime}</span>
          <span className="station-code-badge">{train.from || 'NDLS'}</span>
          <span className="station-full-name">{train.fromStation || train.from}</span>
        </div>

        <div className="train-journey-route">
          <span className="journey-duration-text">
            <Clock size={13} /> {train.duration}
          </span>
          <div className="journey-route-track">
            <span className="route-endpoint start"></span>
            <div className="route-line-animated">
              <span className="pulse-train-dot"></span>
            </div>
            <ArrowRight size={14} className="route-arrow-icon" />
            <span className="route-endpoint end"></span>
          </div>
          <span className="journey-stops-text">Direct Superfast Route</span>
        </div>

        <div className="train-station-block dest">
          <span className="station-arrival-time">{train.arrivalTime}</span>
          <span className="station-code-badge">{train.to || 'BCT'}</span>
          <span className="station-full-name">{train.toStation || train.to}</span>
        </div>
      </div>

      {/* Class Availability Selection Strip */}
      <div className="train-classes-section">
        <div className="classes-section-header">
          <span className="select-class-title">Select Travel Class & Check Live Seat Status:</span>
          <span className="tatkal-info-text">⚡ General & Tatkal Quota Open</span>
        </div>

        <div className="train-classes-tiles-grid">
          {train.classes?.map((cls) => {
            const isSelected = selectedClassCode === cls.code;
            const isAvailable = cls.statusType === 'available' || cls.status?.toUpperCase().includes('AVAIL');
            const isRac = cls.statusType === 'rac' || cls.status?.toUpperCase().includes('RAC');
            const isWl = !isAvailable && !isRac;

            return (
              <button
                key={cls.code}
                type="button"
                className={`train-class-card ${isSelected ? 'is-selected' : ''}`}
                onClick={() => setSelectedClassCode(cls.code)}
              >
                <div className="class-card-top">
                  <span className="class-code-text">{cls.code}</span>
                  <span className="class-price-tag">₹{cls.price.toLocaleString('en-IN')}</span>
                </div>
                <div className="class-full-name">{cls.name}</div>
                <div
                  className={`class-status-badge ${
                    isAvailable ? 'status-available' : isRac ? 'status-rac' : 'status-wl'
                  }`}
                >
                  {isAvailable && <CheckCircle2 size={12} />}
                  {isRac && <AlertCircle size={12} />}
                  <span>{cls.status}</span>
                </div>
                <div className="class-probability-pill">
                  <span className="prob-dot"></span>
                  <span>{cls.probability || '100%'} Chance</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Class Action Row */}
        <div className="train-bottom-action-bar">
          <div className="selected-class-summary">
            <span className="summary-lbl">Selected Class:</span>
            <strong>{activeClassObj?.name || activeClassObj?.code} ({activeClassObj?.code})</strong>
            <span className="summary-status-highlight">
              Status: {activeClassObj?.status}
            </span>
          </div>

          <div className="train-pricing-cta-wrap">
            <div className="train-fare-box">
              <span className="fare-label">Total Fare per passenger:</span>
              <div className="fare-amount">
                <span className="currency">₹</span>
                <strong>{activeClassObj?.price?.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <button
              type="button"
              className="primary-btn book-train-action-btn"
              onClick={() => onBookClass(train, activeClassObj)}
            >
              <span>Book {activeClassObj?.code}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
