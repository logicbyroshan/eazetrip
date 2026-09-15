import { Bus, Star, MapPin, ShieldCheck, ChevronRight, Armchair } from 'lucide-react';

export default function BusCard({ bus, onSelectSeats }) {
  return (
    <div className="bus-card">
      <div className="bus-main-info">
        <div className="bus-operator-block">
          <div className="operator-header">
            <h3>{bus.operator}</h3>
            <div className="bus-rating-pill">
              <Star size={13} fill="#fff" color="#fff" />
              <span>{bus.rating}</span>
            </div>
          </div>
          <span className="bus-type-text">{bus.busType}</span>
        </div>

        <div className="bus-schedule-block">
          <div className="bus-time-col">
            <span className="time">{bus.departureTime}</span>
            <span className="location">{bus.from}</span>
            <small>{bus.departureLocation}</small>
          </div>

          <div className="bus-duration-col">
            <span>{bus.duration}</span>
            <div className="bus-route-line"></div>
            {bus.liveTracking && (
              <span className="live-gps-badge">● Live GPS Tracking</span>
            )}
          </div>

          <div className="bus-time-col">
            <span className="time">{bus.arrivalTime}</span>
            <span className="location">{bus.to}</span>
            <small>{bus.dropLocation}</small>
          </div>
        </div>

        <div className="bus-price-action-block">
          <div className="bus-price-box">
            {bus.originalPrice && (
              <span className="orig-price">₹{bus.originalPrice}</span>
            )}
            <div className="current-price-row">
              <span className="currency">₹</span>
              <strong>{bus.price}</strong>
            </div>
            <span className="seats-left-text">{bus.seatsAvailable} Seats Available</span>
          </div>

          <button
            type="button"
            className="primary-btn bus-seat-btn"
            onClick={() => onSelectSeats(bus)}
          >
            <Armchair size={16} />
            <span>Select Seats</span>
          </button>
        </div>
      </div>

      <div className="bus-footer-strip">
        <div className="bus-amenities-list">
          {bus.amenities?.map((amenity) => (
            <span key={amenity} className="bus-amenity-chip">✓ {amenity}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
