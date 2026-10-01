import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trendingTrainRoutesGrid } from '../../data/siteData';
import { ArrowLeftRight } from 'lucide-react';

export default function TrendingTrainRoutes() {
  const [tab, setTab] = useState('vandeBharat'); // 'vandeBharat' | 'rajdhaniShatabdi' | 'intercity'
  const navigate = useNavigate();

  const routes = trendingTrainRoutesGrid[tab] || trendingTrainRoutesGrid.vandeBharat;

  const handleRouteClick = (route) => {
    navigate(`/railways?from=${route.fromCode}&to=${route.toCode}&fromStation=${encodeURIComponent(route.from)}&toStation=${encodeURIComponent(route.to)}`);
  };

  return (
    <section className="section-block trending-train-routes-block">
      <div className="container">
        {/* Header with Title and Scope Toggle Buttons */}
        <div className="trending-routes-header">
          <div>
            <h2 className="routes-main-title">
              Trending <span className="routes-highlight-purple">TRAIN ROUTES</span>
            </h2>
            <p className="routes-sub-desc">Quick view of top booked Vande Bharat, Rajdhani & Superfast rail routes</p>
          </div>

          <div className="routes-toggle-group">
            <button
              type="button"
              className={`routes-toggle-btn ${tab === 'vandeBharat' ? 'active' : ''}`}
              onClick={() => setTab('vandeBharat')}
            >
              VANDE BHARAT
            </button>
            <button
              type="button"
              className={`routes-toggle-btn ${tab === 'rajdhaniShatabdi' ? 'active' : ''}`}
              onClick={() => setTab('rajdhaniShatabdi')}
            >
              RAJDHANI & SHATABDI
            </button>
            <button
              type="button"
              className={`routes-toggle-btn ${tab === 'intercity' ? 'active' : ''}`}
              onClick={() => setTab('intercity')}
            >
              SUPERFAST
            </button>
          </div>
        </div>

        {/* 4-Column Grid of Train Route Cards */}
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

              {/* Route Details & Train Info */}
              <div className="route-details-box">
                <div className="route-cities-row">
                  <span className="route-city-name">{r.from}</span>
                  <div className="route-arrow-icon-wrap">
                    <ArrowLeftRight size={12} />
                  </div>
                  <span className="route-city-name">{r.to}</span>
                </div>
                <div className="route-meta-sub">
                  <span className="route-sub-name">{r.trainName ? r.trainName.split('(')[0].trim() : ''}</span>
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
