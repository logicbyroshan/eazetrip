import { useState, useEffect } from 'react';

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Show preloader for 1.7 seconds, then fade out smoothly
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 1600);

    const removeTimer = setTimeout(() => {
      setLoading(false);
    }, 2100);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!loading) return null;

  return (
    <div className={`site-preloader-overlay ${fading ? 'preloader-fade-out' : ''}`}>
      <div className="preloader-content">
        <div className="preloader-logo-wrap">
          <img src="/logo.png" alt="EazeTrip" className="preloader-logo-img" />
          <div className="preloader-brand-title">
            <span className="brand-eaze">Eaze</span><span className="brand-trip">Trip</span>
          </div>
          <span className="preloader-tagline">YOUR SMART TRAVEL PARTNER</span>
        </div>

        <div className="preloader-progress-track">
          <div className="preloader-progress-bar"></div>
        </div>

        <p className="preloader-subtext">Loading best flight, hotel & train deals...</p>
      </div>
    </div>
  );
}
