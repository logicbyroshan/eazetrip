import { useState, useEffect } from 'react';
import { X, Plane, Luggage, ShieldAlert, Receipt, Clock, Calendar, CheckCircle2 } from 'lucide-react';

export default function FlightDetailsModal({ flight, onClose, onBook }) {
  const [activeTab, setActiveTab] = useState('schedule'); // schedule | baggage | cancellation | fare

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && flight) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flight, onClose]);

  if (!flight) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container flight-details-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="flight-details-title"
      >
        <div className="modal-header-custom">
          <div>
            <h3 id="flight-details-title">Flight Information & Fare Rules</h3>
            <span className="sub-tagline">{flight.airline} • {flight.flightNumber} ({flight.from} → {flight.to})</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close flight details modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="modal-tabs-strip">
          <button
            className={`modal-tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            <Clock size={16} /> Schedule
          </button>
          <button
            className={`modal-tab-btn ${activeTab === 'baggage' ? 'active' : ''}`}
            onClick={() => setActiveTab('baggage')}
          >
            <Luggage size={16} /> Baggage
          </button>
          <button
            className={`modal-tab-btn ${activeTab === 'cancellation' ? 'active' : ''}`}
            onClick={() => setActiveTab('cancellation')}
          >
            <ShieldAlert size={16} /> Cancellation Rules
          </button>
          <button
            className={`modal-tab-btn ${activeTab === 'fare' ? 'active' : ''}`}
            onClick={() => setActiveTab('fare')}
          >
            <Receipt size={16} /> Fare Breakup
          </button>
        </div>

        {/* Tab Content */}
        <div className="modal-body-content">
          {activeTab === 'schedule' && (
            <div className="schedule-tab-content">
              <div className="flight-segment-box">
                <div className="segment-airline">
                  <strong>{flight.airline} ({flight.flightNumber})</strong>
                  <span className="badge-pill">{flight.cabinClass || 'Economy'}</span>
                </div>

                <div className="segment-timeline">
                  <div className="timeline-node">
                    <span className="node-time">{flight.departureTime}</span>
                    <div className="node-point"></div>
                    <div className="node-info">
                      <strong>{flight.fromCity} ({flight.from})</strong>
                      <p>{flight.fromAirport || 'Terminal 1 / Main Airport'}</p>
                    </div>
                  </div>

                  <div className="timeline-duration-line">
                    <span>Duration: {flight.duration} • {flight.stopText}</span>
                  </div>

                  <div className="timeline-node">
                    <span className="node-time">{flight.arrivalTime}</span>
                    <div className="node-point"></div>
                    <div className="node-info">
                      <strong>{flight.toCity} ({flight.to})</strong>
                      <p>{flight.toAirport || 'Terminal 2 / Main Airport'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'baggage' && (
            <div className="baggage-tab-content">
              <div className="baggage-table">
                <div className="baggage-row header">
                  <span>Baggage Type</span>
                  <span>Allowance</span>
                  <span>Status</span>
                </div>
                <div className="baggage-row">
                  <div>
                    <strong>Cabin Baggage</strong>
                    <small>Hand baggage per passenger</small>
                  </div>
                  <span>{flight.baggage?.cabin || '7 Kg (1 piece)'}</span>
                  <span className="included-badge">Included</span>
                </div>
                <div className="baggage-row">
                  <div>
                    <strong>Check-in Baggage</strong>
                    <small>Checked luggage per passenger</small>
                  </div>
                  <span>{flight.baggage?.checkin || '15 Kg (1 piece)'}</span>
                  <span className="included-badge">Included</span>
                </div>
              </div>
              <div className="baggage-note">
                <CheckCircle2 size={16} color="#16a34a" />
                <span>Infant baggage allowance: 1 piece of cabin baggage (max 7 kg).</span>
              </div>
            </div>
          )}

          {activeTab === 'cancellation' && (
            <div className="cancellation-tab-content">
              <div className="penalty-table">
                <div className="penalty-row header">
                  <span>Timeframe Before Departure</span>
                  <span>Cancellation Penalty</span>
                  <span>Date Change Fee</span>
                </div>
                <div className="penalty-row">
                  <span>More than 72 hours</span>
                  <span>₹{flight.cancellationFee || 3000} per pax</span>
                  <span>₹{flight.rescheduleFee || 2500} + fare diff</span>
                </div>
                <div className="penalty-row">
                  <span>Between 2 to 72 hours</span>
                  <span>₹{(flight.cancellationFee || 3000) + 500} per pax</span>
                  <span>₹{(flight.rescheduleFee || 2500) + 500} + fare diff</span>
                </div>
                <div className="penalty-row">
                  <span>Within 2 hours (No-Show)</span>
                  <span className="text-danger">Non-Refundable</span>
                  <span className="text-danger">Not Permitted</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fare' && (
            <div className="fare-tab-content">
              <div className="fare-breakup-list">
                <div className="fare-row">
                  <span>Base Fare (1 Adult)</span>
                  <span>₹{(flight.basePrice || flight.price - 749).toLocaleString('en-IN')}</span>
                </div>
                <div className="fare-row">
                  <span>Taxes, Aviation Security & User Development Fees</span>
                  <span>₹{(flight.taxes || 749).toLocaleString('en-IN')}</span>
                </div>
                <div className="fare-row">
                  <span>Convenience Fee</span>
                  <span className="free-text">FREE / Waived</span>
                </div>
                <div className="fare-row total-row">
                  <strong>Total Amount Payable</strong>
                  <strong className="accent-total">₹{flight.price.toLocaleString('en-IN')}</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="modal-footer-custom">
          <div className="footer-price-info">
            <span className="total-label">Fare per adult:</span>
            <strong className="footer-total">₹{flight.price.toLocaleString('en-IN')}</strong>
          </div>
          <div className="footer-buttons">
            <button type="button" className="secondary-btn" onClick={onClose}>
              Close
            </button>
            {onBook && (
              <button
                type="button"
                className="primary-btn"
                onClick={() => {
                  onClose();
                  onBook(flight);
                }}
              >
                Proceed to Book
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
