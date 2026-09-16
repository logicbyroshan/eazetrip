import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { specialBankOffers } from '../../data/siteData';
import { ChevronLeft, ChevronRight, Copy, Check, ArrowRight, Tag, Sparkles } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';

export default function SpecialOffersSection() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [copiedCode, setCopiedCode] = useState(null);
  const carouselRef = useRef(null);
  const { showToast } = useBooking();
  const { user } = useAuth();
  const firstName = user?.name ? user.name.split(' ')[0] : '';

  const categories = ['All', 'Flights', 'Hotels', 'Buses', 'Railway'];

  const filteredOffers = activeCategory === 'All'
    ? specialBankOffers
    : specialBankOffers.filter(o => o.category.toLowerCase() === activeCategory.toLowerCase());

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Coupon Code ${code} copied to clipboard!`);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -370, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 370, behavior: 'smooth' });
    }
  };

  return (
    <section className="section-block special-offers-block">
      <div className="container">
        {/* Top Promotional Campaign Banner */}
        <div className="campaign-promo-banner">
          <div className="promo-banner-left">
            <div className="promo-banner-title-wrap">
              <span className="promo-banner-sun">☀️</span>
              <h3 className="promo-banner-title">Pack your Journey</h3>
            </div>
            <div className="promo-banner-discount">
              <span className="discount-prefix">UP TO</span>
              <span className="discount-highlight">65%</span>
              <span className="discount-suffix">OFF*</span>
            </div>
          </div>

          <div className="promo-banner-middle">
            <div className="promo-category-pills">
              <span>✈️ Flights</span>
              <span>🏨 Hotels</span>
              <span>🚌 Buses</span>
              <span>🚆 Trains</span>
            </div>
          </div>

          <div className="promo-banner-right">
            <div className="promo-code-box">
              <span className="promo-code-label">Code:</span>
              <strong className="promo-code-val">EAZETRIP</strong>
              <button
                type="button"
                className="promo-copy-pin-btn"
                onClick={() => handleCopy('EAZETRIP')}
                title="Copy Code"
              >
                {copiedCode === 'EAZETRIP' ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        </div>

        {/* Special Offers White Enclosed Card Container */}
        <div className="special-offers-main-card">
          {/* Header & Carousel Arrows */}
          <div className="special-offers-header">
            <div className="offers-title-group">
              <h2>{firstName ? `Special Offers For You, ${firstName}` : 'Special Offers'}</h2>
              <p className="offers-sub-text">
                {firstName
                  ? `Handpicked bank discounts, card savings, and exclusive member vouchers curated for ${firstName}`
                  : 'Exclusive bank discounts, card savings and instant cashback'}
              </p>
            </div>

            <div className="offers-controls">
              <button
                type="button"
                className="carousel-arrow-btn"
                onClick={scrollLeft}
                aria-label="Previous offers"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                className="carousel-arrow-btn"
                onClick={scrollRight}
                aria-label="Next offers"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="special-offers-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`offer-filter-tab ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Bank Offers Horizontal Carousel / Grid */}
          <div className="bank-offers-carousel" ref={carouselRef}>
            {filteredOffers.map((offer) => (
              <div key={offer.id} className="bank-offer-card">
                {/* Left Scenic Image with Curved Cutout */}
                <div className="bank-card-media">
                  <img src={offer.image} alt={offer.title} />
                  <div className="bank-pill-badge" style={{ backgroundColor: offer.bankTheme || '#034ea2' }}>
                    <span>{offer.bank}</span>
                  </div>
                </div>

                {/* Right Offer Details */}
                <div className="bank-card-details">
                  <h4 className="bank-offer-amount">{offer.title}</h4>
                  <p className="bank-offer-category-label">{offer.subtitle}</p>
                  <p className="bank-offer-terms">{offer.terms}</p>

                  <div className="bank-offer-action-bar">
                    <button
                      type="button"
                      className="bank-code-btn"
                      onClick={() => handleCopy(offer.code)}
                      title="Click to copy coupon code"
                    >
                      <span>{offer.code}</span>
                      {copiedCode === offer.code ? (
                        <Check size={14} className="code-copy-icon success" />
                      ) : (
                        <Copy size={14} className="code-copy-icon" />
                      )}
                    </button>

                    <Link to={offer.link} className="bank-view-details-link">
                      View Details &gt;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Offers Link at Bottom */}
          <div className="special-offers-footer">
            <Link to="/offers" className="view-all-offers-main-btn">
              <span>View all offers</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
