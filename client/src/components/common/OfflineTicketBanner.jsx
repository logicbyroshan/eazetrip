import { useState, useEffect } from 'react';
import { WifiOff, ShieldCheck, ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCurrency } from '../../context/CurrencyContext';

export default function OfflineTicketBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [dismissed, setDismissed] = useState(false);
  const { t } = useCurrency();

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setDismissed(false);
    };
    const handleOffline = () => {
      setIsOffline(true);
      setDismissed(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline || dismissed) return null;

  return (
    <div className="offline-ticket-banner" role="status" aria-live="polite">
      <div className="container offline-banner-inner">
        <div className="offline-banner-left">
          <div className="offline-icon-circle">
            <WifiOff size={16} />
          </div>
          <div className="offline-banner-text">
            <strong>{t('offlineWallet', 'Offline Ticket Wallet Active')}</strong>
            <p>{t('offlineNotice', 'You are currently offline. Your confirmed E-Tickets and boarding passes remain cached locally for airport and station access.')}</p>
          </div>
        </div>

        <div className="offline-banner-actions">
          <Link to="/manage-bookings" className="offline-wallet-btn">
            <ShieldCheck size={14} /> View Saved Tickets <ArrowRight size={14} />
          </Link>
          <button
            type="button"
            className="offline-dismiss-btn"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss offline banner"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
