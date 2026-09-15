import { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { Plane, Building2, Bus, Train, Calendar, ShieldAlert, FileText, Download, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ManageBookingsPage() {
  const { bookings, openTicketModal, cancelBooking } = useBooking();
  const [filterType, setFilterType] = useState('all'); // all | flight | hotel | bus | train
  const [filterStatus, setFilterStatus] = useState('all'); // all | Confirmed | Cancelled
  const [cancellingBookingId, setCancellingBookingId] = useState(null);
  const [cancelReason, setCancelReason] = useState('Travel plans changed');

  const filteredBookings = bookings.filter((b) => {
    if (filterType !== 'all' && b.type !== filterType) return false;
    if (filterStatus !== 'all' && b.status !== filterStatus) return false;
    return true;
  });

  const handleConfirmCancel = () => {
    if (cancellingBookingId) {
      cancelBooking(cancellingBookingId, cancelReason);
      setCancellingBookingId(null);
    }
  };

  const getTypeIcon = (type) => {
    if (type === 'flight') return <Plane size={20} color="#1272d5" />;
    if (type === 'hotel') return <Building2 size={20} color="#1272d5" />;
    if (type === 'bus') return <Bus size={20} color="#1272d5" />;
    return <Train size={20} color="#1272d5" />;
  };

  return (
    <div className="manage-bookings-page container">
      <div className="page-header-block">
        <div>
          <h1>Manage Your Bookings</h1>
          <p>View upcoming itineraries, download e-tickets, and manage cancellations</p>
        </div>
        <Link to="/" className="primary-btn">
          + Book New Trip
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="bookings-filters-bar">
        <div className="filter-pill-group">
          {['all', 'flight', 'hotel', 'bus', 'train'].map((t) => (
            <button
              key={t}
              type="button"
              className={`filter-pill-btn ${filterType === t ? 'active' : ''}`}
              onClick={() => setFilterType(t)}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="status-select-wrap">
          <label>Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="native-select small"
          >
            <option value="all">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="empty-bookings-box">
          <FileText size={48} color="#94a3b8" />
          <h3>No bookings found</h3>
          <p>You haven't made any bookings under this filter yet.</p>
          <Link to="/" className="primary-btn mt-3">
            Explore Flights & Hotels
          </Link>
        </div>
      ) : (
        <div className="bookings-cards-list">
          {filteredBookings.map((booking) => {
            const isCancelled = booking.status === 'Cancelled';
            return (
              <div key={booking.id} className={`booking-manage-card ${isCancelled ? 'cancelled-card' : ''}`}>
                <div className="booking-card-main">
                  <div className="booking-icon-col">
                    <div className="booking-type-circle">
                      {getTypeIcon(booking.type)}
                    </div>
                  </div>

                  <div className="booking-details-col">
                    <div className="booking-top-line">
                      <span className="booking-ref-id">ID: {booking.id}</span>
                      <span className={`status-badge ${isCancelled ? 'cancelled' : 'confirmed'}`}>
                        {booking.status}
                      </span>
                    </div>

                    <h3 className="booking-title">{booking.title}</h3>

                    <div className="booking-meta-row">
                      <div className="meta-item">
                        <Calendar size={14} />
                        <span>Date: {booking.date}</span>
                      </div>
                      {booking.pnr && (
                        <div className="meta-item">
                          <span>PNR: <strong>{booking.pnr}</strong></span>
                        </div>
                      )}
                      {booking.passengers?.[0] && (
                        <div className="meta-item">
                          <span>Passenger: <strong>{booking.passengers[0].name}</strong></span>
                        </div>
                      )}
                    </div>

                    {isCancelled && booking.refundStatus && (
                      <div className="refund-notice-box">
                        <span>Refund Status: <strong>{booking.refundStatus}</strong></span>
                      </div>
                    )}
                  </div>

                  <div className="booking-price-action-col">
                    <div className="price-display">
                      <span className="lbl">Total Fare</span>
                      <strong>₹{Number(booking.totalAmount).toLocaleString('en-IN')}</strong>
                    </div>

                    <div className="booking-card-actions">
                      <button
                        type="button"
                        className="btn-view-ticket"
                        onClick={() => openTicketModal(booking)}
                      >
                        <FileText size={15} /> View E-Ticket
                      </button>

                      {!isCancelled && (
                        <button
                          type="button"
                          className="btn-cancel-booking"
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
                <span className="sub-tagline">Booking ID: {cancellingBookingId}</span>
              </div>
              <button className="modal-close-btn" onClick={() => setCancellingBookingId(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="cancel-modal-body">
              <div className="warning-callout">
                <ShieldAlert size={20} color="#dc2626" />
                <p>
                  Are you sure you want to cancel this booking? Refund will be calculated per the operator's cancellation rules and processed back to your original payment mode within 5-7 working days.
                </p>
              </div>

              <div className="form-group mt-3">
                <label>Reason for Cancellation</label>
                <select
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
  );
}
