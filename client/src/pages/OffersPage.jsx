import { useState } from 'react';
import { siteOffers } from '../data/siteData';
import { Tag, Copy, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';

export default function OffersPage() {
  const { showToast } = useBooking();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Flights', 'Hotels', 'Buses', 'Railway'];

  const filteredOffers =
    selectedCategory === 'All'
      ? siteOffers
      : siteOffers.filter((o) => o.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    showToast(`Promo Code ${code} copied to clipboard!`);
  };

  return (
    <div className="container page-wrap">
      <div className="page-shell">
        <div className="page-topbar">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Latest Offers</span>
        </div>

        <div className="offers-hero-banner">
          <h1>Exclusive Travel Deals & Discount Codes</h1>
          <p>Save extra on your flight tickets, luxury hotel stays, bus rides and train journeys.</p>
        </div>

        {/* Category Pills */}
        <div className="category-filter-strip">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`cat-pill-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Offers Grid */}
        <div className="offers-grid mt-4">
          {filteredOffers.map((offer) => (
            <div key={offer.id} className="offer-card large-offer-card">
              <div className="offer-img-box">
                <img src={offer.image} alt={offer.title} />
                <span className="offer-category-badge">{offer.category}</span>
              </div>
              <div className="offer-content">
                <div className="offer-discount-tag">{offer.discount}</div>
                <h3>{offer.title}</h3>
                <p>{offer.description}</p>
                <span className="validity-text">Valid till: {offer.validTill}</span>
                <div className="offer-code-row mt-3">
                  <span className="coupon-code-pill">CODE: {offer.code}</span>
                  <button
                    type="button"
                    className="copy-code-btn"
                    onClick={() => handleCopyCode(offer.code)}
                  >
                    <Copy size={14} /> Copy Code
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
