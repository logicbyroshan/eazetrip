import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trendingDestinations } from '../../data/siteData';
import { Compass, Sparkles, ArrowRight, Plane, Building2 } from 'lucide-react';

export default function TrendingDestinations() {
  const [activeTab, setActiveTab] = useState('india'); // 'india' | 'international'
  const navigate = useNavigate();

  const list = trendingDestinations[activeTab] || trendingDestinations.india;
  const heroItems = list.slice(0, 2);
  const secondaryItems = list.slice(2, 5);
  const extraItems = list.slice(5, 8);

  const handleDestinationClick = (item) => {
    if (item.query) {
      navigate(`/flight-booking?from=${item.query.from}&to=${item.query.to}&fromCity=${encodeURIComponent(item.query.fromCity)}&toCity=${encodeURIComponent(item.query.toCity)}`);
    } else {
      navigate('/flight-booking');
    }
  };

  return (
    <section className="section-block trending-destinations-block">
      <div className="container">
        {/* Section Header & Subtitle */}
        <div className="trending-dest-header">
          <div>
            <div className="section-tag-pill">
              <Compass size={14} />
              <span>POPULAR ESCAPES</span>
            </div>
            <h2 className="trending-title">Trending destinations</h2>
            <p className="trending-subtitle">Most popular choices for travelers from India</p>
          </div>

          {/* India vs International Tabs */}
          <div className="trending-nav-tabs">
            <button
              type="button"
              className={`trending-nav-btn ${activeTab === 'india' ? 'active' : ''}`}
              onClick={() => setActiveTab('india')}
            >
              <span className="tab-flag">🇮🇳</span>
              <span>Domestic (India)</span>
            </button>
            <button
              type="button"
              className={`trending-nav-btn ${activeTab === 'international' ? 'active' : ''}`}
              onClick={() => setActiveTab('international')}
            >
              <span className="tab-flag">🌐</span>
              <span>International</span>
            </button>
          </div>
        </div>

        {/* 2-Large Cards Top Row */}
        <div className="trending-grid-hero">
          {heroItems.map((item) => (
            <div
              key={item.id}
              className="trending-card trending-card-large"
              onClick={() => handleDestinationClick(item)}
              role="button"
              tabIndex={0}
            >
              <div className="trending-img-container">
                <img src={item.image} alt={item.name} loading="lazy" />
                <div className="trending-card-overlay"></div>
              </div>

              {/* Floating Badge with City Name & Flag */}
              <div className="trending-city-badge">
                <span className="city-name">{item.name}</span>
                <span className="city-flag">{item.flag}</span>
              </div>

              {/* Bottom Card Caption */}
              <div className="trending-card-meta">
                <span className="meta-tag">{item.tag}</span>
                <p className="meta-places">{item.places}</p>
                <div className="explore-hover-btn">
                  <span>Book Flights & Stays</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 3-Cards Middle Row */}
        <div className="trending-grid-triplet">
          {secondaryItems.map((item) => (
            <div
              key={item.id}
              className="trending-card trending-card-medium"
              onClick={() => handleDestinationClick(item)}
              role="button"
              tabIndex={0}
            >
              <div className="trending-img-container">
                <img src={item.image} alt={item.name} loading="lazy" />
                <div className="trending-card-overlay"></div>
              </div>

              <div className="trending-city-badge">
                <span className="city-name">{item.name}</span>
                <span className="city-flag">{item.flag}</span>
              </div>

              <div className="trending-card-meta">
                <span className="meta-tag">{item.tag}</span>
                <p className="meta-places">{item.places}</p>
                <div className="explore-hover-btn">
                  <span>Explore Route</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Extra Trending Hotspots Row */}
        {extraItems.length > 0 && (
          <div className="trending-grid-triplet extra-row">
            {extraItems.map((item) => (
              <div
                key={item.id}
                className="trending-card trending-card-medium"
                onClick={() => handleDestinationClick(item)}
                role="button"
                tabIndex={0}
              >
                <div className="trending-img-container">
                  <img src={item.image} alt={item.name} loading="lazy" />
                  <div className="trending-card-overlay"></div>
                </div>

                <div className="trending-city-badge">
                  <span className="city-name">{item.name}</span>
                  <span className="city-flag">{item.flag}</span>
                </div>

                <div className="trending-card-meta">
                  <span className="meta-tag">{item.tag}</span>
                  <p className="meta-places">{item.places}</p>
                  <div className="explore-hover-btn">
                    <span>Explore Route</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
