import { Plane, ChevronRight, Info, Luggage, ShieldCheck, Sparkles, Clock, ArrowRight } from 'lucide-react';

export default function FlightCard({
  flight,
  onSelect,
  onViewDetails,
  isSelected = false,
  isReturn = false
}) {
  return (
    <div className={`flight-card luxury-flight-card ${isSelected ? 'selected' : ''}`}>
      {/* Airline Info Block */}
      <div className="flight-airline-col">
        <div className="airline-badge">
          <div
            className="airline-logo-box"
            style={{
              backgroundColor: flight.airlineColor ? `${flight.airlineColor}15` : '#eff6ff',
              border: `1px solid ${flight.airlineColor ? `${flight.airlineColor}35` : '#bfdbfe'}`
            }}
          >
            <Plane size={20} color={flight.airlineColor || '#034ea2'} />
          </div>
          <div className="airline-title-group">
            <strong className="airline-name-text">{flight.airline}</strong>
            <div className="flight-number-row">
              <span className="flight-code-badge">{flight.flightNumber}</span>
              <span className="aircraft-type-text">Airbus A320</span>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule & Flight Route */}
      <div className="flight-schedule-col">
        <div className="time-block origin">
          <span className="flight-time-big">{flight.departureTime}</span>
          <span className="flight-airport-code">{flight.from || 'BOM'}</span>
          <span className="flight-city-name">{flight.fromCity || flight.from}</span>
        </div>

        <div className="duration-block">
          <span className="duration-text">
            <Clock size={12} /> {flight.duration}
          </span>
          <div className="flight-path-line">
            <span className="path-dot"></span>
            <div className="path-track-line"></div>
            <Plane size={14} className="path-plane" />
            <span className="path-dot"></span>
          </div>
          <span className="stops-badge">{flight.stopText || 'Non-stop · Direct'}</span>
        </div>

        <div className="time-block dest">
          <span className="flight-time-big">{flight.arrivalTime}</span>
          <span className="flight-airport-code">{flight.to || 'DEL'}</span>
          <span className="flight-city-name">{flight.toCity || flight.to}</span>
        </div>
      </div>

      {/* Price & Book Action */}
      <div className="flight-price-col">
        <div className="price-box">
          <div className="flight-tag-row">
            <span className="fare-tag">Special Fare</span>
            <span className="baggage-tag">15kg Luggage</span>
          </div>
          <div className="price-amount">
            <span className="currency">₹</span>
            <strong>{flight.price.toLocaleString('en-IN')}</strong>
          </div>
          <span className="per-pax">per adult · taxes included</span>
        </div>

        <div className="flight-action-buttons">
          <button
            type="button"
            className="link-details-btn"
            onClick={() => onViewDetails(flight)}
          >
            <Info size={13} />
            <span>Flight Details</span>
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
