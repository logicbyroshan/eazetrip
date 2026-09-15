import { Star, MapPin, Check, Wifi, Coffee, Waves, Wind, ShieldCheck, Sparkles, Building2 } from 'lucide-react';

export default function HotelCard({ hotel, onBook }) {
  const getAmenityIcon = (amenity) => {
    if (amenity.toLowerCase().includes('wifi')) return <Wifi size={13} />;
    if (amenity.toLowerCase().includes('breakfast') || amenity.toLowerCase().includes('dining')) return <Coffee size={13} />;
    if (amenity.toLowerCase().includes('pool') || amenity.toLowerCase().includes('beach')) return <Waves size={13} />;
    if (amenity.toLowerCase().includes('ac') || amenity.toLowerCase().includes('air')) return <Wind size={13} />;
    return <Check size={13} />;
  };

  return (
    <div className="hotel-card luxury-hotel-card">
      {/* Hotel Thumbnail with Badges */}
      <div className="hotel-image-wrapper">
        <img src={hotel.image} alt={hotel.name} className="hotel-primary-img" />
        <div className="hotel-image-gradient-overlay"></div>
        
        {hotel.discountText && (
          <span className="hotel-discount-badge">{hotel.discountText}</span>
        )}

        <div className="hotel-verified-overlay-badge">
          <Building2 size={12} />
          <span>Verified Luxury Stay</span>
        </div>
      </div>

      {/* Main Details & Amenities */}
      <div className="hotel-info-section">
        <div className="hotel-rating-header-row">
          <div className="hotel-stars-cluster">
            {Array.from({ length: hotel.starRating || 5 }).map((_, i) => (
              <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
            ))}
            <span className="hotel-star-text">{hotel.starRating} Star Luxury Hotel</span>
          </div>

          <div className="hotel-guest-score-pill">
            <span className="score-number">{hotel.userRating || '4.8'}</span>
            <span className="score-divider">/ 5</span>
            <span className="reviews-count-text">({hotel.reviewsCount || 850} reviews)</span>
          </div>
        </div>

        <h3 className="hotel-name-heading">{hotel.name}</h3>

        <div className="hotel-location-text-row">
          <MapPin size={14} className="hotel-pin-icon" />
          <span>{hotel.location}</span>
        </div>

        <div className="hotel-room-type-highlight">
          <span className="room-type-label">Room Type:</span>
          <strong>{hotel.roomType}</strong>
        </div>

        <div className="hotel-amenities-chip-grid">
          {hotel.amenities?.slice(0, 5).map((item) => (
            <span key={item} className="hotel-amenity-chip">
              {getAmenityIcon(item)}
              <span>{item}</span>
            </span>
          ))}
        </div>

        <div className="hotel-perks-row">
          {hotel.freeCancellation && (
            <span className="hotel-free-cancel-badge">
              <ShieldCheck size={13} />
              <span>Free Cancellation Available</span>
            </span>
          )}
          {hotel.breakfastIncluded && (
            <span className="hotel-breakfast-badge">
              <Coffee size={13} />
              <span>Complimentary Breakfast Included</span>
            </span>
          )}
        </div>
      </div>

      {/* Pricing & Booking CTA */}
      <div className="hotel-pricing-column">
        <div className="hotel-price-breakdown">
          {hotel.originalPrice && (
            <span className="hotel-original-price">₹{hotel.originalPrice.toLocaleString('en-IN')}</span>
          )}
          <div className="hotel-nightly-price-row">
            <span className="hotel-currency">₹</span>
            <strong className="hotel-amount">{hotel.pricePerNight.toLocaleString('en-IN')}</strong>
            <span className="hotel-per-night-lbl">/ night</span>
          </div>
          <span className="hotel-taxes-note">+ ₹{hotel.taxes || 450} taxes & service fee</span>
          <span className="hotel-zero-convenience">Zero convenience charges</span>
        </div>

        <button
          type="button"
          className="primary-btn luxury-hotel-book-btn"
          onClick={() => onBook(hotel)}
        >
          <span>Book Room</span>
          <Sparkles size={14} />
        </button>
      </div>
    </div>
  );
}
