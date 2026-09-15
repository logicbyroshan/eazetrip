import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trendingFlightRoutesGrid } from '../../data/siteData';
import { ArrowLeftRight } from 'lucide-react';

export default function TrendingFlightRoutes() {
  const [tab, setTab] = useState('domestic'); // 'domestic' | 'international'
  const navigate = useNavigate();

  const routes = trendingFlightRoutesGrid[tab] || trendingFlightRoutesGrid.domestic;

  const handleRouteClick = (route) => {
    navigate(`/flight-booking?from=${route.fromCode}&to=${route.toCode}&fromCity=${encodeURIComponent(route.from)}&toCity=${encodeURIComponent(route.to)}`);
  };

  return (
    <section className="section-block trending-flight-routes-block">
      <div className="container">
        {/* Header with Title and Domestic/International Filter */}
        <div className="trending-routes-header">
          <div>
            <h2 className="routes-main-title">
              Trending <span className="routes-highlight-red">FLIGHT ROUTES</span>
            </h2>
            <p className="routes-sub-desc">Quick view of popular flights routes worldwide</p>
          </div>

          <div className="routes-toggle-group">
            <button
              type="button"
              className={`routes-toggle-btn ${tab === 'domestic' ? 'active' : ''}`}
              onClick={() => setTab('domestic')}
            >
              DOMESTIC
            </button>
            <button
              type="button"
              className={`routes-toggle-btn ${tab === 'international' ? 'active' : ''}`}
              onClick={() => setTab('international')}
            >
              INTERNATIONAL
            </button>
          </div>
        </div>

        {/* 4-Column Grid of Route Cards (Matching Screenshot 3) */}
        <div className="routes-cards-grid">
          {routes.map((r) => (
            <div
              key={r.id}
              className="route-item-card"
              onClick={() => handleRouteClick(r)}
              role="button"
              tabIndex={0}
            >
              {/* Left Destination Landmark Image */}
              <div className="route-thumb-box">
                <img src={r.image} alt={`${r.from} to ${r.to}`} loading="lazy" />
              </div>

              {/* Right Route Cities & Arrow */}
              <div className="route-details-box">
                <span className="route-city-name">{r.from}</span>
                <div className="route-arrow-icon-wrap">
                  <ArrowLeftRight size={13} />
                </div>
                <span className="route-city-name">{r.to}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
