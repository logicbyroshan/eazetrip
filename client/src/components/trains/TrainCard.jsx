import { useState } from 'react';
import { Train, Clock, ArrowRight, Utensils, CheckCircle2, AlertCircle } from 'lucide-react';

export default function TrainCard({ train, onBookClass }) {
  const [selectedClassCode, setSelectedClassCode] = useState(train.classes?.[0]?.code || '3A');

  const activeClassObj = train.classes?.find((c) => c.code === selectedClassCode) || train.classes?.[0];

  return (
    <div className="train-card">
      <div className="train-header-row">
        <div className="train-name-group">
          <div className="train-icon-badge">
            <Train size={20} />
          </div>
          <div>
            <h3>
              {train.trainName} <span className="train-number">({train.trainNumber})</span>
            </h3>
            <div className="running-days-strip">
              <span>Runs On:</span>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
                const runs = train.runningDays?.includes(day);
                return (
                  <span
                    key={idx}
                    className={`day-badge ${runs ? 'active' : 'inactive'}`}
                  >
                    {day}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {train.pantry && (
          <div className="pantry-badge">
            <Utensils size={14} />
            <span>Pantry: {train.pantry}</span>
          </div>
        )}
      </div>

      <div className="train-schedule-row">
        <div className="station-col origin">
          <span className="station-time">{train.departureTime}</span>
          <span className="station-name">{train.fromStation || train.from}</span>
        </div>

        <div className="duration-col">
          <span className="duration-text">{train.duration}</span>
          <div className="train-path-line">
            <span className="path-dot"></span>
            <span className="path-line"></span>
            <ArrowRight size={14} className="path-arrow" />
            <span className="path-dot"></span>
          </div>
        </div>

        <div className="station-col dest">
          <span className="station-time">{train.arrivalTime}</span>
          <span className="station-name">{train.toStation || train.to}</span>
        </div>
      </div>

      {/* Class Availability Tiles */}
      <div className="train-classes-container">
        <div className="classes-grid">
          {train.classes?.map((cls) => {
            const isSelected = selectedClassCode === cls.code;
            const isAvailable = cls.statusType === 'available';
            const isRac = cls.statusType === 'rac';

            return (
              <div
                key={cls.code}
                className={`class-tile ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedClassCode(cls.code)}
              >
                <div className="class-top-meta">
                  <strong>{cls.code}</strong>
                  <span className="class-price">₹{cls.price}</span>
                </div>
                <div
                  className={`status-pill ${
                    isAvailable ? 'available' : isRac ? 'rac' : 'wl'
                  }`}
                >
                  {cls.status}
                </div>
                <small className="prob-text">Chance: {cls.probability}</small>
              </div>
            );
          })}
        </div>

        <div className="train-action-col">
          <div className="action-price-wrap">
            <span className="fee-note">Base Fare:</span>
            <strong>₹{activeClassObj?.price?.toLocaleString('en-IN')}</strong>
          </div>
          <button
            type="button"
            className="primary-btn book-train-btn"
            onClick={() => onBookClass(train, activeClassObj)}
          >
            Book {activeClassObj?.name || activeClassObj?.code}
          </button>
        </div>
      </div>
    </div>
  );
}
