import { Plane, ChevronRight, Info, Luggage, ShieldAlert } from 'lucide-react';

export default function FlightCard({
  flight,
  onSelect,
  onViewDetails,
  isSelected = false,
  isReturn = false
}) {
  return (
    <div className={`flight-card ${isSelected ? 'selected' : ''}`}>
      {/* Airline Info */}
      <div className="flight-airline-col">
        <div className="airline-badge">
          <div
            className="airline-logo-box"
            style={{ backgroundColor: flight.airlineColor ? `${flight.airlineColor}15` : '#f0f5ff' }}
          >
            <Plane size={20} color={flight.airlineColor || '#1272d5'} />
          </div>
          <div>
            <strong>{flight.airline}</strong>
            <small>{flight.flightNumber}</small>
          </div>
        </div>
      </div>

      {/* Schedule & Duration */}
      <div className="flight-schedule-col">
        <div className="time-block origin">
          <span className="time">{flight.departureTime}</span>
          <span className="city">{flight.fromCity}</span>
          <small>{flight.from}</small>
        </div>

        <div className="duration-block">
          <span className="duration-text">{flight.duration}</span>
          <div className="flight-path-line">
            <span className="path-dot"></span>
            <span className="path-line"></span>
            <Plane size={14} className="path-plane" />
            <span className="path-dot"></span>
          </div>
          <span className="stops-badge">{flight.stopText}</span>
        </div>

        <div className="time-block dest">
          <span className="time">{flight.arrivalTime}</span>
          <span className="city">{flight.toCity}</span>
          <small>{flight.to}</small>
        </div>
      </div>

      {/* Price & Action */}
      <div className="flight-price-col">
        <div className="price-box">
          <span className="fare-tag">Special Fare</span>
          <div className="price-amount">
            <span className="currency">₹</span>
            <strong>{flight.price.toLocaleString('en-IN')}</strong>
          </div>
          <span className="per-pax">per adult</span>
        </div>

        <div className="flight-action-buttons">
          <button
            type="button"
            className="link-details-btn"
            onClick={() => onViewDetails(flight)}
          >
            <Info size={14} /> Flight Details
          </button>
          <button
            type="button"
            className={`flight-book-btn ${isSelected ? 'active-select' : ''}`}
            onClick={() => onSelect(flight, isReturn)}
          >
            {isSelected ? 'SELECTED ✓' : 'BOOK NOW'}
          </button>
        </div>
      </div>
    </div>
  );
}
