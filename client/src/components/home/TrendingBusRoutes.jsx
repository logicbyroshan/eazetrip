import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trendingBusRoutesGrid } from '../../data/siteData';
import { ArrowLeftRight, Clock, Bus, Zap, ChevronRight } from 'lucide-react';

export default function TrendingBusRoutes() {
  const [tab, setTab] = useState('volvoSleeper'); // 'volvoSleeper' | 'electricEV' | 'popularIntercity'
  const navigate = useNavigate();

  const routes = trendingBusRoutesGrid[tab] || trendingBusRoutesGrid.volvoSleeper;

  const handleRouteClick = (route) => {
    navigate(`/bus-booking?from=${encodeURIComponent(route.fromCity)}&to=${encodeURIComponent(route.toCity)}`);
  };

  return (
    <section className="section-block trending-bus-routes-block">
      <div className="container">
        {/* Header with Title and Scope Toggle Buttons */}
        <div className="trending-routes-header">
          <div>
            <div className="section-tag-pill bus-tag-pill">
              <Bus size={14} />
              <span>POPULAR HIGHWAY CORRIDORS</span>
            </div>
            <h2 className="routes-main-title">
              Trending <span className="routes-highlight-green">BUS ROUTES</span>
            </h2>
            <p className="routes-sub-desc">Quick view of top booked Volvo Multi-Axle, AC Sleeper & Green EV routes</p>
          </div>

          <div className="routes-toggle-group bus-toggle-group">
            <button
              type="button"
              className={`routes-toggle-btn bus-btn ${tab === 'volvoSleeper' ? 'active' : ''}`}
              onClick={() => setTab('volvoSleeper')}
            >
              VOLVO & AC SLEEPER
            </button>
            <button
              type="button"
              className={`routes-toggle-btn bus-btn ${tab === 'electricEV' ? 'active' : ''}`}
              onClick={() => setTab('electricEV')}
            >
              ELECTRIC & GREEN BUS
            </button>
            <button
              type="button"
              className={`routes-toggle-btn bus-btn ${tab === 'popularIntercity' ? 'active' : ''}`}
              onClick={() => setTab('popularIntercity')}
            >
              POPULAR INTERCITY
            </button>
          </div>
        </div>

        {/* 4-Column Grid of Bus Route Cards */}
        <div className="routes-cards-grid bus-routes-cards-grid">
          {routes.map((r) => (
            <div
              key={r.id}
              className="route-item-card bus-route-card"
              onClick={() => handleRouteClick(r)}
              role="button"
              tabIndex={0}
            >
              {/* Landmark Image */}
              <div className="route-thumb-box">
                <img src={r.image} alt={`${r.from} to ${r.to}`} loading="lazy" />
                <span className="bus-route-thumb-badge">{r.badge}</span>
              </div>

              {/* Route Details & Bus Info */}
              <div className="bus-route-details-box">
                <div className="bus-route-cities-row">
                  <span className="route-city-name">{r.from}</span>
                  <div className="route-arrow-icon-wrap bus-arrow">
                    <ArrowLeftRight size={12} />
                  </div>
                  <span className="route-city-name">{r.to}</span>
                </div>

                <div className="bus-route-name-text" title={r.busName}>
                  {r.busName}
                </div>

                <div className="bus-route-meta-row">
                  <span className="bus-duration-pill">
                    <Clock size={11} />
                    {r.duration}
                  </span>
                  <span className="bus-price-tag">{r.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
