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
import TravelCategoriesSection from '../components/home/TravelCategoriesSection';
import ReviewsSection from '../components/home/ReviewsSection';
import { HERO_BACKDROPS } from '../data/siteData';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('flights'); // flights | hotels | bus | railway

  const currentHero = HERO_BACKDROPS[activeTab] || HERO_BACKDROPS.flights;

  return (
    <div className="home-page">
      {/* Dynamic Hero Section with Luminous Backdrop Overlay */}
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

            {/* Hero Search Box Card - Translucent Glassmorphic Container */}
            <div className="hero-search-wrapper glassmorphic-search-card">
              {/* Clean Travel Category Switcher Tabs */}
              <div className="hero-search-tabs modern-clean-tabs">
                {/* 1. Flights */}
                <button
                  type="button"
                  className={`hero-tab-btn ${activeTab === 'flights' ? 'active' : ''}`}
                  onClick={() => setActiveTab('flights')}
                >
                  <div className="tab-icon-circle flight-bg">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" fill="#0284c7" stroke="#0284c7" />
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
                  <div className="tab-icon-circle hotel-bg">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z" fill="#0097a7" stroke="#0097a7" opacity="0.15" />
                      <path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z" stroke="#0097a7" />
                      <path d="M9 16v4" stroke="#0097a7" />
                      <path d="M15 16v4" stroke="#0097a7" />
                      <path d="M8 6h2" stroke="#0097a7" />
                      <path d="M14 6h2" stroke="#0097a7" />
                      <path d="M8 10h2" stroke="#0097a7" />
                      <path d="M14 10h2" stroke="#0097a7" />
                    </svg>
                  </div>
                  <span className="tab-label-text">Hotels</span>
                  {activeTab === 'hotels' && <div className="tab-active-indicator"></div>}
                </button>

                {/* 3. Trains */}
                <button
                  type="button"
                  className={`hero-tab-btn ${activeTab === 'railway' ? 'active' : ''}`}
                  onClick={() => setActiveTab('railway')}
                >
                  <div className="tab-icon-circle train-bg">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="4" y="3" width="16" height="16" rx="2" fill="#7c3aed" opacity="0.15" />
                      <rect x="4" y="3" width="16" height="16" rx="2" stroke="#7c3aed" />
                      <path d="M4 11h16" stroke="#7c3aed" />
                      <path d="M12 3v8" stroke="#7c3aed" />
                      <path d="m8 19-3 3" stroke="#7c3aed" />
                      <path d="m16 19 3 3" stroke="#7c3aed" />
                      <circle cx="8" cy="15" r="1" fill="#7c3aed" />
                      <circle cx="16" cy="15" r="1" fill="#7c3aed" />
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
                  <div className="tab-icon-circle bus-bg">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 6v6" stroke="#16a34a" />
                      <path d="M16 6v6" stroke="#16a34a" />
                      <path d="M4 6h16" stroke="#16a34a" />
                      <path d="M4 16h16" stroke="#16a34a" />
                      <rect x="4" y="3" width="16" height="15" rx="2" fill="#16a34a" opacity="0.15" />
                      <rect x="4" y="3" width="16" height="15" rx="2" stroke="#16a34a" />
                      <path d="m6 18-2 3" stroke="#16a34a" />
                      <path d="m18 18 2 3" stroke="#16a34a" />
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

      {/* Special Offers Section with Bank Offers Carousel & Campaign Banner */}
      <SpecialOffersSection />

      {/* Popular Airlines Strip with Domestic & International Tabs */}
      <PopularAirlines />

      {/* Trending Flight Routes Grid */}
      <TrendingFlightRoutes />

      {/* Trending Destinations with India & International Tabs */}
      <TrendingDestinations />

      {/* Travel Categories 5-Card Staggered Wave Section */}
      <TravelCategoriesSection />

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

      {/* Modern Verified Reviews & Ratings Section */}
      <ReviewsSection />
    </div>
  );
}
