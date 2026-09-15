import { useEffect } from 'react';
import { useBooking } from '../../context/BookingContext';
import { X, CheckCircle, Printer, Download, QrCode, Plane, Building2, Bus, Train, Calendar, User, ShieldCheck } from 'lucide-react';

export default function TicketModal() {
  const { activeTicket, closeTicketModal, showToast } = useBooking();

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && activeTicket) {
        closeTicketModal();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTicket, closeTicketModal]);

  if (!activeTicket) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    showToast(`E-Ticket ${activeTicket.id}.pdf download initiated.`);
  };

  const getTypeIcon = (type) => {
    if (type === 'flight') return <Plane size={24} color="#1272d5" />;
    if (type === 'hotel') return <Building2 size={24} color="#1272d5" />;
    if (type === 'bus') return <Bus size={24} color="#1272d5" />;
    return <Train size={24} color="#1272d5" />;
  };

  return (
    <div className="modal-overlay" onClick={closeTicketModal}>
      <div
        className="modal-container ticket-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ticket-modal-title"
      >
        <div className="ticket-modal-header no-print">
          <div>
            <span id="ticket-modal-title" className="success-badge-top">
              <CheckCircle size={16} /> Booking Confirmed & Ticket Issued
            </span>
          </div>
          <div className="ticket-actions">
            <button type="button" className="icon-action-btn" onClick={handlePrint} title="Print Ticket">
              <Printer size={16} /> Print
            </button>
            <button type="button" className="icon-action-btn" onClick={handleDownload} title="Download PDF">
              <Download size={16} /> Download
            </button>
            <button className="modal-close-btn" onClick={closeTicketModal} aria-label="Close ticket modal">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Ticket Area */}
        <div className="ticket-voucher-paper">
          {/* Header */}
          <div className="voucher-header">
            <div className="voucher-brand">
              <div className="voucher-logo-row">
                <img src="/logo.png" alt="EazeTrip" className="voucher-logo-img" />
                <span className="voucher-brand-title">Eaze<span className="voucher-brand-trip">Trip</span></span>
              </div>
              <p>Official E-Ticket & Confirmation Voucher</p>
            </div>
            <div className="voucher-qr">
              <QrCode size={64} />
              <small>PNR: {activeTicket.pnr || '6EZ9KM'}</small>
            </div>
          </div>

          {/* Key Reference Bar */}
          <div className="voucher-meta-bar">
            <div>
              <span className="meta-label">Booking Reference ID</span>
              <strong>{activeTicket.id}</strong>
            </div>
            <div>
              <span className="meta-label">Booking Status</span>
              <strong className="text-success">{activeTicket.status || 'Confirmed'}</strong>
            </div>
            <div>
              <span className="meta-label">Journey / Check-in Date</span>
              <strong>{activeTicket.date}</strong>
            </div>
            <div>
              <span className="meta-label">Total Fare Paid</span>
              <strong>₹{Number(activeTicket.totalAmount).toLocaleString('en-IN')}</strong>
            </div>
          </div>

          {/* Main Itinerary Details */}
          <div className="voucher-itinerary-box">
            <div className="itinerary-header">
              <div className="type-icon-box">{getTypeIcon(activeTicket.type)}</div>
              <div>
                <h3>{activeTicket.title}</h3>
                <small>{activeTicket.airline || activeTicket.location || activeTicket.busType || 'Confirmed Travel Booking'}</small>
              </div>
            </div>

            <div className="voucher-passengers-section">
              <h4>Traveller Details</h4>
              <div className="passenger-voucher-table">
                <div className="pax-row header">
                  <span>Passenger Name</span>
                  <span>Seat / Room / Berth</span>
                  <span>Ticket Status</span>
                </div>
                {activeTicket.passengers?.map((p, idx) => (
                  <div key={idx} className="pax-row">
                    <strong>{p.name}</strong>
                    <span>{p.seat || activeTicket.roomType || 'Confirmed 12A'}</span>
                    <span className="text-success">Confirmed (OK)</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="voucher-payment-section">
              <h4>Payment & Invoicing</h4>
              <div className="payment-voucher-grid">
                <div>
                  <span className="meta-label">Payment Method</span>
                  <p>{activeTicket.paymentMethod || 'Online Gateway'}</p>
                </div>
                <div>
                  <span className="meta-label">Transaction ID</span>
                  <p>TXN-{Math.floor(100000000 + Math.random() * 900000000)}</p>
                </div>
                <div>
                  <span className="meta-label">24/7 Helpline</span>
                  <p>+91 8269054018</p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Guidelines */}
          <div className="voucher-terms">
            <p><strong>Important Travel Guidelines:</strong></p>
            <ul>
              <li>Please carry a valid government-issued photo ID (Aadhaar, Passport, Driving License, Voter ID).</li>
              <li>For domestic flights, report at the airport at least 2 hours prior to scheduled departure.</li>
              <li>For cancellations or rescheduling, visit <strong>Manage Bookings</strong> on EazeTrip.</li>
            </ul>
          </div>
        </div>

        <div className="ticket-modal-footer no-print">
          <button type="button" className="primary-btn" onClick={closeTicketModal}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
