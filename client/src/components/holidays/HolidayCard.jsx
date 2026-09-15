import { MapPin, Clock, Star, Sparkles, Check, ArrowRight, ShieldCheck, Utensils, Plane, Building2, Eye } from 'lucide-react';

export default function HolidayCard({ pkg, onBook, onViewDetails }) {
  return (
    <div className="holiday-card luxury-holiday-card">
      {/* Image Block */}
      <div className="holiday-img-col">
        <img src={pkg.image} alt={pkg.title} className="holiday-img" loading="lazy" />
        <div className="holiday-duration-badge">
          <Clock size={13} /> {pkg.duration}
        </div>
        <div className="holiday-category-badge">
          {pkg.category} • {pkg.theme}
        </div>
        {pkg.discountPercent && (
          <div className="holiday-discount-badge">{pkg.discountPercent}</div>
        )}
      </div>

      {/* Content Block */}
      <div className="holiday-content-col">
        <div className="holiday-title-row">
          <div>
            <div className="holiday-rating-strip">
              <span className="star-badge">
                <Star size={13} fill="#f59e0b" color="#f59e0b" /> {pkg.rating}
              </span>
              <span className="reviews-text">({pkg.reviewsCount} travelers reviewed)</span>
              <span className="verified-pill">
                <ShieldCheck size={13} /> Handcrafted Tour
              </span>
            </div>
            <h3 className="holiday-title">{pkg.title}</h3>
            <span className="holiday-dest">
              <MapPin size={14} color="#034ea2" /> Destination: <strong>{pkg.destination}</strong> ({pkg.nights} Nights / {pkg.days} Days)
            </span>
          </div>
        </div>

        {/* Accommodation & Inclusions summary */}
        <div className="holiday-stays-row">
          <div className="stay-pill">
            <Building2 size={14} color="#0097a7" />
            <span>{pkg.hotelName || pkg.hotelRating}</span>
          </div>
          <div className="stay-pill">
            <Plane size={14} color="#034ea2" />
            <span>Transfers & Sightseeing Included</span>
          </div>
        </div>

        {/* Inclusions Chips */}
        <div className="holiday-inclusions-list">
          {pkg.inclusions?.slice(0, 3).map((inc, idx) => (
            <div key={idx} className="inclusion-chip">
              <Check size={13} color="#16a34a" />
              <span>{inc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing & Action Block */}
      <div className="holiday-price-col">
        <div className="price-tag-wrap">
          {pkg.originalPrice && (
            <span className="orig-price">₹{pkg.originalPrice.toLocaleString('en-IN')}</span>
          )}
          <div className="main-price">
            <span className="curr">₹</span>
            <strong>{pkg.price.toLocaleString('en-IN')}</strong>
            <span className="pax-text">/ person</span>
          </div>
          <span className="tax-inclusive">Includes GST & All Stays</span>
        </div>

        <div className="holiday-actions">
          <button
            type="button"
            className="holiday-view-btn"
            onClick={() => onViewDetails(pkg)}
          >
            <Eye size={14} /> View Itinerary
          </button>
          <button
            type="button"
            className="holiday-book-btn"
            onClick={() => onBook(pkg)}
          >
            BOOK PACKAGE <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
