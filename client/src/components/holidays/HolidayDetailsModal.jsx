import { useEffect } from 'react';
import { X, Check, MapPin, Clock, Star, Calendar, ArrowRight, ShieldCheck, Building2, Utensils, Plane } from 'lucide-react';

export default function HolidayDetailsModal({ pkg, onClose, onBook }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!pkg) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container holiday-details-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="holiday-modal-title"
      >
        <div className="modal-header-custom">
          <div>
            <h3 id="holiday-modal-title">{pkg.title}</h3>
            <span className="sub-tagline">
              {pkg.destination} • {pkg.duration} • {pkg.theme}
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="holiday-modal-body">
          {/* Top Banner with Image & Highlights */}
          <div className="holiday-modal-hero">
            <img src={pkg.image} alt={pkg.title} className="modal-hero-img" />
            <div className="modal-hero-overlay">
              <div className="modal-highlights-chips">
                {pkg.highlights?.map((h, i) => (
                  <span key={i} className="modal-highlight-pill">
                    ✨ {h}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing & Key Quick Stats */}
          <div className="modal-quick-stats-strip">
            <div>
              <small>Duration</small>
              <strong>{pkg.duration}</strong>
            </div>
            <div>
              <small>Hotel Category</small>
              <strong>{pkg.hotelName || pkg.hotelRating}</strong>
            </div>
            <div>
              <small>Customer Rating</small>
              <strong>⭐ {pkg.rating} / 5.0</strong>
            </div>
            <div className="modal-price-stat">
              <small>All-Inclusive Fare</small>
              <strong>₹{pkg.price.toLocaleString('en-IN')}</strong>
            </div>
          </div>

          {/* Day-by-Day Detailed Itinerary */}
          <div className="itinerary-timeline-section">
            <h4>📅 Day-Wise Detailed Itinerary</h4>
            <div className="itinerary-timeline">
              {pkg.itinerary?.map((item) => (
                <div key={item.day} className="timeline-node">
                  <div className="timeline-marker">Day {item.day}</div>
                  <div className="timeline-content">
                    <h5>{item.title}</h5>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions & Stays */}
          <div className="inclusions-grid-box">
            <h4>✅ Package Inclusions</h4>
            <div className="inclusions-checklist">
              {pkg.inclusions?.map((inc, idx) => (
                <div key={idx} className="inclusion-item">
                  <Check size={16} color="#16a34a" />
                  <span>{inc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer with Book CTA */}
        <div className="modal-footer-sticky">
          <div className="modal-footer-price">
            <span className="lbl">Total Package Price:</span>
            <strong>₹{pkg.price.toLocaleString('en-IN')} <small>/ person (Incl. Taxes)</small></strong>
          </div>
          <button
            type="button"
            className="primary-btn"
            onClick={() => {
              onClose();
              onBook(pkg);
            }}
          >
            BOOK THIS HOLIDAY <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
