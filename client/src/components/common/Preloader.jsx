import { useState, useEffect } from 'react';

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Show only the clean brand logo with subtle fade, gone in 1.8 - 2.0 seconds
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 1500);

    const removeTimer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!loading) return null;

  return (
    <div className={`site-preloader-overlay ${fading ? 'preloader-fade-out' : ''}`}>
      <div className="preloader-content-minimal">
        <img src="/logo.png" alt="EazeTrip" className="preloader-pure-logo" />
      </div>
    </div>
  );
}
