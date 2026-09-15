import { useState, useEffect } from 'react';

export default function Preloader() {
  const [loading, setLoading] = useState(() => {
    try {
      return !sessionStorage.getItem('eazetrip_preloader_seen');
    } catch {
      return false;
    }
  });
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!loading) return;
    try {
      sessionStorage.setItem('eazetrip_preloader_seen', 'true');
    } catch {}

    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 1000);

    const removeTimer = setTimeout(() => {
      setLoading(false);
    }, 1400);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [loading]);

  if (!loading) return null;

  return (
    <div className={`site-preloader-overlay ${fading ? 'preloader-fade-out' : ''}`}>
      <div className="preloader-content-minimal">
        <img src="/logo.png" alt="EazeTrip" className="preloader-pure-logo" />
      </div>
    </div>
  );
}
