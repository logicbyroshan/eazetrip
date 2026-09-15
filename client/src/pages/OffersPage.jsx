import { useState } from 'react';
import { specialBankOffers, siteOffers } from '../data/siteData';
import { Copy, ArrowRight, Sparkles, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';

export default function OffersPage() {
  const { showToast } = useBooking();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedCode, setCopiedCode] = useState(null);

  const categories = ['All', 'Flights', 'Hotels', 'Buses', 'Railway'];

  // Combine special bank offers and general promotional offers
  const allOffersList = [
    ...specialBankOffers.map((b) => ({
      id: b.id,
      bank: b.bank,
      bankLogo: b.bankLogo,
      bankTheme: b.bankTheme,
      title: b.title,
      subtitle: b.subtitle,
      terms: b.terms,
      code: b.code,
      image: b.image,
      category: b.category,
      link: b.link
    })),
    ...siteOffers.map((o) => ({
      id: `site-${o.id}`,
      bank: 'EAZETRIP SPECIAL',
      bankLogo: null,
      bankTheme: '#034ea2',
      title: o.discount,
      subtitle: o.title,
      terms: `Valid till: ${o.validTill}`,
      code: o.code,
      image: o.image,
      category: o.category,
      link: o.category === 'Hotels' ? '/hotel-booking' : o.category === 'Buses' ? '/bus-booking' : o.category === 'Railway' ? '/railway' : '/flight-booking'
    }))
  ];

  const filteredOffers =
    selectedCategory === 'All'
      ? allOffersList
      : allOffersList.filter(
          (o) => o.category?.toLowerCase() === selectedCategory.toLowerCase()
        );

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Promo Code ${code} copied to clipboard!`);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <div className="container page-wrap">
      <div className="page-shell">
        <div className="page-topbar">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Exclusive Offers & Deals</span>
        </div>

        {/* Campaign Promo Top Banner */}
        <div className="campaign-promo-banner offers-page-banner">
          <div className="promo-banner-left">
            <div className="promo-badge-glow">
              <Sparkles size={16} />
              <span>LIMITED TIME FESTIVE SALE</span>
            </div>
            <h1>Pack Your Journey — UP TO 65% OFF*</h1>
            <p>
              Unlock mega flight discounts, luxury hotel cashbacks, and flat bus & train fare cuts with official bank cards & exclusive coupon codes.
            </p>
          </div>
          <div className="promo-banner-right">
            <div className="code-pill-box">
              <span className="code-label">Use Universal Code:</span>
              <strong className="code-text">EAZETRIP</strong>
              <button
                type="button"
                className="copy-banner-btn"
                onClick={() => handleCopyCode('EAZETRIP')}
              >
                {copiedCode === 'EAZETRIP' ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedCode === 'EAZETRIP' ? 'COPIED' : 'COPY CODE'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Navigation Strip */}
        <div className="offers-filter-wrapper mt-4">
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
          <span className="offers-count-indicator">
            Showing <strong>{filteredOffers.length}</strong> active offers
          </span>
        </div>

        {/* High-Impact Offers Grid */}
        <div className="offers-cards-grid mt-4">
          {filteredOffers.map((offer) => (
            <div key={offer.id} className="elevated-offer-card">
              <div className="offer-card-media">
                <img src={offer.image} alt={offer.title} className="offer-img" />
                <span className="offer-badge-category">{offer.category}</span>
                {offer.bank && (
                  <span
                    className="offer-bank-badge"
                    style={{ backgroundColor: offer.bankTheme || '#034ea2' }}
                  >
                    {offer.bank}
                  </span>
                )}
              </div>

              <div className="offer-card-body">
                <h3 className="offer-title-highlight">{offer.title}</h3>
                <h4 className="offer-subtitle">{offer.subtitle}</h4>
                <p className="offer-terms-note">{offer.terms}</p>

                <div className="offer-card-footer">
                  <div className="code-display-wrap">
                    <span className="code-tag">CODE:</span>
                    <strong className="code-string">{offer.code}</strong>
                  </div>

                  <div className="offer-action-row">
                    <button
                      type="button"
                      className="copy-action-btn"
                      onClick={() => handleCopyCode(offer.code)}
                      title="Copy Promo Code"
                    >
                      {copiedCode === offer.code ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copiedCode === offer.code ? 'COPIED' : 'COPY'}</span>
                    </button>

                    <Link to={offer.link || '/flight-booking'} className="book-deal-btn">
                      <span>Book Now</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
