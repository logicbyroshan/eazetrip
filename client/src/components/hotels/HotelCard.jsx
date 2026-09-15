import { Star, MapPin, Check, Wifi, Coffee, Waves, Wind } from 'lucide-react';

export default function HotelCard({ hotel, onBook }) {
  const getAmenityIcon = (amenity) => {
    if (amenity.includes('WiFi')) return <Wifi size={14} />;
    if (amenity.includes('Breakfast')) return <Coffee size={14} />;
    if (amenity.includes('Pool')) return <Waves size={14} />;
    if (amenity.includes('Conditioning') || amenity.includes('AC')) return <Wind size={14} />;
    return <Check size={14} />;
  };

  return (
    <div className="hotel-card">
      <div className="hotel-image-wrap">
        <img src={hotel.image} alt={hotel.name} className="hotel-thumb" />
        {hotel.discountText && (
          <span className="discount-tag">{hotel.discountText}</span>
        )}
      </div>

      <div className="hotel-info-col">
        <div className="hotel-top-meta">
          <div className="star-rating-row">
            {Array.from({ length: hotel.starRating }).map((_, i) => (
              <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
            ))}
            <span className="star-text">{hotel.starRating} Star Property</span>
          </div>
          <div className="user-score-badge">
            <span className="score-num">{hotel.userRating}</span>
            <span className="score-label">/ 5 ({hotel.reviewsCount} reviews)</span>
          </div>
        </div>

        <h3 className="hotel-title">{hotel.name}</h3>

        <div className="hotel-location-row">
          <MapPin size={15} className="location-pin" />
          <span>{hotel.location}</span>
        </div>

        <div className="hotel-room-type">
          <strong>Room:</strong> {hotel.roomType}
        </div>

        <div className="hotel-amenities-strip">
          {hotel.amenities?.slice(0, 4).map((item) => (
            <span key={item} className="amenity-chip">
              {getAmenityIcon(item)}
              <span>{item}</span>
            </span>
          ))}
        </div>

        {hotel.freeCancellation && (
          <span className="free-cancel-tag">✓ Free Cancellation Available</span>
        )}
      </div>

      <div className="hotel-price-col">
        <div className="hotel-pricing-box">
          {hotel.originalPrice && (
            <span className="orig-price">₹{hotel.originalPrice.toLocaleString('en-IN')}</span>
          )}
          <div className="current-price-row">
            <span className="currency">₹</span>
            <strong>{hotel.pricePerNight.toLocaleString('en-IN')}</strong>
          </div>
          <span className="per-night-text">+ ₹{hotel.taxes} taxes / night</span>
        </div>

        <button
          type="button"
          className="primary-btn full book-hotel-btn"
          onClick={() => onBook(hotel)}
        >
          Book Room
        </button>
      </div>
    </div>
  );
}
