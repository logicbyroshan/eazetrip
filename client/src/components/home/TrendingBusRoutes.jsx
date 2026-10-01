import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trendingBusRoutesGrid } from '../../data/siteData';
import { ArrowLeftRight } from 'lucide-react';

export default function TrendingBusRoutes() {
  const [tab, setTab] = useState('volvoSleeper'); // 'volvoSleeper' | 'electricEV' | 'popularIntercity'
  const navigate = useNavigate();

  const routes = trendingBusRoutesGrid[tab] || trendingBusRoutesGrid.volvoSleeper;

  const handleRouteClick = (route) => {
    navigate(`/bus-booking?from=${encodeURIComponent(route.fromCity || route.from)}&to=${encodeURIComponent(route.toCity || route.to)}`);
  };

  return (
    <section className="section-block trending-bus-routes-block">
      <div className="container">
        {/* Header with Title and Scope Toggle Buttons */}
        <div className="trending-routes-header">
          <div>
            <h2 className="routes-main-title">
              Trending <span className="routes-highlight-green">BUS ROUTES</span>
            </h2>
            <p className="routes-sub-desc">Quick view of top booked Volvo Multi-Axle, AC Sleeper & Green EV routes</p>
          </div>

          <div className="routes-toggle-group">
            <button
              type="button"
              className={`routes-toggle-btn ${tab === 'volvoSleeper' ? 'active' : ''}`}
              onClick={() => setTab('volvoSleeper')}
            >
              VOLVO & SLEEPER
            </button>
            <button
              type="button"
              className={`routes-toggle-btn ${tab === 'electricEV' ? 'active' : ''}`}
              onClick={() => setTab('electricEV')}
            >
              ELECTRIC & GREEN EV
            </button>
            <button
              type="button"
              className={`routes-toggle-btn ${tab === 'popularIntercity' ? 'active' : ''}`}
              onClick={() => setTab('popularIntercity')}
            >
              INTERCITY
            </button>
          </div>
        </div>

        {/* 4-Column Grid of Bus Route Cards */}
        <div className="routes-cards-grid">
          {routes.map((r) => (
            <div
              key={r.id}
              className="route-item-card"
              onClick={() => handleRouteClick(r)}
              role="button"
              tabIndex={0}
            >
              {/* Landmark Image */}
              <div className="route-thumb-box">
                <img src={r.image} alt={`${r.from} to ${r.to}`} loading="lazy" />
              </div>

              {/* Route Details & Bus Info */}
              <div className="route-details-box">
                <div className="route-cities-row">
                  <span className="route-city-name">{r.from}</span>
                  <div className="route-arrow-icon-wrap">
                    <ArrowLeftRight size={12} />
                  </div>
                  <span className="route-city-name">{r.to}</span>
                </div>
                <div className="route-meta-sub">
                  <span className="route-sub-name">{r.busName ? r.busName.split('(')[0].trim() : ''}</span>
                  <span className="route-sub-price">{r.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
