import { useState, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import {
  Plane,
  Building2,
  Bus,
  Train,
  Calendar,
  ShieldAlert,
  FileText,
  Download,
  X,
  Luggage,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ManageBookingsPage() {
  const { bookings, openTicketModal, cancelBooking } = useBooking();
  const [filterType, setFilterType] = useState('all'); // all | flight | hotel | bus | train
  const [filterStatus, setFilterStatus] = useState('all'); // all | Confirmed | Cancelled
  const [searchQuery, setSearchQuery] = useState('');
  const [cancellingBookingId, setCancellingBookingId] = useState(null);
  const [cancelReason, setCancelReason] = useState('Travel plans changed');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setCancellingBookingId(null);
      }
    };
    if (cancellingBookingId) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cancellingBookingId]);

  const filteredBookings = bookings.filter((b) => {
    if (filterType !== 'all' && b.type !== filterType) return false;
    if (filterStatus !== 'all' && b.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = b.id?.toLowerCase().includes(q);
      const matchTitle = b.title?.toLowerCase().includes(q);
      const matchPnr = b.pnr?.toLowerCase().includes(q);
      const matchPax = b.passengers?.some((p) => p.name?.toLowerCase().includes(q));
      return matchId || matchTitle || matchPnr || matchPax;
    }
    return true;
  });

  const handleConfirmCancel = () => {
    if (cancellingBookingId) {
      cancelBooking(cancellingBookingId, cancelReason);
      setCancellingBookingId(null);
    }
  };

  const getTypeIcon = (type) => {
    if (type === 'flight') return <Plane size={20} color="#034ea2" />;
    if (type === 'hotel') return <Building2 size={20} color="#034ea2" />;
    if (type === 'bus') return <Bus size={20} color="#034ea2" />;
    return <Train size={20} color="#034ea2" />;
  };

  const activeCount = bookings.filter((b) => b.status === 'Confirmed').length;
  const cancelledCount = bookings.filter((b) => b.status === 'Cancelled').length;

  return (
    <div className="manage-bookings-page container page-wrap">
      <div className="page-shell">
        <div className="page-topbar">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>My Trips & Bookings</span>
        </div>

        {/* Top Header Banner */}
        <div className="bookings-hero-banner">
          <div className="bookings-banner-left">
            <div className="banner-tag">
              <Luggage size={16} />
              <span>ITINERARY & RESERVATIONS HUB</span>
            </div>
            <h1>Manage Your Bookings</h1>
            <p>Access your confirmed flight tickets, hotel vouchers, train PNRs, and bus reservations in one place.</p>
          </div>
          <div className="bookings-banner-right">
            <Link to="/" className="primary-btn">
              + Plan New Journey
            </Link>
          </div>
        </div>

        {/* Quick Stats Metrics */}
        <div className="bookings-stats-strip mt-3">
          <div className="booking-stat-chip">
            <span>Total Bookings:</span>
            <strong>{bookings.length}</strong>
          </div>
          <div className="booking-stat-chip active-stat">
            <span>Confirmed / Active:</span>
            <strong>{activeCount}</strong>
          </div>
          <div className="booking-stat-chip cancel-stat">
            <span>Cancelled:</span>
            <strong>{cancelledCount}</strong>
          </div>
        </div>

        {/* Filter Toolbar & Search */}
        <div className="bookings-toolbar-card content-card mt-4">
          <div className="toolbar-filters-row">
            <div className="filter-pill-group">
              {[
                { key: 'all', label: 'All Trips' },
                { key: 'flight', label: 'Flights' },
                { key: 'hotel', label: 'Hotels' },
                { key: 'bus', label: 'Buses' },
                { key: 'train', label: 'Trains' }
              ].map((t) => (
                <button
                  key={t.key}
                  type="button"
                  className={`filter-pill-btn ${filterType === t.key ? 'active' : ''}`}
                  onClick={() => setFilterType(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="toolbar-controls-right">
              <div className="bookings-search-input">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search by Booking ID, PNR, City..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="native-select small status-dropdown"
              >
                <option value="all">All Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="content-card empty-bookings-box text-center py-5 mt-4">
            <div className="empty-icon-circle mx-auto mb-3">
              <FileText size={42} color="#94a3b8" />
            </div>
            <h3>No Bookings Found</h3>
            <p className="lead">
              {searchQuery
                ? `No booking records matched your search "${searchQuery}".`
                : "You don't have any bookings under this selected filter."}
            </p>
            <div className="mt-4">
              <Link to="/" className="primary-btn">
                Book Flights, Hotels or Trains
              </Link>
            </div>
          </div>
        ) : (
          <div className="bookings-cards-list mt-4">
            {filteredBookings.map((booking) => {
              const isCancelled = booking.status === 'Cancelled';
              return (
                <div
                  key={booking.id}
                  className={`booking-manage-card-elevated ${isCancelled ? 'cancelled-card' : ''}`}
                >
                  <div className="booking-card-main-grid">
                    {/* Left: Type Icon & ID */}
                    <div className="booking-service-badge-col">
                      <div className="booking-service-circle">
                        {getTypeIcon(booking.type)}
                      </div>
                      <span className="booking-id-text">ID: {booking.id}</span>
                    </div>

                    {/* Middle: Itinerary & Passenger Details */}
                    <div className="booking-itinerary-col">
                      <div className="booking-status-header">
                        <span className={`status-badge ${isCancelled ? 'cancelled' : 'confirmed'}`}>
                          {isCancelled ? '● Cancelled' : '✓ Confirmed'}
                        </span>
                        <span className="booking-service-type">{booking.type?.toUpperCase()}</span>
                      </div>

                      <h3 className="booking-title-text">{booking.title}</h3>

                      <div className="booking-meta-badges">
                        <div className="meta-badge-item">
                          <Calendar size={14} />
                          <span>Date: <strong>{booking.date}</strong></span>
                        </div>
                        {booking.pnr && (
                          <div className="meta-badge-item">
                            <span>PNR: <strong>{booking.pnr}</strong></span>
                          </div>
                        )}
                        {booking.passengers?.[0] && (
                          <div className="meta-badge-item">
                            <span>Lead Passenger: <strong>{booking.passengers[0].name}</strong></span>
                          </div>
                        )}
                      </div>

                      {isCancelled && (
                        <div className="refund-status-callout mt-2">
                          <ShieldAlert size={14} />
                          <span>Refund Status: <strong>{booking.refundStatus || 'Processing to original payment mode'}</strong></span>
                        </div>
                      )}
                    </div>

                    {/* Right: Fare & Actions */}
                    <div className="booking-action-price-col">
                      <div className="fare-display-box">
                        <span className="fare-label">Total Amount Paid</span>
                        <strong className="fare-amount-num">₹{Number(booking.totalAmount || 0).toLocaleString('en-IN')}</strong>
                      </div>

                      <div className="action-buttons-stack">
                        <button
                          type="button"
                          className="view-ticket-btn"
                          onClick={() => openTicketModal(booking)}
                        >
                          <FileText size={15} />
                          <span>View E-Ticket</span>
                        </button>

                        {!isCancelled && (
                          <button
                            type="button"
                            className="cancel-trip-btn"
                            onClick={() => setCancellingBookingId(booking.id)}
                          >
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Cancellation Confirmation Modal */}
        {cancellingBookingId && (
          <div className="modal-overlay" onClick={() => setCancellingBookingId(null)}>
            <div className="modal-container cancel-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-custom">
                <div>
                  <h3>Confirm Booking Cancellation</h3>
                  <span className="sub-tagline">Booking Reference: {cancellingBookingId}</span>
                </div>
                <button
                  className="modal-close-btn"
                  onClick={() => setCancellingBookingId(null)}
                  type="button"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="cancel-modal-body p-4">
                <div className="warning-callout">
                  <ShieldAlert size={20} color="#dc2626" />
                  <p>
                    Are you sure you want to cancel this booking? Refund will be calculated as per operator cancellation rules and credited back to your original payment mode within 3-5 business days.
                  </p>
                </div>

                <div className="form-group mt-3">
                  <label htmlFor="cancel-reason-select">Reason for Cancellation</label>
                  <select
                    id="cancel-reason-select"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="native-select"
                  >
                    <option value="Travel plans changed">Travel plans changed</option>
                    <option value="Found better fare / dates">Found better fare / dates</option>
                    <option value="Personal emergency">Personal emergency</option>
                    <option value="Booked by mistake">Booked by mistake</option>
                  </select>
                </div>

                <div className="checkout-actions-row mt-4">
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => setCancellingBookingId(null)}
                  >
                    Keep Booking
                  </button>
                  <button
                    type="button"
                    className="danger-btn"
                    onClick={handleConfirmCancel}
                  >
                    Confirm Cancellation & Refund
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
