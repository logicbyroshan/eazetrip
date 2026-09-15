import { useState } from 'react';
import { Link } from 'react-router-dom';
import FlightSearchWidget from '../components/search/FlightSearchWidget';
import HotelSearchWidget from '../components/search/HotelSearchWidget';
import BusSearchWidget from '../components/search/BusSearchWidget';
import TrainSearchWidget from '../components/search/TrainSearchWidget';
import SpecialOffersSection from '../components/home/SpecialOffersSection';
import PopularAirlines from '../components/home/PopularAirlines';
import TrendingFlightRoutes from '../components/home/TrendingFlightRoutes';
import TrendingDestinations from '../components/home/TrendingDestinations';
import { siteTestimonials, siteFaqs, HERO_BACKDROPS } from '../data/siteData';
import { Plane, Building2, Bus, Train, ShieldCheck, Check, Star, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('flights'); // flights | hotels | bus | railway

  const currentHero = HERO_BACKDROPS[activeTab] || HERO_BACKDROPS.flights;

  return (
    <div className="home-page">
      {/* Dynamic Hero Section - Light Luminous Gradient Overlay */}
      <section
        className="hero-section dynamic-hero"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(10, 25, 47, 0.40) 0%, rgba(17, 34, 64, 0.52) 100%), url('${currentHero.url}')`
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

            {/* Hero Search Box Card - Glassmorphism Translucent Styling */}
            <div className="hero-search-wrapper glassmorphic-search-card">
              {/* Category Switcher Tabs (Matching Screenshot 1) */}
              <div className="hero-search-tabs illustrated-tabs">
                {/* 1. Flights */}
                <button
                  type="button"
                  className={`hero-tab-btn ${activeTab === 'flights' ? 'active' : ''}`}
                  onClick={() => setActiveTab('flights')}
                >
                  <div className="tab-icon-peach-circle">
                    <svg viewBox="0 0 48 48" width="30" height="30" className="tab-svg-art">
                      <path d="M8 26 L22 22 L38 12 C41 10 44 11 44 14 C44 16 42 18 39 19 L26 27 L28 38 L23 40 L18 30 L10 32 L8 26 Z" fill="#0284c7" />
                      <path d="M12 28 L24 24 L36 15 C38 14 40 14 41 16 C41 17 40 18 38 19 L26 26 L24 34 L21 35 L19 28 L14 29 Z" fill="#ffffff" opacity="0.9" />
                      <circle cx="28" cy="28" r="3" fill="#f97316" />
                      <path d="M4 36 C14 36 28 32 44 26" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.8" />
                    </svg>
                  </div>
                  <span className="tab-label-text">Flights</span>
                  {activeTab === 'flights' && <div className="tab-active-indicator"></div>}
                </button>

                {/* 2. Hotels */}
                <button
                  type="button"
                  className={`hero-tab-btn ${activeTab === 'hotels' ? 'active' : ''}`}
                  onClick={() => setActiveTab('hotels')}
                >
                  <div className="tab-discount-tag-pill">Flat 80% Off</div>
                  <div className="tab-icon-peach-circle">
                    <svg viewBox="0 0 48 48" width="30" height="30" className="tab-svg-art">
                      <rect x="12" y="12" width="24" height="28" rx="2" fill="#0284c7" />
                      <rect x="16" y="16" width="4" height="4" fill="#ffffff" />
                      <rect x="24" y="16" width="4" height="4" fill="#ffffff" />
                      <rect x="16" y="24" width="4" height="4" fill="#ffffff" />
                      <rect x="24" y="24" width="4" height="4" fill="#ffffff" />
                      <rect x="16" y="32" width="4" height="4" fill="#ffffff" />
                      <rect x="24" y="32" width="4" height="4" fill="#ffffff" />
                      <path d="M20 40 L28 40 L28 34 L20 34 Z" fill="#0f172a" />
                      <path d="M36 20 L42 24 L42 40 L36 40 Z" fill="#38bdf8" />
                    </svg>
                  </div>
                  <span className="tab-label-text">Hotels</span>
                  {activeTab === 'hotels' && <div className="tab-active-indicator"></div>}
                </button>

                {/* 3. Railway / Trains */}
                <button
                  type="button"
                  className={`hero-tab-btn ${activeTab === 'railway' ? 'active' : ''}`}
                  onClick={() => setActiveTab('railway')}
                >
                  <div className="tab-icon-peach-circle">
                    <svg viewBox="0 0 48 48" width="30" height="30" className="tab-svg-art">
                      <path d="M14 10 C14 8 16 6 24 6 C32 6 34 8 34 10 L36 34 C36 37 33 38 24 38 C15 38 12 37 12 34 Z" fill="#034ea2" />
                      <rect x="16" y="12" width="16" height="10" rx="2" fill="#ffffff" />
                      <path d="M16 12 L32 12 L32 18 L16 18 Z" fill="#38bdf8" />
                      <circle cx="18" cy="28" r="2.5" fill="#f59e0b" />
                      <circle cx="30" cy="28" r="2.5" fill="#f59e0b" />
                      <rect x="20" y="26" width="8" height="4" rx="1" fill="#f97316" />
                      <path d="M14 38 L10 44 M34 38 L38 44" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span className="tab-label-text">Trains</span>
                  {activeTab === 'railway' && <div className="tab-active-indicator"></div>}
                </button>

                {/* 4. Buses */}
                <button
                  type="button"
                  className={`hero-tab-btn ${activeTab === 'bus' ? 'active' : ''}`}
                  onClick={() => setActiveTab('bus')}
                >
                  <div className="tab-icon-peach-circle">
                    <svg viewBox="0 0 48 48" width="30" height="30" className="tab-svg-art">
                      <path d="M12 10 C12 8 15 6 24 6 C33 6 36 8 36 10 L38 34 C38 37 35 38 24 38 C13 38 10 37 10 34 Z" fill="#0284c7" />
                      <rect x="14" y="12" width="20" height="12" rx="2" fill="#ffffff" />
                      <path d="M14 12 L34 12 L34 19 L14 19 Z" fill="#38bdf8" />
                      <circle cx="16" cy="30" r="2.5" fill="#f97316" />
                      <circle cx="32" cy="30" r="2.5" fill="#f97316" />
                      <rect x="19" y="28" width="10" height="4" rx="1" fill="#ffffff" />
                      <circle cx="13" cy="38" r="3" fill="#0f172a" />
                      <circle cx="35" cy="38" r="3" fill="#0f172a" />
                    </svg>
                  </div>
                  <span className="tab-label-text">Buses</span>
                  {activeTab === 'bus' && <div className="tab-active-indicator"></div>}
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

      {/* Special Offers Section with Bank Offers Carousel & Campaign Banner (Image 2 Style) */}
      <SpecialOffersSection />

      {/* Popular Domestic Airlines Strip (Screenshot 2 Style) */}
      <PopularAirlines />

      {/* Trending Flight Routes Grid (Screenshot 3 Style) */}
      <TrendingFlightRoutes />

      {/* Trending Destinations with India & International Tabs (Image 4 Style) */}
      <TrendingDestinations />

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
