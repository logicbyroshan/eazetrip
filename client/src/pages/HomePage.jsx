import { useState } from 'react';
import { Link } from 'react-router-dom';
import FlightSearchWidget from '../components/search/FlightSearchWidget';
import HotelSearchWidget from '../components/search/HotelSearchWidget';
import BusSearchWidget from '../components/search/BusSearchWidget';
import TrainSearchWidget from '../components/search/TrainSearchWidget';
import { siteOffers, siteTestimonials, siteFaqs, HERO_BACKDROPS } from '../data/siteData';
import { Plane, Building2, Bus, Train, ShieldCheck, Check, Star, ArrowRight, Tag, Copy } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('flights'); // flights | hotels | bus | railway
  const { showToast } = useBooking();

  const currentHero = HERO_BACKDROPS[activeTab] || HERO_BACKDROPS.flights;

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    showToast(`Promo Code ${code} copied to clipboard!`);
  };

  return (
    <div className="home-page">
      {/* Dynamic Hero Section */}
      <section
        className="hero-section dynamic-hero"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(10, 25, 47, 0.82) 0%, rgba(17, 34, 64, 0.88) 100%), url('${currentHero.url}')`
        }}
      >
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-headline">
              {currentHero.title}
            </h1>
            <p className="hero-subheadline">
              {currentHero.subtitle}
            </p>

            {/* Hero Search Box Card */}
            <div className="hero-search-wrapper">
              {/* Category Switcher Tabs */}
              <div className="hero-search-tabs">
                <button
                  type="button"
                  className={`hero-tab-btn ${activeTab === 'flights' ? 'active' : ''}`}
                  onClick={() => setActiveTab('flights')}
                >
                  <Plane size={18} />
                  <span>Flights</span>
                </button>
                <button
                  type="button"
                  className={`hero-tab-btn ${activeTab === 'hotels' ? 'active' : ''}`}
                  onClick={() => setActiveTab('hotels')}
                >
                  <Building2 size={18} />
                  <span>Hotels</span>
                </button>
                <button
                  type="button"
                  className={`hero-tab-btn ${activeTab === 'bus' ? 'active' : ''}`}
                  onClick={() => setActiveTab('bus')}
                >
                  <Bus size={18} />
                  <span>Bus</span>
                </button>
                <button
                  type="button"
                  className={`hero-tab-btn ${activeTab === 'railway' ? 'active' : ''}`}
                  onClick={() => setActiveTab('railway')}
                >
                  <Train size={18} />
                  <span>Railway</span>
                </button>
              </div>

              {/* Active Tab Search Form */}
              <div className="hero-search-content">
                {activeTab === 'flights' && <FlightSearchWidget />}
                {activeTab === 'hotels' && <HotelSearchWidget />}
                {activeTab === 'bus' && <BusSearchWidget />}
                {activeTab === 'railway' && <TrainSearchWidget />}
              </div>
            </div>
          </div>
        </div>

        {/* Assurance Strip */}
        <div className="container">
          <div className="assurance-banner">
            <div className="assurance-item">
              <span className="assurance-icon">🌍</span>
              <p>Get more for less: Affordable travel options at your fingertips.</p>
            </div>
            <div className="assurance-item">
              <span className="assurance-icon">🎟️</span>
              <p>No hassle, no stress, simple bookings with great savings!</p>
            </div>
            <div className="assurance-item">
              <span className="assurance-icon">🧑‍✈️</span>
              <p>Your journey, our commitment—reliable service, every time.</p>
            </div>
            <div className="assurance-item">
              <span className="assurance-icon">📱</span>
              <p>Instant confirmation, e-tickets & 24/7 dedicated support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Offers Section */}
      <section className="section-block offers-section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-tag">HOT DEALS</span>
              <h2>Latest Travel Offers</h2>
            </div>
            <Link to="/offers" className="view-all-link">
              View All Offers <ArrowRight size={16} />
            </Link>
          </div>

          <div className="offers-grid">
            {siteOffers.map((offer) => (
              <div key={offer.id} className="offer-card">
                <div className="offer-img-box">
                  <img src={offer.image} alt={offer.title} />
                  <span className="offer-category-badge">{offer.category}</span>
                </div>
                <div className="offer-content">
                  <div className="offer-discount-tag">{offer.discount}</div>
                  <h3>{offer.title}</h3>
                  <p>{offer.description}</p>
                  <div className="offer-code-row">
                    <span className="coupon-code-pill">CODE: {offer.code}</span>
                    <button
                      type="button"
                      className="copy-code-btn"
                      onClick={() => handleCopyCode(offer.code)}
                      title="Copy Code"
                    >
                      <Copy size={14} /> Copy
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore by Category */}
      <section className="section-block categories-section bg-muted">
        <div className="container">
          <div className="section-header center">
            <span className="section-tag">SERVICES</span>
            <h2>Explore by Category</h2>
            <p>Seamless booking experience across all key travel verticals</p>
          </div>

          <div className="category-cards-grid">
            <Link to="/flight-booking" className="cat-card">
              <div className="cat-icon-box flight-cat">
                <Plane size={32} />
              </div>
              <h3>Flights</h3>
              <p>Domestic & International flights at lowest guaranteed fares</p>
              <span className="cat-link-text">Book Flights →</span>
            </Link>

            <Link to="/hotel-booking" className="cat-card">
              <div className="cat-icon-box hotel-cat">
                <Building2 size={32} />
              </div>
              <h3>Hotels & Stays</h3>
              <p>Handpicked luxury resorts, boutique hotels and budget stays</p>
              <span className="cat-link-text">Explore Stays →</span>
            </Link>

            <Link to="/bus-booking" className="cat-card">
              <div className="cat-icon-box bus-cat">
                <Bus size={32} />
              </div>
              <h3>Bus Tickets</h3>
              <p>AC Sleeper, Bharat Benz & Volvo buses with live tracking</p>
              <span className="cat-link-text">Find Buses →</span>
            </Link>

            <Link to="/railway" className="cat-card">
              <div className="cat-icon-box train-cat">
                <Train size={32} />
              </div>
              <h3>Railway</h3>
              <p>IRCTC authorized train bookings, PNR status & seat alerts</p>
              <span className="cat-link-text">Search Trains →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section-block why-choose-section">
        <div className="container">
          <div className="section-header center">
            <span className="section-tag">WHY US</span>
            <h2>Why Choose EazeTrip</h2>
            <p>We combine cutting-edge travel technology with exceptional customer care</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-badge">✓</div>
              <h3>Best Price Guarantee</h3>
              <p>
                Transparent pricing with zero hidden charges. Get access to exclusive discounts and special fares.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-badge">⚡</div>
              <h3>Fast & Easy Booking</h3>
              <p>
                Intuitive search, smart filters, real-time seat selection, and instant e-ticket issuance.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-badge">🛡️</div>
              <h3>100% Safe & Secure</h3>
              <p>
                Encrypted payment gateways supporting UPI, Cards, Net Banking, and zero cancellation convenience fee.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-block testimonials-section bg-muted">
        <div className="container">
          <div className="section-header center">
            <span className="section-tag">REVIEWS</span>
            <h2>What Travellers Say</h2>
          </div>

          <div className="testimonials-grid">
            {siteTestimonials.map((t, idx) => (
              <div key={idx} className="testimonial-card">
                <div className="testimonial-stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <p className="testimonial-quote">“{t.quote}”</p>
                <div className="testimonial-author">
                  <strong>{t.author}</strong>
                  <small>{t.city} • {t.service}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Preview Section */}
      <section className="section-block home-faq-section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-tag">NEED HELP?</span>
              <h2>Frequently Asked Questions</h2>
            </div>
            <Link to="/faq" className="view-all-link">
              View All FAQs <ArrowRight size={16} />
            </Link>
          </div>

          <div className="faq-preview-grid">
            {siteFaqs[0].items.map((item, idx) => (
              <div key={idx} className="faq-card-preview">
                <h4>{item.q}</h4>
                <p>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
