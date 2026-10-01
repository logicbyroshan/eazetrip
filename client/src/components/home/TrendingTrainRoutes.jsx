import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trendingTrainRoutesGrid } from '../../data/siteData';
import { ArrowLeftRight, Clock, Zap, TrainTrack, ChevronRight } from 'lucide-react';

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
            <div className="section-tag-pill train-tag-pill">
              <TrainTrack size={14} />
              <span>POPULAR RAILWAY CORRIDORS</span>
            </div>
            <h2 className="routes-main-title">
              Trending <span className="routes-highlight-purple">TRAIN ROUTES</span>
            </h2>
            <p className="routes-sub-desc">Quick view of top booked Vande Bharat, Rajdhani & Superfast train routes</p>
          </div>

          <div className="routes-toggle-group train-toggle-group">
            <button
              type="button"
              className={`routes-toggle-btn train-btn ${tab === 'vandeBharat' ? 'active' : ''}`}
              onClick={() => setTab('vandeBharat')}
            >
              VANDE BHARAT
            </button>
            <button
              type="button"
              className={`routes-toggle-btn train-btn ${tab === 'rajdhaniShatabdi' ? 'active' : ''}`}
              onClick={() => setTab('rajdhaniShatabdi')}
            >
              RAJDHANI & SHATABDI
            </button>
            <button
              type="button"
              className={`routes-toggle-btn train-btn ${tab === 'intercity' ? 'active' : ''}`}
              onClick={() => setTab('intercity')}
            >
              SUPERFAST INTERCITY
            </button>
          </div>
        </div>

        {/* 4-Column Grid of Train Route Cards */}
        <div className="routes-cards-grid train-routes-cards-grid">
          {routes.map((r) => (
            <div
              key={r.id}
              className="route-item-card train-route-card"
              onClick={() => handleRouteClick(r)}
              role="button"
              tabIndex={0}
            >
              {/* Landmark Image */}
              <div className="route-thumb-box">
                <img src={r.image} alt={`${r.from} to ${r.to}`} loading="lazy" />
                <span className="train-route-thumb-badge">{r.badge}</span>
              </div>

              {/* Route Details & Train Info */}
              <div className="train-route-details-box">
                <div className="train-route-cities-row">
                  <span className="route-city-name">{r.from}</span>
                  <div className="route-arrow-icon-wrap train-arrow">
                    <ArrowLeftRight size={12} />
                  </div>
                  <span className="route-city-name">{r.to}</span>
                </div>

                <div className="train-route-name-text" title={r.trainName}>
                  {r.trainName}
                </div>

                <div className="train-route-meta-row">
                  <span className="train-duration-pill">
                    <Clock size={11} />
                    {r.duration}
                  </span>
                  <span className="train-price-tag">{r.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
