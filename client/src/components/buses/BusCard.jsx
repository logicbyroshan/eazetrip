import { Bus, Star, MapPin, ShieldCheck, ChevronRight, Armchair, Wifi, Zap, Wind, Navigation, Sparkles } from 'lucide-react';

export default function BusCard({ bus, onSelectSeats }) {
  const getAmenityIcon = (amenity) => {
    if (amenity.toLowerCase().includes('wifi')) return <Wifi size={13} />;
    if (amenity.toLowerCase().includes('charg') || amenity.toLowerCase().includes('port')) return <Zap size={13} />;
    if (amenity.toLowerCase().includes('ac') || amenity.toLowerCase().includes('air')) return <Wind size={13} />;
    if (amenity.toLowerCase().includes('tracking') || amenity.toLowerCase().includes('gps')) return <Navigation size={13} />;
    return <Sparkles size={13} />;
  };

  const isLowSeats = bus.seatsAvailable <= 10;

  return (
    <div className="bus-card luxury-bus-card">
      {/* Top Main Section */}
      <div className="bus-card-main-grid">
        {/* Operator Info */}
        <div className="bus-operator-column">
          <div className="bus-operator-header">
            <div className="bus-operator-icon-badge">
              <Bus size={20} />
            </div>
            <div>
              <div className="bus-operator-name-row">
                <h3 className="bus-operator-name">{bus.operator}</h3>
                <span className="bus-verified-pill" title="Verified Safe Operator">
                  <ShieldCheck size={12} />
                  <span>Verified</span>
                </span>
              </div>
              <span className="bus-coach-type">{bus.busType}</span>
            </div>
          </div>

          <div className="bus-rating-review-row">
            <div className="bus-rating-badge">
              <Star size={13} fill="#fff" color="#fff" />
              <strong>{bus.rating}</strong>
            </div>
            <span className="bus-reviews-text">({bus.reviewsCount || 420} ratings)</span>
          </div>
        </div>

        {/* Schedule & Route Timeline */}
        <div className="bus-timeline-column">
          <div className="bus-stop-block origin">
            <span className="bus-time-text">{bus.departureTime}</span>
            <span className="bus-city-tag">{bus.from}</span>
            <span className="bus-pickup-point" title={bus.departureLocation}>
              <MapPin size={12} />
              {bus.departureLocation}
            </span>
          </div>

          <div className="bus-duration-track">
            <span className="bus-duration-badge">{bus.duration}</span>
            <div className="bus-track-line">
              <span className="track-point start"></span>
              <div className="track-dashed-line"></div>
              <span className="track-point end"></span>
            </div>
            {bus.liveTracking && (
              <span className="bus-live-gps-badge">
                <span className="live-pulse-dot"></span>
                <span>Live GPS Tracking</span>
              </span>
            )}
          </div>

          <div className="bus-stop-block dest">
            <span className="bus-time-text">{bus.arrivalTime}</span>
            <span className="bus-city-tag">{bus.to}</span>
            <span className="bus-pickup-point" title={bus.dropLocation}>
              <MapPin size={12} />
              {bus.dropLocation}
            </span>
          </div>
        </div>

        {/* Price & Select Seats CTA */}
        <div className="bus-action-column">
          <div className="bus-pricing-display">
            {bus.originalPrice && (
              <span className="bus-strikethrough-price">₹{bus.originalPrice}</span>
            )}
            <div className="bus-current-price-row">
              <span className="currency-sign">₹</span>
              <strong className="price-bold">{bus.price}</strong>
              <span className="per-seat-lbl">/ seat</span>
            </div>
            <div className={`bus-seats-urgency ${isLowSeats ? 'urgency-high' : 'urgency-normal'}`}>
              {isLowSeats ? `🔥 Only ${bus.seatsAvailable} Seats Left!` : `✓ ${bus.seatsAvailable} Seats Available`}
            </div>
          </div>

          <button
            type="button"
            className="primary-btn luxury-bus-select-btn"
            onClick={() => onSelectSeats(bus)}
          >
            <Armchair size={16} />
            <span>Select Seats</span>
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* Bottom Amenities & Policy Strip */}
      <div className="bus-card-footer-strip">
        <div className="bus-amenities-tags-list">
          {bus.amenities?.map((amenity) => (
            <span key={amenity} className="bus-amenity-tag">
              {getAmenityIcon(amenity)}
              <span>{amenity}</span>
            </span>
          ))}
        </div>

        <div className="bus-policy-badges">
          <span className="bus-policy-pill">✓ Free Cancellation (up to 4 hrs prior)</span>
          <span className="bus-policy-pill">✓ Zero Booking Surcharge</span>
        </div>
      </div>
    </div>
  );
}
